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
        max_tokens: 512,
      }),
    });

    let targetModel = 'gemma2-9b-it';
    let response = await makeRequest(targetModel);
    let errText = '';

    if (!response.ok) {
      errText = await response.text();
      const isModelError = errText.includes('model_not_found') || errText.includes('model_decommissioned') || errText.includes('does not exist') || errText.includes('decommissioned');
      
      if (isModelError) {
        console.log(`Model ${targetModel} not found. Fetching available models for fallback...`);
        const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${key}` }
        });
        
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const availableModels = modelsData.data?.map(m => m.id) || [];
          
          // Strictly fallback to a known-good foundational model, ensuring we never pick the same failing model
          const safeModels = ['mixtral-8x7b-32768', 'llama-3.2-3b-preview', 'llama-3.1-8b-instant', 'llama3-8b-8192'];
          const fallbackModel = safeModels.find(m => m !== targetModel && availableModels.includes(m)) || availableModels.find(m => m !== targetModel && m.includes('llama') && !m.includes('vision') && !m.includes('guard'));
          
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
