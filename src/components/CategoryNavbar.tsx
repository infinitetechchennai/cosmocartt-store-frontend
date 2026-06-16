import { Link } from "react-router-dom";
import {
    Menu,
    ChevronDown
} from "lucide-react";

import { categories } from "../data/categories";

const navItems = [
    {
        title: "Audio",
        source: "Audio"
    },
    {
        title: "Gaming",
        source: "Gaming"
    },
    {
        title: "Computers",
        source: "Laptops & Desktops"
    },
    {
        title: "Mobile",
        source: "Mobile Accessories"
    },
    {
        title: "Accessories",
        source: "Laptop Accessories"
    },
    {
        title: "Storage",
        source: "Storage"
    }
];

export default function CategoryNavbar() {

    return (

        <div className="bg-white border-b border-slate-200">

            <div className="max-w-7xl mx-auto px-6">

                <div className="flex items-center gap-8 h-14">

                   {/* ALL CATEGORIES */}

<div className="relative group">

    <button
        className="
        flex items-center gap-2
        bg-[#4B1E78]
        text-white
        px-8
        min-w-[190px]
        h-11
        rounded-xl
        font-semibold
        whitespace-nowrap
        "
    >
        <Menu size={18} />
        All Categories
        <ChevronDown size={16} />
    </button>

    <div className="fixed inset-0 bg-black/60 hidden group-hover:block z-40"></div>

    <div
        className="
        absolute
        top-full
        left-0
        mt-0
        w-[760px]
        h-[560px]
        bg-[#151515]
        text-white
        hidden
        group-hover:flex
        z-50
        shadow-2xl
        "
    >
        <div className="relative w-[360px] bg-[#222222]">

            <div className="px-5 py-4 border-b border-white/20 font-bold">
                Shop by Category
            </div>

            {categories.map((category) => (
               <div
    key={category.name}
    className="group/item"
>
                    <Link
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        className="
                        flex
                        items-center
                        justify-between
                        px-5
                        py-3.5
                        text-sm
                        font-semibold
                        hover:bg-[#12D6B0]
                        hover:text-black
                        transition
                        "
                    >
                        <span>{category.name}</span>
                        <ChevronDown size={15} className="-rotate-90" />
                    </Link>

                    <div
    className="
    absolute
    top-0
    left-full
                        w-[400px]
                        h-[560px]
                        bg-[#151515]
                        border-l-4
                        border-[#12D6B0]
                        p-6
                        hidden
                        group-hover/item:block
                        "
                    >
                        <div className="space-y-4">
                            {category.subcategories.map((sub) => (
                                <Link
                                    key={sub}
                                    to={`/products?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                                    className="
                                    flex
                                    items-center
                                    justify-between
                                    text-sm
                                    font-medium
                                    text-gray-200
                                    hover:text-[#12D6B0]
                                    transition
                                    "
                                >
                                    <span>{sub}</span>
                                    <ChevronDown size={14} className="-rotate-90" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

        </div>

        <div className="w-[400px] bg-[#151515] p-6 border-l-4 border-[#12D6B0]">
            <p className="text-gray-400 text-sm">
                Hover category to see subcategories
            </p>
        </div>

    </div>

</div>

                                           {/* NAVIGATION */}
                    <div className="flex items-center gap-10">

                        {navItems.map((item) => {

                            const category = categories.find(
                                (c) => c.name === item.source
                            );

                            if (!category) return null;

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
                                        hover:text-[#4B1E78]
                                        transition
                                    "
                                    >
                                        {item.title}

                                        <ChevronDown size={14} />
                                    </button>

                                    <div
                                        className="
                                        absolute
                                        top-full
                                        left-0
                                        mt-3
                                        w-72
                                        bg-white
                                        rounded-2xl
                                        shadow-xl
                                        border
                                        border-slate-200
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

                                        <div className="space-y-2">

                                            {category.subcategories.map(
                                                (sub) => (

                                                    <Link
                                                        key={sub}
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

                        <div className="relative">

                            <button
                                className="
                                flex
                                items-center
                                gap-1
                                font-medium
                                hover:text-[#4B1E78]
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
                                shadow-xl
                                border
                                border-slate-200
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

                                <div className="space-y-2">

                                    <Link
                                        to="/products"
                                        className="block hover:text-[#4B1E78]"
                                    >
                                        Cameras & Accessories
                                    </Link>

                                    <Link
                                        to="/products"
                                        className="block hover:text-[#4B1E78]"
                                    >
                                        Health & Personal Care
                                    </Link>

                                    <Link
                                        to="/products"
                                        className="block hover:text-[#4B1E78]"
                                    >
                                        Smart Home Automation
                                    </Link>

                                    <Link
                                        to="/products"
                                        className="block hover:text-[#4B1E78]"
                                    >
                                        Wearables
                                    </Link>

                                    <Link
                                        to="/products"
                                        className="block hover:text-[#4B1E78]"
                                    >
                                        Tablets
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}