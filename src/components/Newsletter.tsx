import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  Mail,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setError(true);
      setTimeout(() => setError(false), 1800);
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F7F3FF] to-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute right-0 bottom-8 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="absolute left-0 bottom-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[36px] sm:rounded-[46px] bg-gradient-to-br from-[#150622] via-[#35115E] to-[#6F2DBD]">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center p-6 sm:p-10 lg:p-14">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl">
                <Sparkles size={16} className="text-purple-200" />
                <span className="text-[11px] sm:text-xs font-black tracking-[0.22em] uppercase">
                  Exclusive Offers
                </span>
              </div>

              <h2 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
                Get premium deals before everyone else.
              </h2>

              <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg leading-8 text-purple-100">
                Join the CosmoCartt insider list for early product launches,
                private discounts, flash sale alerts and members-only shopping
                updates.
              </p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4 max-w-2xl">
                <OfferPoint
                  icon={<Zap size={22} />}
                  title="Flash Alerts"
                  text="Never miss limited-time offers."
                />

                <OfferPoint
                  icon={<Gift size={22} />}
                  title="Private Deals"
                  text="Exclusive discounts for subscribers."
                />

                <OfferPoint
                  icon={<ShieldCheck size={22} />}
                  title="No Spam"
                  text="Clean updates only, unsubscribe anytime."
                />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[30px] sm:rounded-[36px] border border-white/20 bg-white p-5 sm:p-7 shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
                {!submitted ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center shrink-0">
                        <Mail size={26} />
                      </div>

                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                          Join the insider list
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Premium offers and early access delivered directly to
                          your inbox.
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 space-y-4">
                      <div
                        className={`relative rounded-2xl border bg-slate-50 transition-all ${
                          error
                            ? "border-red-300 ring-4 ring-red-50"
                            : "border-slate-200 focus-within:border-[#4B1E78] focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-100"
                        }`}
                      >
                        <Mail
                          size={19}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSubscribe()
                          }
                          placeholder="Enter your email address"
                          className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 font-bold text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {error && (
                        <p className="text-sm font-bold text-red-500">
                          Please enter a valid email address.
                        </p>
                      )}

                      <button
                        onClick={handleSubscribe}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#7C3AED] px-6 py-4 font-black text-white shadow-[0_18px_42px_rgba(75,30,120,0.30)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(75,30,120,0.38)]"
                      >
                        Subscribe Now
                        <ArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </button>
                    </div>

                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <ShieldCheck
                        size={18}
                        className="mt-0.5 text-emerald-600 shrink-0"
                      />

                      <p className="text-sm leading-6 text-slate-500">
                        No spam, no unnecessary emails. Unsubscribe anytime with
                        one click.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="mx-auto h-20 w-20 rounded-[28px] bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 size={44} />
                    </div>

                    <h3 className="mt-6 text-3xl font-black text-slate-950">
                      You’re subscribed
                    </h3>

                    <p className="mt-3 text-slate-500 leading-7">
                      You’ll now receive exclusive CosmoCartt offers, launch
                      updates and members-only deals.
                    </p>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setEmail("");
                      }}
                      className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 px-6 py-3 font-black text-[#4B1E78] transition hover:bg-[#4B1E78] hover:text-white"
                    >
                      Subscribe another email
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <MiniTrust icon={<Tag size={18} />} text="Exclusive pricing" />
                <MiniTrust icon={<ShieldCheck size={18} />} text="Privacy protected" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferPoint({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <div className="h-11 w-11 rounded-2xl bg-white/10 text-purple-100 flex items-center justify-center">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-purple-100/80">
        {text}
      </p>
    </div>
  );
}

function MiniTrust({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white/80 px-4 py-3 text-sm font-black text-slate-600 flex items-center justify-center gap-2">
      <span className="text-[#4B1E78]">
        {icon}
      </span>
      {text}
    </div>
  );
}