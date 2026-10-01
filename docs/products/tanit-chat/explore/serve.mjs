import { readFileSync, existsSync } from 'node:fs'
import { resolve, extname } from 'node:path'
import { createServer } from 'node:http'

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
	'.woff2': 'font/woff2',
	'.woff': 'font/woff',
}

export const SERVE_REBUILD_MS = 5000

export function serve(dir, htmlName, port) {
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
