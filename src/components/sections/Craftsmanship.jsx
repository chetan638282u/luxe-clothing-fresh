import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const stories = [
  {
    imgFirst: true,
    image: '/photo-1558769132-cb1aea458c5e.avif',
    alt: 'Fabric weave close-up',
    heading: 'Generations of Mastery',
    paragraphs: [
      'Every garment begins with the finest raw materials, sourced from the most revered textile houses across the globe. Our master artisans, many with decades of experience, transform these materials into wearable art.',
      'From the initial cut to the final stitch, each piece passes through the hands of craftsmen who treat fabric with the reverence it deserves. This is not production — this is preservation of a dying art.',
    ],
  },
  {
    imgFirst: false,
    image: 'https://images.pexels.com/photos/15125919/pexels-photo-15125919.jpeg?w=800&q=80',
    alt: 'Stitching detail on fabric',
    heading: 'The Fabric of Legacy',
    paragraphs: [
      'Our atelier in the heart of Florence houses looms that have been in continuous operation since 1923. The rhythmic clatter of these machines is the heartbeat of our brand — a sound that speaks of tradition, patience, and unwavering commitment to excellence.',
      'We refuse to compromise on speed for quality. While the industry races toward faster production, we take the time necessary to honor the materials and the hands that work them.',
    ],
  },
]

export default function Craftsmanship() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.story-heading', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })

      gsap.from('.story-paragraph', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power3.out',
      })

      document.querySelectorAll('.parallax-img').forEach((img) => {
        gsap.to(img, {
          scrollTrigger: {
            trigger: img.closest('.story-block'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: 40,
          ease: 'none',
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="craftsmanship" ref={sectionRef} className="py-24 px-6 space-y-32">
      <div className="max-w-7xl mx-auto space-y-32">
        {stories.map((story, i) => (
          <div
            key={i}
            className="story-block grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {story.imgFirst ? (
              <>
                <ImageSide story={story} />
                <TextSide story={story} />
              </>
            ) : (
              <>
                <TextSide story={story} />
                <ImageSide story={story} />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function ImageSide({ story }) {
  return (
    <div className="overflow-hidden rounded-2xl">
      <img
        src={story.image}
        alt={story.alt}
        className="parallax-img w-full aspect-[4/5] object-cover"
        loading="lazy"
      />
    </div>
  )
}

function TextSide({ story }) {
  return (
    <div className="max-w-lg">
      <h3 className="story-heading font-heading text-2xl md:text-3xl text-ivory mb-6">
        {story.heading}
      </h3>
      {story.paragraphs.map((p, i) => (
        <p
          key={i}
          className={`story-paragraph font-sans text-ivory/70 leading-relaxed ${i > 0 ? 'mt-4' : ''}`}
        >
          {p}
        </p>
      ))}
    </div>
  )
}
