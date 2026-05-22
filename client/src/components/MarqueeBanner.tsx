import { useRef, useEffect, useState } from "react";
import { Leaf, Globe, HeartPulse, User } from "lucide-react";

const items = [
  { icon: Leaf, text: "NO ARTIFICIAL FLAVORS OR COLORS" },
  { icon: Globe, text: "SUSTAINABLY SOURCED" },
  { icon: HeartPulse, text: "GENTLE ON YOU, KIND TO NATURE" },
  { icon: User, text: "WELLNESS THAT FITS YOUR LIFE" },
  { icon: Leaf, text: "MADE FOR THOSE WHO CHOOSE BETTER" },
];

export default function MarqueeBanner() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animFrame: number;
    let startTime = performance.now();
    let accumulated = 0;
    const speed = 55; // pixels per second

    const animate = (now: number) => {
      if (isPaused) {
        startTime = now;
        animFrame = requestAnimationFrame(animate);
        return;
      }

      const halfWidth = track.scrollWidth / 2;
      const elapsed = (now - startTime) / 1000;
      accumulated += elapsed * speed;
      startTime = now;

      const offset = accumulated % halfWidth;
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;

      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isPaused]);

  return (
    <section className="w-full overflow-hidden bg-[#2C3320] border-y border-[#D9C9A3]/25 py-3 md:py-4 motion-reduce:hidden">
      <div
        ref={trackRef}
        className="flex"
        style={{ willChange: "transform" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...Array(2)].map((_, dupIdx) =>
          items.map((item, idx) => (
            <div
              key={`${dupIdx}-${idx}`}
              aria-hidden={dupIdx === 1 ? "true" : undefined}
              className="flex items-center shrink-0 pr-6 md:pr-10 border-r border-[#D9C9A3]/20"
            >
              <div className="flex items-center gap-3 md:gap-4 pl-6 md:pl-10">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/60 flex items-center justify-center shrink-0">
                  <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-white text-[11px] md:text-[13px] font-medium uppercase tracking-[2px] whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
