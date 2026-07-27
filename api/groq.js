const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'https://luxe-clothing.vercel.app',
  'https://luxe-clothing-snowy.vercel.app',
]

const rateMap = new Map()

export default async function handler(req, res) {
  const origin = req.headers.origin
  
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')
    if (!isAllowed) {
      return res.status(403).json({ error: 'Forbidden' })
    }
  }

  const ip = req.headers['x-forwarded-for'] || 'unknown'
  const now = Date.now()
  const recent = (rateMap.get(ip) || []).filter(t => now - t < 60000)
  if (recent.length >= 20) {
    return res.status(429).json({ error: 'Too many requests. Please wait.' })
  }
  recent.push(now)
  rateMap.set(ip, recent)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body
  const key = process.env.GROQ_API_KEY

  if (!key) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json()
    res.json({ reply: data.choices?.[0]?.message?.content || '' })
  } catch (err) {
    console.error('/api/groq error:', err)
    res.status(500).json({ error: err.message })
  }
}
