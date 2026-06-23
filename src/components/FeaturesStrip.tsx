import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  Receipt,
} from "lucide-react";

export default function FeaturesStrip() {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "On orders above ₹999",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      desc: "100% secure checkout",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      desc: "Hassle free returns",
    },
    {
      icon: Receipt,
      title: "GST Billing",
      desc: "For businesses & B2B",
    },
  ];

  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-6
        py-16
      "
    >
      <div
        className="
          rounded-[32px]
          bg-gradient-to-b
          from-white
          to-purple-50/30
          border
          border-purple-100
          shadow-[0_10px_35px_rgba(111,45,189,0.08)]
          grid
          md:grid-cols-4
          overflow-hidden
        "
      >
        {features.map(
          (
            {
              icon: Icon,
              title,
              desc,
            },
            index
          ) => (
            <div
              key={index}
              className={`
                group
                flex
                flex-col
                items-center
                justify-center
                py-12
                px-6
                transition-all
                duration-300
                hover:bg-white
                hover:scale-[1.02]
                ${
                  index !==
                  features.length - 1
                    ? "border-b md:border-b-0 md:border-r border-purple-100"
                    : ""
                }
              `}
            >
              {/* Icon Circle */}
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  bg-gradient-to-r
                  from-[#4B1E78]
                  to-[#6F2DBD]
                  shadow-lg
                  shadow-purple-200
                  transition-all
                  duration-300
                  group-hover:scale-110
                "
              >
                <Icon
                  size={28}
                  className="text-white"
                />
              </div>

              {/* Title */}
              <h3
                className="
                  font-bold
                  text-xl
                  mt-5
                  text-[#24103d]
                "
              >
                {title}
              </h3>

              {/* Description */}
              <p
                className="
                  text-slate-500
                  text-center
                  mt-3
                  text-sm
                  leading-6
                "
              >
                {desc}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}