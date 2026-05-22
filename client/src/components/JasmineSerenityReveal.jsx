import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/images/jasmine-serenity/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

function MoonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A7A8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function WaveIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A7A8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2-2 4-4 6-2s4 4 6 2 4-4 6-2 4 4 6 2" />
      <path d="M2 17c2-2 4-4 6-2s4 4 6 2 4-4 6-2 4 4 6 2" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A7A8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a4 4 0 0 1 4 4c0 2-1 3-2 4l-2 3-2-3c-1-1-2-2-2-4a4 4 0 0 1 4-4z" />
      <path d="M12 2v2" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </svg>
  );
}
function DownArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A7A8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <polyline points="19 14 12 21 5 14" />
      <line x1="3" y1="3" x2="21" y2="3" strokeWidth="1" />
    </svg>
  );
}
function LotusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A7A8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c-2 3-5 5-5 8 0 3 2 6 5 8 3-2 5-5 5-8 0-3-3-5-5-8z" />
      <path d="M12 10v10" />
      <path d="M8 20h8" />
    </svg>
  );
}
function FeatherIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5A7A8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function BenefitCard({ icon, title, desc }) {
  return (
    <div
      className="js-benefit-card"
      style={{
        width: 240,
        minHeight: 150,
        padding: "20px 22px",
        backgroundColor: "rgba(250,247,240,0.88)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(90,122,140,0.25)",
        borderRadius: 2,
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        textAlign: "left",
      }}
    >
      <div style={{ marginBottom: 14 }}>{icon}</div>
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 500,
          color: "#1F1F1F",
          lineHeight: 1.3,
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12.5,
          lineHeight: 1.55,
          color: "#4A4A4A",
          marginTop: 8,
          width: "100%",
        }}
      >
        {desc}
      </p>
    </div>
  );
}

