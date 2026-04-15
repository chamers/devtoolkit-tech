"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export type RotaryResourceItem = {
  id: string;
  title: string;
  href: string;
  category: string;
  tagline?: string;
  accent?: string;
};

type RotaryResourceCarouselProps = {
  items?: RotaryResourceItem[];
  autoRotateMs?: number;
  className?: string;
};

const DEFAULT_ITEMS: RotaryResourceItem[] = [
  {
    id: "1",
    title: "Frontend Mentor",
    href: "/resources/frontend-mentor",
    category: "frontend",
    tagline: "Improve your frontend skills with real projects.",
    accent: "from-sky-200/80 to-sky-100",
  },
  {
    id: "2",
    title: "UI Patterns",
    href: "/resources/ui-patterns",
    category: "design",
    tagline: "Browse tried-and-tested interface design patterns.",
    accent: "from-amber-200/80 to-amber-100",
  },
  {
    id: "3",
    title: "Bootstrap",
    href: "/resources/bootstrap",
    category: "frontend",
    tagline: "Build responsive sites faster with ready-made components.",
    accent: "from-violet-200/80 to-violet-100",
  },
  {
    id: "4",
    title: "Awwwards",
    href: "/resources/awwwards",
    category: "inspiration",
    tagline: "Discover award-winning websites and creative inspiration.",
    accent: "from-rose-200/80 to-rose-100",
  },
  {
    id: "5",
    title: "CSS Font Stack",
    href: "/resources/css-font-stack",
    category: "typography",
    tagline: "Find practical font stacks for reliable web typography.",
    accent: "from-emerald-200/80 to-emerald-100",
  },
  {
    id: "6",
    title: "Flaticon",
    href: "/resources/flaticon",
    category: "assets",
    tagline: "Access icons and visual assets for interfaces and products.",
    accent: "from-orange-200/80 to-orange-100",
  },
];

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

function wrapIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function getRelativeOffset(index: number, activeIndex: number, total: number) {
  const raw = index - activeIndex;
  const half = Math.floor(total / 2);

  if (raw > half) return raw - total;
  if (raw < -half) return raw + total;
  return raw;
}

export default function RotaryResourceCarousel({
  items = DEFAULT_ITEMS,
  autoRotateMs = 2400,
  className,
}: RotaryResourceCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const dragStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (reducedMotion || isPaused || items.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => wrapIndex(current + 1, items.length));
    }, autoRotateMs);

    return () => window.clearInterval(id);
  }, [autoRotateMs, isPaused, items.length, reducedMotion]);

  return (
    <section
      className={cn("relative isolate w-full overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(event) => {
        setIsPaused(true);
        dragStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const startX = dragStartX.current;
        const endX = event.changedTouches[0]?.clientX ?? null;

        if (startX !== null && endX !== null) {
          const delta = endX - startX;

          if (Math.abs(delta) > 30) {
            setActiveIndex((current) =>
              wrapIndex(current + (delta < 0 ? 1 : -1), items.length),
            );
          }
        }

        dragStartX.current = null;
        setIsPaused(false);
      }}
      aria-label="Featured resources"
    >
      <div className="absolute inset-x-0 top-10 mx-auto h-28 w-28 rounded-full border border-stone-400/40 bg-stone-200/50 blur-2xl dark:bg-stone-700/20" />

      <div className="relative mx-auto flex h-[500px] w-full max-w-[760px] items-center justify-center [perspective:1800px] sm:h-[560px]">
        <div className="absolute bottom-14 h-6 w-[72%] rounded-full bg-black/10 blur-2xl dark:bg-black/30" />

        <div className="absolute bottom-24 h-5 w-[70%] rounded-full border border-stone-300/70 bg-stone-200/70 shadow-inner dark:border-stone-700 dark:bg-stone-900/80" />

        <div className="absolute bottom-28 h-[210px] w-3 rounded-full bg-gradient-to-b from-stone-300 via-stone-500 to-stone-700 shadow-[0_0_18px_rgba(0,0,0,0.2)] dark:from-stone-500 dark:via-stone-300 dark:to-stone-700" />

        <div className="absolute bottom-[292px] z-20 h-14 w-14 rounded-full border border-stone-400 bg-gradient-to-br from-stone-200 to-stone-400 shadow-lg dark:border-stone-600 dark:from-stone-700 dark:to-stone-900" />

        {items.map((item, index) => {
          const offset = getRelativeOffset(index, activeIndex, items.length);
          const absOffset = Math.abs(offset);
          const isActive = offset === 0;

          const rotateY = offset * 26;
          const translateX = offset * 84;
          const translateZ = isActive
            ? 130
            : Math.max(24, 110 - absOffset * 40);
          const translateY = absOffset * 10;
          const scale = isActive ? 1 : Math.max(0.82, 1 - absOffset * 0.08);
          const opacity = isActive
            ? 1
            : Math.max(0.24, 0.86 - absOffset * 0.18);
          const zIndex = 100 - absOffset;

          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              animate={{
                rotateY,
                x: translateX,
                z: translateZ,
                y: translateY,
                scale,
                opacity,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                zIndex,
                transformStyle: "preserve-3d",
              }}
              aria-pressed={isActive}
              aria-label={`Show ${item.title}`}
            >
              <article
                className={cn(
                  "group relative h-[300px] w-[220px] rounded-[1.65rem] border border-stone-300 bg-gradient-to-b from-stone-50 to-stone-100 p-0 shadow-[0_22px_60px_rgba(20,16,10,0.22)] transition-all dark:border-stone-700 dark:from-stone-900 dark:to-stone-950 sm:h-[340px] sm:w-[250px]",
                  isActive ? "shadow-[0_28px_75px_rgba(20,16,10,0.3)]" : "",
                )}
              >
                <div className="absolute inset-x-6 top-0 h-7 rounded-b-2xl border-x border-b border-stone-300 bg-stone-100/95 dark:border-stone-700 dark:bg-stone-900/95" />

                <div className="absolute left-1/2 top-[13px] h-3 w-3 -translate-x-1/2 rounded-full border border-stone-500 bg-stone-300 shadow-inner dark:border-stone-500 dark:bg-stone-700" />

                <div className="flex h-full flex-col rounded-[1.65rem] p-5 pt-10 sm:p-6 sm:pt-11">
                  <div
                    className={cn(
                      "mb-5 rounded-2xl border border-stone-300/80 bg-gradient-to-r px-4 py-3 dark:border-stone-700/80",
                      item.accent ?? "from-stone-200 to-stone-100",
                    )}
                  >
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-stone-700 dark:text-stone-900">
                      {item.category}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="line-clamp-2 font-serif text-xl leading-tight text-stone-900 dark:text-stone-100 sm:text-[1.45rem]">
                      {item.title}
                    </h3>

                    <div className="h-px w-full bg-stone-300 dark:bg-stone-700" />

                    <p className="line-clamp-4 text-sm leading-6 text-stone-700 dark:text-stone-300 sm:text-[0.95rem]">
                      {item.tagline ?? "Explore this resource on DevToolkit."}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className="
    mt-auto flex items-center justify-between pt-6 text-sm
    text-stone-700 dark:text-stone-300
    hover:text-black dark:hover:text-white
    transition-colors
  "
                  >
                    <span className="font-medium tracking-wide">View card</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
