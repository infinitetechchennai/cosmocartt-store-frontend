import {
  ShieldCheck,
  RotateCcw,
  Truck,
  Headphones,
} from "lucide-react";

export default function PremiumBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-6 pb-14">

      <div
        className="
          relative
          overflow-hidden
          rounded-[42px]
          bg-gradient-to-br
          from-[#120424]
          via-[#24103E]
          to-[#4B1E78]
          px-10
          lg:px-14
          py-14
          shadow-[0_30px_80px_rgba(30,10,60,0.18)]
        "
      >

        {/* BACKGROUND GLOW */}

        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* LEFT */}

          <div>

            <div
              className="
                inline-flex
                bg-white/10
                backdrop-blur-xl
                border border-white/10
                px-5
                py-2
                rounded-full
                text-white
                text-sm
                font-medium
              "
            >
              ✨ Premium Quality Collection
            </div>

            <h1
              className="
                mt-6
                text-5xl
                lg:text-7xl
                font-black
                leading-tight
                tracking-tight
                text-white
              "
            >
              Discover Future
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-purple-200
                  via-pink-300
                  to-white
                  bg-clip-text
                  text-transparent
                "
              >
                Shopping
              </span>
            </h1>

            <p className="mt-5 text-purple-100 text-lg leading-relaxed max-w-xl">
              Premium electronics, fashion, gaming accessories and
              flagship products curated for a next-generation shopping experience.
            </p>

            {/* BUTTON */}

            <button
              className="
                mt-8
                px-7
                py-4
                rounded-2xl
                bg-white
                text-[#4B1E78]
                font-semibold
                hover:scale-105
                hover:shadow-xl
                transition-all
              "
            >
              Explore Collection
            </button>

          </div>

          {/* RIGHT */}

          <div className="relative flex justify-center">

            <div className="absolute w-[430px] h-[430px] bg-purple-500/20 rounded-full blur-3xl" />

            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
              alt="Products"
              className="
                w-[430px]
                rounded-[30px]
                shadow-[0_30px_60px_rgba(0,0,0,0.25)]
                relative
                z-10
                hover:scale-105
                transition-all
                duration-500
              "
            />

            {/* FLOATING OFFER */}

            <div
              className="
                absolute
                top-5
                right-5
                z-50
                bg-white/10
                backdrop-blur-xl
                border border-white/10
                text-white
                rounded-3xl
                h-32
                w-32
                flex
                flex-col
                items-center
                justify-center
                font-bold
                shadow-xl
              "
            >
              <span className="text-sm">UP TO</span>
              <span className="text-4xl">50%</span>
              <span className="text-sm">OFF</span>
            </div>

          </div>

        </div>

        {/* BOTTOM FEATURES */}

        <div className="grid md:grid-cols-4 gap-4 mt-12 relative z-10">

          {[
            {
              icon: <ShieldCheck size={18} />,
              text: "100% Secure Payment",
            },
            {
              icon: <RotateCcw size={18} />,
              text: "Easy Returns",
            },
            {
              icon: <Truck size={18} />,
              text: "Fast Delivery",
            },
            {
              icon: <Headphones size={18} />,
              text: "24/7 Support",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
                bg-white/10
                backdrop-blur-xl
                border border-white/10
                rounded-2xl
                px-5
                py-5
                text-white
                flex
                items-center
                justify-center
                gap-3
                font-medium
                hover:bg-white/15
                transition-all
              "
            >
              {item.icon}
              {item.text}
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}