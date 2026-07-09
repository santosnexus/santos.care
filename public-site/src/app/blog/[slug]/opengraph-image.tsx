import { ImageResponse } from "next/og";
import { getBlogPost } from "@/lib/mdx";

export const alt = "Heal India Medi Tourism — Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  const title = post ? post.frontmatter.metaTitle || post.frontmatter.title : "Heal India Blog";
  const category = post ? post.frontmatter.category : "Medical Tourism";

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

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 999,
              padding: "8px 20px",
              alignSelf: "flex-start",
              color: "#d6f0f1",
            }}
          >
            {category}
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.08, maxWidth: 1000 }}>{title}</div>
        </div>

        <div style={{ fontSize: 24, color: "#d6f0f1" }}>Expert cost guides & real patient stories</div>
      </div>
    ),
    { ...size }
  );
}
