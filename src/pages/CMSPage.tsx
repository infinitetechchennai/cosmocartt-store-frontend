import { API_URL } from "../config/api";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    ChevronDown,
    CircleHelp,
    Clock,
    CreditCard,
    FileText,
    Headset,
    Mail,
    MapPinned,
    MessageCircle,
    PackageCheck,
    PhoneCall,
    RefreshCcw,
    RotateCcw,
    Search,
    Send,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    Users,
    Zap
} from "lucide-react";

const pageMap: Record<string, string> = {
    about: "about",
    contact: "contact",
    "privacy-policy": "privacy",
    terms: "terms",
    faq: "faq",
    "refund-policy": "refund-policy",
    "shipping-policy": "shipping-policy"
};

const pageConfig: Record<string, any> = {
    about: {
        badge: "About CosmoCartt",
        title: "Premium Electronics & Smart Accessories Marketplace",
        subtitle: "Built for customers who expect quality products, secure shopping and reliable service.",
        icon: Sparkles,
        gradient: "from-[#18072d] via-[#4B1E78] to-[#7C3AED]"
    },
    contact: {
        badge: "Customer Support",
        title: "We’re Here To Help You",
        subtitle: "Need help with orders, payments, shipping, returns or product support? Our team is ready to assist.",
        icon: Headset,
        gradient: "from-[#1E1B4B] via-[#4B1E78] to-[#9333EA]"
    },
    terms: {
        badge: "Legal Policy",
        title: "Terms & Conditions",
        subtitle: "Understand the terms that govern your access, purchases and use of CosmoCartt services.",
        icon: FileText,
        gradient: "from-[#111827] via-[#2B1055] to-[#6F2DBD]"
    },
    privacy: {
        badge: "Privacy & Security",
        title: "Privacy Policy",
        subtitle: "Learn how CosmoCartt protects customer information and keeps your shopping experience secure.",
        icon: ShieldCheck,
        gradient: "from-[#111827] via-[#4B1E78] to-[#6F2DBD]"
    },
    faq: {
        badge: "Help Center",
        title: "Frequently Asked Questions",
        subtitle: "Find quick answers about orders, payments, shipping, refunds and customer support.",
        icon: CircleHelp,
        gradient: "from-[#2B1055] via-[#5B21B6] to-[#9333EA]"
    },
    "shipping-policy": {
        badge: "Shipping Information",
        title: "Shipping Policy",
        subtitle: "Fast, secure and transparent delivery information for every CosmoCartt order.",
        icon: Truck,
        gradient: "from-[#1E1B4B] via-[#4B1E78] to-[#7C3AED]"
    },
    "refund-policy": {
        badge: "Returns & Refunds",
        title: "Returns & Refunds Policy",
        subtitle: "Clear guidance on return eligibility, refund timelines, replacements and customer support.",
        icon: RefreshCcw,
        gradient: "from-[#2B1055] via-[#4B1E78] to-[#9333EA]"
    }
};

