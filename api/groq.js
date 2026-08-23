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

    let targetModel = 'llama-3.3-70b-versatile';
    let response = await makeRequest(targetModel);
    let errText = '';

    if (!response.ok) {
      errText = await response.text();
      const isModelError = errText.includes('model_not_found') || errText.includes('model_decommissioned') || errText.includes('does not exist') || errText.includes('decommissioned') || errText.includes('rate_limit_exceeded') || response.status === 429;
      
      if (isModelError) {
        console.log(`Model ${targetModel} failed. Fetching available models for fallback loop...`);
        const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${key}` }
        });
        
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json();
          const availableModels = modelsData.data?.map(m => m.id) || [];
          
          let validModels = availableModels.filter(m => m !== targetModel && !m.includes('whisper') && !m.includes('vision') && !m.includes('guard') && !m.includes('orpheus') && !m.includes('embed') && !m.includes('deepseek') && !m.includes('qwq'));
          
          // Sort to prioritize 8b, 3b, 1b, instant models first
          validModels.sort((a, b) => {
            const aSmall = a.includes('8b') || a.includes('3b') || a.includes('1b') || a.includes('instant');
            const bSmall = b.includes('8b') || b.includes('3b') || b.includes('1b') || b.includes('instant');
            if (aSmall && !bSmall) return -1;
            if (!aSmall && bSmall) return 1;
            return 0;
          });
          
          // Try up to 4 models sequentially
          for (const fallbackModel of validModels.slice(0, 4)) {
            console.log(`Retrying with fallback model: ${fallbackModel}`);
            response = await makeRequest(fallbackModel);
            if (response.ok) {
              break; // Success!
            } else {
              errText = await response.text();
              const isRetryable = errText.includes('rate_limit_exceeded') || response.status === 429 || errText.includes('decommissioned') || errText.includes('model_not_found') || errText.includes('does not exist');
              if (!isRetryable) break; // Break on hard errors (like bad prompt)
            }
          }
        }
      }
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    let replyText = data.choices?.[0]?.message?.content || '';
    
    // Strip out <think>...</think> blocks from deep reasoning models
    replyText = replyText.replace(/<think>[\s\S]*?<\/think>\n*/g, '').trim();
    
    res.json({ reply: replyText });
  } catch (err) {
    console.error('/api/groq error:', err);
    res.status(500).json({ error: err.message });
  }
}
