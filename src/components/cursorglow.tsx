import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    let lastX = 0;
    let lastY = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      /* Smooth follow */

      currentX += (mouseX - currentX) * 0.10;
      currentY += (mouseY - currentY) * 0.10;

      /* Velocity */

      const velocityX = currentX - lastX;
      const velocityY = currentY - lastY;

      const speed =
        Math.sqrt(
          velocityX * velocityX +
          velocityY * velocityY
        ) * 0.6;

      /* Stretch amount */

      const stretch = Math.min(speed, 35);

      /* Angle */

      const angle =
        Math.atan2(
          velocityY,
          velocityX
        ) *
        (180 / Math.PI);

      if (blobRef.current) {
        blobRef.current.style.transform = `
          translate3d(
            ${currentX - 140}px,
            ${currentY - 140}px,
            0
          )
          rotate(${angle}deg)
          scaleX(${1 + stretch / 100})
          scaleY(${1 - stretch / 180})
        `;
      }

      lastX = currentX;
      lastY = currentY;

      requestAnimationFrame(animate);
    };

    window.addEventListener(
      "mousemove",
      handleMove
    );

    animate();

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );
    };
  }, []);

  return (
    <div
      ref={blobRef}
      style={{
        position: "fixed",

        width: "280px",
        height: "280px",

        borderRadius: "50%",

        pointerEvents: "none",

        zIndex: 1,

        willChange: "transform",

        background: `
          radial-gradient(
            circle,
            rgba(111,45,189,0.12) 0%,
            rgba(75,30,120,0.08) 35%,
            rgba(168,85,247,0.05) 60%,
            transparent 75%
          )
        `,

        filter: "blur(55px)",

        transition: "transform 0.05s linear",
      }}
    />
  );
}