export default function CMSPage() {
    const { slug } = useParams<{ slug?: string }>();

    const [page, setPage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeFaq, setActiveFaq] = useState<number | null>(0);
    const [faqSearch, setFaqSearch] = useState("");

    useEffect(() => {
        const loadPage = async () => {
            try {
                setLoading(true);

                const key = pageMap[slug || ""] || slug || "";
                const res = await fetch(`${API_URL}/api/cms/${key}`);
                const data = await res.json();

                if (data.success) {
                    setPage(data.page);
                } else {
                    setPage(null);
                }
            } catch (error) {
                console.error("CMS page load error:", error);
                setPage(null);
            } finally {
                setLoading(false);
            }
        };

        loadPage();
    }, [slug]);

    const fields = page?.fields || {};
    const pageKey = page?.key || pageMap[slug || ""] || slug || "about";
    const config = pageConfig[pageKey] || pageConfig.about;
    const HeroIcon = config.icon;

    const faqItems = useMemo(() => {
        const questions = Array.isArray(fields.questions) ? fields.questions : [];

        if (!faqSearch.trim()) return questions;

        return questions.filter((item: any) =>
            `${item.question} ${item.answer}`
                .toLowerCase()
                .includes(faqSearch.toLowerCase())
        );
    }, [fields.questions, faqSearch]);

    if (loading) {
        return (
            <PageShell>
                <div className="rounded-[36px] bg-white border border-slate-200 p-10 shadow-sm animate-pulse">
                    <div className="h-7 w-48 rounded-full bg-slate-200" />
                    <div className="mt-6 h-16 w-3/4 rounded-3xl bg-slate-200" />
                    <div className="mt-8 h-4 w-full rounded-full bg-slate-200" />
                    <div className="mt-3 h-4 w-2/3 rounded-full bg-slate-200" />
                </div>
            </PageShell>
        );
    }

    if (!page) {
        return <Navigate to="/404" replace />;
    }

    if (page.status !== "Published") {
        return (
            <PageShell>
                <EmptyState
                    icon={<Clock size={52} />}
                    title="This Page Is Being Updated"
                    text="We are improving this content. Please check back soon."
                />
            </PageShell>
        );
    }

    return (
        <PageShell>
            <HeroSection
                config={config}
                HeroIcon={HeroIcon}
                title={fields.heroTitle || config.title || page.title}
                subtitle={
                    fields.heroSubtitle ||
                    page.metaDescription ||
                    config.subtitle ||
                    "Explore CosmoCartt information and support details."
                }
            />

            {pageKey === "about" && (
                <AboutPage page={page} fields={fields} />
            )}

            {pageKey === "contact" && (
                <ContactPage fields={fields} />
            )}

            {pageKey === "faq" && (
                <FAQPage
                    faqs={faqItems}
                    faqSearch={faqSearch}
                    setFaqSearch={setFaqSearch}
                    activeFaq={activeFaq}
                    setActiveFaq={setActiveFaq}
                />
            )}

            {pageKey === "terms" && (
                <PolicyPage
                    page={page}
                    fields={fields}
                    type="terms"
                />
            )}

            {pageKey === "privacy" && (
                <PolicyPage
                    page={page}
                    fields={fields}
                    type="privacy"
                />
            )}

            {pageKey === "shipping-policy" && (
                <ShippingPage page={page} fields={fields} />
            )}

            {pageKey === "refund-policy" && (
                <RefundPage page={page} fields={fields} />
            )}
        </PageShell>
    );
}

function PageShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-purple-50 text-slate-900">
            <Navbar />

            <main className="max-w-7xl mx-auto px-5 py-12 md:py-16 space-y-12">
                {children}
            </main>

            <Footer />
        </div>
    );
}

function HeroSection({
    config,
    HeroIcon,
    title,
    subtitle
}: {
    config: any;
    HeroIcon: any;
    title: string;
    subtitle: string;
}) {
    return (
        <section className={`relative overflow-hidden rounded-[42px] bg-gradient-to-br ${config.gradient} p-8 md:p-12 lg:p-14 shadow-[0_35px_100px_rgba(76,29,149,0.28)]`}>
            <div className="absolute -top-28 -right-24 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl" />

            <div className="relative z-10 grid lg:grid-cols-[1.35fr_0.85fr] gap-10 items-center">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white backdrop-blur-md border border-white/15">
                        <HeroIcon size={17} />
                        {config.badge}
                    </span>

                    <h1 className="mt-6 text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                        {title}
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg md:text-xl leading-8 text-purple-100">
                        {subtitle}
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

                <div className="hidden lg:flex justify-center">
                    <div className="relative h-[330px] w-[340px] rounded-[46px] border border-white/20 bg-white/15 p-6 backdrop-blur-xl shadow-2xl">
                        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/25 blur-2xl" />

                        <div className="h-full rounded-[36px] bg-white/10 border border-white/10 flex flex-col items-center justify-center text-center">
                            <div className="h-24 w-24 rounded-[30px] bg-white text-[#4B1E78] flex items-center justify-center shadow-xl">
                                <HeroIcon size={52} />
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
    );
}

