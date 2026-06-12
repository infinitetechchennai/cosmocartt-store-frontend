export default function QuickLinks() {

    const links = [
        "Top Offers",
        "New Arrivals",
        "Best Sellers",
        "Premium Brands",
        "Gaming Zone",
        "Clearance Sale"
    ];

    return (

        <div className="bg-slate-50 border-b">

            <div className="max-w-7xl mx-auto px-6">

                <div className="flex gap-10 h-12 items-center overflow-x-auto whitespace-nowrap">

                    {links.map((item) => (

                        <button
                            key={item}
                            className="
text-sm
font-semibold
text-slate-600
hover:text-[#4B1E78]
transition
"
                        >
                            {item}
                        </button>

                    ))}

                </div>

            </div>

        </div>

    );
}