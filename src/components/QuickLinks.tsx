export default function QuickLinks() {
  const links = [
    "Top Offers",
    "New Arrivals",
    "Best Sellers",
    "Premium Brands",
    "Gaming Zone",
    "Clearance Sale",
  ];

  return (
    <section className="bg-white border-b border-slate-100 py-4">

      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
            flex
            gap-4
            overflow-x-auto
            whitespace-nowrap
            scrollbar-hide
          "
        >
          {links.map((item) => (
            <button
              key={item}
              className="
                group
                px-5
                py-3
                rounded-2xl
                bg-slate-50
                border
                border-slate-200
                text-sm
                font-semibold
                text-slate-700
                transition-all
                duration-300
                hover:bg-[#4B1E78]
                hover:text-white
                hover:border-[#4B1E78]
                hover:shadow-lg
                hover:scale-105
                active:scale-100
              "
            >
              <span className="transition-all group-hover:tracking-wide">
                {item}
              </span>
            </button>
          ))}
        </div>

      </div>

    </section>
  );
}