import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const THEME_FILE = /^explore_([a-z0-9][a-z0-9_-]*)\.css$/i
export const DEFAULT_SKIN = 'plex'

function parseThemeMeta(css, fallbackId) {
	const head = css.slice(0, 1200)
	const idM = head.match(/@explore-theme\s+([a-z0-9_-]+)/i)
	const fontM = head.match(/@explore-font\s+(\S+)/i)
	return {
		id: (idM ? idM[1] : fallbackId).toLowerCase(),
		font: fontM ? fontM[1] : '',
	}
}

/** Discover `explore_<name>.css` next to explore.css. Default skin (`plex`) sorts first. */
export function discoverThemes(dir) {
	if (!existsSync(dir)) return []
	const themes = []
	for (const file of readdirSync(dir)) {
		const m = file.match(THEME_FILE)
		if (!m) continue
		const path = join(dir, file)
		const css = readFileSync(path, 'utf8')
		if (!css.trim()) continue
		const meta = parseThemeMeta(css, m[1].toLowerCase())
		themes.push({ id: meta.id, file, path, css, font: meta.font })
	}
	themes.sort((a, b) => {
		if (a.id === DEFAULT_SKIN) return -1
		if (b.id === DEFAULT_SKIN) return 1
		return a.id.localeCompare(b.id)
	})
	return themes
}

export function resolveSkin(themes, requested) {
	const ids = themes.map((t) => t.id)
	const want = String(requested || '').trim().toLowerCase()
	if (want && ids.includes(want)) return want
	if (ids.includes(DEFAULT_SKIN)) return DEFAULT_SKIN
	return ids[0] || DEFAULT_SKIN
}

export function fontLinks(themes) {
	const seen = new Set()
	const hrefs = []
	for (const t of themes) {
		if (!t.font || seen.has(t.font)) continue
		seen.add(t.font)
		hrefs.push(t.font)
	}
	if (!hrefs.length) return ''
	const google = hrefs.some((h) => h.includes('fonts.googleapis.com'))
	const pre = google
		? `<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>\n`
		: ''
	return pre + hrefs.map((h) => `<link href="${h}" rel="stylesheet"/>`).join('\n')
}

export function styleLinks(themes) {
	return ['explore.css', ...themes.map((t) => t.file)]
		.map((f) => `<link rel="stylesheet" href="${f}"/>`)
		.join('\n')
}

export function bundledCss(layoutCss, themes) {
	return [layoutCss, ...themes.map((t) => `/* ${t.file} */\n${t.css}`)].join('\n')
}

/** Scope theme tokens + height to .tv-explore for widget hosts.
 *  Critical: never leave bare `body{overflow:hidden}` — that freezes the host page. */
export function cssForInline(css) {
	return css
		.replace(/:root/g, '.tv-explore')
		// Theme attrs on .tv-explore only — never rewrite .tv-lightbox[data-theme=…]
		.replace(/(^|[,}\n])(\s*)\[data-theme=/g, '$1$2.tv-explore[data-theme=')
		.replace(/(^|[,}\n])(\s*)\[data-skin=/g, '$1$2.tv-explore[data-skin=')
		.replace(/html,body\{height:100%;margin:0\}/, '.tv-explore{height:100%;min-height:0;margin:0}')
		.replace(/html\.tv-playing/g, '.tv-explore.tv-playing')
		.replace(/html\.tv-stack/g, '.tv-explore.tv-stack')
		.replace(/html\[data-pm-embed\]/g, '.tv-explore[data-pm-embed]')
		.replace(/(?<![a-zA-Z0-9_-])body\{/g, '.tv-explore{')
		.replace(/(?<![a-zA-Z0-9_-])html\{/g, '.tv-explore{')
		.replace(/(^|})\s*\*\{/g, '$1.tv-explore,.tv-explore *{')
		.replace(/\*,\*::before,\*::after/g, '.tv-explore *,.tv-explore *::before,.tv-explore *::after')
		.replace(/(^|})\s*button,input\{/g, '$1.tv-explore button,.tv-explore input{')
		.replace(/(^|})\s*button\{/g, '$1.tv-explore button{')
		.replace(/(^|})\s*img,video\{/g, '$1.tv-explore img,.tv-explore video{')
		.replace(/(^|})\s*a\{/g, '$1.tv-explore a{')
		.replace(/height:100dvh/g, 'height:100%')
		.replace(/min-height:100dvh/g, 'min-height:100%')
}
