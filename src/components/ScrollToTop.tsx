import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const startPosition =
      window.pageYOffset;

    const duration = 700;
    let startTime: number | null =
      null;

    /* Smooth easing */

    const easeInOutCubic = (
      t: number
    ) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 -
          Math.pow(
            -2 * t + 2,
            3
          ) /
            2;

    const animateScroll = (
      currentTime: number
    ) => {
      if (!startTime)
        startTime = currentTime;

      const elapsed =
        currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const eased =
        easeInOutCubic(progress);

      window.scrollTo(
        0,
        startPosition *
          (1 - eased)
      );

      if (elapsed < duration) {
        requestAnimationFrame(
          animateScroll
        );
      }
    };

    requestAnimationFrame(
      animateScroll
    );
  }, [pathname]);

  return null;
}