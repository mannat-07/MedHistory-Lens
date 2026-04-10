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
    <div className="min-h-screen bg-[#FAFAF7] text-[#18181B] flex flex-col font-sans selection:bg-[#4C1D95]/20 selection:text-[#4C1D95]">
      {/* Soft background gradients for light mode */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#4C1D95]/5 blur-[160px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/5 blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Top Bar */}
      <header className="h-[72px] sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E4E4E7] flex items-center justify-between px-[32px] shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-[36px] h-[36px] rounded-[10px] bg-[#4C1D95] flex items-center justify-center shadow-[0_4px_12px_rgba(76,29,149,0.2)]">
            <Activity className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-bold tracking-tight text-[#18181B]">
            MedHistory <span className="font-normal text-[#52525B]">Lens</span>
          </span>
        </div>

        <div className="flex items-center gap-[16px]">
          <div className="flex flex-col items-end mr-[8px]">
            <span className="text-[14px] font-semibold text-[#18181B]">{profileName}</span>
            <span className="text-[11px] text-[#52525B] uppercase tracking-widest font-semibold flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Active User
            </span>
          </div>
          <div className="w-[44px] h-[44px] rounded-full bg-[#FAFAF7] border border-[#E4E4E7] flex items-center justify-center shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#4C1D95]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[15px] font-bold text-[#4C1D95] z-10">{initials}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <aside className="w-[260px] bg-white/60 backdrop-blur-2xl border-r border-[#E4E4E7] flex flex-col pt-[32px]">
          <nav className="px-[16px] pb-[24px] flex-1 space-y-[6px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full group flex items-center gap-[14px] px-[16px] py-[12px] rounded-[12px] text-[14px] font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive ? "text-[#4C1D95] bg-[#FAFAF7] shadow-sm border border-[#E4E4E7]" : "text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] border border-transparent"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-[25%] bottom-[25%] w-[3px] bg-[#4C1D95] rounded-r-full shadow-[0_0_12px_rgba(76,29,149,0.3)]" />
                  )}
                  <Icon 
                    className={`w-[18px] h-[18px] z-10 transition-colors ${isActive ? "text-[#4C1D95]" : "text-[#A1A1AA] group-hover:text-[#52525B]"}`} 
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
            <div className="text-[12px] text-[#52525B] mb-[24px] uppercase tracking-widest font-bold flex items-center gap-[8px]">
              <span>System</span>
              <span className="text-[#4C1D95] text-[10px] w-[4px] h-[4px] rounded-full bg-[#4C1D95]" />
              <span className="text-[#18181B]">{breadcrumb || "Overview"}</span>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Floating AI Assistant Button */}
      <button
        onClick={() => navigate("/ai-prediction")}
        className="fixed bottom-[40px] right-[40px] w-[64px] h-[64px] bg-[#4C1D95] rounded-full shadow-[0_8px_32px_rgba(76,29,149,0.3)] hover:shadow-[0_12px_40px_rgba(76,29,149,0.4)] hover:scale-[1.02] transition-all duration-400 flex items-center justify-center z-50 group border border-white/20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="w-[26px] h-[26px] text-white relative z-10" strokeWidth={2.2} />
        <div className="absolute -top-[48px] right-0 bg-white border border-[#E4E4E7] text-[#18181B] px-[16px] py-[8px] rounded-[10px] text-[13px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none">
          MedAI Copilot
        </div>
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full border-[1.5px] border-white/30 animate-[spin_4s_linear_infinite]" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
      </button>
    </div>
  );
}
