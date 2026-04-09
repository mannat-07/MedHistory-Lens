import { useNavigate } from "react-router";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1A6BFA] to-[#0EA5E9] flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#0F172A]">MedHistory Lens</span>
            </div>
            <p className="text-sm text-[#64748B]">Clear AI insights from your medical reports, built for everyday health confidence.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0F172A] mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              {isAuthenticated ? (
                <>
                  <button onClick={() => navigate("/dashboard")} className="block text-[#64748B] hover:text-[#1A6BFA]">Dashboard</button>
                  <button onClick={() => navigate("/reports")} className="block text-[#64748B] hover:text-[#1A6BFA]">My Reports</button>
                  <button onClick={() => navigate("/health-overview")} className="block text-[#64748B] hover:text-[#1A6BFA]">Health Overview</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate("/")} className="block text-[#64748B] hover:text-[#1A6BFA]">Home</button>
                  <button onClick={() => navigate("/signin")} className="block text-[#64748B] hover:text-[#1A6BFA]">Login</button>
                  <button onClick={() => navigate("/signup")} className="block text-[#64748B] hover:text-[#1A6BFA]">Sign Up</button>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0F172A] mb-3">Legal</h4>
            <div className="space-y-2 text-sm text-[#64748B]">
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-xs text-[#94A3B8]">
          © 2026 MedHistory Lens. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
