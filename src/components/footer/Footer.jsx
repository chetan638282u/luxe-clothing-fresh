import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { scrollToAnchor } from '../../utils/scroll'

const shopLinks = [
  { label: 'Women', href: '#collections' },
  { label: 'Men', href: '#collections' },
  { label: 'Accessories', href: '#collections' },
  { label: 'New Arrivals', href: '#collections' },
  { label: 'Sale', href: '#bestsellers' },
]
const companyLinks = [
  { label: 'About Us', href: '#craftsmanship' },
  { label: 'Careers', href: '#' },
  { label: 'Sustainability', href: '#' },
  { label: 'Press', href: '#' },
]
const supportLinks = [
  { label: 'Contact', href: '#newsletter' },
  { label: 'Shipping & Returns', href: '#' },
  { label: 'Size Guide', href: '#' },
  { label: 'FAQ', href: '#' },
]

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    viewBox: '0 0 24 24',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .3 2.7.7.7.3 1.4.7 2 1.3.6.6 1 1.2 1.3 2 .4.7.6 1.5.7 2.7.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.2 1.2-.3 2-.7 2.7-.3.7-.7 1.4-1.3 2-.6.6-1.2 1-2 1.3-.7.4-1.5.6-2.7.7-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.2-2-.3-2.7-.7-.7-.3-1.4-.7-2-1.3-.6-.6-1-1.2-1.3-2-.4-.7-.6-1.5-.7-2.7-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.2-1.2.3-2 .7-2.7.3-.7.7-1.4 1.3-2 .6-.6 1.2-1 2-1.3.7-.4 1.5-.6 2.7-.7C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7.1.1 5.8.2 5 .4 4.2.8c-.8.4-1.5.8-2.1 1.5C1.4 2.9 1 3.6.7 4.4c-.4.8-.6 1.6-.7 2.9C-.1 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 1.2.3 2 .7 2.8.4.8.8 1.5 1.5 2.1.6.6 1.3 1.1 2.1 1.5.8.4 1.6.6 2.9.7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.2-.2 2-.3 2.8-.7.8-.4 1.5-.8 2.1-1.5.6-.6 1.1-1.3 1.5-2.1.4-.8.6-1.6.7-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-1.2-.3-2-.7-2.8-.4-.8-.8-1.5-1.5-2.1-.6-.6-1.3-1.1-2.1-1.5-.8-.4-1.6-.6-2.9-.7C15.7 0 15.3 0 12 0m0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4m0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.4-9.6a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    viewBox: '0 0 24 24',
    path: 'M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3.1V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12',
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com',
    viewBox: '0 0 24 24',
    path: 'M12 0a12 12 0 0 0-4.4 23.2c-.1-.9-.2-2.3 0-3.3.2-.9 1.4-5.9 1.4-5.9s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 .9 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.8-.3 1.2.6 2.1 1.8 2.1 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.3-.1.7-.1.3-.3 1-.4 1.3-.1.4-.5.5-.9.3-1.6-.8-2.6-3.1-2.6-5 0-4.1 3-7.9 8.6-7.9 4.5 0 8 3.2 8 7.5 0 4.5-2.8 8.1-6.7 8.1-1.3 0-2.5-.7-3-1.5l-.8 3.1c-.3 1.1-1.1 2.5-1.6 3.4A12 12 0 0 0 12 24a12 12 0 0 0 0-24',
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    viewBox: '0 0 24 24',
    path: 'M19.6 6.7A5.5 5.5 0 0 1 17 4.6l.1-.1h-3.3v11.5a3.7 3.7 0 1 1-2.1-3.4v-3.7a7 7 0 1 0 6.5 7V8.6c.6.4 1.3.7 2.1.9v-2.8z',
  },
]

function scrollTo(href) {
  if (href.startsWith('#')) {
    scrollToAnchor(href)
  }
}

export default function Footer() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-col', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        },
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      })

      gsap.from('.footer-social', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        },
        y: 12,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power3.out',
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={containerRef} className="bg-charcoal pt-20 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="footer-col lg:col-span-2">
            <span className="font-heading text-gold text-xl tracking-[0.3em] uppercase">
              MAISON
            </span>
            <p className="text-ivory/50 text-sm mt-3 max-w-[260px] leading-relaxed">
              Luxury redefined, stitch by stitch. Every piece tells a story of
              uncompromising craftsmanship.
            </p>
            <div className="flex gap-4 mt-6">
              {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="footer-social text-ivory/40 hover:text-gold transition-colors duration-300"
                  >
                  <svg
                    width="20"
                    height="20"
                    viewBox={s.viewBox}
                    fill="currentColor"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Shop" links={shopLinks} onNavigate={scrollTo} />
          <LinkColumn title="Company" links={companyLinks} onNavigate={scrollTo} />
          <LinkColumn title="Support" links={supportLinks} onNavigate={scrollTo} />
        </div>

        <div className="flex justify-center lg:justify-end gap-6 mt-8 mb-10">
          <PaymentIcon label="Visa">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 8l2 8M14 8l-2 8M8 8l-1 4.5L6 8M16 8l1 4.5L18 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </PaymentIcon>
          <PaymentIcon label="Mastercard">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="9.5" cy="12" r="3.5" fill="currentColor" opacity="0.6" />
            <circle cx="14.5" cy="12" r="3.5" fill="currentColor" opacity="0.4" />
          </PaymentIcon>
          <PaymentIcon label="PayPal">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9 10h4.5a2.5 2.5 0 0 1 0 5H11l-.5 3H9l.5-3H8l1-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </PaymentIcon>
          <PaymentIcon label="Apple Pay">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M11 8v4l1-1M13 8v5M15 8l-1 3 1 2M9 10c0 1 .5 2 1 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </PaymentIcon>
        </div>

        <div className="h-px w-full bg-white/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
          <p className="text-ivory/40 text-xs">
            &copy; {new Date().getFullYear()} MAISON. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-ivory/50 hover:text-gold text-xs transition-colors duration-300">
              Privacy Policy
            </span>
            <span className="text-ivory/50 hover:text-gold text-xs transition-colors duration-300">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function LinkColumn({ title, links, onNavigate }) {
  return (
    <div className="footer-col">
      <h4 className="text-gold text-xs tracking-[0.2em] uppercase mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <span
              onClick={() => onNavigate(link.href)}
              className="text-ivory/60 hover:text-gold text-sm transition-colors duration-300"
            >
              {link.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PaymentIcon({ label, children }) {
  return (
    <div
      className="text-ivory/30 hover:text-gold/60 transition-colors duration-300"
      title={label}
    >
      <svg width="28" height="20" viewBox="0 0 24 24" className="block">
        {children}
      </svg>
    </div>
  )
}
