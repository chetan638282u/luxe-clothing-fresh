import { useRef, useState, useEffect } from 'react'

const TOTAL_FRAMES = 192

export default function useVideoLoop(fps = 30) {
  const canvasRef = useRef(null)
  const allImagesRef = useRef([])
  const ctxRef = useRef(null)
  const currentFrameRef = useRef(1)
  const [isReady, setIsReady] = useState(false)
  const animationFrameRef = useRef(null)
  const lastDrawTimeRef = useRef(0)

  useEffect(() => {
    const images = []
    let loaded = 0
    let errored = 0

    const checkReady = () => {
      if (loaded + errored === TOTAL_FRAMES) {
        setIsReady(true)
      }
    }

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.onload = () => { loaded++; checkReady() }
      img.onerror = () => { errored++; checkReady() }
      img.src = `/hero/frames/frame-${String(i).padStart(3, '0')}.jpg`
      images.push(img)
    }

    allImagesRef.current = images
  }, [])

  useEffect(() => {
    if (!isReady) return

    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctxRef.current = canvas.getContext('2d')
    }

    const drawFrame = (timestamp) => {
      const msPerFrame = 1000 / fps
      const elapsed = timestamp - lastDrawTimeRef.current

      if (elapsed > msPerFrame) {
        lastDrawTimeRef.current = timestamp - (elapsed % msPerFrame)
        
        const img = allImagesRef.current[currentFrameRef.current - 1]
        const ctx = ctxRef.current
        
        if (canvas && ctx && img) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = 1.0
          drawCover(ctx, img, canvas.width, canvas.height)
        }
        
        currentFrameRef.current = (currentFrameRef.current % TOTAL_FRAMES) + 1
      }

      animationFrameRef.current = requestAnimationFrame(drawFrame)
    }

    animationFrameRef.current = requestAnimationFrame(drawFrame)

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [isReady, fps])

  return { canvasRef, isReady }
}

function drawCover(ctx, img, cw, ch) {
  const imgAspect = img.naturalWidth / img.naturalHeight
  const canvasAspect = cw / ch

  let sx, sy, sw, sh

  if (imgAspect > canvasAspect) {
    sh = img.naturalHeight
    sw = sh * canvasAspect
    sx = (img.naturalWidth - sw) / 2
    sy = 0
  } else {
    sw = img.naturalWidth
    sh = sw / canvasAspect
    sx = 0
    sy = (img.naturalHeight - sh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
}
