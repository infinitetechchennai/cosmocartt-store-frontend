import { apiPath } from "../config/api";
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function RazorpayTest() {

    const testPayment = async () => {

        try {

            const response = await fetch(
                apiPath("/api/payment/create-order"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        amount: 1,
                    }),
                }
            );

            const data =
                await response.json();

            console.log(data);

            const options = {

                key: "rzp_test_SzWOSqm0kgH1d3",

                amount:
                    data.order.amount,

                currency: "INR",

                name: "CosmoCartt",

                description:
                    "Razorpay Test",

                order_id:
                    data.order.id,

                method: {
                    upi: true,
                    card: false,
                    netbanking: false,
                    wallet: false,
                    emi: false,
                },

                handler: function (
                    response: any
                ) {

                    console.log(
                        "SUCCESS",
                        response
                    );

                    alert(
                        "PAYMENT SUCCESS"
                    );
                },
            };

            console.log(
                "KEY:",
                options.key
            );

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.on(
                "payment.failed",
                function (
                    response: any
                ) {

                    console.log(
                        "PAYMENT FAILED FULL",
                        response
                    );

                    alert(
                        "Payment Failed"
                    );
                }
            );

            razorpay.open();

        } catch (error) {

            console.error(error);

        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center">

            <button
                onClick={testPayment}
                className="bg-purple-700 text-white px-8 py-4 rounded-xl"
            >
                Test ₹1 Payment
            </button>

        </div>

    );
}