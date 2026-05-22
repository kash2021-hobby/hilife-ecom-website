import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 150;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/images/hero2-demo/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

export default function ScrollFrameHeroV2() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const headline1Ref = useRef(null);
  const headline2Ref = useRef(null);
  const dividerRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonRef = useRef(null);
  const imagesRef = useRef([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentIndex = 0;
    let imagesLoaded = 0;
    let animationId = null;

    function drawFrame(index) {
      const img = imagesRef.current[index];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;

      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentIndex);
    }

    function preloadAll() {
      imagesRef.current = [];
      FRAMES.forEach((src, i) => {
        const img = new Image();
        img.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === 1) {
            resizeCanvas();
          }
          if (imagesLoaded === FRAME_COUNT) {
            setLoaded(true);
          }
        };
        img.onerror = () => {
          imagesLoaded++;
          if (imagesLoaded === FRAME_COUNT) {
            setLoaded(true);
          }
        };
        img.src = src;
        imagesRef.current[i] = img;
      });
    }

    preloadAll();

    window.addEventListener("resize", resizeCanvas);

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const scrollDistance = isMobile ? "+=250vh" : "+=300vh";

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300vh",
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
        defaults: { duration: 1, ease: "power2.out" },
      });

      tl.to({}, { duration: 0.55 });
      tl.fromTo(headline1Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.55);
      tl.fromTo(headline2Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.62);
      tl.fromTo(dividerRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, transformOrigin: "center" }, 0.72);
      tl.fromTo(subtextRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.78);
      tl.fromTo(buttonRef.current, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1 }, 0.85);

      return () => { tl.kill(); };
    });

    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250vh",
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
        defaults: { duration: 1, ease: "power2.out" },
      });

      tl.to({}, { duration: 0.55 });
      tl.fromTo(headline1Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.55);
      tl.fromTo(headline2Ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.62);
      tl.fromTo(dividerRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, transformOrigin: "center" }, 0.72);
      tl.fromTo(subtextRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.78);
      tl.fromTo(buttonRef.current, { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1 }, 0.85);

      return () => { tl.kill(); };
    });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: scrollDistance,
      scrub: 1,
      onUpdate: function (self) {
        const rawIndex = self.progress * (FRAME_COUNT - 1);
        const index = Math.round(rawIndex);
        if (index !== currentIndex && index >= 0 && index < FRAME_COUNT) {
          currentIndex = index;
          if (animationId) cancelAnimationFrame(animationId);
          animationId = requestAnimationFrame(() => drawFrame(index));
        }
      },
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      st.kill();
      mm.revert();
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="scrollframe-v2-section"
      style={{
        backgroundColor: "#FAF7F0",
        position: "relative",
        overflow: "hidden",
        padding: 0,
        margin: 0,
        width: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          opacity: loaded ? 1 : 0.7,
          transition: "opacity 0.5s ease",
        }}
      />

      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          pointerEvents: "none",
          maxWidth: "700px",
          width: "90vw",
          textAlign: "center",
        }}
      >
        <h2
          ref={headline1Ref}
          className="v2-headline"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            textShadow: "0 2px 12px rgba(0,0,0,0.25)",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          Wellness Crafted
        </h2>
        <h2
          ref={headline2Ref}
          className="v2-headline"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#1E5128",
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            textShadow: "0 2px 12px rgba(0,0,0,0.25)",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          By Nature
        </h2>
        <div
          ref={dividerRef}
          style={{
            width: "60px",
            height: "2px",
            backgroundColor: "#C9A227",
            margin: "24px auto",
            transformOrigin: "center",
          }}
        />
        <p
          ref={subtextRef}
          className="v2-subtext"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "#FFFFFF",
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
            lineHeight: 1.6,
            maxWidth: "560px",
            margin: "0 auto",
            textShadow: "0 1px 8px rgba(0,0,0,0.2)",
          }}
        >
          Botanical wellness teas designed to nourish the body, ease the
          mind, and elevate daily rituals.
        </p>
        <a
          ref={buttonRef}
          href="#"
          className="v2-button"
          style={{
            display: "inline-block",
            backgroundColor: "#1E5128",
            color: "#FAF7F0",
            padding: "14px 36px",
            borderRadius: "999px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "0.02em",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease, background 0.3s ease",
            marginTop: "28px",
            textDecoration: "none",
            pointerEvents: "auto",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.backgroundColor = "#16401F";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.backgroundColor = "#1E5128";
          }}
        >
          Shop Now
        </a>
      </div>

      <style>{`
        .scrollframe-v2-section .v2-headline {
          font-size: clamp(2.5rem, 6vw, 5rem);
        }
        @media (max-width: 767px) {
          .scrollframe-v2-section .v2-headline {
            font-size: clamp(1.8rem, 7vw, 3rem) !important;
          }
          .scrollframe-v2-section .v2-subtext {
            font-size: clamp(0.9rem, 3vw, 1rem) !important;
          }
          .scrollframe-v2-section .v2-button {
            padding: 12px 28px !important;
          }
        }
      `}</style>
    </div>
  );
}
