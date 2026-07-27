import { useStore } from '../../hooks/store'

function IconButton({ children, className = '', ...props }) {
  return (
    <button
      className={`text-ivory/80 hover:text-gold transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function NavIcons({ searchOpen, onSearchToggle }) {
  const bagCount = useStore(state => state.bagCount)
  const wishlist = useStore(state => state.wishlist)

  return (
    <div className="flex items-center gap-4 lg:gap-5">
      <IconButton aria-label="Search" onClick={onSearchToggle}>
        {searchOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )}
      </IconButton>
      <IconButton
        aria-label="Wishlist"
        className="relative"
        onClick={() => window.dispatchEvent(new Event('open-wishlist'))}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M19 14c1.5-1.5 3-3.5 3-6 0-2.8-2.2-5-5-5-1.6 0-3 .7-4 1.8C12 3.7 10.6 3 9 3 6.2 3 4 5.2 4 8c0 2.5 1.5 4.5 3 6l5 5 7-7Z" />
        </svg>
        {wishlist.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-gold text-deep text-[9px] font-semibold leading-none">
            {wishlist.length}
          </span>
        )}
      </IconButton>
      <button
        aria-label="Shopping bag"
        onClick={() => window.dispatchEvent(new Event('open-cart'))}
        className="relative text-ivory/80 hover:text-gold transition-colors duration-300"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {bagCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-gold text-deep text-[9px] font-semibold leading-none">
            {bagCount}
          </span>
        )}
      </button>
    </div>
  )
}
