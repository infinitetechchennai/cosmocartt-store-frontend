import {
  ShieldCheck,
  Truck,
  Headphones,
  RefreshCcw,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "Protected checkout with trusted payment gateways.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Quick and reliable delivery across India.",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    desc: "Simple replacements and hassle-free support.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Friendly help whenever you need assistance.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="inline-block px-5 py-2 rounded-full bg-purple-100 text-[#4B1E78] text-sm font-bold">
            WHY CHOOSE US
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900">
            Shopping Made Simple
          </h2>

          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            A smoother, safer and more reliable shopping experience for every Cosmocartt customer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  group
                  bg-white
                  rounded-[30px]
                  p-8
                  border
                  border-slate-200
                  shadow-md
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-purple-50
                    flex
                    items-center
                    justify-center
                    group-hover:bg-[#4B1E78]
                    transition-all
                    duration-300
                  "
                >
                  <Icon
                    size={34}
                    className="text-[#4B1E78] group-hover:text-white transition"
                  />
                </div>

                <h3 className="mt-6 text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="text-slate-500 mt-3 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-6 h-1 w-12 rounded-full bg-[#4B1E78] opacity-0 group-hover:opacity-100 transition" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}