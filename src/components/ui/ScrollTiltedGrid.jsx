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
  const side = index % 2 === 0 ? -1 : 1;

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile || reduceMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = tile.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const position = clamp((window.innerHeight - rect.top) / travel);
      const distance = Math.abs(position - 0.5) * 2;
      const signed = (position - 0.5) * 2;
      const eased = distance * distance * (3 - 2 * distance);
      const x = side * eased * 18;
      const y = -signed * eased * 24;
      const tilt = -signed * maxTilt;
      const roll = side * signed * 3;
      const skew = -side * signed * 7;

      tile.style.setProperty("--tile-blur", `${eased * maxBlur}px`);
      tile.style.setProperty("--tile-brightness", String(1 - eased * 0.5));
      tile.style.setProperty("--tile-saturation", String(1 - eased * 0.5));
      tile.style.setProperty("--tile-image-scale", String(1.03 + eased * 0.15));
      tile.style.setProperty(
        "--tile-transform",
        `translate3d(${x}%, ${y}%, ${eased * 180}px) rotateX(${tilt}deg) rotateZ(${roll}deg) skewX(${skew}deg)`
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(tile);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [maxBlur, maxTilt, reduceMotion, side]);

  const variables = {
    aspectRatio,
    borderRadius: rounded,
    perspective,
    "--tile-blur": "0px",
    "--tile-brightness": 1,
    "--tile-saturation": 1,
    "--tile-transform": "translate3d(0, 0, 0)",
    "--tile-image-scale": 1.03,
  };

  return (
    <figure
      ref={tileRef}
      className={cn("m-0 relative", side > 0 && "pt-12 sm:pt-24")}
      style={variables}
    >
      <div
        className={cn(
          "relative w-full h-full overflow-hidden transition-all duration-300",
          !reduceMotion &&
            "[filter:blur(var(--tile-blur))_brightness(var(--tile-brightness))_saturate(var(--tile-saturation))] [transform:var(--tile-transform)] [transform-style:preserve-3d]"
        )}
        style={{ aspectRatio, borderRadius: rounded }}
      >
        <div 
          className={cn(
            "h-full w-full",
            !reduceMotion && "[transform:scale(var(--tile-image-scale))]"
          )}
        >
          <ProductCard product={product} onSelect={() => onSelect(product)} />
        </div>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10" />
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
  onSelect
}) {
  const reduceMotion = useReducedMotion() ?? false;
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
      className={cn("relative w-full overflow-hidden", className)}
      aria-label="Scroll-reactive best sellers grid"
    >
      <div
        className="mx-auto grid w-full max-w-5xl grid-cols-2 items-start gap-x-4 gap-y-16 px-4 sm:gap-x-10 sm:gap-y-28 sm:px-10 lg:gap-x-16"
        style={{ paddingBlock: sectionPadding }}
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
