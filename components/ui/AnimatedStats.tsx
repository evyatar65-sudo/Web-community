"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
}

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{display}{suffix}</div>;
}

export default function AnimatedStats({ stats }: { stats: Stat[] }) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-6 text-center">
          {stats.map((stat) => {
            const match = stat.value.match(/^(\d+)(.*)$/);
            const num = match ? parseInt(match[1]) : 0;
            const suffix = match ? match[2] : stat.value;
            return (
              <div key={stat.label}>
                <div className="font-rubik font-black text-4xl sm:text-5xl text-green-dark mb-1">
                  <AnimatedNumber target={num} suffix={suffix} />
                </div>
                <div className="text-sm sm:text-base text-gray-500">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
