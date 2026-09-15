#!/usr/bin/env node
/**
 * Tanit Viewer — feature explorer generator
 *
 *   node explore.mjs                 # all langs → features.html + features.<lang>.html
 *   node explore.mjs --inline        # all langs → features.inline.html (+ .inline.<lang>)
 *   node explore.mjs --lang de       # one lang only
 *   node explore.mjs --serve
 *
 * Assets (edit these, then rebuild):
 *   explore.css  — styles
 *   explore.js   — client runtime
 *   icons/*.svg  — embedded at build
 *
 * Data:
 *   product.json              — base catalog (lang = en / default)
 *   product_<lang>.json       — overlays; auto-built when --lang omitted
 *
 * product.json: features[] (flat) — or categories[] → features[] for sectioned nav
 *   feature|slide|highlight.enabled|enable — omit or true to show; false to hide
 * slide.media: one {src} | string | array of those (array → multiple slides)
 *
 * --inline: no <!DOCTYPE>/html/head/body — CSS/JS/icons/product inlined; media paths stay relative
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname, basename, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'

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
		else if (a === '--help' || a === '-h') out.help = true
		else if (!a.startsWith('-') && !out.product) out.product = a
	}
	return out
}

/** Normalize CDN/base prefix; empty string disables. */
function normalizeAssetUrl(url) {
	if (!url) return ''
	const s = String(url).trim()
	if (!s) return ''
	return s.replace(/\/?$/, '/')
}

function isPlainObject(v) {
	return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}

/** Deep-merge lang overlay. Arrays of {id} merge by id; plain-object arrays merge by index; else replace. */
function mergeLang(base, over) {
	if (over === undefined) return base
	if (Array.isArray(base) && Array.isArray(over)) {
		const baseIds = base.length && base.every((x) => isPlainObject(x) && 'id' in x)
		const overIds = over.every((x) => isPlainObject(x) && 'id' in x)
		if (baseIds && overIds) {
			const map = new Map(base.map((x) => [x.id, x]))
			for (const item of over) {
				map.set(item.id, map.has(item.id) ? mergeLang(map.get(item.id), item) : item)
			}
			const seen = new Set()
			const out = []
			for (const b of base) {
				out.push(map.get(b.id))
				seen.add(b.id)
			}
			for (const item of over) {
				if (!seen.has(item.id)) out.push(map.get(item.id))
			}
			return out
		}
		if (base.every(isPlainObject) && over.every(isPlainObject)) {
			const len = Math.max(base.length, over.length)
			const out = []
			for (let i = 0; i < len; i++) {
				if (i < base.length && i < over.length) out.push(mergeLang(base[i], over[i]))
				else if (i < over.length) out.push(over[i])
				else out.push(base[i])
			}
			return out
		}
		return over
	}
	if (isPlainObject(base) && isPlainObject(over)) {
		const out = { ...base }
		for (const k of Object.keys(over)) out[k] = mergeLang(base[k], over[k])
		return out
	}
	return over
}

function loadJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'))
}

function productStem(path) {
	return basename(path, extname(path)) // product
}

/** Find lang codes from product_<lang>.json / product-<lang>.json next to base. */
function discoverLangs(productPath) {
	const dir = dirname(resolve(productPath))
	const stem = productStem(productPath)
	const langs = new Set()
	const underscore = new RegExp(`^${stem}_([a-zA-Z0-9-]+)\\.json$`)
	const hyphen = new RegExp(`^${stem}-([a-zA-Z0-9-]+)\\.json$`)
	for (const file of readdirSync(dir)) {
		const m = file.match(underscore) || file.match(hyphen)
		if (m) langs.add(m[1].toLowerCase())
	}
	return [...langs].sort()
}

function resolveOverlayPath(productPath, lang) {
	const dir = dirname(resolve(productPath))
	const stem = productStem(productPath)
	const candidates = [
		join(dir, `${stem}_${lang}.json`),
		join(dir, `${stem}-${lang}.json`),
		join(dir, lang, `${stem}.json`),
	]
	return candidates.find((p) => existsSync(p)) || null
}

