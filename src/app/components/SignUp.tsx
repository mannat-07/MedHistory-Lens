import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, Activity, ArrowRight } from "lucide-react";

export function SignUp() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [localError, setLocalError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters long");
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setLocalError(error || "Registration failed. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    clearError();
    setLocalError("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center p-[24px] relative overflow-hidden selection:bg-[#8B5CF6]/20 selection:text-[#6D28D9]">
      {/* Soft Decorative Ambient Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8B5CF6]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#10B981]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Brand Header */}
        <div className="text-center mb-[32px] flex flex-col items-center">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-[0_8px_24px_rgba(109,40,217,0.3)] mb-[16px]">
            <Activity className="w-[24px] h-[24px] text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A] mb-[8px]">
            Create Account
          </h1>
          <p className="text-[14px] text-[#64748B] font-medium">
            Join the future of personalized healthcare
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 border border-[#E2E8F0] backdrop-blur-2xl rounded-3xl p-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-white to-transparent opacity-50 blur-2xl pointer-events-none" />

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-[20px] relative z-10">
            {/* Error Message */}
            {(error || localError) && (
              <div className="flex items-start gap-[10px] p-[16px] bg-[#FEF2F2]/80 border border-[#FCA5A5] backdrop-blur-md rounded-[14px] mb-[8px] animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-[16px] h-[16px] text-[#DC2626] mt-[2px] flex-shrink-0" strokeWidth={2} />
                <p className="text-[13px] text-[#B91C1C] font-medium leading-relaxed">{error || localError}</p>
              </div>
            )}

            <div className="space-y-[16px]">
              {/* Full Name */}
              <div className="space-y-[8px]">
                <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider pl-[4px]">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="w-full h-[48px] px-[16px] bg-white border border-[#E2E8F0] rounded-[12px] text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#8B5CF6] focus:ring-[3px] focus:ring-[#8B5CF6]/10 transition-all duration-300 shadow-sm disabled:opacity-50"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="space-y-[8px]">
                <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider pl-[4px]">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  disabled={isLoading}
                  className="w-full h-[48px] px-[16px] bg-white border border-[#E2E8F0] rounded-[12px] text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#8B5CF6] focus:ring-[3px] focus:ring-[#8B5CF6]/10 transition-all duration-300 shadow-sm disabled:opacity-50"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-[8px]">
                <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider pl-[4px]">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full h-[48px] px-[16px] bg-white border border-[#E2E8F0] rounded-[12px] text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#8B5CF6] focus:ring-[3px] focus:ring-[#8B5CF6]/10 transition-all duration-300 shadow-sm disabled:opacity-50"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-[8px]">
                <label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider pl-[4px]">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full h-[48px] px-[16px] bg-white border border-[#E2E8F0] rounded-[12px] text-[15px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#8B5CF6] focus:ring-[3px] focus:ring-[#8B5CF6]/10 transition-all duration-300 shadow-sm disabled:opacity-50"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[50px] bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-[12px] text-[15px] font-semibold hover:shadow-[0_8px_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-[8px] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none mt-[8px]"
            >
              {isLoading ? (
                <>
                  <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="text-center mt-[32px] pt-[24px] border-t border-[#E2E8F0]">
            <p className="text-[14px] text-[#64748B]">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/signin')} 
                className="text-[#8B5CF6] font-semibold hover:text-[#6D28D9] transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
