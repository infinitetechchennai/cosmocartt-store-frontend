import { Link } from "react-router-dom";

import mobileBanner from "../assets/mobile-category.jpg";
import tvBanner from "../assets/tv-category.jpg";
import acBanner from "../assets/ac-category.jpg";

export default function CategoryShowcase() {
  return (
    <section className="pt-20 pb-0 bg-gradient-to-b from-white via-slate-50 to-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-12">

          <span className="inline-block px-5 py-2 rounded-full bg-purple-100 text-[#4B1E78] text-sm font-bold">
            SHOP BY CATEGORY
          </span>

          <h2 className="text-4xl md:text-5xl font-black mt-5 text-slate-900">
            Explore Our Collections
          </h2>

          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Discover premium mobile cases, TV remotes and AC remotes designed
            for style, convenience and everyday use.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* MOBILE CASES - BIG CARD */}

          <Link
            to="/backcase-brands"
            className="
              lg:col-span-2
              relative
              h-[450px]
              rounded-[32px]
              overflow-hidden
              group
              shadow-xl
              hover:shadow-2xl
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

            <div className="absolute inset-0 bg-gradient-to-r from-[#2B1055]/95 to-[#7C3AED]/50" />

            <div className="relative z-10 h-full p-10 flex flex-col justify-between text-white">

              <div>
                <p className="text-sm font-bold tracking-widest opacity-80">
                  
                </p>

                <h3 className="text-5xl md:text-6xl font-black mt-3">
                  Mobile Cases
                </h3>

                <p className="mt-4 text-white/90 max-w-md">
                  Premium protection, stylish designs and perfect fit for your favorite devices.
                </p>
              </div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white
                  text-[#4B1E78]
                  px-6
                  py-4
                  rounded-2xl
                  font-bold
                  w-fit
                  group-hover:gap-4
                  transition-all
                "
              >
                Browse Cases →
              </div>

            </div>

          </Link>

          {/* RIGHT SIDE */}

          <div className="flex flex-col gap-6">

            {/* TV REMOTE */}

            <Link
              to="/products"
              className="
                relative
                h-[212px]
                rounded-[28px]
                overflow-hidden
                group
                shadow-xl
                hover:shadow-2xl
                transition-all
                duration-500
              "
            >
              <img
                src={tvBanner}
                alt="TV Remotes"
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

              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 to-blue-500/60" />

              <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">

                <div>
                  <h3 className="text-4xl font-black">
                    TV Remotes
                  </h3>

                  <p className="text-sm mt-2 text-white/80">
                    Universal & Smart Controls
                  </p>
                </div>

                <span className="font-bold">
                  Explore →
                </span>

              </div>

            </Link>

            {/* AC REMOTE */}

            <Link
              to="/products"
              className="
                relative
                h-[212px]
                rounded-[28px]
                overflow-hidden
                group
                shadow-xl
                hover:shadow-2xl
                transition-all
                duration-500
              "
            >
              <img
                src={acBanner}
                alt="AC Remotes"
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

              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 to-emerald-500/60" />

              <div className="relative z-10 h-full p-6 flex flex-col justify-between text-white">

                <div>
                  <h3 className="text-3xl font-black">
                    AC Remotes
                  </h3>

                  <p className="text-sm mt-2 text-white/80">
                    Smart Climate Control
                  </p>
                </div>

                <span className="font-bold">
                  Explore →
                </span>

              </div>

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}