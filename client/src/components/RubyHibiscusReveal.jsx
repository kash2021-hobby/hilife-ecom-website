import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/images/ruby-hibiscus/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`
);

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B12B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function FlameIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B12B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B12B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
      <circle cx="18" cy="18" r="3" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B12B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
function DropletIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B12B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
function LightningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B12B2B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function BenefitCard({ icon, title, desc }) {
  return (
    <div
      className="rh-benefit-card"
      style={{
        width: 240,
        minHeight: 150,
        padding: "20px 22px",
        backgroundColor: "rgba(250,247,240,0.88)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(201,169,97,0.25)",
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

export default function RubyHibiscusReveal() {
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

      tl.to(".rh-card-1", { opacity: 1, y: 0 }, 0.06);
      tl.to(".rh-card-2", { opacity: 1, y: 0 }, 0.14);
      tl.to(".rh-card-3", { opacity: 1, y: 0 }, 0.22);
      tl.to(".rh-card-4", { opacity: 1, y: 0 }, 0.30);
      tl.to(".rh-card-5", { opacity: 1, y: 0 }, 0.38);
      tl.to(".rh-card-6", { opacity: 1, y: 0 }, 0.46);
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

      tl.to(".rh-mob-1", { opacity: 1, y: 0 }, 0.05);
      tl.to(".rh-mob-1", { opacity: 0, y: -16 }, 0.18);
      tl.to(".rh-mob-2", { opacity: 1, y: 0 }, 0.22);
      tl.to(".rh-mob-2", { opacity: 0, y: -16 }, 0.35);
      tl.to(".rh-mob-3", { opacity: 1, y: 0 }, 0.39);
      tl.to(".rh-mob-3", { opacity: 0, y: -16 }, 0.52);
      tl.to(".rh-mob-4", { opacity: 1, y: 0 }, 0.56);
      tl.to(".rh-mob-4", { opacity: 0, y: -16 }, 0.69);
      tl.to(".rh-mob-5", { opacity: 1, y: 0 }, 0.73);
      tl.to(".rh-mob-5", { opacity: 0, y: -16 }, 0.83);
      tl.to(".rh-mob-6", { opacity: 1, y: 0 }, 0.83);
      tl.to(".rh-mob-6", { opacity: 0, y: -16 }, 0.90);
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
          className="rh-desktop"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "absolute", left: "3.5%", top: "12%", width: 240 }}>{benefit(<HeartIcon />, "Lowers Blood Pressure", "Naturally supports cardiovascular wellness for active lifestyles.", "rh-card-1")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "12%", width: 240 }}>{benefit(<FlameIcon />, "Boosts Metabolism", "Green tea catechins support fat oxidation and recovery.", "rh-card-2")}</div>
          <div style={{ position: "absolute", left: "3.5%", top: "40%", width: 240 }}>{benefit(<SparkleIcon />, "Glowing Skin", "Antioxidants fight free radicals from intense training.", "rh-card-3")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "40%", width: 240 }}>{benefit(<LeafIcon />, "Rich in Antioxidants", "Vitamin C and polyphenols defend cells from oxidative stress.", "rh-card-4")}</div>
          <div style={{ position: "absolute", left: "3.5%", top: "68%", width: 240 }}>{benefit(<DropletIcon />, "Balances Blood Sugar", "Helps stabilize energy levels through long workouts.", "rh-card-5")}</div>
          <div style={{ position: "absolute", right: "3.5%", top: "68%", width: 240 }}>{benefit(<LightningIcon />, "Calm Focused Energy", "Light caffeine + L-theanine — clean focus without jitters.", "rh-card-6")}</div>
        </div>

        {/* ===== MOBILE OVERLAY (< 768px) ===== */}
        <div
          className="rh-mobile"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            display: "none",
          }}
        >
          <div className="rh-mob-1 mob-card">
            <BenefitCard icon={<HeartIcon />} title="Lowers Blood Pressure" desc="Naturally supports cardiovascular wellness." align="center" />
          </div>
          <div className="rh-mob-2 mob-card">
            <BenefitCard icon={<FlameIcon />} title="Boosts Metabolism" desc="Green tea catechins support fat oxidation." align="center" />
          </div>
          <div className="rh-mob-3 mob-card">
            <BenefitCard icon={<SparkleIcon />} title="Glowing Skin" desc="Antioxidants fight free radicals from training." align="center" />
          </div>
          <div className="rh-mob-4 mob-card">
            <BenefitCard icon={<LeafIcon />} title="Rich in Antioxidants" desc="Vitamin C and polyphenols defend cells." align="center" />
          </div>
          <div className="rh-mob-5 mob-card">
            <BenefitCard icon={<DropletIcon />} title="Balances Blood Sugar" desc="Helps stabilize energy levels through workouts." align="center" />
          </div>
          <div className="rh-mob-6 mob-card">
            <BenefitCard icon={<LightningIcon />} title="Calm Focused Energy" desc="Clean focus without jitters." align="center" />
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
            href="/products/ruby-hibiscus"
            style={{
              pointerEvents: "auto",
              display: "inline-block",
              padding: "18px 44px",
              backgroundColor: "#B12B2B",
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
              e.currentTarget.style.background = "#8E1F1F";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(177,43,43,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#B12B2B";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            SHOP RUBY HIBISCUS
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
          .rh-desktop { display: none !important; }
          .rh-mobile { display: block !important; }
        }
        @media (min-width: 768px) {
          .rh-mobile { display: none !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .rh-benefit-card {
            width: 200px !important;
            min-height: 140px !important;
          }
          .rh-benefit-card p:first-of-type {
            font-size: 16px !important;
          }
          .rh-benefit-card p:last-of-type {
            font-size: 12px !important;
          }
        }
      `}</style>
    </section>
  );
}
