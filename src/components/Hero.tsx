import { Link } from "react-router-dom";
export default function Hero() {
    return (
        <section className="bg-gradient-to-r from-[#4B1E78] via-[#5B2392] to-[#6F2DBD] text-white">

            <div className="max-w-7xl mx-auto px-6 py-24">

                <div className="max-w-2xl">

                    <p className="uppercase tracking-widest text-sm opacity-80 mb-3">
                        Welcome To CosmoCart
          </p>

                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">

                        Discover Amazing
            <br />
            Products Everyday

          </h1>

                    <p className="mt-6 text-lg opacity-90">

                        Shop premium quality products,
                        latest collections and unbeatable deals
                        all in one place.

          </p>

                    <div className="mt-8 flex gap-4">

                        <Link
                            to="/products"
                            className="inline-block bg-white text-[#4B1E78] px-8 py-3 rounded-xl font-semibold"
                        >
                            Shop Now
</Link>

                        <button className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#4B1E78] transition">
                            Explore
            </button>

                    </div>

                </div>

            </div>

        </section>
    );
}