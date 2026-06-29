import { API_URL, apiPath } from "../config/api";
import { useEffect, useState } from "react";
import StatusBanner from "./StatusBanner";

type StatusType = "success" | "error" | "warning";

const cmsSections = [
    {
        key: "about",
        title: "About Us",
        description: "Brand story, mission, vision and company overview."
    },
    {
        key: "contact",
        title: "Contact Us",
        description: "Customer support contact details and store address."
    },
    {
        key: "privacy",
        title: "Privacy Policy",
        description: "Privacy, data handling and customer information policy."
    },
    {
        key: "terms",
        title: "Terms & Conditions",
        description: "Purchase terms, usage rules and legal conditions."
    },
    {
        key: "faq",
        title: "FAQ",
        description: "Frequently asked questions shown on the store."
    },
    {
        key: "refund-policy",
        title: "Refund Policy",
        description: "Refund eligibility, timelines and processing rules."
    },
    {
        key: "shipping-policy",
        title: "Shipping Policy",
        description: "Shipping timelines, delivery coverage and courier rules."
    }
];

const defaultFields: any = {
    about: {
        heroTitle: "",
        heroSubtitle: "",
        content: "",
        mission: "",
        vision: ""
    },
    contact: {
        phone: "",
        email: "",
        address: "",
        supportHours: "",
        mapUrl: ""
    },
    privacy: {
        content: "",
        effectiveDate: ""
    },
    terms: {
        content: "",
        effectiveDate: ""
    },
    faq: {
        questions: [
            {
                question: "",
                answer: ""
            }
        ]
    },
    "refund-policy": {
        content: "",
        effectiveDate: ""
    },
    "shipping-policy": {
        content: "",
        effectiveDate: ""
    }
};

