import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Bell, ChevronDown, HeartPulse } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const showLoggedMenu = isAuthenticated;
  const profileName = user?.name || localStorage.getItem("profile_name") || "Guest User";

  const initials = useMemo(() => {
    const parts = profileName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "GU";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [profileName]);

  const publicItems = [
    { label: "Home", href: "#top" },
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  const appItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Reports", path: "/reports" },
    { label: "Health Overview", path: "/health-overview" },
    { label: "AI Predictions", path: "/ai-prediction" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#E6EEF8] bg-white/90 backdrop-blur-md shadow-[0_6px_20px_rgba(16,80,160,0.06)]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A6BFA] to-[#0EA5E9] flex items-center justify-center shadow-sm">
            <HeartPulse className="w-5 h-5 text-white" strokeWidth={1.8} />
          </div>
          <span className="text-[17px] font-semibold text-[#0F172A]">MedHistory Lens</span>
        </button>

        <nav className="hidden md:flex items-center gap-6">
          {showLoggedMenu
            ? appItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`text-[14px] transition-colors ${
                    location.pathname === item.path ? "text-[#1A6BFA] font-semibold" : "text-[#475569] hover:text-[#1A6BFA]"
                  }`}
                >
                  {item.label}
                </button>
              ))
            : publicItems.map((item) => (
                <a key={item.href} href={item.href} className="text-[14px] text-[#475569] hover:text-[#1A6BFA] transition-colors">
                  {item.label}
                </a>
              ))}
        </nav>

        <div className="flex items-center gap-3">
          {!showLoggedMenu ? (
            <>
              <button onClick={() => navigate("/signin")} className="px-4 py-2 text-sm text-[#334155] hover:text-[#1A6BFA]">
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 rounded-lg bg-[#1A6BFA] text-white text-sm font-medium hover:bg-[#1557CC] transition-colors"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button className="w-9 h-9 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#64748B]" strokeWidth={1.6} />
              </button>
              <div className="relative">
                <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#F8FAFC]">
                  <div className="w-8 h-8 rounded-full bg-[#1A6BFA] text-white text-xs font-semibold flex items-center justify-center">
                    {initials}
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#64748B]" />
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1">
                    <button onClick={() => setOpen(false)} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#F8FAFC]">Profile</button>
                    <button onClick={() => { navigate("/reports"); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#F8FAFC]">My Reports</button>
                    <button onClick={() => setOpen(false)} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#F8FAFC]">Settings</button>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-[#B91C1C] rounded-lg hover:bg-[#FEF2F2]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