function loadProduct(path, lang) {
	const abs = resolve(path)
	if (!existsSync(abs)) {
		console.error(`product not found: ${abs}`)
		process.exit(1)
	}
	let data = loadJson(abs)
	const hasCats = Array.isArray(data.categories) && data.categories.length > 0
	const hasFlat = Array.isArray(data.features) && data.features.length > 0
	if (!hasCats && !hasFlat) {
		console.error('product.json needs features[] or categories[]')
		process.exit(1)
	}

	if (lang) {
		const overlayPath = resolveOverlayPath(abs, lang)
		if (overlayPath) {
			const overlay = loadJson(overlayPath)
			data = mergeLang(data, overlay)
			console.log(`  lang overlay: ${basename(overlayPath)}`)
		} else {
			console.log(`  lang ${lang}: no overlay; using base`)
		}
		data.lang = data.lang || lang
	} else {
		data.lang = data.lang || 'en'
	}

	return data
}

function outNameFor({ inline, lang }) {
	if (inline) return lang && lang !== 'en' ? `features.inline.${lang}.html` : 'features.inline.html'
	return lang && lang !== 'en' ? `features.${lang}.html` : 'features.html'
}

function normalizeMedia(m) {
	if (!m) return null
	if (typeof m === 'string') return { src: m }
	if (m.src) {
		return {
			type: m.type,
			src: m.src,
			title: m.title || m.caption || undefined,
			description: m.description || undefined,
		}
	}
	return null
}

function mediaTypeFromSrc(src) {
	return /\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(src || '') ? 'video' : 'image'
}

/** One slide.media entry, or an array → one slide per asset (per-item title/description kept). */
function expandSlideMedia(slide) {
	const raw = slide.media
	const list = Array.isArray(raw) ? raw : raw != null ? [raw] : [null]
	const medias = list.map(normalizeMedia)
	if (medias.length <= 1) {
		const media = medias[0]
		if (media && !media.type) media.type = mediaTypeFromSrc(media.src)
		const next = { ...slide, media: media ? { type: media.type, src: media.src } : null }
		if (media?.title) next.title = media.title
		if (media?.description) next.description = media.description
		return [next]
	}
	return medias.map((media, i) => {
		const m = media ? { type: media.type || mediaTypeFromSrc(media.src), src: media.src } : null
		return {
			...slide,
			id: `${slide.id || 'slide'}-${i}`,
			title: media?.title || slide.title,
			description: media?.description || slide.description,
			media: m,
		}
	})
}

function isEnabled(item) {
	if (!item) return false
	if (item.enabled === false || item.enable === false) return false
	return true
}

function filterHighlights(list) {
	if (!Array.isArray(list)) return []
	return list.filter(isEnabled)
}

function normalizeFeature(f, cat) {
	let slides = f.slides
	if (!slides?.length && f.gallery?.length) {
		slides = f.gallery.map((g, i) => ({
			id: `g-${i}`,
			title: g.caption || f.label,
			description: g.description || f.description || '',
			media: { type: g.type || mediaTypeFromSrc(g.src), src: g.src },
			highlights: [],
			actions: [],
		}))
	}
	if (!slides?.length) {
		slides = [{
			id: 'overview',
			title: f.label,
			description: f.description || '',
			media: null,
			highlights: [],
			actions: [],
		}]
	}
	slides = slides
		.filter(isEnabled)
		.flatMap(expandSlideMedia)
		.map((s) => ({ ...s, highlights: filterHighlights(s.highlights) }))
	const out = { ...f, slides }
	if (cat) {
		out.categoryId = cat.id
		out.categoryLabel = cat.label
	}
	return out
}

function flattenFeatures(product) {
	const list = []
	if (product.categories?.length) {
		for (const cat of product.categories) {
			for (const f of cat.features || []) {
				if (!isEnabled(f)) continue
				list.push(normalizeFeature(f, cat))
			}
		}
		return list
	}
	for (const f of product.features || []) {
		if (!isEnabled(f)) continue
		list.push(normalizeFeature(f, null))
	}
	return list
}

