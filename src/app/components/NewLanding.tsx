import { Upload, Shield, Lock, Info, Zap, TrendingUp, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router";

export function NewLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="h-[64px] px-[24px] flex items-center justify-between border-b border-[#E5E5E5]">
        <div className="text-[16px] font-medium text-[#111111]">
          MedHistory Lens
        </div>
        
        {/* Center links */}
        <div className="flex items-center gap-8">
          <a href="#how" className="text-[14px] text-[#6B6B6B] hover:text-[#111111] transition-colors">
            How it works
          </a>
          <a href="#features" className="text-[14px] text-[#6B6B6B] hover:text-[#111111] transition-colors">
            Features
          </a>
          <a href="#privacy" className="text-[14px] text-[#6B6B6B] hover:text-[#111111] transition-colors">
            Privacy
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/signin")}
            className="text-[14px] text-[#6B6B6B] hover:text-[#111111] transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-[16px] py-[8px] bg-[#1A6BFA] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#1557CC] transition-colors"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero section */}
      <section className="max-w-[1200px] mx-auto px-[24px] pt-[96px] pb-[80px]">
        <div className="grid grid-cols-2 gap-[64px] items-center">
          {/* Left 50% */}
          <div>
            <h1 className="text-[32px] font-semibold text-[#111111] mb-[16px] leading-tight">
              Know what your lab reports actually mean.
            </h1>
            <p className="text-[16px] text-[#6B6B6B] mb-[32px]">
              Upload once. Track trends. Ask questions.
            </p>
            <div className="flex items-center gap-[16px]">
              <button
                onClick={() => navigate("/processing")}
                className="px-[24px] py-[12px] bg-[#1A6BFA] text-white text-[15px] font-medium rounded-[8px] hover:bg-[#1557CC] transition-colors"
              >
                Upload a report
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-[24px] py-[12px] border border-[#E5E5E5] text-[#111111] text-[15px] font-medium rounded-[8px] hover:border-[#1A6BFA] hover:text-[#1A6BFA] transition-colors"
              >
                See a demo
              </button>
            </div>
          </div>

          {/* Right 50% - Dashboard preview mockup */}
          <div className="bg-[#F9F9F8] rounded-[12px] p-[24px] border border-[#E5E5E5]">
            <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
              <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-[16px]">
                <div className="text-[11px] text-[#6B6B6B] mb-[8px]">GLUCOSE</div>
                <div className="text-[20px] font-semibold text-[#111111]">110</div>
                <div className="text-[10px] text-[#6B6B6B]">mg/dL</div>
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-[16px]">
                <div className="text-[11px] text-[#6B6B6B] mb-[8px]">HbA1c</div>
                <div className="text-[20px] font-semibold text-[#111111]">6.8%</div>
                <div className="w-2 h-2 rounded-full bg-[#D97706] mt-[4px]" />
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-[16px]">
                <div className="text-[11px] text-[#6B6B6B] mb-[8px]">CHOL</div>
                <div className="text-[20px] font-semibold text-[#111111]">220</div>
                <div className="text-[10px] text-[#6B6B6B]">mg/dL</div>
              </div>
            </div>
            <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-[16px]">
              <div className="text-[11px] text-[#6B6B6B] mb-[12px]">TREND</div>
              <div className="h-[60px] flex items-end gap-[8px]">
                <div className="w-full h-[40%] bg-[#1A6BFA] rounded-t-[4px]" />
                <div className="w-full h-[55%] bg-[#1A6BFA] rounded-t-[4px]" />
                <div className="w-full h-[70%] bg-[#1A6BFA] rounded-t-[4px]" />
                <div className="w-full h-[85%] bg-[#D97706] rounded-t-[4px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="max-w-[1200px] mx-auto px-[24px] py-[64px] border-t border-[#E5E5E5]">
        <div className="grid grid-cols-3 gap-[48px]">
          <div>
            <div className="w-[40px] h-[40px] rounded-[8px] bg-[#F0F0EF] flex items-center justify-center mb-[16px]">
              <Zap className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#111111] mb-[8px]">
              Instant extraction
            </h3>
            <p className="text-[14px] text-[#6B6B6B]">
              Upload a PDF and get structured data in seconds.
            </p>
          </div>

          <div>
            <div className="w-[40px] h-[40px] rounded-[8px] bg-[#F0F0EF] flex items-center justify-center mb-[16px]">
              <TrendingUp className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#111111] mb-[8px]">
              Trend tracking
            </h3>
            <p className="text-[14px] text-[#6B6B6B]">
              See how your biomarkers change over time with clear charts.
            </p>
          </div>

          <div>
            <div className="w-[40px] h-[40px] rounded-[8px] bg-[#F0F0EF] flex items-center justify-center mb-[16px]">
              <MessageSquare className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
            </div>
            <h3 className="text-[16px] font-semibold text-[#111111] mb-[8px]">
              Ask AI anything
            </h3>
            <p className="text-[14px] text-[#6B6B6B]">
              Get plain-language explanations about your results.
            </p>
          </div>
        </div>
      </section>

      {/* Trust badges section */}
      <section id="privacy" className="max-w-[1200px] mx-auto px-[24px] py-[64px] border-t border-[#E5E5E5]">
        <div className="grid grid-cols-3 gap-[32px]">
          <div className="flex flex-col items-center text-center">
            <div className="w-[48px] h-[48px] rounded-full bg-[#F0F0EF] flex items-center justify-center mb-[16px]">
              <Shield className="w-[20px] h-[20px] text-[#6B6B6B]" strokeWidth={1.5} />
            </div>
            <h4 className="text-[15px] font-semibold text-[#111111] mb-[8px]">
              No data stored
            </h4>
            <p className="text-[13px] text-[#6B6B6B]">
              Your reports stay on your device. We never store your medical data.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-[48px] h-[48px] rounded-full bg-[#F0F0EF] flex items-center justify-center mb-[16px]">
              <Lock className="w-[20px] h-[20px] text-[#6B6B6B]" strokeWidth={1.5} />
            </div>
            <h4 className="text-[15px] font-semibold text-[#111111] mb-[8px]">
              Private by default
            </h4>
            <p className="text-[13px] text-[#6B6B6B]">
              All processing happens locally. No third-party sharing.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-[48px] h-[48px] rounded-full bg-[#F0F0EF] flex items-center justify-center mb-[16px]">
              <Info className="w-[20px] h-[20px] text-[#6B6B6B]" strokeWidth={1.5} />
            </div>
            <h4 className="text-[15px] font-semibold text-[#111111] mb-[8px]">
              Not a diagnosis tool
            </h4>
            <p className="text-[13px] text-[#6B6B6B]">
              AI-assisted insights. Always consult your healthcare provider.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] py-[32px]">
        <div className="max-w-[1200px] mx-auto px-[24px] flex items-center justify-between">
          <div className="text-[14px] font-medium text-[#111111]">
            MedHistory Lens
          </div>
          <div className="text-[13px] text-[#6B6B6B]">
            © 2026 MedHistory Lens
          </div>
        </div>
      </footer>
    </div>
  );
}
