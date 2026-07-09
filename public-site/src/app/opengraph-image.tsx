import { ImageResponse } from "next/og";

export const revalidate = 86400;
export const alt = "Heal India Medi Tourism — World-Class Treatment in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0b5e61 0%, #0d7377 55%, #149ba0 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "white",
              color: "#0d7377",
              fontSize: 30,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            HC
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.5 }}>Heal India Medi Tourism</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            World-Class Medical Treatment in India
          </div>
          <div style={{ fontSize: 30, color: "#d6f0f1", maxWidth: 820, lineHeight: 1.3 }}>
            JCI-accredited hospitals, expert surgeons & Ayurveda recovery in Kerala.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {[
            { big: "70-90%", small: "Lower cost" },
            { big: "JCI", small: "Accredited" },
            { big: "24h", small: "Free plan" },
          ].map((s) => (
            <div
              key={s.big}
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 16,
                padding: "18px 26px",
              }}
            >
              <div style={{ fontSize: 34, fontWeight: 800 }}>{s.big}</div>
              <div style={{ fontSize: 20, color: "#d6f0f1" }}>{s.small}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
