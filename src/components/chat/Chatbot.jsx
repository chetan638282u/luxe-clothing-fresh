import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBagItems, getWishlist, getBagCount } from '../../hooks/store'
import { womenProducts, menProducts, accessoriesProducts, newArrivalsProducts, bestSellersProducts } from '../../data/catalog'

const suggestedQuestions = [
  'I need a slim fit blazer, any suggestions?',
  'I am 5\'4", which dress would look best on me?',
  'What are the latest new arrivals?',
  'What is your return policy?',
]

function buildSystemPrompt() {
  const bagItems = getBagItems()
  const wishlist = getWishlist()
  const bagCount = getBagCount()

  const catalogStr = [
    'BEST SELLERS: ' + bestSellersProducts.map(p => `${p.name} ${p.price}`).join(', '),
    'WOMEN: ' + womenProducts.map(p => `${p.name} ${p.price}`).join(', '),
    'MEN: ' + menProducts.map(p => `${p.name} ${p.price}`).join(', '),
    'ACCESSORIES: ' + accessoriesProducts.map(p => `${p.name} ${p.price}`).join(', '),
    'NEW ARRIVALS: ' + newArrivalsProducts.map(p => `${p.name} ${p.price}`).join(', '),
    'Free shipping on orders over $500. 30-day returns. concierge@maison.com',
  ].join('\n')

  let context = ''
  if (bagCount > 0) {
    context += `Bag: ${bagItems.map(i => i.name).join(', ')}\n`
  }
  context += `Wishlist: ${wishlist.map(i => i.name).join(', ') || 'empty'}`

  return `You are Jessi — a fast MAISON concierge.

CATALOG (exact live prices):
${catalogStr}

CUSTOMER:
${context}

RULES:
- Mirror the user's language (Reply in English if they speak English, Hindi if Hindi, Hinglish if Hinglish)
- Your final output to the user MUST be a maximum of 1-3 short sentences. You may use your internal <think> block to think for as long as you need, but the final text you provide outside the block must be extremely concise and brief.
- Use exact $ prices from catalog
- Warm but very brief — like a quick luxury boutique chat
- Example: "That blazer is $42 and would look very elegant on you. Would you like to try it?"`
}

function fmtTime(ts) {
  const d = new Date(ts)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
}

const btnGlow = `
@keyframes chat-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201,169,97,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(201,169,97,0); }
}
`

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const chatRef = useRef(null)
  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  const askGroq = useCallback(async (conversation) => {
    const systemPrompt = buildSystemPrompt()
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...conversation.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
    ]

    const res = await fetch('/api/groq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: groqMessages }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || `HTTP ${res.status}`)
    }

    const data = await res.json()
    return data.reply || 'I am sorry, I could not process that right now. Please try again.'
  }, [])

  const handleSelect = async (question) => {
    const userMsg = { role: 'user', text: question, time: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const updated = [...messages, userMsg]
      const reply = await askGroq(updated)
      setMessages((prev) => [...prev, { role: 'bot', text: reply, time: Date.now() }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `Error: ${err.message}`, time: Date.now() },
      ])
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', text, time: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    try {
      const updated = [...messages, userMsg]
      const reply = await askGroq(updated)
      setMessages((prev) => [...prev, { role: 'bot', text: reply, time: Date.now() }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `Error: ${err.message}`, time: Date.now() },
      ])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!loading) inputRef.current?.focus()
  }, [loading])

  useEffect(() => {
    if (!open) return

    const el = scrollRef.current
    if (!el) return

    const handler = (e) => e.stopPropagation()
    el.addEventListener('wheel', handler, { passive: false })

    inputRef.current?.focus()

    return () => {
      el.removeEventListener('wheel', handler)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <>
      <style>{btnGlow}</style>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-8 right-8 z-50 w-18 h-18 rounded-full bg-gold shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200"
        style={open ? {} : { animation: 'chat-glow 2s ease-in-out infinite' }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-deep">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            <span className="relative font-heading text-[12px] tracking-wider font-semibold uppercase text-deep -mt-0.5">agent</span>
            <div className="absolute -bottom-3 right-2.5 w-5 h-5 bg-gold" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)', transform: 'rotate(-10deg)' }} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] h-[480px] max-h-[calc(100vw*1.4-8rem)] md:max-h-[70vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-black/10"
            style={{ backgroundColor: 'rgba(235, 231, 224, 0.96)', contain: 'paint layout', willChange: 'transform' }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-xs font-semibold">J</span>
                </div>
                <div>
                  <p className="text-ivory text-sm font-medium">Jessi</p>
                  <p className="text-ivory/40 text-[10px]">Online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-ivory/40 hover:text-gold transition-colors"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4" data-lenis-prevent="true">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="glass p-3 rounded-lg text-ivory/80 text-sm leading-relaxed">
                    Hello! I'm Jessi — your personal MAISON concierge. How can I help you today? Are you looking for a specific product or styling advice?
                  </div>
                  <p className="text-ivory/50 text-[11px] tracking-wide uppercase mt-4 mb-2">Quick Questions</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSelect(q)}
                        disabled={loading}
                        className="text-xs text-ivory/70 border border-black/15 rounded-full px-3 py-1.5 hover:border-gold/50 hover:text-gold transition-colors disabled:opacity-40"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gold/20 text-ivory'
                        : 'glass text-ivory/80'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-ivory/25 mt-0.5 px-1">{fmtTime(msg.time)}</span>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="glass px-4 py-2.5 rounded-lg text-ivory/60 text-sm">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-[10px] text-ivory/40">Jessi is typing...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-black/10"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..." maxLength={500}
                disabled={loading}
                className="flex-1 bg-transparent text-ivory text-sm placeholder:text-ivory/30 focus:outline-none focus:ring-1 focus:ring-gold/40 rounded disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="text-gold hover:text-ivory transition-colors disabled:opacity-30"
                aria-label="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
