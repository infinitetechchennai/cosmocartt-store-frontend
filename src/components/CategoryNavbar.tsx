import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useCatalog } from "../context/CatalogContext";

const encode = (value: string) => encodeURIComponent(value);

const getSubcategoryLink = (categoryName: string, subcategoryName: string) => {
  return `/catalog/${encode(categoryName)}/${encode(subcategoryName)}`;
};

export default function CategoryNavbar() {
  const { catalog } = useCatalog();

  const navItems = catalog.slice(0, 6);
  const moreItems = catalog.slice(6);

  if (catalog.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 h-14">
          <div className="relative group">
            <Link
              to="/catalog"
              className="flex items-center gap-2 bg-[#4B1E78] text-white px-8 min-w-[190px] h-11 rounded-xl font-semibold whitespace-nowrap"
            >
              <Menu size={18} />
              All Categories
              <ChevronDown size={16} />
            </Link>

            <div className="absolute top-full left-0 mt-0 w-[1000px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 grid grid-cols-4 gap-8 z-50 opacity-0 invisible translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out">
              {catalog.slice(0, 12).map((category) => (
                <div key={category.name}>
                  <Link
                    to={`/catalog/${encode(category.name)}`}
                    className="font-bold text-[#4B1E78] mb-4 block hover:underline"
                  >
                    {category.name}
                  </Link>

                  <div className="space-y-2">
                    {category.subcategories.slice(0, 5).map((sub) => (
                      <Link
                        key={sub.name}
                        to={getSubcategoryLink(category.name, sub.name)}
                        className="block text-sm text-slate-600 hover:text-[#4B1E78] transition"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-10">
            {navItems.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  to={`/catalog/${encode(category.name)}`}
                  className="flex items-center gap-1 font-medium hover:text-[#4B1E78] transition"
                >
                  {category.name}
                  <ChevronDown size={14} />
                </Link>

                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={getSubcategoryLink(category.name, sub.name)}
                        className="block text-sm text-slate-600 hover:text-[#4B1E78] hover:translate-x-1 transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {moreItems.length > 0 && (
              <div className="relative group">
                <button className="flex items-center gap-1 font-medium hover:text-[#4B1E78]">
                  More
                  <ChevronDown size={14} />
                </button>

                <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="space-y-2">
                    {moreItems.map((item) => (
                      <Link
                        key={item.name}
                        to={`/catalog/${encode(item.name)}`}
                        className="block hover:text-[#4B1E78]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
