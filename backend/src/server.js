import { createApp } from './app.js'

const required = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY']
const missing = required.filter((name) => !process.env[name])
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  process.exit(1)
}

const port = Number.parseInt(process.env.PORT || '3001', 10)
const app = createApp()
app.listen(port, '0.0.0.0', () => console.log(`n8n Detleng backend listening on port ${port}`))
