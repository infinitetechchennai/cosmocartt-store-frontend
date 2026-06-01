export default function AnnouncementBar() {
    return (
        <div className="bg-black text-white text-sm">

            <div className="max-w-7xl mx-auto px-6 py-2 flex justify-center md:justify-between items-center">

                <p>
                    🚚 Free Shipping on Orders Above ₹999
                </p>

                <div className="hidden md:flex gap-8">

                    <span>
                        🔒 Secure Payments
                    </span>

                    <span>
                        ⭐ Trusted by Customers
                    </span>

                </div>

            </div>

        </div>
    );
}