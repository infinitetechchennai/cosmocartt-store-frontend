export default function PremiumBanner() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-10">

            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#14052d] via-[#2B1055] to-[#6F2DBD] px-10 py-12 shadow-2xl">

                <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"></div>

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl"></div>

                <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">

                    <div>

                        <div className="inline-flex bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
                            ✨ Premium Quality Products
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-white mt-6 leading-tight">
                            Discover Amazing
                            <span className="block bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                                Products
                            </span>
                        </h1>

                        <p className="text-purple-100 mt-5 text-lg">
                            Explore premium gadgets, fashion,
                            electronics and lifestyle products
                            from top brands at unbeatable prices.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                            <div className="bg-white/10 p-4 rounded-2xl text-white">
                                <p className="text-sm">Products</p>
                                <h3 className="text-2xl font-bold">500+</h3>
                            </div>

                            <div className="bg-white/10 p-4 rounded-2xl text-white">
                                <p className="text-sm">Brands</p>
                                <h3 className="text-2xl font-bold">50+</h3>
                            </div>

                            <div className="bg-white/10 p-4 rounded-2xl text-white">
                                <p className="text-sm">Customers</p>
                                <h3 className="text-2xl font-bold">10K+</h3>
                            </div>

                            <div className="bg-white/10 p-4 rounded-2xl text-white">
                                <p className="text-sm">Rating</p>
                                <h3 className="text-2xl font-bold">4.9★</h3>
                            </div>

                        </div>

                    </div>

                    <div className="relative flex justify-center">

                        <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>

                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                            alt="Products"
                            className="relative z-10 w-[420px] rounded-3xl shadow-2xl"
                        />

                        <div className="absolute top-10 right-0 bg-pink-500 text-white rounded-full h-28 w-28 flex flex-col items-center justify-center font-bold shadow-2xl">
                            <span>UP TO</span>
                            <span className="text-3xl">50%</span>
                            <span>OFF</span>
                        </div>

                    </div>

                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-10 relative z-10">

                    <div className="bg-white/10 p-4 rounded-2xl text-center text-white">
                        🔒 100% Secure
                    </div>

                    <div className="bg-white/10 p-4 rounded-2xl text-center text-white">
                        ↩ Easy Returns
                    </div>

                    <div className="bg-white/10 p-4 rounded-2xl text-center text-white">
                        🚚 Free Delivery
                    </div>

                    <div className="bg-white/10 p-4 rounded-2xl text-center text-white">
                        🎧 24/7 Support
                    </div>

                </div>

            </div>

        </section>
    );
}