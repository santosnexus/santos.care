import { ImageResponse } from "next/og";
import { treatments } from "@/data/treatments";

export const alt = "Heal India Medi Tourism — Treatment in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const t = treatments[params.slug];
  const title = t ? `${t.title} in India` : "Treatments in India";
  const subtitle = t ? t.tagline : "World-class medical treatment at 70-90% less cost";
  const price = t ? `From $${t.costRange.from.toLocaleString()}` : "";

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
          <div style={{ fontSize: 26, fontWeight: 700 }}>Heal India Medi Tourism</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#d6f0f1", maxWidth: 860, lineHeight: 1.3 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {price && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 16,
                padding: "18px 26px",
              }}
            >
              <div style={{ fontSize: 34, fontWeight: 800 }}>{price}</div>
              <div style={{ fontSize: 20, color: "#d6f0f1" }}>All-inclusive</div>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 16,
              padding: "18px 26px",
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 800 }}>JCI</div>
            <div style={{ fontSize: 20, color: "#d6f0f1" }}>Accredited</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