function AboutPage({ page, fields }: { page: any; fields: any }) {
    return (
        <div className="space-y-14">
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <AboutStat icon={<Users />} value="10K+" label="Happy Customers" />
                <AboutStat icon={<PackageCheck />} value="100+" label="Quality Products" />
                <AboutStat icon={<Truck />} value="Fast" label="Delivery Support" />
                <AboutStat icon={<ShieldCheck />} value="100%" label="Secure Shopping" />
            </section>

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
                            "CosmoCartt is a modern e-commerce destination focused on premium electronics, mobile accessories, remotes and smart lifestyle products."}
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
                            "To become India’s most trusted e-commerce destination for mobile accessories and consumer electronics."
                        }
                    />
                </div>
            </section>

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
                    <WhyChooseCard icon={<ShieldCheck />} title="Secure Shopping" text="Safe checkout, protected payments and trusted customer data handling." />
                    <WhyChooseCard icon={<PackageCheck />} title="Quality Selection" text="Carefully selected products that meet customer expectations." />
                    <WhyChooseCard icon={<Truck />} title="Reliable Delivery" text="Clear order updates and delivery support for every purchase." />
                    <WhyChooseCard icon={<Headset />} title="Helpful Support" text="Friendly support for orders, returns, refunds and product queries." />
                </div>
            </section>

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

