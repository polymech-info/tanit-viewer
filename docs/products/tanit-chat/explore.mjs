#!/usr/bin/env node
/**
 * Tanit Chat — feature explorer generator
 *
 *   node explore.mjs                 # all langs → features.html + features.<lang>.html
 *   node explore.mjs --inline        # all langs → features.inline.html (+ .inline.<lang>)
 *   node explore.mjs --lang de       # one lang only
 *   node explore.mjs --serve
 *   node explore.mjs --skin shell    # default pack (still bundles every explore_*.css)
 *   node explore.mjs --theme plex    # same as --skin plex (not light/dark)
 *   node explore.mjs --publish tanit-chat-next
 *       fetch the raw page, put the inline fragment in its html-widget, pages update
 *
 * Layout (runtime, also ?layout=classic|scroll):
 *   scroll  — expand every feature for continuous scrolling (default)
 *   classic — sidebar + one-feature stage (?layout=classic)
 *
 * Skin (runtime, also ?skin=<name>):
 *   explore_<name>.css — token packs, bundled by this generator
 *   default: plex (explore_plex.css)
 *
 * Assets (edit these, then rebuild):
 *   explore.css           — layout (no palette)
 *   explore_<name>.css    — a theme (copy plex, rename, retoken)
 *   explore.js            — client runtime
 *   icons/*.svg           — embedded at build
 *   explore/fragments/    — HTML shells
 *
 * Data:
 *   product.json              — base catalog (lang = en / default)
 *   product_<lang>.json       — overlays; auto-built when --lang omitted
 *   intro.md                  — opening copy (en)
 *   intro_<lang>.md           — localized intro (intro_de.md); falls back to intro.md
 *
 * --inline: no <!DOCTYPE>/html/head/body — CSS/JS/icons/product inlined; media paths stay relative
 */
import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { discoverLangs, flattenFeatures, loadIcons, loadProduct, outNameFor } from './explore/catalog.mjs'
import { buildHtml, normalizeAssetUrl } from './explore/html.mjs'
import { bundledCss, discoverThemes, resolveSkin } from './explore/themes.mjs'
import { serve, SERVE_REBUILD_MS } from './explore/serve.mjs'

const DEFAULT_OWNER = '3bb4cfbf-318b-44d3-a9d3-35680e738421'
const DEFAULT_ASSET_URL = `https://tanit.polymech.info/api/vfs/get/${DEFAULT_OWNER}/tanit-chat/`

const __dir = dirname(fileURLToPath(import.meta.url))
const ICONS_DIR = join(__dir, 'icons')
const CSS_PATH = join(__dir, 'explore.css')
const JS_PATH = join(__dir, 'explore.js')

function parseArgs(argv) {
	const out = {
		product: null,
		out: null,
		serve: false,
		port: 5177,
		lang: null,
		inline: false,
		assetUrl: null,
		skin: null,
		publish: null,
		owner: null,
		help: false,
	}
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i]
		if (a === '--serve') out.serve = true
		else if (a === '--inline') out.inline = true
		else if (a === '--out') out.out = argv[++i]
		else if (a === '--port') out.port = Number(argv[++i]) || 5177
		else if (a === '--lang' || a === '-l') out.lang = String(argv[++i] || '').trim().toLowerCase() || null
		else if (a === '--asset-url') out.assetUrl = String(argv[++i] || '').trim() || null
		else if (a === '--publish') out.publish = String(argv[++i] || '').trim() || null
		else if (a === '--owner') out.owner = String(argv[++i] || '').trim() || null
		else if (a === '--skin' || a === '--theme') out.skin = String(argv[++i] || '').trim().toLowerCase() || null
		else if (a === '--help' || a === '-h') out.help = true
		else if (!a.startsWith('-') && !out.product) out.product = a
	}
	return out
}

function requireAsset(path, label) {
	if (!existsSync(path)) {
		console.error(`missing ${label}: ${path}`)
		process.exit(1)
	}
	return readFileSync(path, 'utf8')
}

const args = parseArgs(process.argv.slice(2))
if (args.help) {
	console.log(`Usage: node explore.mjs [product.json] [options]

With no --lang, builds the base catalog plus every product_<lang>.json found.

Options:
  --lang, -l <code>   Build only this lang (merge product_<code>.json if present)
  --skin, --theme <name>
                      Default pack (explore_<name>.css). --theme is an alias.
                      Runtime pack: ?skin=plex|shell. Light/dark: ?theme=light|dark.
  --inline            Embed-ready fragment (no doctype/html/head/body).
                      Inlines: CSS, JS, icons, product data (+ lang overlay).
  --asset-url <url>   Prepend to images, videos, and click sfx (e.g. https://cdn.example/tanit/)
                      screenshots/ is stripped: uploads land at <url>chrome.jpg
  --publish <slug>    Fetch the raw page, replace its html-widget with the inline
                      fragment, then tanit-cli service pages update. Implies --inline.
                      Default asset URL is the public tanit-chat folder.
  --owner <id>        Page owner for --publish (default: the PolyMech user id)
  --out <file>        Single output path (requires --lang, or base-only if no overlays)
  --serve             Serve the product dir after build; rebuild from product.json every 5s
  --port <n>          Port for --serve (default: 5177)
  -h, --help          Show help

Edit: explore.css, explore_<name>.css, explore.js, icons/*.svg, product.json, product_<lang>.json, intro.md, intro_<lang>.md

Intro copy is Markdown, rendered at build time with marked (intro.md, or intro_<lang>.md such as intro_de.md).
`)
	process.exit(0)
}

