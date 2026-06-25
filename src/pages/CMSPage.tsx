import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
                    `http://localhost:5000/api/cms/${key}`
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
                <>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#4B1E78] font-black">
                        About CosmoCartt
          </p>

                    <h1 className="text-4xl md:text-5xl font-black text-zinc-950 mt-3 leading-tight">
                        {fields.heroTitle || page.title}
                    </h1>

                    {fields.heroSubtitle && (
                        <p className="text-lg text-zinc-500 mt-4 leading-8 max-w-3xl">
                            {fields.heroSubtitle}
                        </p>
                    )}

                    {fields.content && (
                        <div className="mt-10 text-zinc-600 leading-8 whitespace-pre-line">
                            {fields.content}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 mt-10">
                        {fields.mission && (
                            <div className="rounded-3xl bg-purple-50 border border-purple-100 p-6">
                                <h2 className="text-xl font-black text-[#4B1E78]">
                                    Our Mission
                </h2>

                                <p className="text-zinc-600 leading-7 mt-3 whitespace-pre-line">
                                    {fields.mission}
                                </p>
                            </div>
                        )}

                        {fields.vision && (
                            <div className="rounded-3xl bg-orange-50 border border-orange-100 p-6">
                                <h2 className="text-xl font-black text-orange-600">
                                    Our Vision
                </h2>

                                <p className="text-zinc-600 leading-7 mt-3 whitespace-pre-line">
                                    {fields.vision}
                                </p>
                            </div>
                        )}
                    </div>
                </>
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
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-5 py-14">
                <div className="bg-white border border-zinc-100 rounded-3xl p-8 md:p-12 shadow-sm">
                    {loading ? (
                        <p className="text-zinc-500">
                            Loading page...
                        </p>
                    ) : !page ? (
                        <div>
                            <h1 className="text-4xl font-black text-zinc-950">
                                Page Not Found
              </h1>

                            <p className="text-zinc-500 mt-3">
                                This CMS page has not been created yet.
              </p>
                        </div>
                    ) : (
                        renderPageContent()
                    )}
                </div>
            </main>

            <Footer />
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