import { Link } from "react-router-dom";
import { ArrowRight, Flame, Clock } from "lucide-react";

const deals = [
  {
    title: "Gaming Zone",
    subtitle: "RTX laptops, keyboards and pro gaming accessories.",
    discount: "UP TO 50% OFF",
    tag: "Best Deal",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575",
  },
  {
    title: "Premium Audio",
    subtitle: "Headphones, speakers and wireless audio gear.",
    discount: "STARTING ₹999",
    tag: "Hot Pick",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  },
  {
    title: "Smartphones",
    subtitle: "Latest flagship devices with exchange offers.",
    discount: "EXCHANGE BONUS",
    tag: "Trending",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
];

export default function TopDeals() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">

          <div>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 text-[#4B1E78] text-sm font-semibold">
              <Flame size={16} />
              Exclusive Deals
            </span>

            <h2 className="mt-5 text-5xl font-black tracking-tight text-slate-900">
              Today’s Top Offers
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl text-lg leading-relaxed">
              Premium gadgets and electronics curated with exclusive offers for a limited time.
            </p>
          </div>

          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              px-7
              py-4
              rounded-2xl
              bg-[#4B1E78]
              text-white
              font-semibold
              hover:shadow-xl
              hover:scale-105
              transition-all
            "
          >
            View All Deals
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* CARDS */}

        <div className="grid lg:grid-cols-3 gap-8">

          {deals.map((deal) => (
            <Link
              key={deal.title}
              to="/products"
              className="
                group
                relative
                overflow-hidden
                rounded-[32px]
                h-[420px]
                border
                border-white/30
                bg-white/40
                backdrop-blur-xl
                shadow-[0_15px_40px_rgba(15,23,42,0.08)]
                hover:-translate-y-2
                hover:shadow-[0_25px_60px_rgba(75,30,120,0.18)]
                transition-all
                duration-500
              "
            >

              {/* IMAGE */}

              <img
                src={deal.image}
                alt={deal.title}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-110
                  transition-transform
                  duration-700
                "
              />

              {/* PREMIUM OVERLAY */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* TOP BADGES */}

              <div className="absolute top-6 left-6 right-6 flex justify-between">

                <span className="
                  px-4 py-2
                  rounded-full
                  bg-white/80
                  backdrop-blur-xl
                  text-[#4B1E78]
                  text-xs
                  font-bold
                ">
                  {deal.discount}
                </span>

                <span className="
                  inline-flex
                  items-center
                  gap-1
                  px-4
                  py-2
                  rounded-full
                  bg-black/20
                  backdrop-blur-xl
                  text-white
                  text-xs
                  font-semibold
                ">
                  <Clock size={13} />
                  {deal.tag}
                </span>

              </div>

              {/* CONTENT */}

              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">

                <h3 className="text-4xl font-black tracking-tight">
                  {deal.title}
                </h3>

                <p className="mt-3 text-white/80 leading-relaxed">
                  {deal.subtitle}
                </p>

                <div
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-2xl
                    bg-white/90
                    text-[#4B1E78]
                    font-semibold
                    w-fit
                    group-hover:gap-4
                    transition-all
                  "
                >
                  Shop Now
                  <ArrowRight size={18} />
                </div>

              </div>

              {/* GLOW EFFECT */}

              <div className="
                absolute
                -bottom-20
                -right-20
                w-56
                h-56
                rounded-full
                bg-purple-400/20
                blur-3xl
                group-hover:bg-purple-400/30
                transition-all
              " />

            </Link>
          ))}

        </div>

      </div>
    </section>
  );
}