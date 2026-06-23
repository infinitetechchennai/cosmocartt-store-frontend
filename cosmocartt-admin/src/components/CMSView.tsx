import { useEffect, useState } from "react";
import StatusBanner from "./StatusBanner";

export default function CMSView() {
    const [cmsPages, setCmsPages] = useState<any[]>([]);
    const [selectedCMS, setSelectedCMS] = useState<any>(null);
    const [showCMSModal, setShowCMSModal] = useState(false);

    const [statusMessage, setStatusMessage] =
        useState<{
            type: "success" | "error" | "warning";
            title: string;
            message: string;
        } | null>(null);

    const cmsSections = [
        { key: "about", title: "About Us" },
        { key: "contact", title: "Contact Information" },
        { key: "privacy", title: "Privacy Policy" },
        { key: "terms", title: "Terms & Conditions" },
        { key: "faq", title: "FAQ" },
        { key: "seo", title: "SEO Settings" }
    ];

    const loadCMSPages = async () => {
        const res = await fetch("http://localhost:5000/api/cms");
        const data = await res.json();

        if (data.success) {
            setCmsPages(data.pages || []);
        }
    };

    useEffect(() => {
        loadCMSPages();
    }, []);

    const saveCMS = async () => {
        if (!selectedCMS?.title) return;

        const res = await fetch(
            `http://localhost:5000/api/cms/${selectedCMS.key}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(selectedCMS)
            }
        );

        const data = await res.json();

        if (!data.success) {
            setStatusMessage({
                type: "error",
                title: "Save Failed",
                message: data.message || "CMS content could not be saved."
            });
            return;
        }

        await loadCMSPages();

        setShowCMSModal(false);

        setStatusMessage({
            type: "success",
            title: "CMS Updated",
            message: "Content saved successfully."
        });
    };

    return (
        <div className="space-y-6 text-left">
            {statusMessage && (
                <StatusBanner
                    type={statusMessage.type}
                    title={statusMessage.title}
                    message={statusMessage.message}
                    onClose={() => setStatusMessage(null)}
                />
            )}

            <div>
                <h1 className="text-2xl font-bold text-zinc-950">
                    Content Management System
        </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Manage store content, legal pages and SEO information.
        </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {cmsSections.map((section) => {
                    const existing = cmsPages.find(
                        (p) => p.key === section.key
                    );

                    return (
                        <div
                            key={section.key}
                            className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs"
                        >
                            <h3 className="font-bold text-zinc-900">
                                {section.title}
                            </h3>

                            <p className="text-sm text-zinc-500 mt-2 min-h-[60px]">
                                {existing?.content
                                    ? existing.content.substring(0, 120) + "..."
                                    : "No content added yet."}
                            </p>

                            <div className="flex items-center justify-between mt-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${existing?.status === "Published"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-zinc-100 text-zinc-500"
                                        }`}
                                >
                                    {existing?.status || "Draft"}
                                </span>

                                <button
                                    onClick={() => {
                                        setSelectedCMS(
                                            existing || {
                                                key: section.key,
                                                title: section.title,
                                                content: "",
                                                metaTitle: "",
                                                metaDescription: "",
                                                status: "Draft"
                                            }
                                        );

                                        setShowCMSModal(true);
                                    }}
                                    className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold"
                                >
                                    Edit Content
                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showCMSModal && selectedCMS && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl">
                        <h2 className="text-xl font-bold text-zinc-950">
                            {selectedCMS.title}
                        </h2>

                        <div className="space-y-4 mt-5">
                            <input
                                value={selectedCMS.title}
                                onChange={(e) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        title: e.target.value
                                    })
                                }
                                placeholder="Page Title"
                                className="w-full border rounded-xl px-4 py-3 text-sm"
                            />

                            <input
                                value={selectedCMS.metaTitle}
                                onChange={(e) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        metaTitle: e.target.value
                                    })
                                }
                                placeholder="Meta Title"
                                className="w-full border rounded-xl px-4 py-3 text-sm"
                            />

                            <textarea
                                value={selectedCMS.content}
                                onChange={(e) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        content: e.target.value
                                    })
                                }
                                placeholder="Page Content"
                                className="w-full border rounded-xl px-4 py-3 h-48 text-sm"
                            />

                            <textarea
                                value={selectedCMS.metaDescription}
                                onChange={(e) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        metaDescription: e.target.value
                                    })
                                }
                                placeholder="Meta Description"
                                className="w-full border rounded-xl px-4 py-3 h-24 text-sm"
                            />

                            <select
                                value={selectedCMS.status}
                                onChange={(e) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        status: e.target.value
                                    })
                                }
                                className="w-full border rounded-xl px-4 py-3 text-sm"
                            >
                                <option>Draft</option>
                                <option>Published</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCMSModal(false)}
                                className="px-5 py-2.5 rounded-xl border text-sm font-bold"
                            >
                                Cancel
              </button>

                            <button
                                onClick={saveCMS}
                                className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-bold"
                            >
                                Save CMS
              </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}