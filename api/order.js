const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://luxe-clothing.vercel.app',
  'https://luxe-clothing-snowy.vercel.app',
]

export default async function handler(req, res) {
  const origin = req.headers.origin
  
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')
    if (!isAllowed) {
      return res.status(403).json({ error: 'Forbidden' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, address, items, total } = req.body

  if (!name || !email || !items || !items.length) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()

  console.log(`Order ${orderId}: ${name} <${email}> — $${total} — ${items.length} items`)

  res.json({ orderId })
}
