import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Zap,
} from "lucide-react";

export default function ForgotPassword() {
  return (
    <div
      className="
        h-screen
        bg-[#ECE5F5]
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND BLURS */}

      <div
        className="
          absolute
          top-10
          left-10
          w-72
          h-72
          bg-purple-300/20
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0
          w-80
          h-80
          bg-violet-300/20
          rounded-full
          blur-3xl
        "
      />

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-4">

        {/* OUTER GLASS FRAME */}

        <div
          className="
            relative
            rounded-[38px]
            p-4
            bg-white/25
            backdrop-blur-3xl
            border
            border-white/40
            shadow-[0_25px_60px_rgba(100,60,150,0.08)]
          "
        >

          {/* GLASS REFLECTION */}

          <div
            className="
              absolute
              inset-0
              rounded-[38px]
              bg-gradient-to-br
              from-white/30
              via-transparent
              to-white/10
              pointer-events-none
            "
          />

          {/* INNER FRAME */}

          <div
            className="
              relative
              grid
              lg:grid-cols-2
              rounded-[34px]
              overflow-hidden
              bg-white/10
              backdrop-blur-2xl
              border
              border-white/20
            "
          >

            {/* LEFT PANEL */}

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="
                relative
                overflow-hidden
                p-8
                text-white
                min-h-[580px]
                bg-gradient-to-br
                from-[#4A1B8C]
                via-[#6D38B4]
                to-[#B779F9]
              "
            >

              {/* GLASS COATING */}

              <div
                className="
                  absolute
                  inset-0
                  bg-white/[0.06]
                  backdrop-blur-xl
                "
              />

              {/* TOP REFLECTION */}

              <div
                className="
                  absolute
                  -top-10
                  -left-20
                  w-[400px]
                  h-[120px]
                  rotate-12
                  bg-white/15
                  blur-3xl
                "
              />

              {/* CURVED LIGHT */}

              <div
                className="
                  absolute
                  top-0
                  right-[-100px]
                  w-[250px]
                  h-[500px]
                  rounded-full
                  bg-pink-300/20
                  blur-2xl
                "
              />

              {/* BOTTOM LIGHT */}

              <div
                className="
                  absolute
                  bottom-[-80px]
                  left-[-80px]
                  w-[300px]
                  h-[220px]
                  bg-white/20
                  rounded-full
                  blur-3xl
                "
              />

              {/* SECOND GLASS FRAME */}

              <div
                className="
                  absolute
                  inset-5
                  rounded-[28px]
                  border
                  border-white/20
                  bg-white/[0.02]
                "
              />

              <div className="relative z-10">

                {/* BADGE */}

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-full
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    text-xs
                    font-medium
                  "
                >
                  <Lock size={13} />
                  ACCOUNT RECOVERY
                </span>

                {/* TITLE */}

                <h2
                  className="
                    mt-7
                    text-5xl
                    font-black
                    leading-[0.95]
                    tracking-tight
                  "
                >
                  Forgot
                  <br />
                  Password?
                </h2>

                {/* TEXT */}

                <p
                  className="
                    mt-5
                    text-base
                    text-purple-100
                    leading-relaxed
                    max-w-md
                  "
                >
                  Reset your password securely and
                  recover access to your account.
                </p>

                {/* FEATURES */}

                <div className="mt-10 space-y-3">

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      pb-3
                      border-b
                      border-white/10
                    "
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                      <ShieldCheck size={18} />
                    </div>

                    <span>
                      Secure & Encrypted
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      pb-3
                      border-b
                      border-white/10
                    "
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                      <Mail size={18} />
                    </div>

                    <span>
                      Email Verification
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      pb-3
                      border-b
                      border-white/10
                    "
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                      <Lock size={18} />
                    </div>

                    <span>
                      Protected Access
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xl">
                      <Zap size={18} />
                    </div>

                    <span>
                      Fast Recovery
                    </span>
                  </div>

                </div>

              </div>

            </motion.div>
                        {/* RIGHT PANEL */}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="
                relative
                p-8
                min-h-[580px]
                flex
                items-center
                justify-center
                bg-white/20
                backdrop-blur-3xl
              "
            >

              {/* INNER FROSTED CARD */}

              <div
                className="
                  absolute
                  inset-6
                  rounded-[28px]
                  bg-white/35
                  backdrop-blur-3xl
                  border
                  border-white/40
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]
                "
              />

              {/* REFLECTION */}

              <div
                className="
                  absolute
                  top-0
                  left-16
                  w-[280px]
                  h-[80px]
                  bg-white/20
                  blur-3xl
                  rotate-6
                "
              />

              <div className="relative z-10 w-full max-w-md">

                {/* HEADER */}

                <div className="text-center">

                  <h1
                    className="
                      text-4xl
                      font-black
                      tracking-tight
                      text-[#2B2350]
                    "
                  >
                    Reset Password
                  </h1>

                  <p
                    className="
                      mt-3
                      text-sm
                      text-slate-500
                      leading-relaxed
                    "
                  >
                    Enter your email and verification code
                    to continue securely.
                  </p>

                </div>

                {/* INPUTS */}

                <div className="mt-8 space-y-4">

                  {/* EMAIL */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      px-5
                      py-3
                      rounded-2xl
                      bg-white/45
                      backdrop-blur-2xl
                      border
                      border-white/60
                      shadow-[0_8px_18px_rgba(120,80,180,0.05)]
                      focus-within:ring-4
                      focus-within:ring-purple-100
                      transition-all
                    "
                  >

                    <Mail
                      size={20}
                      className="text-[#6D38B4]"
                    />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        placeholder:text-slate-400
                      "
                    />

                  </div>

                  {/* CODE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                      px-5
                      py-3
                      rounded-2xl
                      bg-white/45
                      backdrop-blur-2xl
                      border
                      border-white/60
                      shadow-[0_8px_18px_rgba(120,80,180,0.05)]
                      focus-within:ring-4
                      focus-within:ring-purple-100
                      transition-all
                    "
                  >

                    <ShieldCheck
                      size={20}
                      className="text-[#6D38B4]"
                    />

                    <input
                      type="text"
                      placeholder="Enter verification code"
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        placeholder:text-slate-400
                      "
                    />

                  </div>

                </div>

                {/* BUTTON */}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="
                    w-full
                    mt-6
                    py-3
                    rounded-2xl
                    text-white
                    font-semibold
                    bg-gradient-to-r
                    from-[#5A1DBA]
                    via-[#8B5CF6]
                    to-[#D26BFF]
                    shadow-[0_10px_25px_rgba(120,60,200,0.15)]
                    hover:brightness-105
                    transition-all
                  "
                >
                  Send Reset Link →
                </motion.button>

                {/* DIVIDER */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    mt-7
                  "
                >

                  <div className="flex-1 h-px bg-slate-300/60" />

                  <span className="text-xs tracking-[0.2em] text-slate-400">
                    GO BACK
                  </span>

                  <div className="flex-1 h-px bg-slate-300/60" />

                </div>

                {/* BACK */}

                <Link
                  to="/login"
                  className="
                    mt-6
                    flex
                    justify-center
                    items-center
                    gap-2
                    py-3
                    rounded-2xl
                    bg-white/35
                    backdrop-blur-2xl
                    border
                    border-white/50
                    text-[#4B1E78]
                    font-semibold
                    hover:bg-white/50
                    transition-all
                  "
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </div>
  );
}