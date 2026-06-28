import {
    Truck,
    ShieldCheck,
    Star,
    Zap,
} from "lucide-react";

export default function AnnouncementBar() {
    const items = [
        {
            icon: <Truck size={16} />,
            text: "Free Shipping Above ₹999",
        },
        {
            icon: <ShieldCheck size={16} />,
            text: "100% Secure Payments",
        },
        {
            icon: <Star size={16} />,
            text: "Trusted by 10,000+ Customers",
        },
        {
            icon: <Zap size={16} />,
            text: "Fast Delivery Across India",
        },
    ];

    return (
        <div className="bg-[#491D76] text-white overflow-hidden shadow-md">
            <div className="py-3 overflow-hidden">
                <div className="flex w-max animate-[marquee_22s_linear_infinite]">
                    {[...items, ...items].map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 whitespace-nowrap px-10 text-sm md:text-base font-medium"
                        >
                            {item.icon}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}