import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#64748B] text-[15px]">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
