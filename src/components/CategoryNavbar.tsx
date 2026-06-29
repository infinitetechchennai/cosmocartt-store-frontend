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

const getSubcategoryLink = (categoryName: string, sub: string) => {
  const name = sub.toLowerCase();

  if (
    categoryName === "Mobile Accessories" &&
    (name.includes("case") || name.includes("cover") || name.includes("backcase"))
  ) {
    return "/backcase-brands";
  }

  return `/products?category=${encodeURIComponent(
    categoryName
  )}&subcategory=${encodeURIComponent(sub)}`;
};

export default function CategoryNavbar() {
  return (
    <div className="hidden lg:block bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 h-14">

          <div className="relative group">
            <button className="flex items-center gap-2 bg-[#4B1E78] text-white px-8 min-w-[190px] h-11 rounded-xl font-semibold whitespace-nowrap">
              <Menu size={18} />
              All Categories
              <ChevronDown size={16} />
            </button>

            <div
  className="
    absolute
    top-full
    left-0
    mt-0
    w-[1000px]
    bg-white
    rounded-3xl
    shadow-2xl
    border
    border-slate-200
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
              {categories.map((category) => (
                <div key={category.name}>
                  <h3 className="font-bold text-[#4B1E78] mb-4">
                    {category.name}
                  </h3>

                  <div className="space-y-2">
                    {category.subcategories.slice(0, 5).map((sub) => (
                      <Link
                        key={sub}
                        to={getSubcategoryLink(category.name, sub)}
                        className="block text-sm text-slate-600 hover:text-[#4B1E78] transition"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-10">
            {navItems.map((item) => {
              const category = categories.find(
                (c) => c.name === item.source
              );

              if (!category) return null;

              return (
                <div key={item.title} className="relative group">
                  <button className="flex items-center gap-1 font-medium hover:text-[#4B1E78] transition">
                    {item.title}
                    <ChevronDown size={14} />
                  </button>

                  <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={getSubcategoryLink(category.name, sub)}
                          className="block text-sm text-slate-600 hover:text-[#4B1E78] hover:translate-x-1 transition-all"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="relative group">
              <button className="flex items-center gap-1 font-medium hover:text-[#4B1E78]">
                More
                <ChevronDown size={14} />
              </button>

              <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="space-y-2">
                  {[
                    "Cameras & Accessories",
                    "Health & Personal Care",
                    "Smart Home Automation",
                    "Wearables",
                    "Tablets",
                  ].map((item) => (
                    <Link
                      key={item}
                      to={`/products?category=${encodeURIComponent(item)}`}
                      className="block hover:text-[#4B1E78]"
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