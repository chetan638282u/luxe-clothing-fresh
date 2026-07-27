import { useRef, useState, useEffect } from 'react'

const TOTAL_FRAMES = 192
const FRAME_SAMPLES = 80

const sampleIndices = Array.from({ length: FRAME_SAMPLES }, (_, i) =>
  Math.round(i * (TOTAL_FRAMES - 1) / (FRAME_SAMPLES - 1))
)

export default function useVideoScrub() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)
  const allImagesRef = useRef([])
  const ctxRef = useRef(null)
  const lastFrameRef = useRef(-1)
  const progressRef = useRef(0)

  const [isComplete, setIsComplete] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const isCompleteRef = useRef(false)

  useEffect(() => {
    const images = []
    let loaded = 0
    let errored = 0

    const checkReady = () => {
      if (loaded + errored === TOTAL_FRAMES) {
        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
          ctxRef.current = canvas.getContext('2d')
        }
        const img = allImagesRef.current[sampleIndices[0]]
        const ctx = ctxRef.current
        if (canvas && ctx && img) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = 0.7
          drawCover(ctx, img, canvas.width, canvas.height)
          lastFrameRef.current = sampleIndices[0]
        }
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





  return { sectionRef, canvasRef, isComplete, isReady }
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
