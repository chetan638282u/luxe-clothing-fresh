export const scrollToAnchor = (href, _duration = 1) => {
  if (href === '#top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.querySelector(href)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80 // 80px for navbar offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}
