import {
    ShieldCheck,
    Truck,
    Headphones,
    RefreshCcw
} from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Secure Payments",
        desc: "100% secure transactions with trusted payment gateways."
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        desc: "Quick and reliable shipping across India."
    },
    {
        icon: RefreshCcw,
        title: "Easy Returns",
        desc: "Hassle-free returns and replacements."
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        desc: "Dedicated support whenever you need help."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black">
                    Why Choose CosmoCartt
                </h2>

                <p className="text-slate-500 mt-3">
                    Built for customers and businesses.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                {features.map((item, index) => {

                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="
                                bg-white
                                rounded-3xl
                                p-8
                                border
                                border-purple-100
                                shadow-lg
                                hover:-translate-y-2
                                transition-all
                            "
                        >
                            <Icon
                                className="
                                    text-[#4B1E78]
                                    mb-4
                                "
                                size={42}
                            />

                            <h3 className="font-bold text-xl">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 mt-3">
                                {item.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}