export default function CMSView() {
    const [cmsPages, setCmsPages] = useState<any[]>([]);
    const [selectedCMS, setSelectedCMS] = useState<any>(null);
    const [showCMSModal, setShowCMSModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [statusMessage, setStatusMessage] =
        useState<{
            type: StatusType;
            title: string;
            message: string;
        } | null>(null);

    const loadCMSPages = async () => {
        try {
            setLoading(true);

            const res = await fetch(apiPath("/api/cms"));
            const data = await res.json();

            if (data.success) {
                setCmsPages(data.pages || []);
            }
        } catch (error) {
            console.error("CMS loading error:", error);

            setStatusMessage({
                type: "error",
                title: "CMS Load Failed",
                message: "Could not load CMS content."
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCMSPages();
    }, []);

    const openCMS = (section: any) => {
        const existing = cmsPages.find(
            (p) => p.key === section.key
        );

        setSelectedCMS({
            key: section.key,
            title: existing?.title || section.title,
            status: existing?.status || "Draft",
            metaTitle: existing?.metaTitle || "",
            metaDescription: existing?.metaDescription || "",
            content: existing?.content || "",
            fields: {
                ...(defaultFields[section.key] || {}),
                ...(existing?.fields || {})
            }
        });

        setShowCMSModal(true);
    };

    const updateField = (field: string, value: any) => {
        setSelectedCMS({
            ...selectedCMS,
            fields: {
                ...selectedCMS.fields,
                [field]: value
            }
        });
    };

    const updateFAQ = (
        index: number,
        field: "question" | "answer",
        value: string
    ) => {
        const questions = [
            ...(selectedCMS.fields.questions || [])
        ];

        questions[index] = {
            ...questions[index],
            [field]: value
        };

        updateField("questions", questions);
    };

    const addFAQ = () => {
        const questions =
            selectedCMS.fields.questions || [];

        updateField("questions", [
            ...questions,
            {
                question: "",
                answer: ""
            }
        ]);
    };

    const removeFAQ = (index: number) => {
        const questions =
            selectedCMS.fields.questions || [];

        updateField(
            "questions",
            questions.filter(
                (_: any, i: number) => i !== index
            )
        );
    };

    const saveCMS = async () => {
        if (!selectedCMS?.title?.trim()) {
            setStatusMessage({
                type: "warning",
                title: "Title Required",
                message: "Please enter a CMS page title."
            });
            return;
        }

        try {
            const res = await fetch(
                `${API_URL}/api/cms/${selectedCMS.key}`,
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
                    message:
                        data.message ||
                        "CMS content could not be saved."
                });

                return;
            }

            await loadCMSPages();

            setShowCMSModal(false);

            setStatusMessage({
                type: "success",
                title: "CMS Updated",
                message:
                    `${selectedCMS.title} was saved successfully.`
            });
        } catch (error) {
            console.error("CMS save error:", error);

            setStatusMessage({
                type: "error",
                title: "Save Failed",
                message:
                    "Something went wrong while saving CMS content."
            });
        }
    };

    const renderSpecificFields = () => {
        if (!selectedCMS) return null;

        if (selectedCMS.key === "about") {
            return (
                <>
                    <CMSInput
                        label="Hero Title"
                        value={selectedCMS.fields.heroTitle}
                        onChange={(value) =>
                            updateField("heroTitle", value)
                        }
                    />

                    <CMSInput
                        label="Hero Subtitle"
                        value={selectedCMS.fields.heroSubtitle}
                        onChange={(value) =>
                            updateField("heroSubtitle", value)
                        }
                    />

                    <CMSTextarea
                        label="Main Content"
                        value={selectedCMS.fields.content}
                        onChange={(value) =>
                            updateField("content", value)
                        }
                        rows={5}
                    />

                    <CMSTextarea
                        label="Mission"
                        value={selectedCMS.fields.mission}
                        onChange={(value) =>
                            updateField("mission", value)
                        }
                        rows={3}
                    />

                    <CMSTextarea
                        label="Vision"
                        value={selectedCMS.fields.vision}
                        onChange={(value) =>
                            updateField("vision", value)
                        }
                        rows={3}
                    />
                </>
            );
        }

        if (selectedCMS.key === "contact") {
            return (
                <>
                    <CMSInput
                        label="Phone Number"
                        value={selectedCMS.fields.phone}
                        onChange={(value) =>
                            updateField("phone", value)
                        }
                    />

                    <CMSInput
                        label="Support Email"
                        value={selectedCMS.fields.email}
                        onChange={(value) =>
                            updateField("email", value)
                        }
                    />

                    <CMSTextarea
                        label="Store Address"
                        value={selectedCMS.fields.address}
                        onChange={(value) =>
                            updateField("address", value)
                        }
                        rows={3}
                    />

                    <CMSInput
                        label="Support Hours"
                        value={selectedCMS.fields.supportHours}
                        onChange={(value) =>
                            updateField("supportHours", value)
                        }
                    />

                    <CMSInput
                        label="Google Map URL"
                        value={selectedCMS.fields.mapUrl}
                        onChange={(value) =>
                            updateField("mapUrl", value)
                        }
                    />
                </>
            );
        }

        if (selectedCMS.key === "faq") {
            const questions =
                selectedCMS.fields.questions || [];

            return (
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-zinc-900">
                            FAQ Questions
            </h3>

                        <button
                            onClick={addFAQ}
                            className="px-3 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold"
                        >
                            Add Question
            </button>
                    </div>

                    {questions.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="border border-zinc-200 rounded-2xl p-4 space-y-3"
                        >
                            <CMSInput
                                label={`Question ${index + 1}`}
                                value={item.question}
                                onChange={(value) =>
                                    updateFAQ(index, "question", value)
                                }
                            />

                            <CMSTextarea
                                label={`Answer ${index + 1}`}
                                value={item.answer}
                                onChange={(value) =>
                                    updateFAQ(index, "answer", value)
                                }
                                rows={3}
                            />

                            {questions.length > 1 && (
                                <button
                                    onClick={() => removeFAQ(index)}
                                    className="text-xs font-bold text-red-600"
                                >
                                    Remove Question
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <>
                <CMSInput
                    label="Effective Date"
                    type="date"
                    value={selectedCMS.fields.effectiveDate}
                    onChange={(value) =>
                        updateField("effectiveDate", value)
                    }
                />

                <CMSTextarea
                    label="Policy Content"
                    value={selectedCMS.fields.content}
                    onChange={(value) =>
                        updateField("content", value)
                    }
                    rows={9}
                />
            </>
        );
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
                    Manage store pages with page-specific fields and SEO metadata.
        </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {cmsSections.map((section) => {
                    const existing =
                        cmsPages.find(
                            (p) => p.key === section.key
                        );

                    return (
                        <div
                            key={section.key}
                            className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-bold text-zinc-900">
                                        {section.title}
                                    </h3>

                                    <p className="text-sm text-zinc-500 mt-2 min-h-[50px]">
                                        {section.description}
                                    </p>
                                </div>

                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold shrink-0 ${existing?.status === "Published"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-zinc-100 text-zinc-500"
                                        }`}
                                >
                                    {existing?.status || "Draft"}
                                </span>
                            </div>

                            <div className="mt-4 text-xs text-zinc-400">
                                Last updated:{" "}
                                {existing?.updatedAt
                                    ? new Date(
                                        existing.updatedAt
                                    ).toLocaleDateString()
                                    : "Never"}
                            </div>

                            <button
                                onClick={() => openCMS(section)}
                                className="mt-5 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold"
                            >
                                Edit Content
              </button>
                        </div>
                    );
                })}
            </div>

            {loading && (
                <p className="text-sm text-zinc-400">
                    Loading CMS pages...
                </p>
            )}

            {showCMSModal && selectedCMS && (
                <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-950">
                                    {selectedCMS.title}
                                </h2>

                                <p className="text-sm text-zinc-500 mt-1">
                                    Edit page-specific fields and SEO settings.
                </p>
                            </div>

                            <select
                                value={selectedCMS.status}
                                onChange={(e) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        status: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            >
                                <option>Draft</option>
                                <option>Published</option>
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            <CMSInput
                                label="Page Title"
                                value={selectedCMS.title}
                                onChange={(value) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        title: value
                                    })
                                }
                            />

                            <CMSInput
                                label="Meta Title"
                                value={selectedCMS.metaTitle}
                                onChange={(value) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        metaTitle: value
                                    })
                                }
                            />

                            <CMSTextarea
                                label="Meta Description"
                                value={selectedCMS.metaDescription}
                                onChange={(value) =>
                                    setSelectedCMS({
                                        ...selectedCMS,
                                        metaDescription: value
                                    })
                                }
                                rows={3}
                            />

                            {renderSpecificFields()}
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

function CMSInput({
    label,
    value,
    onChange,
    type = "text"
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <label className="block">
            <span className="text-xs font-bold text-zinc-500 uppercase">
                {label}
            </span>

            <input
                type={type}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900"
            />
        </label>
    );
}

function CMSTextarea({
    label,
    value,
    onChange,
    rows = 4
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}) {
    return (
        <label className="block md:col-span-2">
            <span className="text-xs font-bold text-zinc-500 uppercase">
                {label}
            </span>

            <textarea
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="mt-1 w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-zinc-900"
            />
        </label>
    );
}