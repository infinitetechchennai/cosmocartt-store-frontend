import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth(); 
  const location = useLocation();

  // Waiting for auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">

          {/* Premium Loader */}

          <div
            className="
              w-14
              h-14
              rounded-full
              border-4
              border-slate-200
              border-t-[#4B1E78]
              animate-spin
            "
          />

          <p className="text-slate-500 font-medium">
            Loading your experience...
          </p>

        </div>
      </div>
    );
  }

  // If not logged in → redirect
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}