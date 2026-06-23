import {
  Truck,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div
      className="
        relative
        overflow-hidden
        bg-gradient-to-r
        from-[#3E1765]
        via-[#4B1E78]
        to-[#6F2DBD]
        text-white
        shadow-[0_4px_20px_rgba(75,30,120,0.18)]
      "
    >
      {/* Soft Glow Layer */}
      <div
        className="
          absolute
          inset-0
          opacity-20
          bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.25),transparent_40%)]
          pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-6
            md:gap-10
            py-3.5
            text-sm
            font-medium
          "
        >

          {/* Shipping */}
          <div
            className="
              flex
              items-center
              gap-2
              hover:scale-105
              transition-all
              duration-300
            "
          >
            <Truck
              size={16}
              className="text-purple-100"
            />
            <span>
              Free Shipping Above ₹999
            </span>
          </div>

          <div className="hidden md:block h-4 w-px bg-white/25"></div>

          {/* Security */}
          <div
            className="
              flex
              items-center
              gap-2
              hover:scale-105
              transition-all
              duration-300
            "
          >
            <ShieldCheck
              size={16}
              className="text-purple-100"
            />
            <span>
              100% Secure Payments
            </span>
          </div>

          <div className="hidden md:block h-4 w-px bg-white/25"></div>

          {/* Customers */}
          <div
            className="
              flex
              items-center
              gap-2
              hover:scale-105
              transition-all
              duration-300
            "
          >
            <Star
              size={16}
              className="text-purple-100"
            />
            <span>
              Trusted by 10,000+ Customers
            </span>
          </div>

          <div className="hidden md:block h-4 w-px bg-white/25"></div>

          {/* Delivery */}
          <div
            className="
              flex
              items-center
              gap-2
              hover:scale-105
              transition-all
              duration-300
            "
          >
            <Zap
              size={16}
              className="text-purple-100"
            />
            <span>
              Fast Delivery Across India
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}