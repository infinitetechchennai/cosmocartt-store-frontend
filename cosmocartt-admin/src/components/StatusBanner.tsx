import { CheckCircle, AlertCircle, X } from "lucide-react";

interface StatusBannerProps {
    type: "success" | "error" | "warning";
    title: string;
    message: string;
    onClose: () => void;
}

export default function StatusBanner({
    type,
    title,
    message,
    onClose
}: StatusBannerProps) {
    const styles = {
        success: {
            box: "bg-emerald-50 border-emerald-200 text-emerald-800",
            icon: "text-emerald-600",
            Icon: CheckCircle
        },
        error: {
            box: "bg-red-50 border-red-200 text-red-800",
            icon: "text-red-600",
            Icon: AlertCircle
        },
        warning: {
            box: "bg-amber-50 border-amber-200 text-amber-800",
            icon: "text-amber-600",
            Icon: AlertCircle
        }
    };

    const current = styles[type];
    const Icon = current.Icon;

    return (
        <div
            className={`border rounded-2xl p-4 flex items-start gap-3 shadow-sm ${current.box}`}
        >
            <Icon className={`w-5 h-5 mt-0.5 ${current.icon}`} />

            <div className="flex-1">
                <h3 className="font-bold text-sm">
                    {title}
                </h3>

                <p className="text-sm opacity-80 mt-1">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="opacity-60 hover:opacity-100"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}