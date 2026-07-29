export default function HeroVideo() {
  return (
    <video
      src="/hero-editorial.mp4"
      poster="/hero-poster.jpg"
      autoPlay
      loop
      muted
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0"
      style={{
        contain: 'paint layout',
        willChange: 'transform',
      }}
    />
  )
}
