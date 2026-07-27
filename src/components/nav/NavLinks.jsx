import { scrollToAnchor } from '../../utils/scroll'

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'Collections', href: '#collections' },
  { label: 'Lookbook', href: '#bestsellers' },
  { label: 'About', href: '#craftsmanship' },
  { label: 'Contact', href: '#newsletter' },
]

export default function NavLinks() {
  return (
    <div className="hidden lg:flex items-center gap-10">
      {links.map((link) => (
        <span
          key={link.label}
          onClick={() => scrollToAnchor(link.href)}
          className="nav-underline text-[11px] tracking-[0.2em] uppercase text-ivory/80 hover:text-gold transition-colors duration-300"
        >
          {link.label}
        </span>
      ))}
    </div>
  )
}
