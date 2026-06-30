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
    <section className="pt-6 pb-20 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-100 text-red-600 text-sm font-black">
              <Flame size={16} />
              LIMITED TIME DEALS
            </span>

            <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900">
              Today’s Top Offers
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl">
              Grab premium electronics, accessories and latest gadgets at special prices before the offers expire.
            </p>
          </div>

          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-full
              bg-slate-900
              text-white
              font-bold
              hover:bg-[#4B1E78]
              hover:gap-4
              transition-all
              w-fit
            "
          >
            View All Deals
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {deals.map((deal) => (
            <Link
              key={deal.title}
              to="/products"
              className="
                group
                relative
                overflow-hidden
                rounded-[34px]
                h-[360px]
                shadow-[0_18px_45px_rgba(15,23,42,0.15)]
                hover:shadow-[0_28px_70px_rgba(75,30,120,0.28)]
                hover:-translate-y-2
                transition-all
                duration-500
              "
            >
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

              <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1055]/80 via-transparent to-transparent opacity-80" />

              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <span className="bg-white text-red-500 px-4 py-2 rounded-full text-xs font-black shadow-lg">
                  {deal.discount}
                </span>

                <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-md text-white px-3 py-2 rounded-full text-xs font-bold">
                  <Clock size={14} />
                  {deal.tag}
                </span>
              </div>

              <div className="relative z-10 h-full p-7 flex flex-col justify-end text-white">
                <h3 className="text-3xl md:text-4xl font-black">
                  {deal.title}
                </h3>

                <p className="text-white/85 mt-3 leading-relaxed">
                  {deal.subtitle}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 bg-white text-[#4B1E78] px-5 py-3 rounded-2xl font-black w-fit group-hover:gap-4 transition-all">
                  Shop Now
                  <ArrowRight size={18} />
                </div>
              </div>

              <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-white/20 rounded-full blur-3xl group-hover:bg-purple-400/30 transition-all" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}