export default function JasmineSerenityReveal() {
  const sectionRef = useRef(null);
  const pinnedRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const ctaRef = useRef(null);
  const [ready, setReady] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentIndex = 0;
    let loaded = 0;
    let rafId = null;

    function drawFrame(index) {
      const img = imagesRef.current[index];
      if (!img || !img.complete) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(w / iw, h / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (w - sw) / 2;
      const sy = (h - sh) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, sx, sy, sw, sh);
    }

    function preloadAll() {
      imagesRef.current = [];
      FRAMES.forEach((src, i) => {
        const img = new Image();
        img.onload = () => {
          loaded++;
          if (loaded === 1) {
            drawFrame(0);
          }
          if (loaded === FRAME_COUNT) {
            setReady(true);
          }
        };
        img.onerror = () => {
          loaded++;
          if (loaded === FRAME_COUNT) setReady(true);
        };
        img.src = src;
        imagesRef.current[i] = img;
      });
    }

    function handleResize() {
      const img = imagesRef.current[currentIndex];
      if (img && img.complete) drawFrame(currentIndex);
    }

    preloadAll();
    window.addEventListener("resize", handleResize);

    const mm = gsap.matchMedia();

    /* --- DESKTOP (>= 768px) — text animations only (no pin) --- */
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        defaults: { ease: "power2.out", duration: 1 },
      });

      tl.to(".js-card-1", { opacity: 1, y: 0 }, 0.06);
      tl.to(".js-card-2", { opacity: 1, y: 0 }, 0.14);
      tl.to(".js-card-3", { opacity: 1, y: 0 }, 0.22);
      tl.to(".js-card-4", { opacity: 1, y: 0 }, 0.30);
      tl.to(".js-card-5", { opacity: 1, y: 0 }, 0.38);
      tl.to(".js-card-6", { opacity: 1, y: 0 }, 0.46);
      tl.to(ctaRef.current, { opacity: 1, y: 0 }, 0.90);

      return () => { tl.kill(); };
    });

    /* --- MOBILE (< 768px) — text animations only (no pin) --- */
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        defaults: { ease: "power2.out", duration: 1 },
      });

      tl.to(".js-mob-1", { opacity: 1, y: 0 }, 0.05);
      tl.to(".js-mob-1", { opacity: 0, y: -16 }, 0.18);
      tl.to(".js-mob-2", { opacity: 1, y: 0 }, 0.22);
      tl.to(".js-mob-2", { opacity: 0, y: -16 }, 0.35);
      tl.to(".js-mob-3", { opacity: 1, y: 0 }, 0.39);
      tl.to(".js-mob-3", { opacity: 0, y: -16 }, 0.52);
      tl.to(".js-mob-4", { opacity: 1, y: 0 }, 0.56);
      tl.to(".js-mob-4", { opacity: 0, y: -16 }, 0.69);
      tl.to(".js-mob-5", { opacity: 1, y: 0 }, 0.73);
      tl.to(".js-mob-5", { opacity: 0, y: -16 }, 0.83);
      tl.to(".js-mob-6", { opacity: 1, y: 0 }, 0.83);
      tl.to(ctaRef.current, { opacity: 1, y: 0 }, 0.92);

      return () => { tl.kill(); };
    });

    /* Unified ScrollTrigger — pins inner div + drives frame rendering */
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: pinnedRef.current,
      start: "top top",
      end: "bottom bottom",
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scrub: 1,
      onUpdate: function (self) {
        const rawIndex = self.progress * (FRAME_COUNT - 1);
        const index = Math.floor(rawIndex);
        if (index !== currentIndex && index >= 0 && index < FRAME_COUNT) {
          currentIndex = index;
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => drawFrame(index));
        }
      },
    });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const benefit = (icon, title, desc, cls) => (
    <div className={cls} style={{ opacity: 0, transform: "translateY(20px)" }}>
      <BenefitCard icon={icon} title={title} desc={desc} />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: isMobile ? "280vh" : "350vh",
        margin: 0,
        padding: 0,
        display: "block",
        backgroundColor: "#FAF7F0",
      }}
    >
      <div
        ref={pinnedRef}
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Loading overlay */}
        {!ready && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#FAF7F0",
              zIndex: 1,
            }}
          />
        )}

        {/* Canvas — full viewport, edge to edge */}
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            opacity: ready ? 1 : 0.5,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* ===== DESKTOP OVERLAY (>= 768px) ===== */}
        <div
          className="js-desktop"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "absolute", left: "3.5%", top: "12%", width: 240 }}>{benefit(<MoonIcon />, "Deeper Sleep", "Jasmine's natural compounds promote restful, restorative sleep cycles.", "js-card-1")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "12%", width: 240 }}>{benefit(<DownArrowIcon />, "Lowers Cortisol", "Helps regulate the body's primary stress hormone naturally.", "js-card-2")}</div>
          <div style={{ position: "absolute", left: "3.5%", top: "40%", width: 240 }}>{benefit(<WaveIcon />, "Calms Anxiety", "Soothes a racing mind and gently dissolves daily stress.", "js-card-3")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "40%", width: 240 }}>{benefit(<LotusIcon />, "Mindful Ritual", "Transforms a simple cup into a moment of intentional pause.", "js-card-4")}</div>
          <div style={{ position: "absolute", left: "3.5%", top: "68%", width: 240 }}>{benefit(<BrainIcon />, "Mental Clarity", "L-theanine sharpens focus while keeping nerves perfectly calm.", "js-card-5")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "68%", width: 240 }}>{benefit(<FeatherIcon />, "Eases Tension", "Aromatic florals release shoulder, jaw, and full-body tension.", "js-card-6")}</div>
        </div>

        {/* ===== MOBILE OVERLAY (< 768px) ===== */}
        <div
          className="js-mobile"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            display: "none",
          }}
        >
          <div className="js-mob-1 mob-card">
            <BenefitCard icon={<MoonIcon />} title="Deeper Sleep" desc="Promotes restful, restorative sleep cycles." align="center" />
          </div>
          <div className="js-mob-2 mob-card">
            <BenefitCard icon={<DownArrowIcon />} title="Lowers Cortisol" desc="Regulates the body's primary stress hormone." align="center" />
          </div>
          <div className="js-mob-3 mob-card">
            <BenefitCard icon={<WaveIcon />} title="Calms Anxiety" desc="Soothes a racing mind and dissolves stress." align="center" />
          </div>
          <div className="js-mob-4 mob-card">
            <BenefitCard icon={<LotusIcon />} title="Mindful Ritual" desc="A moment of intentional pause in your day." align="center" />
          </div>
          <div className="js-mob-5 mob-card">
            <BenefitCard icon={<BrainIcon />} title="Mental Clarity" desc="Sharpens focus keeps nerves calm." align="center" />
          </div>
          <div className="js-mob-6 mob-card">
            <BenefitCard icon={<FeatherIcon />} title="Eases Tension" desc="Releases full-body tension naturally." align="center" />
          </div>
        </div>

        {/* ===== CTA BUTTON ===== */}
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <a
            ref={ctaRef}
            href="/products/jasmine-serenity"
            style={{
              pointerEvents: "auto",
              display: "inline-block",
              padding: "18px 44px",
              backgroundColor: "#5A7A8C",
              color: "#FAF7F0",
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              fontWeight: 500,
              borderRadius: 2,
              border: "none",
              cursor: "pointer",
              textDecoration: "none",
              opacity: 0,
              transform: "translateY(16px)",
              transition: "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#3F5C6E";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(90,122,140,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#5A7A8C";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            SHOP JASMINE SERENITY
          </a>
        </div>
      </div>

      <style>{`
        .mob-card {
          opacity: 0;
          position: absolute;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 88vw;
          max-width: 360px;
        }
        @media (max-width: 767px) {
          .js-desktop { display: none !important; }
          .js-mobile { display: block !important; }
        }
        @media (min-width: 768px) {
          .js-mobile { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .js-benefit-card {
            width: 200px !important;
            min-height: 140px !important;
          }
          .js-benefit-card p:first-of-type {
            font-size: 16px !important;
          }
          .js-benefit-card p:last-of-type {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
