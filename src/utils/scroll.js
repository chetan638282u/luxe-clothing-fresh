export const scrollToAnchor = (href, _duration = 1) => {
  if (href === '#top') {
    if (window.location.hash) window.location.hash = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // Clear hash to close any overlays or product pages and return to the main view
  if (window.location.hash && window.location.hash !== '') {
    window.location.hash = ''
  }

  const attemptScroll = (retries = 0) => {
    const el = document.querySelector(href)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80 // 80px for navbar offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else if (retries < 10) {
      setTimeout(() => attemptScroll(retries + 1), 50)
    }
  }

  attemptScroll()
}