function ContactPage({ fields }: { fields: any }) {
    return (
        <div className="space-y-10">
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                <ContactCard icon={<PhoneCall />} title="Call Us" value={fields.phone || "+91 98765 43210"} />
                <ContactCard icon={<Mail />} title="Email Us" value={fields.email || "support@cosmocartt.com"} />
                <ContactCard icon={<MapPinned />} title="Visit Us" value={fields.address || "Chennai, India"} />
                <ContactCard icon={<Clock />} title="Support Hours" value={fields.supportHours || "24/7 Customer Support"} />
            </section>

            <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
                <div className="rounded-[36px] bg-white border border-slate-200 p-8 md:p-10 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#4B1E78] font-black">
                        Message Us
                    </p>

                    <h2 className="mt-4 text-3xl md:text-4xl font-black text-slate-950">
                        Send us your question.
                    </h2>

                    <p className="mt-3 text-slate-500 leading-7">
                        This is a professional contact UI. Connect backend later if you want messages to submit.
                    </p>

                    <div className="mt-7 grid gap-4">
                        <input className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100" placeholder="Your Name" />
                        <input className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100" placeholder="Your Email" />
                        <input className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100" placeholder="Subject" />
                        <textarea className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100" rows={5} placeholder="Your Message" />

                        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4B1E78] px-6 py-4 font-black text-white transition hover:bg-[#6F2DBD]">
                            Send Message
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                <div className="rounded-[36px] bg-gradient-to-br from-purple-50 via-white to-white border border-purple-100 p-8 md:p-10 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#4B1E78] font-black">
                        Support Promise
                    </p>

                    <h2 className="mt-4 text-3xl md:text-4xl font-black text-slate-950">
                        Fast help for every customer.
                    </h2>

                    <p className="mt-4 text-slate-500 leading-7">
                        Our support team helps with product questions, order updates, returns, refunds, delivery issues and payment assistance.
                    </p>

                    <div className="mt-7 space-y-4">
                        <PromiseItem text="Quick response for order-related queries" />
                        <PromiseItem text="Transparent support for returns and refunds" />
                        <PromiseItem text="Secure communication and customer assistance" />
                        <PromiseItem text="Helpful guidance before and after purchase" />
                    </div>

                    <div className="mt-8 rounded-[30px] bg-white border border-slate-200 p-8 text-center">
                        <MapPinned size={52} className="mx-auto text-[#4B1E78]" />

                        <h3 className="mt-4 text-xl font-black text-slate-950">
                            CosmoCartt Support Location
                        </h3>

                        {fields.mapUrl && (
                            <a
                                href={fields.mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-5 inline-flex rounded-2xl bg-[#4B1E78] px-5 py-3 font-bold text-white"
                            >
                                Open Location
                            </a>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function FAQPage({
    faqs,
    faqSearch,
    setFaqSearch,
    activeFaq,
    setActiveFaq
}: any) {
    return (
        <div className="space-y-10">
            <section className="max-w-4xl mx-auto">
                <div className="relative">
                    <Search
                        size={22}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={faqSearch}
                        onChange={(e) => setFaqSearch(e.target.value)}
                        placeholder="Search your question..."
                        className="w-full bg-white border border-purple-100 rounded-3xl px-14 py-5 shadow-lg outline-none focus:border-[#4B1E78] focus:ring-4 focus:ring-purple-100"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    {["Orders", "Payments", "Shipping", "Returns", "Account", "Support"].map((chip) => (
                        <span
                            key={chip}
                            className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600"
                        >
                            {chip}
                        </span>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto space-y-4">
                {faqs.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                        <p className="text-slate-500">No FAQ items found.</p>
                    </div>
                ) : (
                    faqs.map((item: any, index: number) => {
                        const isOpen = activeFaq === index;

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setActiveFaq(isOpen ? null : index)}
                                className="w-full text-left rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-11 w-11 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center shrink-0">
                                            <CircleHelp size={22} />
                                        </div>

                                        <h2 className="font-black text-slate-900">
                                            {item.question}
                                        </h2>
                                    </div>

                                    <ChevronDown
                                        size={22}
                                        className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </div>

                                {isOpen && (
                                    <p className="text-slate-600 leading-7 mt-5 pl-14 whitespace-pre-line">
                                        {item.answer}
                                    </p>
                                )}
                            </button>
                        );
                    })
                )}
            </section>
        </div>
    );
}

function PolicyPage({
    page,
    fields,
    type
}: {
    page: any;
    fields: any;
    type: "privacy" | "terms" | "shipping" | "refund";
}) {
    const content = fields.content || page.content || "No content available yet.";
    const sections = parsePolicyContent(content);

    return (
        <section className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
            <PolicySidebar
                type={type}
                sections={sections}
                effectiveDate={fields.effectiveDate}
            />

            <article className="space-y-5">
                <div className="rounded-[36px] bg-white border border-slate-200 p-8 md:p-10 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center shrink-0">
                            <FileText size={26} />
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-[#4B1E78] font-black">
                                Official Policy
                            </p>

                            <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-950">
                                {page.title}
                            </h2>

                            {fields.effectiveDate && (
                                <p className="mt-2 text-sm font-semibold text-slate-400">
                                    Effective Date: {fields.effectiveDate}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {sections.map((section, index) => (
                    <div
                        key={index}
                        id={`section-${index}`}
                        className="scroll-mt-40 rounded-[32px] bg-white border border-slate-200 p-7 md:p-8 shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex gap-4">
                            <div className="h-11 w-11 rounded-2xl bg-[#4B1E78] text-white flex items-center justify-center font-black shrink-0">
                                {index + 1}
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-slate-950">
                                    {section.title}
                                </h3>

                                <p className="mt-4 text-slate-600 leading-8 whitespace-pre-line">
                                    {section.body}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="rounded-[34px] bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-7 md:p-8 flex gap-5">
                    <ShieldCheck size={38} className="text-[#4B1E78] shrink-0" />

                    <div>
                        <h3 className="text-xl font-black text-slate-950">
                            Customer Trust Notice
                        </h3>

                        <p className="mt-2 text-slate-600 leading-7">
                            CosmoCartt maintains transparent policies to keep your shopping experience secure, simple and reliable.
                        </p>
                    </div>
                </div>
            </article>
        </section>
    );
}

function ShippingPage({ page, fields }: { page: any; fields: any }) {
    return (
        <div className="space-y-10">
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                <ProcessCard icon={<PackageCheck />} title="Order Processing" text="Orders are verified and prepared for dispatch." />
                <ProcessCard icon={<Truck />} title="Delivery Timeline" text="Delivery depends on your location and courier service." />
                <ProcessCard icon={<CreditCard />} title="Shipping Charges" text="Charges are shown clearly before checkout." />
                <ProcessCard icon={<MessageCircle />} title="Tracking Updates" text="Track shipment status from your account." />
            </section>

            <PolicyPage page={page} fields={fields} type="shipping" />
        </div>
    );
}

function RefundPage({ page, fields }: { page: any; fields: any }) {
    return (
        <div className="space-y-10">
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                <ProcessCard icon={<RotateCcw />} title="Request Return" text="Raise a return request within eligible timeline." />
                <ProcessCard icon={<PackageCheck />} title="Product Check" text="Returned products are verified before approval." />
                <ProcessCard icon={<CheckCircle2 />} title="Approval" text="Refund or replacement is approved if eligible." />
                <ProcessCard icon={<CreditCard />} title="Refund Process" text="Amount is processed to the original payment method." />
            </section>

            <PolicyPage page={page} fields={fields} type="refund" />
        </div>
    );
}

function parsePolicyContent(content: string) {
    const cleanContent = content.trim();

    if (!cleanContent) {
        return [
            {
                title: "Overview",
                body: "No content available yet."
            }
        ];
    }

    const parts = cleanContent
        .split(/\n(?=\d+\.\s)/g)
        .map((item) => item.trim())
        .filter(Boolean);

    if (parts.length <= 1) {
        return [
            {
                title: "Overview",
                body: cleanContent
            }
        ];
    }

    return parts.map((part, index) => {
        const lines = part.split("\n");
        const firstLine = lines[0] || "";
        const match = firstLine.match(/^\d+\.\s*(.*)$/);

        return {
            title: match?.[1] || `Section ${index + 1}`,
            body: lines.slice(1).join("\n").trim() || firstLine
        };
    });
}

function PolicySidebar({
    type,
    sections,
    effectiveDate
}: {
    type: string;
    sections: any[];
    effectiveDate?: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    const label =
        type === "privacy"
            ? "Privacy Guide"
            : type === "terms"
                ? "Terms Guide"
                : type === "shipping"
                    ? "Shipping Guide"
                    : "Refund Guide";

    const goToSection = (index: number) => {
        const section = document.getElementById(`section-${index}`);

        if (!section) return;

        const navbarHeight = 145;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const finalPosition = sectionTop - navbarHeight;

        window.scrollTo({
            top: finalPosition,
            behavior: "smooth"
        });

        setActiveIndex(index);
    };

    return (
        <aside className="hidden lg:block sticky top-28">
            <div className="rounded-[32px] bg-white border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-[#4B1E78] font-black">
                    {label}
                </p>

                {effectiveDate && (
                    <div className="mt-4 rounded-2xl bg-purple-50 border border-purple-100 p-4">
                        <p className="text-xs font-black text-purple-700 uppercase tracking-[0.18em]">
                            Effective
                        </p>

                        <p className="text-sm font-bold text-slate-700 mt-1">
                            {effectiveDate}
                        </p>
                    </div>
                )}

                <div className="mt-5 space-y-2 max-h-[480px] overflow-y-auto pr-1">
                    {sections.map((item, index) => {
                        const isActive = activeIndex === index;

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => goToSection(index)}
                                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                                    isActive
                                        ? "bg-[#4B1E78] text-white shadow-md"
                                        : "text-slate-600 hover:bg-purple-50 hover:text-[#4B1E78]"
                                }`}
                            >
                                <PackageCheck size={16} className="shrink-0" />

                                <span className="truncate">
                                    {item.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}

function EmptyState({
    icon,
    title,
    text
}: {
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="bg-white rounded-[36px] p-14 text-center border border-slate-200 shadow-xl">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <h1 className="text-4xl font-black text-slate-900 mt-6">
                {title}
            </h1>

            <p className="text-slate-500 mt-3">
                {text}
            </p>
        </div>
    );
}

function AboutStat({
    icon,
    value,
    label
}: {
    icon: ReactNode;
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
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[34px] bg-white border border-purple-100 p-7 shadow-sm hover:shadow-xl transition-all">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
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
    icon: ReactNode;
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
    icon: ReactNode;
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

function ContactCard({
    icon,
    title,
    value
}: {
    icon: ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-[30px] bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-slate-400 font-black mt-5">
                {title}
            </p>

            <p className="text-slate-900 font-black mt-2 whitespace-pre-line">
                {value || "-"}
            </p>
        </div>
    );
}

function ProcessCard({
    icon,
    title,
    text
}: {
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[30px] bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#4B1E78] flex items-center justify-center">
                {icon}
            </div>

            <h3 className="font-black text-slate-900 mt-5">
                {title}
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
                {text}
            </p>
        </div>
    );
}

function PromiseItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#4B1E78]" />
            <p className="font-semibold text-slate-700">
                {text}
            </p>
        </div>
    );
}