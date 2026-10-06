import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, dirname, basename, join, extname } from 'node:path'
import { marked } from 'marked'

function isPlainObject(v) {
	return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}

/** Deep-merge lang overlay. Arrays of {id} merge by id; plain-object arrays merge by index; else replace. */
export function mergeLang(base, over) {
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
	return basename(path, extname(path))
}

/** Find lang codes from product_<lang>.json / product-<lang>.json next to base. */
export function discoverLangs(productPath) {
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

export function resolveOverlayPath(productPath, lang) {
	const dir = dirname(resolve(productPath))
	const stem = productStem(productPath)
	const candidates = [
		join(dir, `${stem}_${lang}.json`),
		join(dir, `${stem}-${lang}.json`),
		join(dir, lang, `${stem}.json`),
	]
	return candidates.find((p) => existsSync(p)) || null
}

export function loadProduct(path, lang) {
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

	const intro = loadIntro(abs, data.lang)
	if (intro) {
		data.intro = intro
		console.log(`  intro: ${intro.file}`)
	}

	return data
}

function splitFrontMatter(src) {
	const text = String(src || '').replace(/^\uFEFF/, '')
	if (!text.startsWith('---')) return { meta: {}, body: text }
	const end = text.indexOf('\n---', 3)
	if (end < 0) return { meta: {}, body: text }
	const raw = text.slice(3, end).trim()
	const body = text.slice(end + 4).replace(/^\r?\n/, '')
	const meta = {}
	for (const line of raw.split(/\r?\n/)) {
		const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
		if (!m) continue
		meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
	}
	return { meta, body }
}

function firstHeading(md) {
	const m = String(md || '').match(/^#{1,6}\s+(.+)$/m)
	if (!m) return ''
	return m[1].replace(/[#*_`[\]]/g, '').trim()
}

/** intro.md for en; intro_<lang>.md (or intro-<lang>.md) otherwise, then intro.md. */
export function resolveIntroPath(productPath, lang) {
	const dir = dirname(resolve(productPath))
	const code = String(lang || 'en').toLowerCase()
	const localized = code && code !== 'en'
		? [join(dir, `intro_${code}.md`), join(dir, `intro-${code}.md`)]
		: []
	const candidates = [...localized, join(dir, 'intro.md')]
	return candidates.find((p) => existsSync(p)) || null
}

export function loadIntro(productPath, lang) {
	const path = resolveIntroPath(productPath, lang)
	if (!path) return null
	const { meta, body } = splitFrontMatter(readFileSync(path, 'utf8'))
	const html = marked.parse(body, { async: false, gfm: true })
	if (!String(html || '').trim()) return null
	const label = meta.label || firstHeading(body) || 'Intro'
	return { html: String(html), label, file: basename(path) }
}

export function outNameFor({ inline, lang }) {
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

export function flattenFeatures(product) {
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

export function loadIcons(dir) {
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
