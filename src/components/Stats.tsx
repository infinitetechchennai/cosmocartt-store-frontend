import {
  Package,
  Users,
  Award,
  Headphones,
} from "lucide-react";

const stats = [
  {
    value: "5000+",
    label: "Products",
    description: "Premium Accessories",
    icon: Package,
  },
  {
    value: "10000+",
    label: "Happy Customers",
    description: "Trusted Across India",
    icon: Users,
  },
  {
    value: "50+",
    label: "Top Brands",
    description: "Leading Collections",
    icon: Award,
  },
  {
    value: "24/7",
    label: "Customer Support",
    description: "Always Ready To Help",
    icon: Headphones,
  },
];

export default function Stats() {
  return (
    <section className="pt-12 sm:pt-20 pb-8 sm:pb-10 bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden">

      <div className="max-w-7xl mx-auto px-3 sm:px-6">

        {/* Premium Heading */}
        <div className="text-center mb-10">

          <span
            className="
              inline-flex
              items-center
              px-5
              py-2
              rounded-full
              bg-purple-100
              text-[#4B1E78]
              font-bold
              text-sm
              tracking-wide
            "
          >
            TRUSTED NATIONWIDE
          </span>

          <h2 className="mt-6 leading-tight">
  <span className="block text-3xl sm:text-5xl md:text-6xl font-black text-slate-900">
    Premium Products.
  </span>

  <span
    className="
      block
      mt-1
      text-2xl
      md:text-3xl
      font-bold
      tracking-wide
      bg-gradient-to-r
      from-[#4B1E78]
      to-[#A855F7]
      bg-clip-text
      text-transparent
    "
  >
    Trusted Experience.
  </span>
</h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-500 max-w-3xl mx-auto">
            Discover premium mobile cases, TV remotes and AC remotes
            trusted by thousands of customers with fast delivery,
            quality assurance and dedicated support.
          </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[28px]
                  bg-white
                  px-3
                  py-5
                  sm:p-8
                  text-center
                  border
                  border-slate-200
                  shadow-lg
                  hover:shadow-2xl
                  hover:-translate-y-3
                  transition-all
                  duration-300
                "
              >
                {/* Glow */}
                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-300
                    bg-gradient-to-br
                    from-purple-500/10
                    via-fuchsia-500/5
                    to-indigo-500/10
                  "
                />

                {/* Icon */}
                <div
                  className="
                    relative
                    mx-auto
                    w-12
                    h-12
                    sm:w-18
                    sm:h-18
                    flex
                    items-center
                    justify-center
                    rounded-3xl
                    bg-gradient-to-br
                    from-[#4B1E78]
                    to-[#7C3AED]
                    shadow-xl
                    group-hover:scale-110
                    transition-all
                    duration-300
                  "
                >
                  <Icon
                    size={26}
                    className="text-white"
                  />
                </div>

                {/* Number */}
                <h3
                  className="
                    relative
                    mt-4
                    sm:mt-6
                    text-2xl
                    sm:text-5xl
                    font-black
                    text-slate-900
                  "
                >
                  {stat.value}
                </h3>

                {/* Label */}
                <p
                  className="
                    relative
                    mt-2
                    text-sm
                    sm:text-xl
                    font-bold
                    break-words
                    text-[#4B1E78]
                  "
                >
                  {stat.label}
                </p>

                {/* Description */}
                <p
                  className="
                    relative
                    mt-3
                    text-xs
                    sm:text-sm
                    text-slate-500
                    leading-snug
                  "
                >
                  {stat.description}
                </p>

                {/* Bottom Accent */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    h-1
                    bg-gradient-to-r
                    from-[#4B1E78]
                    via-[#7C3AED]
                    to-[#A855F7]
                    scale-x-0
                    group-hover:scale-x-100
                    transition-transform
                    duration-300
                  "
                />
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}