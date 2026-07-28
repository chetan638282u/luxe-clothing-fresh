export default function HeroVideo() {
  return (
    <video
      src="/hero-editorial.mp4"
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