const productPath = resolve(__dir, args.product || 'product.json')
if (args.publish) {
	args.inline = true
	if (!args.lang) args.lang = 'en'
	if (!args.assetUrl) args.assetUrl = DEFAULT_ASSET_URL
}
const assetUrl = normalizeAssetUrl(args.assetUrl)

/** Rebuild HTML from product.json (+ css/js/icons/themes). Returns last output path. */
function runBuild(quiet) {
	const layoutCss = requireAsset(CSS_PATH, 'explore.css')
	const js = requireAsset(JS_PATH, 'explore.js')
	if (!layoutCss.trim() || !js.trim()) {
		console.error('explore.css / explore.js look empty')
		return null
	}
	const themes = discoverThemes(__dir)
	if (!themes.length) {
		console.error('no explore_<name>.css themes found')
		return null
	}
	if (args.skin && !themes.some((t) => t.id === args.skin)) {
		console.error(`unknown --skin ${args.skin} (have: ${themes.map((t) => t.id).join(', ')})`)
		return null
	}
	const skin = resolveSkin(themes, args.skin)
	const css = bundledCss(layoutCss, themes)
	const icons = loadIcons(ICONS_DIR)

	/** @type {{ lang: string | null }[]} */
	let jobs
	if (args.lang) {
		jobs = [{ lang: args.lang }]
	} else {
		const langs = discoverLangs(productPath)
		jobs = [{ lang: null }, ...langs.map((lang) => ({ lang }))]
	}

	if (args.out && jobs.length > 1) {
		console.error('--out with multiple langs: pass --lang <code> for a single file, or omit --out')
		return null
	}

	let lastOut = null
	for (const job of jobs) {
		const lang = job.lang
		const outPath = resolve(__dir, args.out || outNameFor({ inline: args.inline, lang: lang || 'en' }))
		const product = loadProduct(productPath, lang)
		const features = flattenFeatures(product)
		const htmlLang = lang || product.lang || 'en'
		writeFileSync(
			outPath,
			buildHtml(product, icons, htmlLang, { inline: args.inline, css, js, assetUrl, themes, skin }),
			'utf8',
		)
		lastOut = outPath
		if (!quiet) {
			console.log(
				`wrote ${outPath}  (${features.length} features, ${Object.keys(icons).length} icons` +
					`, lang=${htmlLang}, skin=${skin}, themes=${themes.map((t) => t.id).join('+')}` +
					(args.inline ? ', inline' : '') +
					(assetUrl ? `, asset-url=${assetUrl}` : '') +
					(product.intro ? `, intro=${product.intro.file}` : '') +
					`)`,
			)
		}
	}
	if (quiet && lastOut) {
		const stamp = new Date().toLocaleTimeString()
		console.log(`[${stamp}] rebuilt ${basename(lastOut)} (+ overlays) from ${basename(productPath)}`)
	}
	return lastOut
}

function pageDocument(raw) {
	if (raw && raw.page && typeof raw.page === 'object') return raw.page
	return raw
}

function htmlWidget(page) {
	const pages = page && page.content && page.content.pages
	if (!pages || typeof pages !== 'object') return null
	const all = []
	for (const layout of Object.values(pages)) {
		for (const container of layout.containers || []) {
			for (const widget of container.widgets || []) {
				if (widget && widget.widgetId === 'html-widget') all.push(widget)
			}
		}
	}
	return all.find((w) => String(w.props && w.props.content || '').includes('tv-explore')) || all[0] || null
}

/** GET the raw page, drop the inline fragment into its html-widget, PATCH via pages update. */
function publishPage(slug, html) {
	const owner = args.owner || DEFAULT_OWNER
	const got = spawnSync('tanit-cli', ['service', 'pages', 'get', owner, slug, '--json'], {
		encoding: 'utf8',
		maxBuffer: 32 * 1024 * 1024,
	})
	if (got.status !== 0) {
		console.error(got.stderr || got.stdout || `pages get failed (${got.status})`)
		process.exit(got.status || 1)
	}
	const text = String(got.stdout || '').trim()
	const start = text.indexOf('{')
	const end = text.lastIndexOf('}')
	if (start < 0 || end < start) {
		console.error('pages get did not return JSON')
		process.exit(1)
	}
	const page = pageDocument(JSON.parse(text.slice(start, end + 1)))
	if (!page || !page.content) {
		console.error('raw page is missing content')
		process.exit(1)
	}
	const widget = htmlWidget(page)
	if (!widget || !widget.props) {
		console.error(`page ${slug} has no html-widget`)
		process.exit(1)
	}
	widget.props.content = html
	page.content.lastUpdated = Date.now()
	const pagePath = join(__dir, `${slug}.page`)
	writeFileSync(pagePath, JSON.stringify(page) + '\n')
	console.log(`wrote ${pagePath}  (html-widget ${widget.id || ''})`)
	const upd = spawnSync('tanit-cli', ['service', 'pages', 'update', pagePath, '--slug', slug], {
		encoding: 'utf8',
		stdio: 'inherit',
	})
	if (upd.status !== 0) process.exit(upd.status || 1)
}

const lastOut = runBuild(false)
if (!lastOut) process.exit(1)

if (args.publish) publishPage(args.publish, readFileSync(lastOut, 'utf8'))

if (args.serve) {
	serve(__dir, basename(lastOut), args.port)
	setInterval(() => {
		try {
			runBuild(true)
		} catch (err) {
			console.error('rebuild failed:', err && err.message ? err.message : err)
		}
	}, SERVE_REBUILD_MS)
}
