import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flattenFeatures } from './catalog.mjs'
import { cssForInline, fontLinks, styleLinks } from './themes.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const FRAG = join(__dir, 'fragments')

function readFrag(name) {
	return readFileSync(join(FRAG, name), 'utf8').trimEnd()
}

function fill(tpl, map) {
	return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (map[k] != null ? String(map[k]) : ''))
}

function normalizeAssetUrl(url) {
	if (!url) return ''
	const s = String(url).trim()
	if (!s) return ''
	return s.replace(/\/?$/, '/')
}

function assetBootstrap(assetUrl) {
	const base = normalizeAssetUrl(assetUrl)
	if (!base) return ''
	return `<script>window.TV_ASSET_URL=${JSON.stringify(base)};</script>\n`
}

function skinsBoot(skins, defaultSkin) {
	return `window.TV_EXPLORE_SKINS=${JSON.stringify(skins)};window.TV_EXPLORE_SKIN=${JSON.stringify(defaultSkin)};`
}

/** Early paint: theme (light/dark) + skin + layout + embed. */
function bootPage() {
	return `(function(){var skins=window.TV_EXPLORE_SKINS||['plex'];var def=window.TV_EXPLORE_SKIN||skins[0]||'plex';var k='tv-explore-theme';var ks='tv-explore-skin';var sp=null;try{sp=new URLSearchParams(location.search)}catch(e){}var q=sp&&sp.get('theme');var t=(q==='light'||q==='dark')?q:(localStorage.getItem(k)||'light');document.documentElement.setAttribute('data-theme',t);var qs=sp&&sp.get('skin');var skin=(qs&&skins.indexOf(qs)>=0)?qs:(localStorage.getItem(ks)||def);if(skins.indexOf(skin)<0)skin=def;document.documentElement.setAttribute('data-skin',skin);var lq=sp&&(sp.get('layout')||sp.get('mode'))||(function(){try{return localStorage.getItem('tv-explore-layout')}catch(e){return null}})();if(lq==='scroll'||lq==='stack')document.documentElement.classList.add('tv-stack');if((sp&&sp.get('embed')==='1')||(window.parent!==window))document.documentElement.setAttribute('data-pm-embed','1')})();`
}

function bootInline() {
	return `(function(){var skins=window.TV_EXPLORE_SKINS||['plex'];var def=window.TV_EXPLORE_SKIN||skins[0]||'plex';var k='tv-explore-theme';var ks='tv-explore-skin';var q=null;var sp=null;try{sp=new URLSearchParams(location.search);q=sp.get('theme')}catch(e){}var host=null;try{var cl=document.documentElement.classList;if(cl.contains('dark'))host='dark';else if(cl.contains('light'))host='light'}catch(e){}var t=(q==='light'||q==='dark')?q:(host||localStorage.getItem(k)||'light');var r=document.currentScript&&document.currentScript.closest('.tv-explore');if(r)r.setAttribute('data-theme',t);var qs=null;try{qs=sp&&sp.get('skin')}catch(e){}var skin=(qs&&skins.indexOf(qs)>=0)?qs:(function(){try{return localStorage.getItem(ks)}catch(e){return null}})()||def;if(skins.indexOf(skin)<0)skin=def;if(r)r.setAttribute('data-skin',skin);var lq=null;try{lq=(sp&&(sp.get('layout')||sp.get('mode')))||localStorage.getItem('tv-explore-layout')}catch(e){}if(lq==='scroll'||lq==='stack'){document.documentElement.classList.add('tv-stack');if(r)r.classList.add('tv-stack')}})();`
}

export { normalizeAssetUrl }

export function buildHtml(product, icons, lang, {
	inline = false,
	css = '',
	js = '',
	assetUrl = '',
	themes = [],
	skin = 'plex',
} = {}) {
	const features = flattenFeatures(product)
	const payload = JSON.stringify({ product, features }).replace(/</g, '\\u003c')
	const title = (product.title || 'Tanit Viewer').replace(/</g, '')
	const iconsJson = JSON.stringify(icons).replace(/</g, '\\u003c')
	const htmlLang = (lang || product.lang || 'en').replace(/[^\w-]/g, '') || 'en'
	const shell = readFrag('shell.html')
	const boot = assetBootstrap(assetUrl)
	const dataScripts =
		`<script type="application/json" id="data">${payload}</script>\n` +
		`<script type="application/json" id="icons">${iconsJson}</script>`
	const skinIds = themes.map((t) => t.id)
	const map = {
		LANG: htmlLang,
		SKIN: skin,
		TITLE: title,
		FONTS: fontLinks(themes),
		STYLES: styleLinks(themes),
		SKINS_BOOT: skinsBoot(skinIds, skin),
		SHELL: shell,
		DATA: dataScripts,
		ASSET: boot,
	}

	if (inline) {
		return fill(readFrag('inline.html'), {
			...map,
			CSS: cssForInline(css),
			JS: js,
			BOOT: bootInline(),
		}) + '\n'
	}

	return fill(readFrag('page.html'), {
		...map,
		BOOT: bootPage(),
	}) + '\n'
}
