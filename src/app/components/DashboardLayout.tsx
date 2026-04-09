import { useNavigate, useLocation } from "react-router";
import { MessageSquare, LayoutDashboard, Activity, BrainCircuit, FileSearch, LogOut } from "lucide-react";
import { ReactNode, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumb?: string;
}

export function DashboardLayout({ children, breadcrumb }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const profileName = user?.name || user?.email?.split('@')[0] || "User";

  const initials = useMemo(() => {
    const parts = profileName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [profileName]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { id: "health-overview", label: "Health Overview", path: "/health-overview", icon: Activity },
    { id: "ai-prediction", label: "AI Prediction", path: "/ai-prediction", icon: BrainCircuit },
    { id: "reports", label: "Reports", path: "/reports", icon: FileSearch },
  ];

  const activeItem = navItems.find(item => location.pathname === item.path)?.id || "dashboard";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#8B5CF6]/20 selection:text-[#6D28D9]">
      {/* Soft background gradients for light mode */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#8B5CF6]/10 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Top Bar */}
      <header className="h-[72px] sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-[#E2E8F0] flex items-center justify-between px-[32px] shadow-sm">
        <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-[0_4px_12px_rgba(139,92,246,0.3)]">
            <Activity className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-semibold tracking-tight text-[#0F172A]">
            MedHistory <span className="font-light text-[#64748B]">Lens</span>
          </span>
        </div>

        <div className="flex items-center gap-[16px]">
          <div className="flex flex-col items-end mr-[8px]">
            <span className="text-[14px] font-medium text-[#1E293B]">{profileName}</span>
            <span className="text-[11px] text-[#64748B] uppercase tracking-widest font-semibold flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Active User
            </span>
          </div>
          <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-white to-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[15px] font-bold text-[#7D52F4] z-10">{initials}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <aside className="w-[260px] bg-white/60 backdrop-blur-2xl border-r border-[#E2E8F0] flex flex-col pt-[32px]">
          <nav className="px-[16px] pb-[24px] flex-1 space-y-[4px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full group flex items-center gap-[14px] px-[18px] py-[14px] rounded-[14px] text-[14px] font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive ? "text-[#6D28D9] bg-white shadow-sm border border-[#E2E8F0]" : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/60 border border-transparent"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-[25%] bottom-[25%] w-[3px] bg-[#8B5CF6] rounded-r-full shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
                  )}
                  <Icon 
                    className={`w-[18px] h-[18px] z-10 transition-colors ${isActive ? "text-[#8B5CF6]" : "text-[#94A3B8] group-hover:text-[#64748B]"}`} 
                    strokeWidth={isActive ? 2.5 : 1.8} 
                  />
                  <span className="z-10 tracking-wide">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-[20px] pb-[32px]">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-[8px] px-[16px] py-[12px] rounded-[12px] text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FCA5A5] transition-all duration-300"
            >
              <LogOut className="w-[16px] h-[16px]" strokeWidth={2} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Pane wrapper */}
        <div className="flex-1 flex flex-col h-[calc(100vh-72px)] overflow-hidden relative">
          <main className="flex-1 p-[40px] overflow-y-auto max-w-[1600px] w-full mx-auto">
            <div className="text-[12px] text-[#64748B] mb-[24px] uppercase tracking-widest font-semibold flex items-center gap-[8px]">
              <span>System</span>
              <span className="text-[#8B5CF6] text-[10px] w-[4px] h-[4px] rounded-full bg-[#8B5CF6]" />
              <span className="text-[#1E293B]">{breadcrumb || "Overview"}</span>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => navigate("/chat")}
        className="fixed bottom-[40px] right-[40px] w-[64px] h-[64px] bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-full shadow-[0_8px_32px_rgba(139,92,246,0.35)] hover:shadow-[0_16px_48px_rgba(139,92,246,0.5)] hover:scale-[1.05] transition-all duration-500 flex items-center justify-center z-50 group border border-white/40 overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="w-[26px] h-[26px] text-white relative z-10" strokeWidth={2} />
        <div className="absolute -top-[48px] right-0 bg-white/90 backdrop-blur-xl border border-[#E2E8F0] text-[#6D28D9] px-[16px] py-[8px] rounded-[10px] text-[13px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none shadow-xl">
          MedAI Copilot
        </div>
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-white/40 animate-[spin_4s_linear_infinite]" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
        <div className="absolute inset-2 rounded-full border-[1.5px] border-white/20 animate-[spin_3s_linear_infinite_reverse]" style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
      </button>
    </div>
  );
}
