import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle2,
  ShieldAlert,
  FileText
} from "lucide-react";

export default function B2BView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [b2bClients, setB2bClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const customersRes = await fetch(
          "http://localhost:5000/api/customers"
        );

        const customersData = await customersRes.json();

        const customersArray = Array.isArray(customersData)
          ? customersData
          : customersData.customers || customersData.data || [];

        const b2bOnly = customersArray.filter(
          (customer: any) => customer.customerType === "b2b"
        );

        setB2bClients(b2bOnly);

        const ordersRes = await fetch(
          "http://localhost:5000/api/orders"
        );

        const ordersData = await ordersRes.json();

        const ordersArray = Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || ordersData.data || [];

        setOrders(ordersArray);
      } catch (error) {
        console.error("B2B data loading error:", error);
      }
    };

    loadData();
  }, []);

  const filteredClients = b2bClients.filter((client) => {
    const businessName = client.businessName || "";
    const contactPerson = client.contactPerson || "";
    const gstNumber = client.gstNumber || "";

    return (
      businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gstNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const b2bEmails = b2bClients.map((client) => client.email);

  const totalB2BRevenue = orders
    .filter((order) => b2bEmails.includes(order.email))
    .reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || order.total || 0),
      0
    );

  const formatRupeeVal = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const updateStatus = async (
    id: string,
    verificationStatus: "Verified" | "Rejected"
  ) => {
    try {
      await fetch(
        `http://localhost:5000/api/customers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            verificationStatus
          })
        }
      );

      setB2bClients(
        b2bClients.map((client) =>
          client._id === id
            ? {
              ...client,
              verificationStatus
            }
            : client
        )
      );
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  return (
    <div id="b2b-view-container" className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950 font-sans">
          B2B Management
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          Configure GST approvals, verify B2B buyers, and monitor wholesale transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0B0C10] text-[#ff4b4b] border border-zinc-900 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">
            Approved B2B Buyers
          </span>

          <span className="text-3xl font-black block mt-2">
            {
              b2bClients.filter(
                (client) => client.verificationStatus === "Verified"
              ).length
            }
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Pending GST Approvals
          </span>

          <span className="text-3xl font-bold text-zinc-900 block mt-2">
            {
              b2bClients.filter(
                (client) => client.verificationStatus === "Pending"
              ).length
            }
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Total B2B Revenue
          </span>

          <span className="text-3xl font-bold text-[#e31e24] block mt-2">
            {formatRupeeVal(totalB2BRevenue)}
          </span>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-150 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />

          <input
            type="text"
            placeholder="Search B2B buyers by business name, contact person, or GST number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full py-1 text-zinc-800 focus:ring-0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 text-xs font-semibold text-zinc-400 uppercase border-b border-zinc-150 text-left">
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">GST Number</th>
                <th className="px-6 py-4">GST Certificate</th>
                <th className="px-6 py-4">Verification Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 text-sm">
              {filteredClients.map((client) => {
                const gstUrl = client.gstCertificate?.startsWith("http")
                  ? client.gstCertificate
                  : `http://localhost:5000${client.gstCertificate}`;

                return (
                  <tr
                    key={client._id}
                    className="hover:bg-zinc-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-zinc-900">
                        {client.businessName || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-zinc-700">
                      {client.contactPerson || client.name || "-"}
                    </td>

                    <td className="px-6 py-4 font-mono text-zinc-900">
                      {client.gstNumber || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {client.gstCertificate ? (
                        <a
                          href={gstUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          View PDF
                        </a>
                      ) : (
                        <span className="text-zinc-400">Not uploaded</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${client.verificationStatus === "Verified"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : client.verificationStatus === "Rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                      >
                        {client.verificationStatus || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {client.verificationStatus !== "Verified" && (
                          <button
                            onClick={() =>
                              updateStatus(client._id, "Verified")
                            }
                            className="p-1 px-2.5 rounded-lg border border-emerald-100 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        )}

                        {client.verificationStatus !== "Rejected" && (
                          <button
                            onClick={() =>
                              updateStatus(client._id, "Rejected")
                            }
                            className="p-1 px-2.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredClients.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-zinc-400"
                  >
                    No B2B buyers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}