import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function localApi(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      Object.assign(process.env, env) // makes GEMINI_API_KEY visible to api/chat.js

      server.middlewares.use(async (req, res, next) => {
        const match = req.url.match(/^\/api\/(\w+)/)
        if (!match) return next()

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const raw = Buffer.concat(chunks).toString()
          req.body = raw ? JSON.parse(raw) : {}

          res.status = (code) => { res.statusCode = code; return res }
          res.json = (obj) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(obj))
          }

          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`)
          await mod.default(req, res)
        } catch (e) {
          console.error(e)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Local API error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // reads .env, including non-VITE_ vars
  return {
    plugins: [react(), localApi(env)],
  }
})