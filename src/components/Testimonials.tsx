const reviews = [
  {
    name: "Rahul Sharma",
    text: "Excellent service and fast delivery. The product quality exceeded my expectations."
  },
  {
    name: "Priya Nair",
    text: "Very smooth shopping experience. Customer support was extremely helpful."
  },
  {
    name: "Arjun Kumar",
    text: "Best pricing I found online. Will definitely order again."
  }
];

export default function Testimonials() {
  return (
    <section
      className="
        max-w-7xl
        mx-auto
        px-6
        py-24
        bg-gradient-to-b
        from-white
        via-purple-50/20
        to-white
      "
    >
      {/* HEADER */}
      <div className="text-center mb-14">

        {/* Badge */}
        <span
          className="
            inline-flex
            px-5
            py-2
            rounded-full
            bg-gradient-to-r
            from-[#4B1E78]
            to-[#6F2DBD]
            text-white
            text-sm
            font-semibold
            shadow-lg
            shadow-purple-200
          "
        >
          Customer Stories
        </span>

        {/* Heading */}
        <h2
          className="
            mt-5
            text-4xl
            md:text-5xl
            font-black
            tracking-tight
            text-[#24103d]
          "
        >
          What Customers Say
        </h2>

        {/* Subtitle */}
        <p
          className="
            text-slate-500
            mt-4
            max-w-2xl
            mx-auto
            leading-7
          "
        >
          Trusted by thousands of customers
          across India with premium products,
          fast delivery and dependable service.
        </p>
      </div>

      {/* CARDS */}
      <div
        className="
          grid
          md:grid-cols-3
          gap-8
        "
      >
        {reviews.map(
          (review, index) => (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                bg-white
                rounded-[30px]
                p-8
                border
                border-purple-100
                shadow-[0_10px_30px_rgba(111,45,189,0.08)]
                hover:shadow-[0_18px_40px_rgba(111,45,189,0.12)]
                hover:-translate-y-2
                transition-all
                duration-300
              "
            >
              {/* Hover Glow */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  bg-gradient-to-br
                  from-purple-500/5
                  via-fuchsia-500/5
                  to-indigo-500/5
                "
              />

              {/* Stars */}
              <div
                className="
                  relative
                  text-amber-400
                  text-xl
                  tracking-wide
                "
              >
                ★★★★★
              </div>

              {/* Quote */}
              <p
                className="
                  relative
                  mt-5
                  text-slate-600
                  leading-8
                  text-[15px]
                "
              >
                "{review.text}"
              </p>

              {/* User */}
              <div className="mt-7 relative">

                {/* Avatar */}
                <div
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-gradient-to-r
                    from-[#4B1E78]
                    to-[#6F2DBD]
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                    mb-3
                  "
                >
                  {review.name.charAt(0)}
                </div>

                {/* Name */}
                <h4
                  className="
                    font-bold
                    text-[#4B1E78]
                  "
                >
                  {review.name}
                </h4>

              </div>

              {/* Bottom Accent */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  w-full
                  h-1
                  bg-gradient-to-r
                  from-[#4B1E78]
                  via-[#7C3AED]
                  to-[#A855F7]
                  scale-x-0
                  group-hover:scale-x-100
                  transition-transform
                  duration-300
                "
              />
            </div>
          )
        )}
      </div>
    </section>
  );
}