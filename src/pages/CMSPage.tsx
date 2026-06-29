import { API_URL } from "../config/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    ArrowRight,
    BadgeCheck,
    Headset,
    PackageCheck,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    Users,
    Zap
} from "lucide-react";

const pageMap: any = {
    about: "about",
    contact: "contact",
    "privacy-policy": "privacy",
    terms: "terms",
    faq: "faq",
    "refund-policy": "refund-policy",
    "shipping-policy": "shipping-policy"
};

export default function CMSPage() {
    const { slug } = useParams();

    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPage = async () => {
            try {
                setLoading(true);

                const key = pageMap[slug || ""] || slug;

                const res = await fetch(
                    `${API_URL}/api/cms/${key}`
                );

                const data = await res.json();

                if (data.success) {
                    setPage(data.page);
                }
            } catch (error) {
                console.error("CMS page load error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [slug]);

    const fields = page?.fields || {};
    const isAboutPage = page?.key === "about";

    const renderPageContent = () => {
        if (!page) return null;

        if (page.status !== "Published") {
            return (
                <div className="text-center py-10">
                    <h1 className="text-3xl font-black text-zinc-950">
                        Page Not Available
                    </h1>

                    <p className="text-zinc-500 mt-3">
                        This page is currently being updated.
                    </p>
                </div>
            );
        }

        if (page.key === "about") {
            return (
                <AboutUsPremium
                    page={page}
                    fields={fields}
                />
            );
        }

        if (page.key === "contact") {
            return (
                <>
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-950">
                        {page.title}
                    </h1>

                    <p className="text-zinc-500 mt-4">
                        Reach out to CosmoCartt support.
                    </p>

                    <div className="grid md:grid-cols-2 gap-5 mt-10">
                        <InfoCard title="Phone" value={fields.phone} />
                        <InfoCard title="Email" value={fields.email} />
                        <InfoCard title="Support Hours" value={fields.supportHours} />
                        <InfoCard title="Address" value={fields.address} />
                    </div>

                    {fields.mapUrl && (
                        <a
                            href={fields.mapUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex mt-8 bg-[#4B1E78] text-white px-6 py-3 rounded-2xl font-bold"
                        >
                            Open Location
                        </a>
                    )}
                </>
            );
        }

        if (page.key === "faq") {
            const questions = fields.questions || [];

            return (
                <>
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-950">
                        Frequently Asked Questions
                    </h1>

                    <div className="mt-10 space-y-4">
                        {questions.length === 0 && (
                            <p className="text-zinc-500">
                                No FAQ items available yet.
                            </p>
                        )}

                        {questions.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-zinc-100 bg-white p-5"
                            >
                                <h2 className="font-black text-zinc-900">
                                    {item.question}
                                </h2>

                                <p className="text-zinc-600 leading-7 mt-2 whitespace-pre-line">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            );
        }

        return (
            <>
                <h1 className="text-4xl md:text-5xl font-black text-zinc-950">
                    {page.title}
                </h1>

                {fields.effectiveDate && (
                    <p className="text-sm text-zinc-400 mt-3">
                        Effective Date: {fields.effectiveDate}
                    </p>
                )}

                <div className="mt-8 text-zinc-600 whitespace-pre-line leading-8">
                    {fields.content || page.content || "No content available yet."}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50">
            <Navbar />

            <main
                className={
                    isAboutPage
                        ? "max-w-7xl mx-auto px-5 py-12 md:py-16"
                        : "max-w-5xl mx-auto px-5 py-14"
                }
            >
                {loading ? (
                    <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
                        <p className="text-zinc-500">
                            Loading page...
                        </p>
                    </div>
                ) : !page ? (
                    <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
                        <h1 className="text-4xl font-black text-zinc-950">
                            Page Not Found
                        </h1>

                        <p className="text-zinc-500 mt-3">
                            This CMS page has not been created yet.
                        </p>
                    </div>
                ) : isAboutPage ? (
                    renderPageContent()
                ) : (
                    <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
                        {renderPageContent()}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function AboutUsPremium({
    page,
    fields
}: {
    page: any;
    fields: any;
}) {
    return (
        <div className="space-y-14">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-[42px] bg-gradient-to-br from-[#18072d] via-[#4B1E78] to-[#7C3AED] p-8 md:p-12 lg:p-14 shadow-[0_35px_100px_rgba(76,29,149,0.30)]">
                <div className="absolute -top-28 -right-24 h-96 w-96 rounded-full bg-purple-300/25 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl" />

                <div className="relative z-10 grid lg:grid-cols-[1.35fr_0.85fr] gap-10 items-center">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur-md border border-white/15">
                            <Sparkles size={17} />
                            ABOUT COSMOCARTT
                        </span>

                        <h1 className="mt-6 text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                            {fields.heroTitle || page.title}
                        </h1>

                        <p className="mt-5 max-w-3xl text-lg md:text-xl leading-8 text-purple-100">
                            {fields.heroSubtitle ||
                                "Your trusted destination for premium mobile accessories, smart electronics and reliable online shopping experiences."}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-[#4B1E78] transition-all hover:gap-4"
                            >
                                Explore Products
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/15 px-6 py-3 font-black text-white transition-all hover:bg-white/20"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="relative mx-auto h-[340px] max-w-[360px] rounded-[44px] border border-white/20 bg-white/15 p-6 backdrop-blur-xl shadow-2xl">
                            <div className="absolute -top-5 -right-5 h-24 w-24 rounded-full bg-white/20 blur-2xl" />

                            <div className="h-full rounded-[36px] bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center">
                                <div className="h-24 w-24 rounded-[30px] bg-white text-[#4B1E78] flex items-center justify-center shadow-xl">
                                    <PackageCheck size={52} />
                                </div>

                                <h3 className="mt-6 text-3xl font-black text-white">
                                    CosmoCartt
                                </h3>

                                <p className="mt-3 max-w-[240px] text-purple-100 leading-7">
                                    Premium products. Trusted support. Smarter shopping.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <AboutStat icon={<Users />} value="10K+" label="Happy Customers" />
                <AboutStat icon={<PackageCheck />} value="100+" label="Quality Products" />
                <AboutStat icon={<Truck />} value="Fast" label="Delivery Support" />
                <AboutStat icon={<ShieldCheck />} value="100%" label="Secure Shopping" />
            </section>

            {/* STORY */}
            <section className="grid lg:grid-cols-[1.4fr_0.9fr] gap-8 items-start">
                <div className="rounded-[36px] bg-white border border-slate-200 p-8 md:p-10 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#4B1E78] font-black">
                        Our Story
                    </p>

                    <h2 className="mt-4 text-3xl md:text-5xl font-black text-slate-950 leading-tight">
                        Built for customers who expect more from online shopping.
                    </h2>

                    <p className="mt-6 text-slate-600 leading-8 whitespace-pre-line">
                        {fields.content ||
                            page.content ||
                            "CosmoCartt is a modern e-commerce destination focused on premium electronics, mobile accessories, remotes and smart lifestyle products. Our goal is to make shopping simple, secure and reliable for every customer."}
                    </p>

                    <div className="mt-8 grid sm:grid-cols-3 gap-4">
                        <TrustBadge icon={<BadgeCheck />} title="Verified Products" />
                        <TrustBadge icon={<Zap />} title="Fast Experience" />
                        <TrustBadge icon={<Star />} title="Customer First" />
                    </div>
                </div>

                <div className="space-y-5">
                    <AboutFeature
                        icon={<Sparkles />}
                        title="Our Mission"
                        text={
                            fields.mission ||
                            "To provide customers with premium quality electronics and accessories at affordable prices, supported by excellent service and fast nationwide delivery."
                        }
                    />

                    <AboutFeature
                        icon={<ShieldCheck />}
                        title="Our Vision"
                        text={
                            fields.vision ||
                            "To become India’s most trusted e-commerce destination for mobile accessories and consumer electronics by combining quality, transparency and customer satisfaction."
                        }
                    />
                </div>
            </section>

            {/* WHY US */}
            <section>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#4B1E78] font-black">
                            Why Choose Us
                        </p>

                        <h2 className="mt-3 text-3xl md:text-4xl font-black text-slate-950">
                            A shopping experience designed around trust.
                        </h2>
                    </div>

                    <p className="max-w-xl text-slate-500 leading-7">
                        From product quality to support, every part of CosmoCartt is built to deliver confidence.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                    <WhyChooseCard
                        icon={<ShieldCheck />}
                        title="Secure Shopping"
                        text="Safe checkout, protected payments and trusted customer data handling."
                    />

                    <WhyChooseCard
                        icon={<PackageCheck />}
                        title="Quality Selection"
                        text="Carefully selected products that meet customer expectations."
                    />

                    <WhyChooseCard
                        icon={<Truck />}
                        title="Reliable Delivery"
                        text="Clear order updates and delivery support for every purchase."
                    />

                    <WhyChooseCard
                        icon={<Headset />}
                        title="Helpful Support"
                        text="Friendly support for orders, returns, refunds and product queries."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="relative overflow-hidden rounded-[38px] bg-slate-950 p-8 md:p-10 text-white">
                <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black">
                            Ready to experience smarter shopping?
                        </h2>

                        <p className="mt-3 text-slate-300 max-w-2xl leading-7">
                            Discover premium products, secure checkout and reliable support with CosmoCartt.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#4B1E78] transition-all hover:gap-4"
                    >
                        Start Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

function AboutStat({
    icon,
    value,
    label
}: {
    icon: any;
    value: string;
    label: string;
}) {
    return (
        <div className="rounded-[30px] bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <h3 className="mt-5 text-4xl font-black text-slate-950">
                {value}
            </h3>

            <p className="mt-2 text-sm font-semibold text-slate-500">
                {label}
            </p>
        </div>
    );
}

function AboutFeature({
    icon,
    title,
    text
}: {
    icon: any;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[34px] bg-white border border-purple-100 p-7 shadow-sm hover:shadow-xl transition-all">
            <div className="h-13 w-13 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <h3 className="mt-5 text-2xl font-black text-slate-950">
                {title}
            </h3>

            <p className="mt-3 text-slate-600 leading-7 whitespace-pre-line">
                {text}
            </p>
        </div>
    );
}

function TrustBadge({
    icon,
    title
}: {
    icon: any;
    title: string;
}) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white text-[#4B1E78] flex items-center justify-center shadow-sm">
                {icon}
            </div>

            <p className="text-sm font-black text-slate-800">
                {title}
            </p>
        </div>
    );
}

function WhyChooseCard({
    icon,
    title,
    text
}: {
    icon: any;
    title: string;
    text: string;
}) {
    return (
        <div className="group rounded-[30px] bg-white border border-slate-200 p-6 shadow-sm hover:border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center group-hover:bg-[#4B1E78] group-hover:text-white transition-all">
                {icon}
            </div>

            <h3 className="mt-5 font-black text-slate-950">
                {title}
            </h3>

            <p className="mt-2 text-sm text-slate-500 leading-6">
                {text}
            </p>
        </div>
    );
}

function InfoCard({
    title,
    value
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-zinc-100 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400 font-black">
                {title}
            </p>

            <p className="text-zinc-800 font-bold mt-2 whitespace-pre-line">
                {value || "-"}
            </p>
        </div>
    );
}