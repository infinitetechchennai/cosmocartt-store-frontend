import { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface Props {
    children: ReactNode;
}

export default function StoreLayout({
    children
}: Props) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            {children}
        </div>
    );
}