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
    <section
      className="
        pt-24
        pb-14
        bg-gradient-to-b
        from-white
        via-purple-50/25
        to-white
      "
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-14">

          {/* Badge */}
          <span
            className="
              inline-flex
              items-center
              px-5
              py-2
              rounded-full
              bg-gradient-to-r
              from-[#4B1E78]
              to-[#6F2DBD]
              text-white
              font-semibold
              text-sm
              shadow-lg
              shadow-purple-200
              tracking-wide
            "
          >
            Trusted Nationwide
          </span>

          {/* Heading */}
          <h2 className="mt-7 leading-tight">

            <span
              className="
                block
                text-5xl
                md:text-6xl
                font-black
                tracking-tight
                text-[#24103d]
              "
            >
              Premium Products.
            </span>

            <span
              className="
                block
                mt-2
                text-2xl
                md:text-3xl
                font-bold
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

          {/* Subtitle */}
          <p
            className="
              mt-6
              text-base
              md:text-lg
              text-slate-500
              max-w-3xl
              mx-auto
              leading-8
            "
          >
            Discover premium mobile cases,
            TV remotes and AC remotes trusted
            by thousands of customers with
            fast delivery, quality assurance
            and dedicated support.
          </p>

        </div>

        {/* STATS GRID */}
        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-7
          "
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[30px]
                  bg-white
                  p-8
                  text-center
                  border
                  border-purple-100
                  shadow-[0_10px_30px_rgba(111,45,189,0.08)]
                  hover:shadow-[0_18px_40px_rgba(111,45,189,0.12)]
                  hover:-translate-y-3
                  transition-all
                  duration-300
                "
              >
                {/* Hover Glow */}
                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-300
                    bg-gradient-to-br
                    from-purple-500/5
                    via-fuchsia-500/5
                    to-indigo-500/5
                  "
                />

                {/* Icon */}
                <div
                  className="
                    relative
                    mx-auto
                    w-20
                    h-20
                    flex
                    items-center
                    justify-center
                    rounded-3xl
                    bg-gradient-to-r
                    from-[#4B1E78]
                    to-[#6F2DBD]
                    shadow-lg
                    shadow-purple-200
                    group-hover:scale-110
                    transition-all
                    duration-300
                  "
                >
                  <Icon
                    size={34}
                    className="text-white"
                  />
                </div>

                {/* Value */}
                <h3
                  className="
                    relative
                    mt-6
                    text-5xl
                    font-black
                    text-[#24103d]
                  "
                >
                  {stat.value}
                </h3>

                {/* Label */}
                <p
                  className="
                    relative
                    mt-3
                    text-xl
                    font-bold
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
                    text-sm
                    text-slate-500
                    leading-6
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