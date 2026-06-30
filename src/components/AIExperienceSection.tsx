import { useRef, useState } from "react";

export default function AIExperienceSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoSrc = "/src/assets/cosmocartt_video.mp4";

  const handlePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section className="bg-white overflow-hidden pt-0 pb-0 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex px-4 py-2 rounded-full bg-purple-100 text-[#7a37dd] text-[10px] sm:text-xs font-black tracking-[0.14em] mb-5 sm:mb-7">
            AI PRODUCT EXPERIENCE
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900">
            Experience Products
            <br />
            <span className="text-[#7a37dd]">Before You Buy.</span>
          </h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg leading-7 sm:leading-8 text-slate-500 max-w-xl mx-auto lg:mx-0">
            Watch immersive product demonstrations and preview product details
            before making a confident purchase.
          </p>

          <button
            onClick={handlePlay}
            className="mt-6 sm:mt-8 px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-b from-[#7a37dd] to-[#5220a4] text-white text-sm sm:text-base font-bold shadow-[0_12px_30px_rgba(80,20,180,0.25)]"
          >
            Watch Demo
          </button>
        </div>

        <div className="relative h-[230px] sm:h-[360px] lg:h-[460px] rounded-[22px] sm:rounded-[36px] overflow-hidden bg-black border border-purple-200 shadow-[0_25px_70px_rgba(80,20,180,0.16)]">
          <video
            ref={videoRef}
            src={videoSrc}
            controls={isPlaying}
            muted
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover block"
          />

          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-white/40 bg-white/20 backdrop-blur-xl text-white text-2xl sm:text-4xl shadow-2xl"
            >
              ▶
            </button>
          )}

          {!isPlaying && (
            <div className="absolute left-4 right-4 bottom-4 sm:left-7 sm:right-auto sm:bottom-6 text-white">
              <p className="font-black text-sm sm:text-lg">
                Interactive Product Demonstration
              </p>
              <p className="opacity-75 text-xs sm:text-sm mt-1">
                Click to watch the experience
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
