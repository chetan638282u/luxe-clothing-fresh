import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export function CollectionSurfer({ items = [], variant = "magnetic", onSelect, title = "COLLECTION", subtitle = "", pageScroll = false }) {
    // If we are doing a page scroll, we don't need to duplicate items for an infinite loop.
    const displayItems = pageScroll ? items : [...items, ...items];
    
    // Internal scrolling vars
    const scrollPerItem = 600;
    const loopDistance = items.length * scrollPerItem;

    const scrollRef = useRef(null);
    
    // Use target: scrollRef for pageScroll, or container: scrollRef for modal/internal scroll
    const { scrollY, scrollYProgress } = useScroll(
        pageScroll 
            ? { target: scrollRef, offset: ["start start", "end end"] } 
            : { container: scrollRef }
    );

    const smoothScroll = useSpring(scrollY, { mass: 0.1, stiffness: 100, damping: 20 });
    const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });

    const stepX = 240;
    const stepY = -84;
    const stepZ = -288;

    // --- Page Scroll transforms ---
    // If pageScroll, we want scrollYProgress 0->1 to move the track enough so all items go past the camera.
    // To have the last item go off screen, we move it slightly further than items.length.
    const totalDistX = -(items.length + 1) * stepX;
    const totalDistY = -(items.length + 1) * stepY;
    const totalDistZ = -(items.length + 1) * stepZ;

    const pageX = useTransform(smoothProgress, [0, 1], [0, totalDistX]);
    const pageY = useTransform(smoothProgress, [0, 1], [0, totalDistY]);
    const pageZ = useTransform(smoothProgress, [0, 1], [0, totalDistZ]);

    // --- Internal Scroll transforms ---
    const loopedProgress = useTransform(smoothScroll, (value) => value % loopDistance);
    const loopX = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepX]);
    const loopY = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepY]);
    const loopZ = useTransform(loopedProgress, [0, loopDistance], [0, -items.length * stepZ]);

    // Choose transform based on mode
    const x = pageScroll ? pageX : loopX;
    const y = pageScroll ? pageY : loopY;
    const z = pageScroll ? pageZ : loopZ;

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
        <div 
            ref={scrollRef} 
            className={pageScroll ? "relative w-full bg-deep text-ivory" : "relative w-full h-full overflow-y-auto overscroll-contain bg-deep text-ivory"}
            style={{ height: pageScroll ? `calc(100vh + ${items.length * 800}px)` : '100%' }}
        >
            {!pageScroll && <div style={{ height: "50000px" }} className="w-full" />}

            <div
                className={`w-full overflow-hidden flex items-center justify-center perspective-container ${pageScroll ? 'sticky top-0 h-screen left-0' : 'sticky top-0 left-0 h-full'}`}
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
                        {displayItems.map((item, i) => (
                            <Card
                                key={`${item.id || item.name}-${i}`}
                                item={item}
                                i={i}
                                totalItems={items.length}
                                stepX={stepX}
                                stepY={stepY}
                                stepZ={stepZ}
                                mouseX={mouseX}
                                mouseY={mouseY}
                                scrollSpring={pageScroll ? smoothProgress : smoothScroll} // Use progress for distance in pageScroll to keep hover effect working correctly... wait, distance from mouse relies on scrollSpring being raw pixels! Let's pass null for pageScroll and disable distance tracking, or pass window.scrollY.
                                variant={variant}
                                pageScroll={pageScroll}
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
    pageScroll,
    onSelect
}) {
    const ref = useRef(null);

    // If pageScroll is true, we disable the mouse proximity effect to keep performance high and avoid complex coordinate mapping
    const distance = useTransform([mouseX, mouseY], ([x, y]) => {
        if (!ref.current || variant === "simple" || pageScroll) return 200;
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

            if (variant === "magnetic" && !pageScroll) {
                scaleValue = Number(s);
            } else if (variant === "uplift" && !pageScroll) {
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
                {item.category && <p className="text-ivory/60 text-[10px] tracking-widest uppercase mb-1">{item.category}</p>}
                <h3 className="font-heading text-lg text-ivory mb-1 leading-tight">{item.name}</h3>
                {item.price && <p className="text-gold text-sm tracking-wide mb-4">{item.price}</p>}
                
                <div className="w-full py-2.5 glass border border-white/10 flex items-center justify-center pointer-events-auto transition-colors hover:bg-white/10">
                    <span className="text-xs tracking-[0.2em] uppercase text-ivory/90 font-medium">Explore</span>
                </div>
            </div>
        </motion.div>
    );
}
