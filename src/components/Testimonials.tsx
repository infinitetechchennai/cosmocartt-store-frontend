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
        <section className="max-w-7xl mx-auto px-6 py-20">

            <div className="text-center mb-12">
                <h2 className="text-4xl font-black">
                    What Customers Say
                </h2>

                <p className="text-slate-500 mt-3">
                    Trusted by thousands of customers across India.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {reviews.map((review, index) => (

                    <div
                        key={index}
                        className="
                            bg-white
                            rounded-3xl
                            p-8
                            shadow-lg
                            border
                            border-purple-100
                        "
                    >
                        <div className="text-yellow-500 text-xl">
                            ★★★★★
                        </div>

                        <p className="mt-4 text-slate-600">
                            "{review.text}"
                        </p>

                        <h4 className="mt-6 font-bold text-[#4B1E78]">
                            {review.name}
                        </h4>
                    </div>

                ))}

            </div>

        </section>
    );
}