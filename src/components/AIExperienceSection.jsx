export default function AIExperienceSection() {
  return (
    <section
      style={{
        minHeight: "760px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "120px 30px",
        background:
          "linear-gradient(180deg, #ffffff 0%, rgba(243,232,255,0.45) 50%, #ffffff 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Premium Purple Glow */}
      <div
        style={{
          position: "absolute",
          width: "650px",
          height: "650px",
          borderRadius: "50%",
          right: "-140px",
          top: "-120px",
          background: `
            radial-gradient(
              circle,
              rgba(111,45,189,0.12),
              transparent 70%
            )
          `,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      {/* Secondary Glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          left: "-100px",
          bottom: "-120px",
          borderRadius: "50%",
          background: `
            radial-gradient(
              circle,
              rgba(75,30,120,0.08),
              transparent 70%
            )
          `,
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1350px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* LEFT */}
        <div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              borderRadius: "999px",
              background: "#faf5ff",
              border: "1px solid rgba(111,45,189,0.12)",
              marginBottom: "30px",
              color: "#6F2DBD",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              boxShadow:
                "0 4px 14px rgba(111,45,189,0.06)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#6F2DBD",
              }}
            />
            AI PRODUCT EXPERIENCE
          </div>

          {/* Heading */}
          <h2
            style={{
              color: "#1e1b4b",
              fontSize: "clamp(44px,5vw,72px)",
              lineHeight: 1.03,
              letterSpacing: "-0.05em",
              fontWeight: 800,
              marginBottom: "24px",
            }}
          >
            Experience Products
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg,#4B1E78,#6F2DBD)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              Before You Buy.
            </span>
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: "17px",
              lineHeight: 1.9,
              color: "#64748b",
              maxWidth: "530px",
              marginBottom: "38px",
            }}
          >
            Explore immersive AI-powered product previews and
            interactive demonstrations that allow you to
            experience products in a smarter and more engaging
            way before making a purchase.
          </p>

          {/* Feature Pills */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "40px",
            }}
          >
            {[
              "Smart Preview",
              "3D Experience",
              "Live Product Demo",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "11px 18px",
                  borderRadius: "999px",
                  background: "#ffffff",
                  border:
                    "1px solid rgba(111,45,189,0.10)",
                  color: "#4B1E78",
                  fontSize: "13px",
                  fontWeight: 500,
                  boxShadow:
                    "0 6px 14px rgba(111,45,189,0.04)",
                }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Button */}
          <button
            style={{
              padding: "18px 36px",
              borderRadius: "18px",
              border: "none",
              background: `
                linear-gradient(
                  90deg,
                  #4B1E78 0%,
                  #6F2DBD 100%
                )
              `,
              boxShadow: `
                0 10px 25px rgba(111,45,189,0.20)
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

        {/* RIGHT VIDEO PANEL */}
        <div
          style={{
            position: "relative",
            height: "470px",
            borderRadius: "38px",
            overflow: "hidden",
            background: `
              linear-gradient(
                180deg,
                rgba(111,45,189,0.08) 0%,
                rgba(111,45,189,0.03) 100%
              )
            `,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border:
              "1px solid rgba(111,45,189,0.10)",
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.35),
              0 0 40px rgba(111,45,189,0.08)
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
                  rgba(255,255,255,0.35),
                  transparent
                )
              `,
              filter: "blur(22px)",
            }}
          />

          {/* Play Button */}
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "rgba(111,45,189,0.10)",
              border:
                "1px solid rgba(111,45,189,0.15)",
              fontSize: "34px",
              color: "#6F2DBD",
              boxShadow:
                "0 0 35px rgba(111,45,189,0.10)",
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