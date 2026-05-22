import { useState, useEffect } from "react";
import { PersonStanding, Briefcase } from "lucide-react";

function LotusIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#B8935A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 8 7 8 11C8 13.2 9.8 15 12 15C14.2 15 16 13.2 16 11C16 7 12 2 12 2Z" />
      <path d="M12 15V22" />
      <path d="M7 20C7 20 9.5 18 12 18C14.5 18 17 20 17 20" />
      <path d="M4 13C4 13 7 11 12 11C17 11 20 13 20 13" />
    </svg>
  );
}

const trustColumns = [
  { icon: PersonStanding, headline: "FOR FITNESS ENTHUSIASTS", tagline: "Fuel. Recover. Perform." },
  { icon: Briefcase, headline: "FOR BUSY PROFESSIONALS", tagline: "Focus. Balance. Thrive." },
  { icon: LotusIcon, headline: "FOR A BETTER YOU", tagline: "Daily Wellness. Naturally." },
];

export default function MobileHeroVideoSection() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const videoSrc = isDesktop ? "/images/mobilesektop-hero.webm" : "/images/mobile-hero-banner.webm";

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        overflow: "hidden",
        backgroundColor: "#F5EFE0",
      }}
    >
      <video
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={videoSrc} type="video/webm" />
      </video>

      {isDesktop && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Headline Overlay */}
      <div
        style={{
          position: "absolute",
          top: isDesktop ? "16%" : "42%",
          left: "50%",
          transform: isDesktop ? "translateX(-50%)" : "translate(-50%, -50%)",
          width: "100%",
          maxWidth: isDesktop ? 900 : undefined,
          textAlign: isDesktop ? "center" : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "0 24px",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {isDesktop && (
          <span
            style={{
              fontFamily: "'Playfair Display','Cormorant Garamond',serif",
              fontSize: 13,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: 5,
              color: "#1E3A2B",
              textShadow: "0 1px 2px rgba(255,255,255,0.3)",
              position: "relative",
              zIndex: 1,
              display: "block",
              marginBottom: 4,
            }}
          >
            NOURISHING LIVES, NATURALLY
          </span>
        )}
        <h1
          style={{
            margin: isDesktop ? "24px 0 0" : 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1.1,
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: isDesktop ? "clamp(40px,5.5vw,78px)" : "clamp(30px,7.5vw,46px)",
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 0 25px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            NOURISH YOUR BODY.
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: isDesktop ? "clamp(40px,5.5vw,78px)" : "clamp(30px,7.5vw,46px)",
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.8), 0 0 25px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            ELEVATE YOUR LIFE.
          </span>
        </h1>

        <a
          href="/collections"
          style={{
            display: "inline-block",
            marginTop: isDesktop ? 64 : 40,
            padding: isDesktop ? "14px 36px" : "10px 28px",
            fontFamily: "'Inter', sans-serif",
            fontSize: isDesktop ? 13 : 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#FFFFFF",
            backgroundColor: "#AB8743",
            borderRadius: 9999,
            textDecoration: "none",
            pointerEvents: "auto",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C9A961")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#AB8743")}
        >
          Explore Our Collections
        </a>
      </div>

      {/* Trust Bar */}
      <div
        style={{
          position: "absolute",
          bottom: isDesktop ? "6%" : "4%",
          left: "50%",
          transform: "translateX(-50%)",
          width: isDesktop ? "90%" : "92%",
          maxWidth: isDesktop ? 960 : 500,
          zIndex: 11,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            justifyContent: isDesktop ? "space-between" : undefined,
            alignItems: isDesktop ? "center" : undefined,
            gap: isDesktop ? 24 : 10,
            background: "#1E3A2B",
            borderRadius: isDesktop ? 16 : 12,
            padding: isDesktop ? "24px 32px" : "16px 20px",
            boxShadow: "0 4px 20px rgba(30,58,43,0.25)",
          }}
        >
          {trustColumns.map((col, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: isDesktop ? 16 : 10, flex: isDesktop ? 1 : undefined }}>
              <col.icon size={isDesktop ? 32 : 20} />
              <div>
                <p style={{ margin: 0, fontFamily: "'Inter',sans-serif", fontSize: isDesktop ? 14 : 10, fontWeight: 600, letterSpacing: isDesktop ? 2 : 1.5, color: "#D4B57A", textTransform: "uppercase" }}>
                  {col.headline}
                </p>
                <p style={{ margin: isDesktop ? "4px 0 0" : "1px 0 0", fontFamily: "'Inter',sans-serif", fontSize: isDesktop ? 12 : 10, fontWeight: 400, color: "#E8DCC4" }}>
                  {col.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
