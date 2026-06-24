import { useEffect, useState } from "react";

export default function CampaignBanner() {
    const [campaign, setCampaign] = useState<any>(null);

    useEffect(() => {
        const loadCampaign = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/api/campaigns/active/home"
                );

                const data = await res.json();

                if (data.success && data.campaign) {
                    setCampaign(data.campaign);
                } else {
                    setCampaign(null);
                }
            } catch (error) {
                console.error("Campaign load failed:", error);
                setCampaign(null);
            }
        };

        loadCampaign();
    }, []);

    if (!campaign) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 mt-5">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4B1E78] via-[#6D28D9] to-[#9333EA] p-8 md:p-10 text-white shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%)]" />

                <div className="relative z-10 max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/75">
                        {campaign.type}
                    </p>

                    <h2 className="text-3xl md:text-5xl font-black mt-3 leading-tight">
                        {campaign.title}
                    </h2>

                    <p className="mt-4 text-white/85 text-base md:text-lg leading-7">
                        {campaign.bannerText ||
                            campaign.description ||
                            "Limited time offer is now live on CosmoCartt."}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-6">
                        {campaign.discountPercentage > 0 && (
                            <span className="bg-white text-[#4B1E78] px-4 py-2 rounded-full text-sm font-black">
                                {campaign.discountPercentage}% OFF
                            </span>
                        )}

                        {campaign.discountCode && (
                            <span className="border border-white/30 bg-white/10 px-4 py-2 rounded-full text-sm font-bold">
                                Code: {campaign.discountCode}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}