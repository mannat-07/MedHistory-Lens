import { ArrowRight, Activity, Clock, Database, AlertCircle, FileText, Brain, HeartPulse, Salad, MessageSquare, CheckCircle2, TrendingDown, ChevronRight, ShieldCheck, LineChart, Bot } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#18181B] font-sans selection:bg-[#4C1D95]/20 selection:text-[#4C1D95] scroll-smooth">
      
      {/* Navigation */}
      <nav className="w-full h-[64px] flex items-center justify-between px-6 md:px-10 max-w-[1200px] mx-auto sticky top-4 z-50 bg-white/90 backdrop-blur-xl border border-[#E4E4E7] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4C1D95] flex items-center justify-center shadow-sm">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-[#18181B]">
            MedHistory Lens
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#52525B]">
          <a href="#home" className="hover:text-[#18181B] transition-colors">Home</a>
          <a href="#features" className="hover:text-[#18181B] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#18181B] transition-colors">How It Works</a>
          <a href="#about" className="hover:text-[#18181B] transition-colors">About</a>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white border border-[#E4E4E7] shadow-sm rounded-xl text-xs font-semibold text-[#18181B] hover:bg-[#F4F4F5] transition-all"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/signin')}
                className="px-3 py-2 text-xs font-semibold text-[#52525B] hover:text-[#18181B] transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-[#4C1D95] text-white rounded-xl text-xs font-semibold hover:bg-[#3B1475] shadow-sm transition-all"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="home" className="scroll-mt-28 max-w-[1200px] mx-auto px-6 md:px-12 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-in fade-in duration-700">
        <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-[56px] font-bold text-[#18181B] leading-[1.1] tracking-tight mb-6">
            Understand Your Health <br /> Better
          </h1>
          <p className="text-lg text-[#52525B] mb-10 leading-relaxed">
            Upload your medical lab reports and get AI-powered insights, personalized diet plans, and doctor-like explanations in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-3.5 bg-[#4C1D95] text-white rounded-xl text-sm font-medium hover:bg-[#3B1475] shadow-[0_4px_14px_rgba(76,29,149,0.15)] hover:shadow-[0_6px_20px_rgba(76,29,149,0.2)] transition-all flex items-center justify-center gap-2"
            >
              Upload Your Report Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              className="px-8 py-3.5 bg-white border border-[#E4E4E7] text-[#18181B] rounded-xl text-sm font-medium hover:bg-[#F4F4F5] shadow-sm transition-all flex items-center justify-center gap-2"
              onClick={() => (isAuthenticated ? navigate('/dashboard') : navigate('/signup'))}
            >
              {isAuthenticated ? "View Dashboard" : "Sign Up Free"}
            </button>
          </div>
        </div>

        {/* Hero Right: Live Snapshot */}
        <div className="relative w-full hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-150">
          {/* Animated Human Character */}
          <div className="absolute -top-2 left-0 w-[170px] h-[200px] rounded-2xl bg-white border border-[#E4E4E7] shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center transition-transform duration-700 hover:-translate-y-1">
            <div className="relative w-[110px] h-[170px] flex flex-col items-center animate-[float_6s_ease-in-out_infinite]">
              {/* Head */}
              <div className="w-12 h-12 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] z-10"></div>
              {/* Body */}
              <div className="w-20 h-24 bg-[#F4F4F5] border-x border-b border-[#E4E4E7] rounded-b-3xl -mt-2"></div>
              {/* Report in Hand */}
              <div className="absolute top-12 -right-2 w-16 h-20 bg-white border border-[#E4E4E7] rounded-lg shadow-md transform rotate-[8deg] p-2 flex flex-col gap-1.5">
                <div className="h-1.5 bg-[#E4E4E7] rounded-full w-full"></div>
                <div className="h-1.5 bg-[#E4E4E7] rounded-full w-10/12"></div>
                <div className="h-1.5 bg-[#4C1D95] rounded-full w-8/12"></div>
                <div className="h-1.5 bg-[#E4E4E7] rounded-full w-11/12"></div>
              </div>
               {/* Left Arm */}
              <div className="absolute top-14 left-0 w-8 h-16 bg-[#F4F4F5] border-y border-l border-[#E4E4E7] rounded-l-full transform -rotate-[20deg] origin-top-right"></div>
            </div>
          </div>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[360px] bg-white text-left rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E4E4E7] transition-transform duration-700 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-[#52525B]">Live Health Snapshot</span>
              <span className="text-xs font-semibold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md">Stable</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Glucose", value: "92", unit: "mg/dL", color: "#10B981" },
                { label: "HbA1c", value: "5.4", unit: "%", color: "#4C1D95" },
                { label: "Cholesterol", value: "185", unit: "mg/dL", color: "#D97706" }
              ].map((metric) => (
                <div key={metric.label} className="border border-[#E4E4E7] rounded-xl p-3 bg-[#FAFAF7]">
                  <div className="text-[11px] text-[#52525B] font-semibold mb-2">{metric.label}</div>
                  <div className="text-[18px] font-bold text-[#18181B] leading-none">{metric.value}</div>
                  <div className="text-[10px] text-[#A1A1AA] mb-2">{metric.unit}</div>
                  <div className="h-1.5 rounded-full bg-white border border-[#E4E4E7] overflow-hidden">
                    <div className="h-full" style={{ width: "70%", backgroundColor: metric.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="scroll-mt-28 bg-white py-16 border-y border-[#E4E4E7]/50 animate-in fade-in duration-700">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#18181B] text-center mb-10">Features Built for Clarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: LineChart, title: "AI Report Analysis", body: "Extract and explain complex lab reports clearly." },
              { icon: MessageSquare, title: "Doctor Voice Summary", body: "Listen to calm, human-style report summaries." },
              { icon: Salad, title: "Personalized Diet Plans", body: "Plans based on real report metrics and symptoms." },
              { icon: TrendingDown, title: "Health Trends & Predictions", body: "See improvements, patterns, and risk indicators." }
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl border border-[#E4E4E7] bg-[#FAFAF7] shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:shadow-md">
                <div className="w-10 h-10 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[#4C1D95]" />
                </div>
                <h3 className="text-sm font-bold text-[#18181B] mb-2">{item.title}</h3>
                <p className="text-sm text-[#52525B] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-28 py-16 max-w-[1200px] mx-auto px-6 md:px-12 text-center animate-in fade-in duration-700">
        <h2 className="text-xl md:text-2xl font-bold text-[#18181B] mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Upload Your Report", body: "Import your PDF lab report in one click." },
            { step: "2", title: "Get AI Summary", body: "View doctor-like explanations and highlights." },
            { step: "3", title: "Take Action", body: "Follow diet plans and track your health trends." }
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl border border-[#E4E4E7] bg-white shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:shadow-md">
              <div className="w-8 h-8 rounded-full bg-[#4C1D95]/10 text-[#4C1D95] flex items-center justify-center text-sm font-bold mb-4 mx-auto">
                {item.step}
              </div>
              <h3 className="text-sm font-bold text-[#18181B] mb-2">{item.title}</h3>
              <p className="text-sm text-[#52525B] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section id="about" className="scroll-mt-28 py-16 bg-white border-y border-[#E4E4E7]/50 animate-in fade-in duration-700">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[#18181B] mb-10">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "MedHistory Lens made my reports easy to understand in minutes.",
              "The doctor voice summary is calming and super helpful for my parents.",
              "I feel like a real health product, not a demo app."
            ].map((quote, index) => (
              <div key={quote} className="p-5 rounded-2xl border border-[#E4E4E7] bg-[#FAFAF7] shadow-sm text-left transition-transform duration-500 hover:-translate-y-1 hover:shadow-md">
                <div className="text-xs font-semibold text-[#4C1D95] mb-2">User {index + 1}</div>
                <p className="text-sm text-[#52525B] leading-relaxed">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="py-16 animate-in fade-in duration-700">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="rounded-2xl bg-gradient-to-r from-[#4C1D95] to-[#0EA5E9] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">Ready to take control of your health?</h3>
              <p className="text-sm text-white/90 mt-2">Start in minutes with your first report upload.</p>
            </div>
            <button
              onClick={handleGetStarted}
              className="px-6 py-3 bg-white text-[#18181B] rounded-xl text-sm font-semibold hover:bg-[#F4F4F5] transition-all duration-500 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-[#E4E4E7] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#4C1D95] flex items-center justify-center shadow-sm">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[16px] font-bold tracking-tight text-[#18181B]">MedHistory Lens</span>
            </div>
            <p className="text-sm text-[#52525B]">Turn raw medical reports into clear, patient-friendly insights.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#18181B] mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm text-[#52525B]">
              <button className="text-left hover:text-[#18181B]" onClick={() => navigate('/signin')}>Login</button>
              <button className="text-left hover:text-[#18181B]" onClick={() => navigate('/signup')}>Sign Up</button>
              <button className="text-left hover:text-[#18181B]" onClick={() => navigate('/upload-report')}>Upload Report</button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#18181B] mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-[#52525B]">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#E4E4E7] py-4 text-center text-xs text-[#A1A1AA]">© 2026 MedHistory Lens. All rights reserved.</div>
      </footer>

    </div>
  );
}
