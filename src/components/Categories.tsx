const categories = [
  {
    name: "Smartphones",
    icon: "📱",
  },
  {
    name: "Laptops",
    icon: "💻",
  },
  {
    name: "Headphones",
    icon: "🎧",
  },
  {
    name: "Smart Watches",
    icon: "⌚",
  },
  {
    name: "Gaming",
    icon: "🎮",
  },
  {
    name: "Monitors",
    icon: "🖥️",
  },
  {
    name: "Accessories",
    icon: "🎒",
  },
  {
    name: "Cameras",
    icon: "📷",
  },
];

export default function Categories() {
  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-6
        py-20
        bg-gradient-to-b
        from-white
        via-purple-50/20
        to-white
      "
    >
      {/* Header */}
      <div className="text-center mb-14">

        {/* Badge */}
        <span
          className="
            inline-flex
            px-5
            py-2
            rounded-full
            bg-gradient-to-r
            from-[#4B1E78]
            to-[#6F2DBD]
            text-white
            text-sm
            font-semibold
            shadow-lg
            shadow-purple-200
          "
        >
          Explore Categories
        </span>

        {/* Heading */}
        <h2
          className="
            mt-5
            text-4xl
            md:text-5xl
            font-black
            tracking-tight
            text-[#24103d]
          "
        >
          Shop By Category
        </h2>

        {/* Subtitle */}
        <p
          className="
            text-slate-500
            mt-4
            max-w-xl
            mx-auto
            leading-7
          "
        >
          Browse premium collections across our
          most popular technology and accessory
          categories.
        </p>
      </div>

      {/* Grid */}
      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-7
        "
      >
        {categories.map((category) => (
          <div
            key={category.name}
            className="
              group
              bg-white
              rounded-[28px]
              p-8
              text-center
              border
              border-purple-100
              shadow-[0_8px_25px_rgba(111,45,189,0.06)]
              hover:shadow-[0_15px_35px_rgba(111,45,189,0.12)]
              hover:-translate-y-2
              transition-all
              duration-300
              cursor-pointer
            "
          >
            {/* Icon Container */}
            <div
              className="
                w-20
                h-20
                mx-auto
                mb-5
                rounded-2xl
                flex
                items-center
                justify-center
                bg-gradient-to-r
                from-purple-50
                to-purple-100
                group-hover:scale-110
                transition-all
                duration-300
              "
            >
              <div className="text-4xl">
                {category.icon}
              </div>
            </div>

            {/* Name */}
            <h3
              className="
                font-bold
                text-lg
                text-[#24103d]
              "
            >
              {category.name}
            </h3>

            {/* CTA */}
            <p
              className="
                text-sm
                text-[#6F2DBD]
                mt-3
                font-medium
              "
            >
              Browse Collection →
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}