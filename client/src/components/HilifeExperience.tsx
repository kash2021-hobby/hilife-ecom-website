import { useTransform, motion } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface Props {
  scrollYProgress: MotionValue<number>;
}

export default function HilifeExperience({ scrollYProgress }: Props) {
  // Phase 1: Brand Intro (0%–33%)
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.33], [0, 1, 0]);
  const phase1Y = useTransform(scrollYProgress, [0, 0.15, 0.33], [40, 0, -20]);

  // Phase 2: Craftsmanship (33%–66%)
  const phase2Opacity = useTransform(scrollYProgress, [0.33, 0.45, 0.60, 0.66], [0, 1, 1, 0]);
  const phase2Y = useTransform(scrollYProgress, [0.33, 0.45, 0.66], [30, 0, -20]);

  // Phase 3: The Reveal (66%–100%)
  const phase3Opacity = useTransform(scrollYProgress, [0.66, 0.78, 1], [0, 1, 1]);
  const phase3Y = useTransform(scrollYProgress, [0.66, 0.78, 1], [30, 0, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      {/* ===== PHASE 1: Brand Intro ===== */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: phase1Opacity,
          y: phase1Y,
        }}
      >
        <div style={{ maxWidth: 640, textAlign: "center", padding: "0 24px" }}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: "#FFFFFF",
              fontWeight: 600,
              lineHeight: 1.1,
              margin: 0,
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
              letterSpacing: "-0.01em",
            }}
          >
            By Nature
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.9rem, 1.3vw, 1.15rem)",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 400,
              lineHeight: 1.6,
              margin: "16px 0 32px",
              textShadow: "0 1px 10px rgba(0,0,0,0.2)",
              letterSpacing: "0.02em",
            }}
          >
            Wellness Crafted By Nature
          </p>
          <motion.a
            href="#"
            style={{
              pointerEvents: "auto",
              display: "inline-block",
              padding: "12px 32px",
              border: "1.5px solid rgba(201, 169, 97, 0.7)",
              borderRadius: 9999,
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "#C9A961",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.3s ease, color 0.3s ease",
              cursor: "pointer",
            }}
            whileHover={{ backgroundColor: "rgba(201, 169, 97, 0.15)", color: "#E8DCC4" }}
          >
            Discover the Craft
          </motion.a>
        </div>
      </motion.div>

      {/* ===== PHASE 2: Craftsmanship ===== */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          opacity: phase2Opacity,
          y: phase2Y,
          paddingLeft: "clamp(40px, 8vw, 120px)",
          paddingRight: "clamp(40px, 8vw, 120px)",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              width: 50,
              height: 1.5,
              backgroundColor: "#C9A961",
              marginBottom: 20,
            }}
          />
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
              color: "#FFFFFF",
              fontWeight: 600,
              lineHeight: 1.2,
              margin: 0,
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            Crafted in the Nilgiris
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
              color: "rgba(255,255,255,0.8)",
              fontWeight: 400,
              lineHeight: 1.7,
              margin: "16px 0 0",
              textShadow: "0 1px 8px rgba(0,0,0,0.2)",
            }}
          >
            Hand-picked, orthodox-processed green tea leaves from India&rsquo;s misty
            Nilgiri mountains. Each leaf tells a story of tradition, terroir, and
            meticulous craftsmanship passed down through generations of tea artisans.
          </p>
          <div
            style={{
              width: 50,
              height: 1.5,
              backgroundColor: "#C9A961",
              marginTop: 24,
            }}
          />
        </div>
      </motion.div>

      {/* ===== PHASE 3: The Reveal ===== */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          opacity: phase3Opacity,
          y: phase3Y,
          paddingLeft: "clamp(40px, 8vw, 120px)",
          paddingRight: "clamp(40px, 8vw, 120px)",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            textAlign: "right",
            borderRight: "2px solid rgba(201, 169, 97, 0.4)",
            paddingRight: 28,
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
              color: "#FFFFFF",
              fontWeight: 600,
              lineHeight: 1.2,
              margin: 0,
              textShadow: "0 2px 16px rgba(0,0,0,0.3)",
            }}
          >
            Aromatic. Refreshing. Uplifting.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "20px 0 0",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.8rem, 1vw, 0.95rem)",
              color: "rgba(255,255,255,0.8)",
              lineHeight: 2,
              textShadow: "0 1px 6px rgba(0,0,0,0.2)",
            }}
          >
            <li>✦ Wild Floral Aroma</li>
            <li>✦ Low Bitterness</li>
            <li>✦ Revitalizing</li>
            <li>✦ Antioxidant-Rich</li>
          </ul>
          <motion.a
            href="#"
            style={{
              pointerEvents: "auto",
              display: "inline-block",
              marginTop: 24,
              padding: "12px 32px",
              backgroundColor: "#C9A961",
              borderRadius: 9999,
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#2D4A2B",
              letterSpacing: "0.04em",
              textDecoration: "none",
              transition: "background 0.3s ease",
              cursor: "pointer",
            }}
            whileHover={{ backgroundColor: "#E8DCC4" }}
          >
            Explore the Blend
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
}
