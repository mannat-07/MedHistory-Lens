import { useNavigate } from "react-router";
import { Activity, Brain, FileText, Mic, Sparkles, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleUploadClick = () => {
    if (isAuthenticated) navigate("/upload-report");
    else navigate("/signin", { state: { from: { pathname: "/upload-report" } } });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) navigate("/dashboard");
    else navigate("/signin", { state: { from: { pathname: "/dashboard" } } });
  };

  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-white to-[#F8FBFF]">
      <Navbar />

      <main>
        <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(26,107,250,0.18),transparent_55%)]" />
          <div className="relative max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-[#E0EEFF] text-[#1D4ED8] text-xs font-semibold mb-4">
                Trusted AI Health Companion
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
                Understand Your Health Better
              </h1>
              <p className="mt-4 text-[#475569] text-lg max-w-xl">
                Upload your medical lab reports and get AI-powered insights, personalized diet plans, and doctor-like explanations in seconds.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={handleUploadClick} className="px-6 py-3 rounded-xl bg-[#1A6BFA] text-white font-medium hover:bg-[#1557CC]">
                  Upload Your Report Now
                </button>
                <button onClick={() => navigate("/signup")} className="px-6 py-3 rounded-xl border border-[#BFDBFE] text-[#1E40AF] font-medium hover:bg-[#EFF6FF]">
                  Sign Up Free
                </button>
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_20px_45px_rgba(18,52,95,0.08)]">
              <h3 className="text-sm font-semibold text-[#334155] mb-4">Live Health Snapshot</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Glucose", value: "92", unit: "mg/dL", color: "bg-amber-500" },
                  { label: "HbA1c", value: "5.4", unit: "%", color: "bg-emerald-500" },
                  { label: "Cholesterol", value: "185", unit: "mg/dL", color: "bg-blue-500" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-[#E5EDF8] p-3">
                    <div className="text-[11px] text-[#64748B]">{m.label}</div>
                    <div className="text-xl font-semibold text-[#0F172A] mt-1">{m.value}</div>
                    <div className="text-[11px] text-[#94A3B8]">{m.unit}</div>
                    <div className={`h-1 mt-2 rounded-full ${m.color}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-10">Features Built for Clarity</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileText, title: "AI Report Analysis", desc: "Extracts and explains complex lab reports clearly." },
              { icon: Mic, title: "Doctor Voice Summary", desc: "Listen to calm, human-style report summaries." },
              { icon: Stethoscope, title: "Personalized Diet Plans", desc: "Plans based on real report metrics and symptoms." },
              { icon: Activity, title: "Health Trends & Predictions", desc: "See improvement patterns and risk guidance." },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#EAF3FF] text-[#1A6BFA] flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[#0F172A]">{f.title}</h3>
                <p className="text-sm text-[#64748B] mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-white border-y border-[#E2E8F0]">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-10">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Upload Your Report", desc: "Import your PDF lab report in one click." },
                { step: "2", title: "Get AI Summary", desc: "View doctor-like explanations and highlights." },
                { step: "3", title: "Take Action", desc: "Follow diet plans and track your health trend." },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl border border-[#E2E8F0] p-6 bg-[#F8FBFF]">
                  <div className="w-8 h-8 rounded-full bg-[#1A6BFA] text-white text-sm font-semibold flex items-center justify-center mb-3">{s.step}</div>
                  <h3 className="font-semibold text-[#0F172A]">{s.title}</h3>
                  <p className="text-sm text-[#64748B] mt-2">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-3xl font-bold text-[#0F172A] text-center mb-10">What Users Say</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "MedHistory Lens made my reports easy to understand in under a minute.",
              "The doctor voice summary is calming and super helpful for my parents.",
              "It feels like a real health product, not a demo app."
            ].map((t, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-5">
                <Sparkles className="w-4 h-4 text-[#1A6BFA] mb-2" />
                <p className="text-sm text-[#334155]">{t}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-2xl bg-gradient-to-r from-[#1A6BFA] to-[#0EA5E9] px-8 py-10 text-center text-white">
            <h3 className="text-3xl font-bold">Ready to take control of your health?</h3>
            <p className="mt-2 text-blue-100">Start in minutes with your first report upload.</p>
            <button onClick={handleGetStarted} className="mt-6 px-6 py-3 bg-white text-[#1D4ED8] rounded-xl font-semibold hover:bg-[#F1F5F9]">
              Get Started
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
