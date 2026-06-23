import {
    Truck,
    ShieldCheck,
    RefreshCcw,
    Receipt
} from "lucide-react";

export default function FeaturesStrip() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12">

            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg grid md:grid-cols-4">

                <div className="flex flex-col items-center justify-center py-10 border-r">
                    <Truck
                        size={40}
                        className="text-[#6F2DBD]"
                    />

                    <h3 className="font-bold text-xl mt-4">
                        Free Shipping
                    </h3>

                    <p className="text-slate-500 text-center mt-2">
                        On orders above ₹999
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center py-10 border-r">
                    <ShieldCheck
                        size={40}
                        className="text-[#6F2DBD]"
                    />

                    <h3 className="font-bold text-xl mt-4">
                        Secure Payments
                    </h3>

                    <p className="text-slate-500 text-center mt-2">
                        100% secure checkout
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center py-10 border-r">
                    <RefreshCcw
                        size={40}
                        className="text-[#6F2DBD]"
                    />

                    <h3 className="font-bold text-xl mt-4">
                        Easy Returns
                    </h3>

                    <p className="text-slate-500 text-center mt-2">
                        Hassle free returns
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center py-10">
                    <Receipt
                        size={40}
                        className="text-[#6F2DBD]"
                    />

                    <h3 className="font-bold text-xl mt-4">
                        GST Billing
                    </h3>

                    <p className="text-slate-500 text-center mt-2">
                        For businesses & B2B
                    </p>
                </div>

            </div>

        </section>
    );
}