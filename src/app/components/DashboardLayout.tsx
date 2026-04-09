import { useNavigate, useLocation } from "react-router";
import { Bell, ChevronDown, MessageSquare } from "lucide-react";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumb?: string;
}

export function DashboardLayout({ children, breadcrumb }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "health-overview", label: "Health Overview", path: "/health-overview" },
    { id: "ai-prediction", label: "AI Prediction", path: "/ai-prediction" },
    { id: "reports", label: "Reports", path: "/reports" },
  ];

  const activeItem = navItems.find(item => location.pathname === item.path)?.id || "dashboard";

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col">
      {/* Navbar */}
      <header className="h-[56px] px-[24px] flex items-center justify-between bg-white border-b border-[#E5E5E5]">
        {/* Left: Wordmark */}
        <button
          onClick={() => navigate("/")}
          className="text-[16px] font-medium text-[#111111] hover:text-[#1A6BFA] transition-colors"
        >
          MedHistory Lens
        </button>

        {/* Center: Breadcrumb */}
        <div className="text-[13px] text-[#6B6B6B]">
          Dashboard › {breadcrumb || "My Dashboard"}
        </div>

        {/* Right: Notification + Avatar */}
        <div className="flex items-center gap-[16px]">
          <button className="w-[40px] h-[40px] rounded-full hover:bg-[#F5F5F4] flex items-center justify-center transition-colors">
            <Bell className="w-[20px] h-[20px] text-[#6B6B6B]" strokeWidth={1.5} />
          </button>
          <button className="flex items-center gap-[8px] hover:bg-[#F5F5F4] rounded-[8px] px-[8px] py-[4px] transition-colors">
            <div className="w-[32px] h-[32px] rounded-full bg-[#1A6BFA] flex items-center justify-center">
              <span className="text-[13px] font-semibold text-white">JD</span>
            </div>
            <ChevronDown className="w-[16px] h-[16px] text-[#6B6B6B]" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[240px] bg-white border-r border-[#E5E5E5]">
          {/* Patient info */}
          <div className="p-[24px] pb-[16px]">
            <div className="w-12 h-12 rounded-full bg-[#F0F0EF] flex items-center justify-center mb-3">
              <span className="text-[15px] font-semibold text-[#111111]">JD</span>
            </div>
            <div className="text-[12px] text-[#6B6B6B] tracking-[0.04em]">REPORT DATE</div>
            <div className="text-[13px] text-[#111111] font-medium">March 15, 2026</div>
          </div>

          {/* Main navigation */}
          <nav className="px-[16px] pb-[16px]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-[16px] py-[10px] rounded-[6px] text-[15px] transition-colors relative ${
                  activeItem === item.id
                    ? "text-[#111111] font-semibold"
                    : "text-[#6B6B6B] hover:bg-[#F5F5F4] hover:text-[#111111]"
                }`}
              >
                {activeItem === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#1A6BFA] rounded-r-full" />
                )}
                {item.label}
              </button>
            ))}
          </nav>

        </aside>

        {/* Main content */}
        <main className="flex-1 p-[32px] pt-[28px]">
          {children}
        </main>
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => navigate("/chat")}
        className="fixed bottom-[32px] right-[32px] w-[56px] h-[56px] bg-[#1A6BFA] rounded-full shadow-[0_8px_24px_rgba(26,107,250,0.4)] hover:shadow-[0_12px_32px_rgba(26,107,250,0.5)] hover:scale-110 transition-all flex items-center justify-center z-50 group"
      >
        <MessageSquare className="w-[24px] h-[24px] text-white" strokeWidth={1.5} />
        <div className="absolute -top-[40px] right-0 bg-[#111111] text-white px-[12px] py-[6px] rounded-[6px] text-[13px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask AI Assistant
        </div>
      </button>
    </div>
  );
}