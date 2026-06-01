import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-[#4B1E78] text-white mt-16">

            <div className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid md:grid-cols-4 gap-8">

                    <div>

                        <h2 className="text-2xl font-bold">
                            CosmoCart
                        </h2>

                        <p className="mt-4 text-sm text-zinc-300">
                            Your trusted destination for
                            electronics, gadgets, laptops,
                            smartphones and accessories.
                        </p>

                    </div>

                    <div>

                        <h3 className="font-semibold mb-4">
                            Quick Links
                        </h3>

                        <div className="space-y-2">

                            <Link
                                to="/"
                                className="block text-zinc-300 hover:text-white"
                            >
                                Home
                            </Link>

                            <Link
                                to="/products"
                                className="block text-zinc-300 hover:text-white"
                            >
                                Products
                            </Link>

                        </div>

                    </div>

                    <div>

                        <h3 className="font-semibold mb-4">
                            Company
                        </h3>

                        <div className="space-y-2">

                            <a className="block text-zinc-300 hover:text-white">
                                About Us
                            </a>

                            <a className="block text-zinc-300 hover:text-white">
                                Contact
                            </a>

                        </div>

                    </div>

                    <div>

                        <h3 className="font-semibold mb-4">
                            Legal
                        </h3>

                        <div className="space-y-2">

                            <a className="block text-zinc-300 hover:text-white">
                                Privacy Policy
                            </a>

                            <a className="block text-zinc-300 hover:text-white">
                                Terms & Conditions
                            </a>

                        </div>

                    </div>

                </div>

                <div className="border-t border-zinc-700 mt-10 pt-6 text-center text-sm text-zinc-400">

                    © 2026 CosmoCart. All Rights Reserved.

                </div>

            </div>

        </footer>
    );
}