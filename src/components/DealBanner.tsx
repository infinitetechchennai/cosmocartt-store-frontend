import { Link } from "react-router-dom";

export default function DealBanner() {

    return (

        <section className="max-w-7xl mx-auto px-6 py-16">

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-[40px]
                    bg-gradient-to-r
                    from-[#2B1055]
                    via-[#4B1E78]
                    to-[#6F2DBD]
                    min-h-[420px]
                    shadow-2xl
                "
            >

                {/* Glow Effect */}

                <div
                    className="
                        absolute
                        -right-20
                        -top-20
                        w-96
                        h-96
                        rounded-full
                        bg-white/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        left-10
                        bottom-10
                        w-60
                        h-60
                        rounded-full
                        bg-purple-300/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative
                        z-10
                        grid
                        lg:grid-cols-2
                        items-center
                        h-full
                    "
                >

                    {/* LEFT */}

                    <div className="p-12 lg:p-16 text-white">

                        <span
                            className="
                                bg-red-500
                                px-4
                                py-2
                                rounded-full
                                text-sm
                                font-bold
                            "
                        >
                            LIMITED TIME OFFER
                        </span>

                        <h2
                            className="
                                text-5xl
                                lg:text-6xl
                                font-black
                                mt-6
                                leading-tight
                            "
                        >
                            Up To
                            <br />
                            70% OFF
                        </h2>

                        <p className="mt-5 text-xl text-purple-100">

                            Gaming PCs,
                            Smartphones,
                            Audio Devices
                            and Accessories

                        </p>

                        <div className="flex gap-4 mt-8">

                            <Link
                                to="/products"
                                className="
                                    bg-white
                                    text-[#4B1E78]
                                    px-7
                                    py-4
                                    rounded-2xl
                                    font-bold
                                    hover:scale-105
                                    transition
                                "
                            >
                                Shop Deals
                            </Link>

                            <Link
                                to="/products"
                                className="
                                    border
                                    border-white/30
                                    bg-white/10
                                    backdrop-blur-md
                                    px-7
                                    py-4
                                    rounded-2xl
                                    font-semibold
                                "
                            >
                                Explore Offers
                            </Link>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div
                        className="
                            hidden
                            lg:flex
                            items-center
                            justify-center
                            h-full
                        "
                    >

                        <div
                            className="
                                bg-white/10
                                backdrop-blur-xl
                                rounded-[40px]
                                p-10
                                border
                                border-white/20
                            "
                        >

                            <div className="text-center text-white">

                                <p className="text-purple-200">
                                    SALE ENDS SOON
                                </p>

                                <h3 className="text-6xl font-black mt-3">
                                    70%
                                </h3>

                                <p className="mt-2">
                                    OFF SELECTED PRODUCTS
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );
}