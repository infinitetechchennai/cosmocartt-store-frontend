import { useRef, useState } from "react";

export default function AIExperienceSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoSrc = "src/assets/cosmocartt_video.mp4";

  const handlePlay = () => {
    if (!videoRef.current) return;

    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section
      style={{
        minHeight: "720px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "110px 30px",
        background: "#ffffff",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1350px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "70px",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "#f3e8ff",
              color: "#7a37dd",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              marginBottom: "28px",
            }}
          >
            AI PRODUCT EXPERIENCE
          </div>

          <h2
            style={{
              color: "#0f172a",
              fontSize: "clamp(42px,5vw,68px)",
              lineHeight: 1.05,
              letterSpacing: "-0.05em",
              fontWeight: 800,
              marginBottom: "22px",
            }}
          >
            Experience Products
            <br />
            <span style={{ color: "#7a37dd" }}>
              Before You Buy.
            </span>
          </h2>

          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.8,
              color: "#64748b",
              maxWidth: "520px",
              marginBottom: "35px",
            }}
          >
            Watch immersive product demonstrations and preview product details
            before making a confident purchase.
          </p>

          <button
            onClick={handlePlay}
            style={{
              padding: "17px 34px",
              borderRadius: "18px",
              border: "none",
              background:
                "linear-gradient(180deg, #7a37dd 0%, #5220a4 100%)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 12px 30px rgba(80,20,180,0.25)",
            }}
          >
            Watch Demo
          </button>
        </div>

        <div
          style={{
            position: "relative",
            height: "460px",
            borderRadius: "36px",
            overflow: "hidden",
            background: "#050505",
            border: "1px solid rgba(122,55,221,0.18)",
            boxShadow: "0 35px 90px rgba(80,20,180,0.18)",
          }}
        >
          <video
            ref={videoRef}
            src={videoSrc}
            controls={isPlaying}
            muted
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {!isPlaying && (
            <button
              onClick={handlePlay}
              style={{
                position: "absolute",
                inset: 0,
                margin: "auto",
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px)",
                color: "#ffffff",
                fontSize: "34px",
                cursor: "pointer",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
            >
              ▶
            </button>
          )}

          {!isPlaying && (
            <div
              style={{
                position: "absolute",
                left: "28px",
                bottom: "26px",
                color: "#ffffff",
              }}
            >
              <p style={{ fontWeight: 800, fontSize: "18px" }}>
                Interactive Product Demonstration
              </p>
              <p style={{ opacity: 0.75, fontSize: "13px", marginTop: "4px" }}>
                Click to watch the experience
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}