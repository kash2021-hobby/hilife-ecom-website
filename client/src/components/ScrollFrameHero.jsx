import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 15;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/images/hero-folder/img-${String(i + 1).padStart(2, "0")}.webp`
);

export default function ScrollFrameHero() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentIndex = 0;
    let loaded = 0;

    function drawFrame(index) {
      const img = imagesRef.current[index];
      if (!img) return;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.drawImage(img, 0, 0);
    }

    function preloadAll() {
      imagesRef.current = [];
      FRAMES.forEach((src, i) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          if (loaded === 1) drawFrame(0);
        };
        img.src = src;
        imagesRef.current[i] = img;
      });
    }

    preloadAll();

    const ctxScroll = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=200vh",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const rawIndex = self.progress * (FRAME_COUNT - 1);
        const index = Math.round(rawIndex);
        if (index !== currentIndex && index >= 0 && index < FRAME_COUNT) {
          currentIndex = index;
          drawFrame(index);
        }
      },
    });

    return () => {
      ctxScroll.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        backgroundColor: "#FAF7F0",
        position: "relative",
        overflow: "hidden",
        padding: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100%",
          padding: 0,
          margin: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100vw",
            height: "auto",
            display: "block",
            objectFit: "cover",
          }}
        />
      </div>

      <style>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}
