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
    <section className="bg-white px-3 sm:px-6 py-12 sm:py-20 flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-[680px] overflow-hidden text-center rounded-[28px] sm:rounded-[42px] px-5 py-10 sm:px-16 sm:py-20 bg-gradient-to-br from-[#25064d] via-[#34106a] to-[#7a37dd] shadow-[0_25px_60px_rgba(50,10,100,0.14)]">
        <div className="absolute inset-0 rounded-[28px] sm:rounded-[42px] bg-gradient-to-br from-white/20 via-white/5 to-transparent border border-white/10 pointer-events-none" />
        <div className="absolute w-52 h-52 rounded-full -right-12 -top-14 bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white/10 border border-white/10 mb-6 sm:mb-8 text-white text-[10px] sm:text-xs font-bold tracking-[0.14em]">
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-90" />
          EXCLUSIVE OFFERS
        </div>

        <h2 className="relative z-10 text-white text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
          The best deals,
          <br />
          <span className="text-white/95 font-semibold">
            before everyone else.
          </span>
        </h2>

        <p className="relative z-10 max-w-md mx-auto mt-4 sm:mt-5 mb-7 sm:mb-10 text-white/75 text-sm sm:text-base leading-7">
          Get early access to launches, flash sales, and members-only offers —
          straight to your inbox.
        </p>

        {!submitted ? (
          <div className="relative z-10">
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-2 rounded-2xl sm:rounded-[24px] bg-white p-2 border ${error ? "border-red-300" : "border-white/70"} shadow-inner`}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="Enter your email address"
                className="w-full flex-1 bg-transparent border-none px-4 py-3 text-sm sm:text-base text-slate-800 outline-none"
              />

              <button
                onClick={handleSubscribe}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-[18px] bg-gradient-to-b from-[#7a37dd] to-[#5220a4] text-white text-sm font-bold shadow-[0_8px_18px_rgba(70,20,140,0.28)]"
              >
                Subscribe
              </button>
            </div>

            <p className="mt-4 text-white/50 text-xs">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="relative z-10 text-white">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-2xl">
              ✓
            </div>
            <p className="text-lg font-semibold">You're all set!</p>
            <p className="mt-2 text-sm text-white/65">
              Watch your inbox for exclusive deals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
