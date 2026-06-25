import { useEffect, useState } from "react";
import {
    Megaphone,
    Plus,
    Calendar,
    TicketPercent,
    Target
} from "lucide-react";
import StatusBanner from "./StatusBanner";

const emptyCampaignForm = {
    title: "",
    type: "Homepage Banner",
    status: "Draft",
    placement: "Home",
    bannerText: "",
    description: "",
    discountCode: "",
    discountPercentage: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: ""
};

export default function CampaignsView() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [campaignLoading, setCampaignLoading] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [deleteCampaignId, setDeleteCampaignId] = useState<string | null>(null);
    const [campaignForm, setCampaignForm] = useState(emptyCampaignForm);

    const [statusMessage, setStatusMessage] =
        useState<{
            type: "success" | "error" | "warning";
            title: string;
            message: string;
        } | null>(null);

    const loadCampaigns = async () => {
        try {
            setCampaignLoading(true);

            const res = await fetch("http://localhost:5000/api/campaigns");
            const data = await res.json();

            if (data.success) {
                setCampaigns(data.campaigns || []);
            }
        } catch (error) {
            console.error("Campaign loading error:", error);

            setStatusMessage({
                type: "error",
                title: "Campaigns Failed",
                message: "Could not load campaigns."
            });
        } finally {
            setCampaignLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    const saveCampaign = async () => {
        if (!campaignForm.title.trim()) {
            setStatusMessage({
                type: "warning",
                title: "Title Required",
                message: "Please enter a campaign title before saving."
            });
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/campaigns", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(campaignForm)
            });

            const data = await res.json();

            if (!data.success) {
                setStatusMessage({
                    type: "error",
                    title: "Campaign Save Failed",
                    message: data.message || "Campaign could not be saved."
                });
                return;
            }

            setCampaigns(data.campaigns || []);
            setShowCampaignModal(false);
            setDeleteCampaignId(null);
            setCampaignForm(emptyCampaignForm);

            setStatusMessage({
                type: "success",
                title: "Campaign Created",
                message: "Campaign saved successfully and is ready for the store."
            });
        } catch (error) {
            console.error("Campaign save error:", error);

            setStatusMessage({
                type: "error",
                title: "Campaign Save Failed",
                message: "Something went wrong while saving campaign."
            });
        }
    };

    const updateCampaignStatus = async (campaign: any, status: string) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/campaigns/${campaign._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...campaign,
                        status
                    })
                }
            );

            const data = await res.json();

            if (!data.success) {
                setStatusMessage({
                    type: "error",
                    title: "Status Update Failed",
                    message: data.message || "Could not update campaign status."
                });
                return;
            }

            setCampaigns(data.campaigns || []);

            setStatusMessage({
                type: "success",
                title: "Campaign Updated",
                message:
                    status === "Active"
                        ? "This campaign is now active on the store."
                        : "Campaign status updated successfully."
            });
        } catch (error) {
            console.error("Campaign status error:", error);

            setStatusMessage({
                type: "error",
                title: "Status Update Failed",
                message: "Something went wrong while updating status."
            });
        }
    };

    const deleteCampaign = async () => {
        if (!deleteCampaignId) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/campaigns/${deleteCampaignId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await res.json();

            if (!data.success) {
                setStatusMessage({
                    type: "error",
                    title: "Delete Failed",
                    message: data.message || "Campaign could not be deleted."
                });
                return;
            }

            setCampaigns(data.campaigns || []);
            setDeleteCampaignId(null);

            setStatusMessage({
                type: "success",
                title: "Campaign Deleted",
                message: "Campaign removed successfully."
            });
        } catch (error) {
            console.error("Campaign delete error:", error);

            setStatusMessage({
                type: "error",
                title: "Delete Failed",
                message: "Something went wrong while deleting campaign."
            });
        }
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-950">
                        Campaigns
          </h1>
                    <p className="text-sm text-zinc-500 mt-1">
                        Manage homepage banners, coupon offers, flash sales and festival campaigns.
          </p>
                </div>

                <button
                    onClick={() => {
                        setCampaignForm(emptyCampaignForm);
                        setShowCampaignModal(true);
                    }}
                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800"
                >
                    <Plus className="w-4 h-4" />
          New Campaign
        </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <CampaignStat label="Total Campaigns" value={campaigns.length} icon={<Megaphone />} />
                <CampaignStat label="Active" value={campaigns.filter((c) => c.status === "Active").length} icon={<Target />} />
                <CampaignStat label="Scheduled" value={campaigns.filter((c) => c.status === "Scheduled").length} icon={<Calendar />} />
                <CampaignStat label="Coupon Offers" value={campaigns.filter((c) => c.type === "Coupon").length} icon={<TicketPercent />} />
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-zinc-900">
                            Campaign Library
            </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            Campaigns saved in MongoDB and reflected on the store.
            </p>
                    </div>

                    {campaignLoading && (
                        <span className="text-xs text-zinc-400">
                            Loading...
                        </span>
                    )}
                </div>

                <div className="divide-y divide-zinc-100">
                    {!campaignLoading && campaigns.length === 0 && (
                        <div className="p-10 text-center text-zinc-400 text-sm">
                            No campaigns created yet.
                        </div>
                    )}

                    {campaigns.map((campaign) => (
                        <div
                            key={campaign._id}
                            className="p-5 hover:bg-zinc-50/50 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-zinc-950">
                                            {campaign.title || "Untitled Campaign"}
                                        </h3>

                                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold uppercase">
                                            {campaign.type}
                                        </span>

                                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase">
                                            {campaign.placement || "Home"}
                                        </span>

                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${campaign.status === "Active"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : campaign.status === "Scheduled"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : campaign.status === "Expired"
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-zinc-100 text-zinc-600"
                                                }`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-zinc-500">
                                        {campaign.description || "No description added."}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                                        <span>
                                            Code:{" "}
                                            <strong className="text-zinc-700">
                                                {campaign.discountCode || "-"}
                                            </strong>
                                        </span>

                                        <span>
                                            Discount:{" "}
                                            <strong className="text-zinc-700">
                                                {campaign.discountPercentage || 0}%
                      </strong>
                                        </span>

                                        <span>
                                            Start: {campaign.startDate || "-"}
                                        </span>

                                        <span>
                                            End: {campaign.endDate || "-"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={campaign.status}
                                        onChange={(e) =>
                                            updateCampaignStatus(campaign, e.target.value)
                                        }
                                        className="border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white"
                                    >
                                        <option>Draft</option>
                                        <option>Active</option>
                                        <option>Scheduled</option>
                                        <option>Expired</option>
                                    </select>

                                    <button
                                        onClick={() => setDeleteCampaignId(campaign._id)}
                                        className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        Delete
                  </button>
                                </div>
                            </div>

                            {campaign.bannerText && (
                                <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#e31e24] text-white p-4">
                                    <p className="text-sm font-bold">
                                        {campaign.bannerText}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {showCampaignModal && (
                <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-zinc-950">
                            Create Campaign
            </h2>

                        <div className="grid md:grid-cols-2 gap-4 mt-5">
                            <input
                                placeholder="Campaign Title"
                                value={campaignForm.title}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        title: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            />

                            <select
                                value={campaignForm.type}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        type: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            >
                                <option>Homepage Banner</option>
                                <option>Flash Sale</option>
                                <option>Coupon</option>
                                <option>Festival Offer</option>
                            </select>

                            <select
                                value={campaignForm.status}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        status: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            >
                                <option>Draft</option>
                                <option>Active</option>
                                <option>Scheduled</option>
                                <option>Expired</option>
                            </select>

                            <select
                                value={campaignForm.placement}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        placement: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            >
                                <option>Home</option>
                                <option>Products</option>
                                <option>All Store</option>
                            </select>

                            <input
                                placeholder="Discount Code"
                                value={campaignForm.discountCode}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        discountCode: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            />

                            <input
                                type="number"
                                placeholder="Discount Percentage"
                                value={campaignForm.discountPercentage}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        discountPercentage: Number(e.target.value)
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            />

                            <input
                                type="date"
                                value={campaignForm.startDate}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        startDate: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            />

                            <input
                                type="date"
                                value={campaignForm.endDate}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        endDate: e.target.value
                                    })
                                }
                                className="border rounded-xl px-4 py-3 text-sm"
                            />

                            <textarea
                                placeholder="Short Description"
                                value={campaignForm.description}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        description: e.target.value
                                    })
                                }
                                className="md:col-span-2 border rounded-xl px-4 py-3 text-sm min-h-[90px]"
                            />

                            <textarea
                                placeholder="Homepage Banner Text"
                                value={campaignForm.bannerText}
                                onChange={(e) =>
                                    setCampaignForm({
                                        ...campaignForm,
                                        bannerText: e.target.value
                                    })
                                }
                                className="md:col-span-2 border rounded-xl px-4 py-3 text-sm min-h-[80px]"
                            />
                        </div>

                        <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#4B1E78] to-[#e31e24] text-white p-5">
                            <p className="text-xs uppercase tracking-[0.2em] opacity-80">
                                {campaignForm.type}
                            </p>
                            <h3 className="text-2xl font-black mt-2">
                                {campaignForm.title || "Campaign Preview"}
                            </h3>
                            <p className="text-sm text-white/80 mt-2">
                                {campaignForm.bannerText ||
                                    campaignForm.description ||
                                    "Your homepage campaign banner preview will appear here."}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCampaignModal(false);
                                    setDeleteCampaignId(null);
                                }}
                                className="px-5 py-2.5 rounded-xl border text-sm font-bold"
                            >
                                Cancel
              </button>

                            <button
                                onClick={saveCampaign}
                                className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-bold"
                            >
                                Save Campaign
              </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteCampaignId && (
                <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-zinc-950">
                            Delete Campaign?
            </h2>

                        <p className="text-sm text-zinc-500 mt-2">
                            This action cannot be undone.
            </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeleteCampaignId(null)}
                                className="px-5 py-2.5 rounded-xl border text-sm font-bold"
                            >
                                Cancel
              </button>

                            <button
                                onClick={deleteCampaign}
                                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold"
                            >
                                Delete
              </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CampaignStat({
    label,
    value,
    icon
}: {
    label: string;
    value: any;
    icon: any;
}) {
    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
                <p className="text-xs text-zinc-400 uppercase font-bold">
                    {label}
                </p>
                <p className="text-2xl font-black text-zinc-950 mt-2">
                    {value}
                </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center">
                <div className="w-5 h-5">{icon}</div>
            </div>
        </div>
    );
}