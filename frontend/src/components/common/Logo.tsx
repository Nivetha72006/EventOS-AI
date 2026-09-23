import { Sparkles } from "lucide-react";


interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export default function Logo({
  variant = "light",
  size = "md",
  showSubtitle = false,
}: LogoProps) {
  const isLight = variant === "light";

  const markSizes = {
    sm: { box: 30, font: 16, sparkle: 10 },
    md: { box: 38, font: 20, sparkle: 12 },
    lg: { box: 46, font: 25, sparkle: 14 },
  };

  const currentSize = markSizes[size];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "lg" ? "12px" : "10px",
        userSelect: "none",
        textDecoration: "none",
      }}
    >
      {/* Attractive Luxury Emblem Mark */}
      <div
        style={{
          width: `${currentSize.box}px`,
          height: `${currentSize.box}px`,
          borderRadius: size === "lg" ? "12px" : "10px",
          background: isLight
            ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)"
            : "linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: isLight
            ? "0 6px 20px rgba(37, 99, 235, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)"
            : "0 4px 16px rgba(37, 99, 235, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          flexShrink: 0,
        }}
      >
        {/* Subtle Luxury Sparkle in corner */}
        <Sparkles
          size={currentSize.sparkle}
          style={{
            position: "absolute",
            top: "3px",
            right: "3px",
            color: "#FDE047",
            filter: "drop-shadow(0 0 4px rgba(253, 224, 71, 0.8))",
          }}
        />

        <span
          style={{
            color: "#ffffff",
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 800,
            fontSize: `${currentSize.font}px`,
            lineHeight: 1,
            letterSpacing: "-0.5px",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          E
        </span>
      </div>

      {/* Brand Typography */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", lineHeight: 1.15 }}>
          <span
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontWeight: 800,
              fontSize: size === "lg" ? "24px" : size === "md" ? "19px" : "16px",
              color: isLight ? "#ffffff" : "#0F172A",
              letterSpacing: "-0.4px",
            }}
          >
            EventOS
          </span>

          <span
            style={{
              background: "linear-gradient(135deg, #38BDF8 0%, #2563EB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              fontSize: size === "lg" ? "20px" : size === "md" ? "16px" : "14px",
              letterSpacing: "0.2px",
            }}
          >
            AI
          </span>
        </div>

        {showSubtitle && (
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: isLight ? "rgba(255,255,255,0.7)" : "#64748B",
              fontWeight: 600,
              marginTop: "2px",
            }}
          >
            Smart Event Management
          </span>
        )}
      </div>
    </div>
  );
}
