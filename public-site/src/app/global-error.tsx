"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0fdfa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "28rem" }}>
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "1rem",
              background: "#0d7377",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.25rem",
              margin: "0 auto 1.5rem",
            }}
          >
            HC
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#0d7377", marginBottom: "0.5rem" }}>
            Critical Error
          </h1>
          <p style={{ color: "#4b5563", marginBottom: "1.5rem" }}>
            {error.message || "A critical error occurred. Please reload the page."}
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.625rem 1.25rem",
              background: "#0d7377",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
