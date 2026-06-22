import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      setError(true);
      setTimeout(() => setError(false), 1800);
      return;
    }
    setSubmitted(true);
  };

  return (
    <section
      style={{
        minHeight: "500px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "90px 30px",
        background: "#ffffff",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "680px",
          padding: "78px 65px",
          overflow: "hidden",
          textAlign: "center",
          borderRadius: "42px",

          background: `
            linear-gradient(
              135deg,
              #25064d 0%,
              #34106a 28%,
              #5220a4 68%,
              #7a37dd 100%
            )
          `,

          boxShadow: `
            0 25px 60px rgba(50,10,100,0.14)
          `,

          animation: "floatCard 8s ease-in-out infinite",
        }}
      >
        {/* Glass coating */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "42px",

            background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.18) 0%,
                rgba(255,255,255,0.06) 22%,
                rgba(255,255,255,0.02) 45%,
                transparent 100%
              )
            `,

            border: "1px solid rgba(255,255,255,0.14)",

            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.28),
              inset 0 -1px 0 rgba(255,255,255,0.02)
            `,

            pointerEvents: "none",
          }}
        />

        {/* Reflection streak */}
        <div
          style={{
            position: "absolute",
            width: "330px",
            height: "180px",
            top: "-40px",
            left: "-30px",
            transform: "rotate(-18deg)",

            background: `
              linear-gradient(
                90deg,
                rgba(255,255,255,0.20),
                transparent
              )
            `,

            filter: "blur(22px)",
            pointerEvents: "none",
          }}
        />

        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            right: "-50px",
            top: "-60px",

            background: `
              radial-gradient(
                circle,
                rgba(255,255,255,0.10),
                transparent
              )
            `,

            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.10)",
            marginBottom: "30px",
            color: "#ffffff",
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
              background: "#ffffff",
              opacity: 0.9,
            }}
          />
          EXCLUSIVE OFFERS
        </div>

        {/* Heading */}
        <h2
          style={{
            position: "relative",
            zIndex: 2,
            color: "#ffffff",
            fontSize: "clamp(36px,4vw,52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.06em",
            fontWeight: 700,
            marginBottom: "18px",
          }}
        >
          The best deals,
          <br />
          <span
            style={{
              color: "rgba(255,255,255,0.96)",
              fontWeight: 600,
            }}
          >
            before everyone else.
          </span>
        </h2>

        {/* Description */}
        <p
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "430px",
            margin: "0 auto 42px",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          Get early access to launches, flash sales, and members-only offers —
          straight to your inbox.
        </p>

        {!submitted ? (
          <div style={{ position: "relative", zIndex: 2 }}>
            {/* WHITE GLASS INPUT CONTAINER */}
            <div
              style={{
                display: "flex",
                padding: "6px",
                borderRadius: "24px",

                background: `
                  linear-gradient(
                    180deg,
                    rgba(255,255,255,0.98) 0%,
                    rgba(248,248,252,0.95) 100%
                  )
                `,

                border: `1px solid ${
                  error
                    ? "rgba(255,120,120,0.35)"
                    : "rgba(255,255,255,0.75)"
                }`,

                boxShadow: `
                  inset 0 1px 0 rgba(255,255,255,1),
                  inset 0 -1px 0 rgba(220,220,230,0.7),
                  0 6px 20px rgba(20,10,50,0.08)
                `,

                marginBottom: "16px",
              }}
            >
              {/* INPUT */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubscribe()
                }
                placeholder="Enter your email address"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  padding: "16px 20px",
                  color: "#2b2b2b",
                  fontSize: "15px",
                  outline: "none",
                }}
              />

              {/* PREMIUM PURPLE GLASS BUTTON */}
              <button
                onClick={handleSubscribe}
                style={{
                  padding: "16px 30px",
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.18)",

                  background: `
                    linear-gradient(
                      180deg,
                      rgba(122,55,221,0.95) 0%,
                      rgba(82,32,164,0.95) 100%
                    )
                  `,

                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.22),
                    inset 0 -1px 0 rgba(0,0,0,0.08),
                    0 8px 18px rgba(70,20,140,0.28)
                  `,

                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",

                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.filter = "brightness(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px) scale(1)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                Subscribe
              </button>
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.50)",
                fontSize: "12px",
              }}
            >
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              zIndex: 2,
              color: "#ffffff",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 14px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: "50%",

                background: "rgba(255,255,255,0.10)",

                border: "1px solid rgba(255,255,255,0.12)",

                fontSize: "22px",
              }}
            >
              ✓
            </div>

            <p
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              You're all set!
            </p>

            <p
              style={{
                marginTop: "8px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Watch your inbox for exclusive deals.
            </p>
          </div>
        )}
      </div>

      <style>{`
        input::placeholder{
          color: rgba(100,100,110,0.75);
        }

        @keyframes floatCard {
          0%,100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-6px); 
          }
        }
      `}</style>
    </section>
  );
}