import { motion, AnimatePresence } from 'framer-motion'
import { scrollToAnchor } from '../../utils/scroll'

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'Collections', href: '#collections' },
  { label: 'Lookbook', href: '#bestsellers' },
  { label: 'About', href: '#craftsmanship' },
  { label: 'Contact', href: '#newsletter' },
]

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const linkVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25 },
  },
}

export default function MobileMenu({ open, onClose }) {
  const isMobile = window.innerWidth < 768
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center glass"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit={isMobile ? { opacity: 0, pointerEvents: 'none', transition: { duration: 0 } } : "exit"}
        >
          <button
            className="absolute top-6 right-6 text-ivory/80 hover:text-gold transition-colors z-50"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <motion.ul
            className="flex flex-col items-center gap-10"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit={isMobile ? { opacity: 0, pointerEvents: 'none', transition: { duration: 0 } } : "exit"}
          >
            {links.map((link) => (
              <motion.li key={link.label} variants={linkVariants}>
                <span
                  onClick={() => {
                    onClose()
                    setTimeout(() => scrollToAnchor(link.href), 300)
                  }}
                  className="font-heading text-4xl lg:text-5xl text-ivory hover:text-gold transition-colors duration-300 tracking-[0.06em]"
                >
                  {link.label}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
