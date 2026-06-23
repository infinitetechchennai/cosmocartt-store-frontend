import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import mobileBanner from "../assets/mobile-category.jpg";
import tvBanner from "../assets/tv-category.jpg";
import acBanner from "../assets/ac-category.jpg";

export default function CategoryShowcase() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="text-center mb-16">

          <span
            className="
              inline-flex
              px-5
              py-2
              rounded-full
              bg-purple-50
              border
              border-purple-100
              text-[#4B1E78]
              text-sm
              font-semibold
            "
          >
            SHOP BY CATEGORY
          </span>

          <h2
            className="
              mt-5
              text-5xl
              font-black
              tracking-tight
              text-slate-900
            "
          >
            Explore Collections
          </h2>

          <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Premium mobile cases, smart remotes and essential accessories
            designed for convenience and everyday performance.
          </p>

        </div>

        {/* GRID */}

        <div className="grid lg:grid-cols-3 gap-7">

          {/* LARGE CARD */}

          <Link
            to="/backcase-brands"
            className="
              lg:col-span-2
              relative
              h-[500px]
              overflow-hidden
              rounded-[40px]
              group
              border
              border-slate-200
              shadow-[0_20px_60px_rgba(15,23,42,0.06)]
              hover:-translate-y-2
              hover:shadow-[0_25px_70px_rgba(75,30,120,0.12)]
              transition-all
              duration-500
            "
          >

            <img
              src={mobileBanner}
              alt="Mobile Cases"
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

            {/* OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-r from-[#15052b]/95 via-[#2B1055]/75 to-transparent" />

            <div className="relative z-10 h-full p-10 flex flex-col justify-between text-white">

              <div>

                <span
                  className="
                    inline-flex
                    px-4
                    py-2
                    rounded-full
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    text-sm
                  "
                >
                  Premium Collection
                </span>

                <h3 className="mt-5 text-6xl font-black tracking-tight">
                  Mobile Cases
                </h3>

                <p className="mt-4 max-w-md text-white/80 text-lg">
                  Premium protection, sleek finishes and
                  perfect fit for your favorite devices.
                </p>

              </div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-6
                  py-4
                  rounded-2xl
                  bg-white
                  text-[#4B1E78]
                  font-semibold
                  w-fit
                  group-hover:gap-4
                  transition-all
                "
              >
                Browse Collection
                <ArrowRight size={18} />
              </div>

            </div>

          </Link>

          {/* RIGHT COLUMN */}

          <div className="flex flex-col gap-7">

            {/* TV */}

            <CategoryCard
              image={tvBanner}
              title="TV Remotes"
              subtitle="Universal & Smart Controls"
              gradient="from-blue-950/90 to-blue-500/50"
            />

            {/* AC */}

            <CategoryCard
              image={acBanner}
              title="AC Remotes"
              subtitle="Smart Climate Control"
              gradient="from-emerald-950/90 to-emerald-500/50"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

/* CARD */

function CategoryCard({
  image,
  title,
  subtitle,
  gradient,
}: {
  image: string;
  title: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Link
      to="/products"
      className="
        relative
        h-[236px]
        overflow-hidden
        rounded-[32px]
        group
        border
        border-slate-200
        shadow-[0_15px_40px_rgba(15,23,42,0.05)]
        hover:-translate-y-1
        hover:shadow-[0_20px_45px_rgba(75,30,120,0.10)]
        transition-all
        duration-500
      "
    >

      <img
        src={image}
        alt={title}
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

      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient}`}
      />

      <div className="relative z-10 h-full p-7 flex flex-col justify-between text-white">

        <div>

          <h3 className="text-3xl font-black tracking-tight">
            {title}
          </h3>

          <p className="mt-2 text-white/75 text-sm">
            {subtitle}
          </p>

        </div>

        <div
          className="
            inline-flex
            items-center
            gap-2
            font-medium
            text-white
            group-hover:gap-3
            transition-all
          "
        >
          Explore
          <ArrowRight size={16} />
        </div>

      </div>

    </Link>
  );
}