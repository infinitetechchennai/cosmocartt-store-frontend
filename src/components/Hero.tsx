import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="bg-gradient-to-r from-[#2B1055] via-[#4B1E78] to-[#6F2DBD] text-white">

            <div className="max-w-7xl mx-auto px-6 py-24 text-center">

                <div>

                    {/* Left Content */}

                    <div>
                        

                        <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                            India's Trusted Electronics Marketplace
                        </span>

                        <h1 className="text-6xl md:text-7xl font-black tracking-tight mt-6 leading-tight">

    Your Next
    <span className="block text-yellow-300">
        Tech Upgrade
    </span>

    Starts Here

</h1>

                        <p className="mt-6 text-lg text-gray-200 max-w-xl">

                            Smartphones, Laptops, Gaming,
                            Audio, Cameras, Smart Home Devices
                            and thousands of electronics from
                            top brands.

                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">

                            <Link
                                to="/products"
                                className="bg-white text-[#4B1E78] px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
                            >
                                Shop Now
                            </Link>

                            <button
                                className="border border-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-[#4B1E78] transition"
                            >
                                Explore Categories
                            </button>

                        </div>

                        {/* Stats */}

                        <div className="flex gap-10 mt-12">

                            <div>
                                <h3 className="text-3xl font-bold">
                                    10K+
                                </h3>
                                <p className="text-sm text-gray-200">
                                    Products
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold">
                                    500+
                                </h3>
                                <p className="text-sm text-gray-200">
                                    Brands
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold">
                                    50K+
                                </h3>
                                <p className="text-sm text-gray-200">
                                    Customers
                                </p>
                            </div>

                        </div>

                    </div>

                    
                </div>

            </div>

        </section>
    );
}