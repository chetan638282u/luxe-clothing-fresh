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
    const makeRequest = (model) => fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    let targetModel = 'llama-3.1-70b-versatile';
    let response = await makeRequest(targetModel);
    let errText = '';

    if (!response.ok) {
      errText = await response.text();
      const isModelError = errText.includes('model_not_found') || errText.includes('does not exist');
      
      if (isModelError) {
        console.log(`Model ${targetModel} not found. Fetching available models for fallback...`);
        const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${key}` }
        });
        
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const availableModels = modelsData.data?.map(m => m.id) || [];
          
          // Prefer any non-vision llama model, otherwise fallback to the first available model
          const fallbackModel = availableModels.find(m => m.includes('llama') && !m.includes('vision')) || availableModels[0];
          
          if (fallbackModel && fallbackModel !== targetModel) {
            console.log(`Retrying with fallback model: ${fallbackModel}`);
            response = await makeRequest(fallbackModel);
            if (!response.ok) {
              errText = await response.text();
            }
          }
        }
      }
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || '' });
  } catch (err) {
    console.error('/api/groq error:', err);
    res.status(500).json({ error: err.message });
  }
}