function loadIcons(dir) {
	if (!existsSync(dir)) {
		console.error(`icons dir missing: ${dir}`)
		process.exit(1)
	}
	const out = {}
	for (const file of readdirSync(dir)) {
		if (!file.endsWith('.svg')) continue
		out[file.slice(0, -4)] = readFileSync(join(dir, file), 'utf8').trim()
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

function shellMarkup() {
	return `<div class="shell">
  <aside class="sidebar">
    <div class="side-brand">
      <div class="side-logo" id="brandLogo"></div>
      <strong id="brandTitle"></strong>
    </div>
    <nav class="side-nav" id="sideNav" aria-label="Features"></nav>
    <div class="side-foot">
      <button type="button" class="theme-btn" id="themeBtn" aria-label="Toggle theme" title="Theme">
        <span class="moon" aria-hidden="true">◐</span>
        <span class="sun" aria-hidden="true">☀</span>
      </button>
    </div>
  </aside>
  <div class="main">
    <section class="stage" id="stage" aria-live="polite"></section>
  </div>
</div>`
}

/** Scope theme tokens + height to .tv-explore for widget hosts.
 *  Critical: never leave bare `body{overflow:hidden}` — that freezes the host page. */
function cssForInline(css) {
	return css
		.replace(/:root/g, '.tv-explore')
		// Theme attrs on .tv-explore only — never rewrite .tv-lightbox[data-theme=…]
		// (lightbox is appended to document.body outside the widget root).
		.replace(/(^|[,}])(\s*)\[data-theme=/g, '$1$2.tv-explore[data-theme=')
		// Desktop-ish default height; mobile flatten overrides to height:auto !important
		.replace(/html,body\{height:100%;margin:0\}/, '.tv-explore{height:auto;min-height:480px;margin:0}')
		// Scope the full-page body chrome (overflow:hidden, fonts, bg) to the widget root
		// Negative lookbehind: do not rewrite .stage-body{ etc.
		.replace(/(?<![a-zA-Z0-9_-])body\{/g, '.tv-explore{')
		.replace(/(?<![a-zA-Z0-9_-])html\{/g, '.tv-explore{')
		// Scope remaining element/universal resets so they don't restyle the host app
		.replace(/(^|})\s*\*\{/g, '$1.tv-explore,.tv-explore *{')
		.replace(/\*,\*::before,\*::after/g, '.tv-explore *,.tv-explore *::before,.tv-explore *::after')
		.replace(/(^|})\s*button,input\{/g, '$1.tv-explore button,.tv-explore input{')
		.replace(/(^|})\s*button\{/g, '$1.tv-explore button{')
		.replace(/(^|})\s*img,video\{/g, '$1.tv-explore img,.tv-explore video{')
		.replace(/(^|})\s*a\{/g, '$1.tv-explore a{')
		.replace(/height:100dvh/g, 'height:100%')
		.replace(/min-height:100dvh/g, 'min-height:100%')
}

function assetBootstrap(assetUrl) {
	const base = normalizeAssetUrl(assetUrl)
	if (!base) return ''
	return `<script>window.TV_ASSET_URL=${JSON.stringify(base)};</script>\n`
}

function buildHtml(product, icons, lang, { inline = false, css = '', js = '', assetUrl = '' } = {}) {
	const features = flattenFeatures(product)
	const payload = JSON.stringify({ product, features }).replace(/</g, '\\u003c')
	const title = product.title || 'Tanit Viewer'
	const iconsJson = JSON.stringify(icons).replace(/</g, '\\u003c')
	const htmlLang = (lang || product.lang || 'en').replace(/[^\w-]/g, '') || 'en'
	const shell = shellMarkup()
	const boot = assetBootstrap(assetUrl)
	const dataScripts =
		`<script type="application/json" id="data">${payload}</script>\n` +
		`<script type="application/json" id="icons">${iconsJson}</script>`

	if (inline) {
		const scopedCss = cssForInline(css)
		return `<!-- tanit-viewer explore (inline) lang=${htmlLang} -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<div class="tv-explore" data-theme="light" data-lang="${htmlLang}">
<style>
${scopedCss}
</style>
${shell}
${dataScripts}
${boot}<script>
(function(){var k='tv-explore-theme';var q=null;try{q=new URLSearchParams(location.search).get('theme')}catch(e){}var host=null;try{var cl=document.documentElement.classList;if(cl.contains('dark'))host='dark';else if(cl.contains('light'))host='light'}catch(e){}var t=(q==='light'||q==='dark')?q:(host||localStorage.getItem(k)||'light');var r=document.currentScript&&document.currentScript.closest('.tv-explore');if(r)r.setAttribute('data-theme',t)})();
</script>
<script>
${js}
</script>
</div>
`
	}

	return `<!DOCTYPE html>
<html lang="${htmlLang}" data-theme="light">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title.replace(/</g, '')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="explore.css"/>
<script>
(function(){var k='tv-explore-theme';var sp=null;try{sp=new URLSearchParams(location.search)}catch(e){}var q=sp&&sp.get('theme');var t=(q==='light'||q==='dark')?q:(localStorage.getItem(k)||'light');document.documentElement.setAttribute('data-theme',t);if((sp&&sp.get('embed')==='1')||(window.parent!==window))document.documentElement.setAttribute('data-pm-embed','1')})();
</script>
</head>
<body>
${shell}
${dataScripts}
${boot}<script src="explore.js"></script>
</body>
</html>
`
}

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.json': 'application/json',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.mp4': 'video/mp4',
	'.webm': 'video/webm',
	'.mp3': 'audio/mpeg',
	'.wav': 'audio/wav',
}

const SERVE_REBUILD_MS = 5000

function serve(dir, htmlName, port) {
	const root = resolve(dir)
	const server = createServer((req, res) => {
		const url = new URL(req.url || '/', `http://localhost:${port}`)
		let path = decodeURIComponent(url.pathname)
		if (path === '/') path = `/${htmlName}`
		const file = resolve(root, '.' + path)
		if (!file.startsWith(root) || !existsSync(file)) {
			res.writeHead(404)
			res.end('Not found')
			return
		}
		const ext = extname(file).toLowerCase()
		res.writeHead(200, {
			'Content-Type': MIME[ext] || 'application/octet-stream',
			'Cache-Control': 'no-store',
		})
		res.end(readFileSync(file))
	})
	server.listen(port, () =>
		console.log(`serving http://localhost:${port}/  (${htmlName})  · rebuild every ${SERVE_REBUILD_MS / 1000}s`),
	)
}

const args = parseArgs(process.argv.slice(2))
if (args.help) {
	console.log(`Usage: node explore.mjs [product.json] [options]

With no --lang, builds the base catalog plus every product_<lang>.json found.

Options:
  --lang, -l <code>   Build only this lang (merge product_<code>.json if present)
  --inline            Embed-ready fragment (no doctype/html/head/body).
                      Inlines: CSS, JS, icons, product data (+ lang overlay).
  --asset-url <url>   Prepend to images, videos, and click sfx (e.g. https://cdn.example/tanit/)
  --out <file>        Single output path (requires --lang, or base-only if no overlays)
  --serve             Serve the product dir after build; rebuild from product.json every 5s
  --port <n>          Port for --serve (default: 5177)
  -h, --help          Show help

Edit: explore.css, explore.js, icons/*.svg, product.json, product_<lang>.json
`)
	process.exit(0)
}

const productPath = resolve(__dir, args.product || 'product.json')
const assetUrl = normalizeAssetUrl(args.assetUrl)

/** Rebuild HTML from product.json (+ css/js/icons). Returns last output path. */
function runBuild(quiet) {
	const css = requireAsset(CSS_PATH, 'explore.css')
	const js = requireAsset(JS_PATH, 'explore.js')
	if (!css.trim() || !js.trim()) {
		console.error('explore.css / explore.js look empty')
		return null
	}
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
			buildHtml(product, icons, htmlLang, { inline: args.inline, css, js, assetUrl }),
			'utf8',
		)
		lastOut = outPath
		if (!quiet) {
			console.log(
				`wrote ${outPath}  (${features.length} features, ${Object.keys(icons).length} icons` +
					`, lang=${htmlLang}` +
					(args.inline ? ', inline' : '') +
					(assetUrl ? `, asset-url=${assetUrl}` : '') +
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

const lastOut = runBuild(false)
if (!lastOut) process.exit(1)

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
