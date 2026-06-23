export default function AIExperienceSection() {
  return (
    <section
      style={{
        minHeight: "720px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "110px 30px",
        background: "#ffffff",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft Background Glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          right: "-100px",
          top: "-120px",
          background: `
            radial-gradient(
              circle,
              rgba(122,55,221,0.08),
              transparent 70%
            )
          `,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

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
        {/* LEFT CONTENT */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "#f3e8ff",
              border: "1px solid rgba(122,55,221,0.12)",
              marginBottom: "28px",
              color: "#7a37dd",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#a88cff",
              }}
            />
            AI PRODUCT EXPERIENCE
          </div>

          {/* Heading */}
          <h2
            style={{
              color: "#0f172a",
              fontSize: "clamp(42px,5vw,68px)",
              lineHeight: 1.05,
              letterSpacing: "-0.05em",
              fontWeight: 700,
              marginBottom: "22px",
            }}
          >
            Experience Products
            <br />
            <span
              style={{
                color: "#7a37dd",
                fontWeight: 600,
              }}
            >
              Before You Buy.
            </span>
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.8,
              color: "#64748b",
              maxWidth: "520px",
              marginBottom: "35px",
            }}
          >
            Explore interactive AI-powered product previews and
            immersive demonstrations that let you experience
            products before making a purchase.
          </p>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "35px",
            }}
          >
            {["Smart Preview", "3D Experience", "Live Product Demo"].map(
              (item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "999px",
                    background: "#faf5ff",
                    border: "1px solid rgba(122,55,221,0.08)",
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>

          {/* Button */}
          <button
            style={{
              padding: "17px 34px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: `
                linear-gradient(
                  180deg,
                  rgba(122,55,221,0.96) 0%,
                  rgba(82,32,164,0.96) 100%
                )
              `,
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.22),
                0 8px 24px rgba(80,20,180,0.20)
              `,
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px) scale(1)";
            }}
          >
            Watch Demo
          </button>
        </div>

        {/* RIGHT VIDEO CONTAINER */}
        <div
          style={{
            position: "relative",
            height: "460px",
            borderRadius: "36px",
            overflow: "hidden",
            background: `
              linear-gradient(
                180deg,
                rgba(122,55,221,0.12) 0%,
                rgba(122,55,221,0.05) 100%
              )
            `,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(122,55,221,0.12)",
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.3),
              0 0 40px rgba(120,50,255,0.10)
            `,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Reflection */}
          <div
            style={{
              position: "absolute",
              width: "260px",
              height: "180px",
              top: "-20px",
              left: "-40px",
              transform: "rotate(-20deg)",
              background: `
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.25),
                  transparent
                )
              `,
              filter: "blur(22px)",
            }}
          />

          {/* Play Button */}
          <div
            style={{
              width: "92px",
              height: "92px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(122,55,221,0.12)",
              border: "1px solid rgba(122,55,221,0.15)",
              fontSize: "34px",
              color: "#7a37dd",
              boxShadow: `
                0 0 30px rgba(120,50,255,.12)
              `,
              cursor: "pointer",
            }}
          >
            ▶
          </div>

          <p
            style={{
              position: "absolute",
              bottom: "28px",
              color: "#64748b",
              fontSize: "14px",
              letterSpacing: "0.04em",
            }}
          >
            Interactive Product Demonstration
          </p>
        </div>
      </div>
    </section>
  );
}