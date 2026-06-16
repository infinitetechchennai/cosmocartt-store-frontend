import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import { useParams, useNavigate } from "react-router-dom";



export default function BrandModels() {



    const { brand } = useParams();

    const navigate = useNavigate();



    const models = {

       Apple: [
    "iPhone 11",
    "iPhone 11 Pro",
    "iPhone 11 Pro Max",
    "iPhone 12 Mini",
    "iPhone 12 Pro",
    "iPhone 13",
    "iPhone 13 Mini",
    "iPhone 13 Pro",
    "iPhone 14",
    "iPhone 14 Plus",
    "iPhone 14 Pro",
    "iPhone 14 Pro Max",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro",
    "iPhone 15 Pro Max",
    "iPhone 16",
    "iPhone 16 Plus",
    "iPhone 16 Pro",
    "iPhone 16 Pro Max",
    "iPhone 17",
    "iPhone 17 Pro",
    "iPhone 17 Pro Max"
],


        Samsung: [

            "Galaxy S23",

            "Galaxy S24",

            "Galaxy A54",

            "Galaxy M35"

        ],



        Vivo: [

            "Vivo V30",

            "Vivo V40",

            "Vivo T3",

            "Vivo Y28"

        ],



        Oppo: [

            "Oppo Reno 11",

            "Oppo Reno 12",

            "Oppo A79"

        ],



        OnePlus: [

            "OnePlus 11",

            "OnePlus 12",

            "OnePlus Nord CE4"

        ]

    };



    return (

        <div className="min-h-screen bg-slate-50">



            <Navbar />



            <div className="max-w-7xl mx-auto px-6 py-10">



                <div className="bg-gradient-to-r from-[#2B1055] to-[#6F2DBD] text-white p-10 rounded-3xl mb-10">



                    <h1 className="text-5xl font-black">

                        {brand} Models

                    </h1>



                    <p className="mt-3 text-purple-100">

                        Select your device model

                    </p>



                </div>



                <div className="grid md:grid-cols-5 gap-6">



                    {models[brand as keyof typeof models]?.map(

                        (model) => (



                           <div

    key={model}

    onClick={() =>

        navigate(

            `/backcase-models/${brand}/${encodeURIComponent(model)}`

        )

    }

    className="

                                bg-white

                                rounded-3xl

                                p-6

                                shadow-lg

                                hover:shadow-2xl

                                hover:-translate-y-2

                                transition-all

                                cursor-pointer

                                text-center

                                "

                            >

                                <div className="text-6xl">

                                    📱

                                </div>



                                <h3 className="font-black mt-4">

                                    {model}

                                </h3>

                            </div>



                        )

                    )}



                </div>



            </div>



            <Footer />



        </div>

    );

}