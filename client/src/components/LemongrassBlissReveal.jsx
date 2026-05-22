import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/images/lemongrass/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

function StomachIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B8E3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-3 0-6 2-6 6 0 3 .5 5 2 7s3 3 4 4c1-1 2.5-2 4-4s2-4 2-7c0-4-3-6-6-6z" />
      <path d="M10 8c0 2 .5 3 1 4" />
    </svg>
  );
}
function DropletLeafIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B8E3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <path d="M12 6v8" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B8E3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function PlusShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B8E3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
}
function FlatBellyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B8E3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M7 10c1.5-1 4-1.5 5-1.5s3.5.5 5 1.5" />
      <path d="M7 14c1.5 1 4 1.5 5 1.5s3.5-.5 5-1.5" />
    </svg>
  );
}
function LightningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B8E3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function BenefitCard({ icon, title, desc }) {
  return (
    <div
      className="lb-benefit-card"
      style={{
        width: 240,
        minHeight: 150,
        padding: "20px 22px",
        backgroundColor: "rgba(250,247,240,0.88)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(106,142,61,0.25)",
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

export default function LemongrassBlissReveal() {
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

      tl.to(".lb-card-1", { opacity: 1, y: 0 }, 0.06);
      tl.to(".lb-card-2", { opacity: 1, y: 0 }, 0.14);
      tl.to(".lb-card-3", { opacity: 1, y: 0 }, 0.22);
      tl.to(".lb-card-4", { opacity: 1, y: 0 }, 0.30);
      tl.to(".lb-card-5", { opacity: 1, y: 0 }, 0.38);
      tl.to(".lb-card-6", { opacity: 1, y: 0 }, 0.46);
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

      tl.to(".lb-mob-1", { opacity: 1, y: 0 }, 0.05);
      tl.to(".lb-mob-1", { opacity: 0, y: -16 }, 0.18);
      tl.to(".lb-mob-2", { opacity: 1, y: 0 }, 0.22);
      tl.to(".lb-mob-2", { opacity: 0, y: -16 }, 0.35);
      tl.to(".lb-mob-3", { opacity: 1, y: 0 }, 0.39);
      tl.to(".lb-mob-3", { opacity: 0, y: -16 }, 0.52);
      tl.to(".lb-mob-4", { opacity: 1, y: 0 }, 0.56);
      tl.to(".lb-mob-4", { opacity: 0, y: -16 }, 0.69);
      tl.to(".lb-mob-5", { opacity: 1, y: 0 }, 0.73);
      tl.to(".lb-mob-5", { opacity: 0, y: -16 }, 0.83);
      tl.to(".lb-mob-6", { opacity: 1, y: 0 }, 0.83);
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
          className="lb-desktop"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "absolute", left: "3.5%", top: "12%", width: 240 }}>{benefit(<StomachIcon />, "Aids Digestion", "Soothes the gut and supports healthy digestion after every meal — essential for clean bulking.", "lb-card-1")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "12%", width: 240 }}>{benefit(<PlusShieldIcon />, "Boosts Immunity", "Antimicrobial compounds strengthen defenses during heavy training blocks.", "lb-card-2")}</div>
          <div style={{ position: "absolute", left: "3.5%", top: "40%", width: 240 }}>{benefit(<DropletLeafIcon />, "Natural Detoxifier", "Diuretic properties help flush toxins after intense training sessions.", "lb-card-3")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "40%", width: 240 }}>{benefit(<FlatBellyIcon />, "Reduces Bloating", "Calms water retention for a leaner, sharper physique on stage day.", "lb-card-4")}</div>
          <div style={{ position: "absolute", left: "3.5%", top: "68%", width: 240 }}>{benefit(<ShieldIcon />, "Anti-Inflammatory", "Citral compounds ease muscle soreness and accelerate recovery.", "lb-card-5")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "68%", width: 240 }}>{benefit(<LightningIcon />, "Clean Energy Lift", "Light green tea caffeine for focused, jitter-free pre-workout mornings.", "lb-card-6")}</div>
        </div>

        {/* ===== MOBILE OVERLAY (< 768px) ===== */}
        <div
          className="lb-mobile"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            display: "none",
          }}
        >
          <div className="lb-mob-1 mob-card">
            <BenefitCard icon={<StomachIcon />} title="Aids Digestion" desc="Soothes the gut and supports healthy digestion." align="center" />
          </div>
          <div className="lb-mob-2 mob-card">
            <BenefitCard icon={<PlusShieldIcon />} title="Boosts Immunity" desc="Antimicrobial compounds strengthen defenses." align="center" />
          </div>
          <div className="lb-mob-3 mob-card">
            <BenefitCard icon={<DropletLeafIcon />} title="Natural Detoxifier" desc="Diuretic properties help flush toxins." align="center" />
          </div>
          <div className="lb-mob-4 mob-card">
            <BenefitCard icon={<FlatBellyIcon />} title="Reduces Bloating" desc="Calms water retention for a leaner physique." align="center" />
          </div>
          <div className="lb-mob-5 mob-card">
            <BenefitCard icon={<ShieldIcon />} title="Anti-Inflammatory" desc="Citral compounds ease muscle soreness." align="center" />
          </div>
          <div className="lb-mob-6 mob-card">
            <BenefitCard icon={<LightningIcon />} title="Clean Energy Lift" desc="Focused, jitter-free pre-workout mornings." align="center" />
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
            href="/products/lemongrass-bliss"
            style={{
              pointerEvents: "auto",
              display: "inline-block",
              padding: "18px 44px",
              backgroundColor: "#6B8E3D",
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
              e.currentTarget.style.background = "#557029";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(107,142,61,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6B8E3D";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            SHOP LEMONGRASS BLISS
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
          .lb-desktop { display: none !important; }
          .lb-mobile { display: block !important; }
        }
        @media (min-width: 768px) {
          .lb-mobile { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .lb-benefit-card {
            width: 200px !important;
            min-height: 140px !important;
          }
          .lb-benefit-card p:first-of-type {
            font-size: 16px !important;
          }
          .lb-benefit-card p:last-of-type {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
