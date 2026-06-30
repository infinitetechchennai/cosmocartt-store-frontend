import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Crown,
  Gift,
  LockKeyhole,
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

  const handleSubscribe = (e?: React.FormEvent) => {
    e?.preventDefault();

    const trimmedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      setError(true);
      setTimeout(() => setError(false), 1800);
      return;
    }

    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8F5FF] to-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-16 h-72 w-72 rounded-full bg-purple-200/35 blur-3xl" />
        <div className="absolute right-[5%] bottom-10 h-80 w-80 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[34px] sm:rounded-[48px] bg-[#12051f] shadow-[0_35px_120px_rgba(75,30,120,0.24)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.35),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.22),transparent_38%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03]" />

          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14 xl:p-16">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-xl">
                <Crown size={16} className="text-purple-200" />

                <span className="text-[11px] sm:text-xs font-black tracking-[0.24em] uppercase">
                  CosmoCartt Insider Access
                </span>
              </div>

              <h2 className="mt-7 max-w-3xl text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.02] tracking-[-0.04em]">
                Unlock offers before they go public.
              </h2>

              <p className="mt-6 max-w-2xl text-sm sm:text-base lg:text-lg leading-8 text-purple-100/85">
                Get early access to product launches, limited-time price drops,
                private coupons and members-only deals curated for serious
                shoppers.
              </p>

              <div className="mt-9 grid sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl">
                <BenefitCard
                  icon={<Zap size={22} />}
                  title="Early Alerts"
                  text="Flash sales and launches before everyone else."
                />

                <BenefitCard
                  icon={<Gift size={22} />}
                  title="Private Deals"
                  text="Subscriber-only offers and special coupons."
                />

                <BenefitCard
                  icon={<ShieldCheck size={22} />}
                  title="Clean Inbox"
                  text="No spam. Only relevant shopping updates."
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <TrustBadge icon={<LockKeyhole size={15} />} text="Privacy protected" />
                <TrustBadge icon={<Bell size={15} />} text="Priority alerts" />
                <TrustBadge icon={<Tag size={15} />} text="Exclusive pricing" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[38px] bg-gradient-to-br from-white/20 via-purple-400/20 to-fuchsia-400/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[30px] sm:rounded-[38px] border border-white/15 bg-white p-5 sm:p-7 lg:p-8 shadow-[0_35px_100px_rgba(0,0,0,0.26)]">
                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-purple-100 blur-3xl" />

                {!submitted ? (
                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#4B1E78] text-white shadow-[0_16px_35px_rgba(75,30,120,0.28)]">
                        <Mail size={26} />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#4B1E78]">
                          Join the list
                        </p>

                        <h3 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                          Receive premium offers directly.
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Be first to know when new deals, launches and limited
                          offers go live.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubscribe} className="mt-8 space-y-4">
                      <div
                        className={`relative rounded-[22px] border bg-slate-50 transition-all duration-300 ${
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
                          placeholder="Enter your email address"
                          className="w-full rounded-[22px] bg-transparent py-4 pl-12 pr-4 text-sm sm:text-base font-bold text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {error && (
                        <p className="text-sm font-bold text-red-500">
                          Please enter a valid email address.
                        </p>
                      )}

                      <button
                        type="submit"
                        className="group flex w-full items-center justify-center gap-2 rounded-[22px] bg-gradient-to-r from-[#4B1E78] via-[#6426A3] to-[#7C3AED] px-6 py-4 font-black text-white shadow-[0_18px_45px_rgba(75,30,120,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_65px_rgba(75,30,120,0.42)]"
                      >
                        Subscribe for Exclusive Access
                        <ArrowRight
                          size={18}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </button>
                    </form>

                    <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <ShieldCheck size={17} />
                        </div>

                        <div>
                          <p className="font-black text-slate-800">
                            No spam, ever.
                          </p>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            We only send useful offers and important shopping
                            updates. Unsubscribe anytime.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 py-6 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[30px] bg-emerald-50 text-emerald-600 shadow-[0_18px_45px_rgba(16,185,129,0.16)]">
                      <CheckCircle2 size={52} />
                    </div>

                    <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-emerald-600">
                      Subscription Confirmed
                    </p>

                    <h3 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                      You’re on the insider list.
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                      You will now receive CosmoCartt’s best deals, launch
                      alerts and members-only offers directly in your inbox.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setEmail("");
                      }}
                      className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 px-6 py-3 font-black text-[#4B1E78] transition-all hover:bg-[#4B1E78] hover:text-white"
                    >
                      Subscribe another email
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <MiniCard icon={<Sparkles size={18} />} text="Premium drops" />
                <MiniCard icon={<Gift size={18} />} text="Member rewards" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.12]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-purple-100">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-purple-100/75">
        {text}
      </p>
    </div>
  );
}

function TrustBadge({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-black text-purple-100 backdrop-blur-xl">
      {icon}
      {text}
    </span>
  );
}

function MiniCard({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-purple-100 bg-white/80 px-4 py-3 text-sm font-black text-slate-600 backdrop-blur-xl">
      <span className="text-[#4B1E78]">
        {icon}
      </span>
      {text}
    </div>
  );
}