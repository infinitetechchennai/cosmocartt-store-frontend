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
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="text-center mb-16">

          <span
            className="
              inline-flex
              px-5
              py-2
              rounded-full
              bg-purple-50
              text-[#4B1E78]
              text-sm
              font-semibold
              border
              border-purple-100
            "
          >
            WHY CHOOSE US
          </span>

          <h2
            className="
              mt-5
              text-5xl
              font-black
              tracking-tight
              text-slate-900
            "
          >
            Shopping Reimagined
          </h2>

          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Designed to deliver a faster, safer and premium shopping
            experience built around trust and convenience.
          </p>

        </div>

        {/* FEATURE GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">

          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[32px]
                  bg-white
                  border
                  border-slate-200
                  p-8
                  shadow-[0_12px_35px_rgba(15,23,42,0.04)]
                  hover:-translate-y-2
                  hover:shadow-[0_20px_45px_rgba(75,30,120,0.10)]
                  transition-all
                  duration-500
                "
              >

                {/* LIGHT GLOW */}

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all" />

                {/* ICON */}

                <div
                  className="
                    relative
                    z-10
                    w-18
                    h-18
                    rounded-3xl
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
                    size={30}
                    className="
                      text-[#4B1E78]
                      group-hover:text-white
                      transition-all
                    "
                  />
                </div>

                {/* TEXT */}

                <h3
                  className="
                    mt-6
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-3
                    text-slate-500
                    leading-relaxed
                  "
                >
                  {item.desc}
                </p>

                {/* ACCENT BAR */}

                <div
                  className="
                    mt-6
                    h-1
                    w-14
                    rounded-full
                    bg-[#4B1E78]
                    opacity-20
                    group-hover:opacity-100
                    transition-all
                  "
                />

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}