import {
    Truck,
    ShieldCheck,
    Star,
    Zap
} from "lucide-react";

export default function AnnouncementBar() {
    return (
        <div className="bg-[#491D76] text-white shadow-md">

            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-3 text-sm font-medium">

                    <div className="flex items-center gap-2">
                        <Truck size={16} />
                        <span>Free Shipping Above ₹999</span>
                    </div>

                    <div className="hidden md:block h-4 w-px bg-white/30"></div>

                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} />
                        <span>100% Secure Payments</span>
                    </div>

                    <div className="hidden md:block h-4 w-px bg-white/30"></div>

                    <div className="flex items-center gap-2">
                        <Star size={16} />
                        <span>Trusted by 10,000+ Customers</span>
                    </div>

                    <div className="hidden md:block h-4 w-px bg-white/30"></div>

                    <div className="flex items-center gap-2">
                        <Zap size={16} />
                        <span>Fast Delivery Across India</span>
                    </div>

                </div>

            </div>

        </div>
    );
}