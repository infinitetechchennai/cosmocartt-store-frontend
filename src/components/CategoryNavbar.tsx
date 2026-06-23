import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { categories } from "../data/categories";

const navItems = [
  { title: "Audio", source: "Audio" },
  { title: "Gaming", source: "Gaming" },
  { title: "Computers", source: "Laptops & Desktops" },
  { title: "Mobile", source: "Mobile Accessories" },
  { title: "Accessories", source: "Laptop Accessories" },
  { title: "Storage", source: "Storage" },
];

const getSubcategoryLink = (
  categoryName: string,
  sub: string
) => {
  const name = sub.toLowerCase();

  if (
    categoryName === "Mobile Accessories" &&
    (name.includes("case") ||
      name.includes("cover") ||
      name.includes("backcase"))
  ) {
    return "/backcase-brands";
  }

  return `/products?category=${encodeURIComponent(
    categoryName
  )}&subcategory=${encodeURIComponent(
    sub
  )}`;
};

export default function CategoryNavbar() {
  return (
    <div
      className="
        bg-white/95
        backdrop-blur-md
        border-b
        border-purple-100
        shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto px-6">

        <div
          className="
            flex
            items-center
            gap-10
            h-16
          "
        >
          {/* ALL CATEGORIES */}
          <div className="relative group">

            <button
              className="
                flex
                items-center
                gap-3
                bg-gradient-to-r
                from-[#4B1E78]
                to-[#6F2DBD]
                text-white
                px-8
                min-w-[210px]
                h-12
                rounded-2xl
                font-semibold
                shadow-lg
                shadow-purple-200
                hover:scale-[1.02]
                transition-all
                duration-300
                whitespace-nowrap
              "
            >
              <Menu size={18} />

              All Categories

              <ChevronDown size={16} />
            </button>

            {/* Mega Menu */}
            <div
              className="
                absolute
                top-full
                left-0
                mt-2
                w-[1050px]
                bg-white
                rounded-[28px]
                shadow-[0_20px_50px_rgba(111,45,189,0.12)]
                border
                border-purple-100
                p-8
                grid
                grid-cols-4
                gap-8
                z-50

                opacity-0
                invisible
                translate-y-2
                pointer-events-none

                group-hover:opacity-100
                group-hover:visible
                group-hover:translate-y-0
                group-hover:pointer-events-auto

                transition-all
                duration-300
                ease-out
              "
            >
              {categories.map(
                (category) => (
                  <div
                    key={category.name}
                  >
                    <h3
                      className="
                        font-bold
                        text-[#4B1E78]
                        mb-4
                        text-sm
                        uppercase
                        tracking-wide
                      "
                    >
                      {category.name}
                    </h3>

                    <div className="space-y-3">
                      {category.subcategories
                        .slice(0, 5)
                        .map((sub) => (
                          <Link
                            key={sub}
                            to={getSubcategoryLink(
                              category.name,
                              sub
                            )}
                            className="
                              block
                              text-sm
                              text-slate-600
                              hover:text-[#6F2DBD]
                              hover:translate-x-1
                              transition-all
                            "
                          >
                            {sub}
                          </Link>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* NAV ITEMS */}
          <div
            className="
              flex
              items-center
              gap-10
            "
          >
            {navItems.map((item) => {
              const category =
                categories.find(
                  (c) =>
                    c.name ===
                    item.source
                );

              if (!category)
                return null;

              return (
                <div
                  key={item.title}
                  className="relative group"
                >
                  <button
                    className="
                      flex
                      items-center
                      gap-1
                      font-medium
                      text-slate-700
                      hover:text-[#4B1E78]
                      transition-all
                      duration-300
                    "
                  >
                    {item.title}

                    <ChevronDown
                      size={14}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className="
                      absolute
                      top-full
                      left-0
                      mt-3
                      w-72
                      bg-white
                      rounded-2xl
                      shadow-[0_15px_40px_rgba(111,45,189,0.08)]
                      border
                      border-purple-100
                      p-5

                      opacity-0
                      invisible

                      group-hover:opacity-100
                      group-hover:visible

                      transition-all
                      duration-200
                      z-50
                    "
                  >
                    <div className="space-y-3">
                      {category.subcategories.map(
                        (sub) => (
                          <Link
                            key={sub}
                            to={getSubcategoryLink(
                              category.name,
                              sub
                            )}
                            className="
                              block
                              text-sm
                              text-slate-600
                              hover:text-[#4B1E78]
                              hover:translate-x-1
                              transition-all
                            "
                          >
                            {sub}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* MORE */}
            <div className="relative group">
              <button
                className="
                  flex
                  items-center
                  gap-1
                  font-medium
                  text-slate-700
                  hover:text-[#4B1E78]
                  transition-all
                "
              >
                More

                <ChevronDown size={14} />
              </button>

              <div
                className="
                  absolute
                  top-full
                  right-0
                  mt-3
                  w-72
                  bg-white
                  rounded-2xl
                  shadow-[0_15px_40px_rgba(111,45,189,0.08)]
                  border
                  border-purple-100
                  p-5

                  opacity-0
                  invisible

                  group-hover:opacity-100
                  group-hover:visible

                  transition-all
                  duration-200
                  z-50
                "
              >
                <div className="space-y-3">
                  {[
                    "Cameras & Accessories",
                    "Health & Personal Care",
                    "Smart Home Automation",
                    "Wearables",
                    "Tablets",
                  ].map((item) => (
                    <Link
                      key={item}
                      to="/products"
                      className="
                        block
                        text-sm
                        text-slate-600
                        hover:text-[#4B1E78]
                        hover:translate-x-1
                        transition-all
                      "
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}