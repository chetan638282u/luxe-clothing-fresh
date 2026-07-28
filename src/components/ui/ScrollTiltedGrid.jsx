import { cn } from "../../lib/utils";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "../sections/BestSellers";

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function GalleryTile({
  product,
  index,
  aspectRatio,
  perspective,
  maxTilt,
  maxBlur,
  rounded,
  reduceMotion,
  onSelect
}) {
  const tileRef = useRef(null);
  const hoverTarget = useRef(0);
  const hoverCurrent = useRef(0);
  const side = index % 2 === 0 ? -1 : 1;

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile || reduceMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      
      // Interpolate hover state (0 = normal, 1 = hovered)
      hoverCurrent.current += (hoverTarget.current - hoverCurrent.current) * 0.15;
      const hp = hoverCurrent.current;

      const rect = tile.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const position = clamp((window.innerHeight - rect.top) / travel);
      
      // Multiply by 2.5 to make transition to center faster and snappier
      const distance = clamp(Math.abs(position - 0.5) * 2.5);
      const signed = (position - 0.5) * 2.5;
      const eased = distance * distance * (3 - 2 * distance);
      
      // Base scroll targets
      const tX = side * eased * 18;
      const tY = -clamp(signed, -1, 1) * eased * 24;
      const tTilt = -clamp(signed, -1, 1) * maxTilt;
      const tRoll = side * clamp(signed, -1, 1) * 3;
      const tSkew = -side * clamp(signed, -1, 1) * 7;
      const tBlur = eased * maxBlur;

      // Blend scroll targets with flat hover targets (hp = 1 means flat)
      const finalX = tX * (1 - hp);
      const finalY = tY * (1 - hp);
      const finalTilt = tTilt * (1 - hp);
      const finalRoll = tRoll * (1 - hp);
      const finalSkew = tSkew * (1 - hp);
      const finalBlur = tBlur * (1 - hp);
      const finalScale = (1.03 + eased * 0.15) * (1 - hp) + 1.05 * hp;
      const finalZ = eased * 180 * (1 - hp);

      tile.style.setProperty("--tile-blur", `${finalBlur}px`);
      tile.style.setProperty("--tile-image-scale", String(finalScale));
      tile.style.setProperty(
        "--tile-transform",
        `translate3d(${finalX}%, ${finalY}%, ${finalZ}px) rotateX(${finalTilt}deg) rotateZ(${finalRoll}deg) skewX(${finalSkew}deg)`
      );

      // Keep loop running if hover interpolation is not finished
      if (Math.abs(hoverTarget.current - hoverCurrent.current) > 0.001) {
        schedule();
      }
    };
    
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(tile);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Bind custom hover events directly to avoid React state triggers
    const handleMouseEnter = () => { hoverTarget.current = 1; schedule(); };
    const handleMouseLeave = () => { hoverTarget.current = 0; schedule(); };
    tile.addEventListener('mouseenter', handleMouseEnter);
    tile.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      tile.removeEventListener('mouseenter', handleMouseEnter);
      tile.removeEventListener('mouseleave', handleMouseLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [maxBlur, maxTilt, reduceMotion, side]);

  const variables = {
    borderRadius: rounded,
    perspective,
    "--tile-blur": "0px",
    "--tile-transform": "translate3d(0, 0, 0)",
    "--tile-image-scale": 1.03,
  };

  return (
    <figure
      ref={tileRef}
      className={cn("m-0 relative", side > 0 && "max-lg:pt-0 lg:pt-24")}
      style={variables}
    >
      <div
        className={cn(
          "relative w-full h-full",
          !reduceMotion &&
            "[filter:blur(var(--tile-blur))] [transform:var(--tile-transform)] [transform-style:preserve-3d]"
        )}
        style={{ borderRadius: rounded }}
      >
        <div className="h-full w-full">
          <ProductCard product={product} onSelect={() => onSelect(product)} />
        </div>
      </div>
    </figure>
  );
}

export function ScrollTiltedGrid({
  products,
  loop = false,
  initialCycles = 2,
  maxCycles = 4,
  aspectRatio = "3 / 4",
  perspective = 1000,
  maxTilt = 30,
  maxBlur = 4,
  rounded = "0rem",
  sectionPadding = "10vh",
  className,
  onSelect,
}) {
  const reduceMotion = useReducedMotion();
  const cycleLimit = Math.max(1, maxCycles);
  const [cycleCount, setCycleCount] = useState(() =>
    clamp(initialCycles, 1, cycleLimit)
  );
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const marker = loadMoreRef.current;
    if (!loop || !marker) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setCycleCount((count) => Math.min(cycleLimit, count + 1));
        }
      },
      { rootMargin: "1200px 0px" }
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, [cycleLimit, loop]);

  const tiles = useMemo(
    () =>
      Array.from({ length: loop ? cycleCount : 1 }, (_, cycle) =>
        products.map((product, index) => ({ cycle, product, index }))
      ).flat(),
    [cycleCount, products, loop]
  );

  return (
    <section
      className={cn("relative w-full", className)}
      aria-label="Scroll-reactive best sellers grid"
    >
      <div
        className="mx-auto grid w-full max-w-5xl grid-cols-1 lg:grid-cols-2 items-start gap-x-4 gap-y-16 px-6 sm:gap-x-10 sm:gap-y-28 sm:px-10 lg:gap-x-16"
        style={{ paddingBlock: sectionPadding, perspective: perspective ? `${perspective}px` : "none" }}
      >
        {tiles.map(({ cycle, product, index }) => (
          <GalleryTile
            key={`${cycle}-${index}-${product.name}`}
            product={product}
            index={index}
            aspectRatio={aspectRatio}
            perspective={perspective}
            maxTilt={maxTilt}
            maxBlur={maxBlur}
            rounded={rounded}
            reduceMotion={reduceMotion}
            onSelect={onSelect}
          />
        ))}
      </div>
      {loop && cycleCount < cycleLimit ? (
        <div ref={loadMoreRef} className="h-px" aria-hidden="true" />
      ) : null}
    </section>
  );
}
