export default function Newsletter() {
    return (
        <section className="py-20">

            <div
                className="
                    max-w-6xl
                    mx-auto
                    rounded-[40px]
                    bg-gradient-to-r
                    from-[#2B1055]
                    via-[#4B1E78]
                    to-[#6F2DBD]
                    p-12
                    text-center
                    text-white
                "
            >

                <h2 className="text-4xl font-black">
                    Stay Updated
                </h2>

                <p className="mt-4 text-purple-100">
                    Get exclusive offers, product launches and business deals.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="
                            px-6 py-4
                            rounded-full
                            text-black
                            w-full
                            md:w-[420px]
                        "
                    />

                    <button
                        className="
                            bg-white
                            text-[#4B1E78]
                            px-8
                            py-4
                            rounded-full
                            font-bold
                        "
                    >
                        Subscribe
                    </button>

                </div>

            </div>

        </section>
    );
}