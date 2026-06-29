import { apiPath } from "../config/api";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";

export default function Login({ onLogin }: any) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiPath("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Remember Me Logic
      if (remember) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      onLogin(data.user);



    } catch (err) {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-red-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/10 shadow-2xl">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-widest text-white">
            COSMOCARTT
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            Admin Dashboard Access
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/20 text-red-200 border border-red-400/30 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-red-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-red-400 outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-red-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:border-red-400 outline-none transition"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm text-slate-300">

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-red-500"
              />
              Remember me
            </label>

          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all shadow-lg active:scale-[0.98]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Secure Enterprise Admin System
        </p>

      </div>

    </div>
  );
}