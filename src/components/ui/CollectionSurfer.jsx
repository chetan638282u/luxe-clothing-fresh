import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export function CollectionSurfer({ items = [], variant = "magnetic", onSelect, title = "COLLECTION", subtitle = "" }) {
    const duplicatedItems = [...items, ...items];
    const scrollPerItem = 600;
    const loopDistance = items.length * scrollPerItem;

    const scrollRef = useRef(null);
    const { scrollY } = useScroll({ container: scrollRef });

    const smoothScroll = useSpring(scrollY, {
        mass: 0.1,
        stiffness: 100,
        damping: 20
    });

    const loopedProgress = useTransform(smoothScroll, (value) => value % loopDistance);

    const stepX = 240;
    const stepY = -84;
    const stepZ = -288;

    const x = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepX]);
    const y = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepY]);
    const z = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepZ]);

    const mouseX = useMotionValue(-10000);
    const mouseY = useMotionValue(-10000);

    const handleMouseMove = (e) => {
        if (variant === "simple") return;
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => {
        if (variant === "simple") return;
        mouseX.set(-10000);
        mouseY.set(-10000);
    };

    return (
        <div ref={scrollRef} className="relative w-full h-full overflow-y-auto overscroll-contain bg-deep text-ivory">
            <div style={{ height: "50000px" }} className="w-full" />

            <div
                className="sticky top-0 left-0 w-full h-full overflow-hidden flex items-center justify-center perspective-container"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="absolute top-[3vw] left-[3vw] z-50 pointer-events-none mix-blend-difference">
                    <h1 className="font-heading font-bold text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tighter ml-[4vw]">
                        {subtitle}
                    </h1>
                    <h1 className="font-heading font-bold text-[clamp(2rem,6vw,5rem)] leading-[0.9] tracking-tighter uppercase">
                        {title}
                        <span className="text-[0.4em] align-top relative top-[0.6em] ml-2 font-mono tabular-nums lowercase">
                            ({items.length})
                        </span>
                    </h1>
                </div>

                <div className="absolute bottom-[3vw] right-[3vw] z-50 font-mono text-xs tracking-wider uppercase opacity-70 pointer-events-none text-gold">
                    scroll to surf
                </div>

                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        perspective: "2000px",
                        perspectiveOrigin: "10% 10%",
                    }}
                >
                    <motion.div
                        className="relative w-0 h-0"
                        style={{
                            x,
                            y,
                            z,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {duplicatedItems.map((item, i) => (
                            <Card
                                key={`${item.id}-${i}`}
                                item={item}
                                i={i}
                                totalItems={items.length}
                                stepX={stepX}
                                stepY={stepY}
                                stepZ={stepZ}
                                mouseX={mouseX}
                                mouseY={mouseY}
                                scrollSpring={smoothScroll}
                                variant={variant}
                                onSelect={() => onSelect && onSelect(item)}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function Card({
    item,
    i,
    totalItems,
    stepX,
    stepY,
    stepZ,
    mouseX,
    mouseY,
    scrollSpring,
    variant,
    onSelect
}) {
    const ref = useRef(null);

    const distance = useTransform([mouseX, mouseY, scrollSpring], ([x, y]) => {
        if (!ref.current || variant === "simple") return 200;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        return dist;
    });

    const targetScale = useTransform(distance, [0, 400], [1.5, 1]);
    const springScale = useSpring(targetScale, {
        mass: 0.5,
        stiffness: 300,
        damping: 20
    });

    const targetUplift = useTransform(distance, [0, 400], [-100, 0]);
    const springUplift = useSpring(targetUplift, {
        mass: 0.5,
        stiffness: 300,
        damping: 20
    });

    const transform = useTransform(
        [springScale, springUplift],
        ([s, u]) => {
            let scaleValue = 1;
            let upliftValue = 0;

            if (variant === "magnetic") {
                scaleValue = Number(s);
            } else if (variant === "uplift") {
                upliftValue = Number(u);
            }

            const baseX = i * stepX;
            const baseY = i * stepY;
            const baseZ = i * stepZ;

            return `translate3d(${baseX}px, ${baseY + upliftValue}px, ${baseZ}px) rotateY(-50deg) scale(${scaleValue})`;
        }
    );

    return (
        <motion.div
            ref={ref}
            onClick={onSelect}
            className="absolute w-[clamp(220px,70vw,300px)] h-[clamp(300px,90vw,400px)] bg-charcoal overflow-hidden shadow-2xl transition-colors duration-500 ease-out group cursor-pointer"
            style={{
                transform,
                transformStyle: "preserve-3d",
            }}
        >
            <div className="absolute -top-6 -left-4 text-ivory font-mono text-xs opacity-50 transition-opacity group-hover:opacity-100 z-20">
                {String((i % totalItems) + 1).padStart(2, '0')}
            </div>

            <div className="relative w-full h-full brightness-75 group-hover:brightness-100 transition-all duration-300">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-ivory/60 text-[10px] tracking-widest uppercase mb-1">{item.category || "Apparel"}</p>
                <h3 className="font-heading text-lg text-ivory mb-1 leading-tight">{item.name}</h3>
                <p className="text-gold text-sm tracking-wide mb-4">{item.price}</p>
                
                <div className="w-full py-2.5 glass border border-white/10 flex items-center justify-center pointer-events-auto transition-colors hover:bg-white/10">
                    <span className="text-xs tracking-[0.2em] uppercase text-ivory/90 font-medium">Shop Now</span>
                </div>
            </div>
        </motion.div>
    );
}
