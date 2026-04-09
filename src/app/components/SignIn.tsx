import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle } from "lucide-react";

export function SignIn() {
  const navigate = useNavigate();
  const { login, continueAsGuest, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!email || !password) {
      setLocalError("Please enter email and password");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setLocalError(error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center px-[24px]">
      <div className="w-full max-w-[480px] bg-white rounded-[16px] border border-[#E5E5E5] p-[40px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {/* Logo */}
        <div className="text-center mb-[32px]">
          <div className="text-[18px] font-semibold text-[#111111] mb-[8px]">
            MedHistory Lens
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-[32px]">
          <h1 className="text-[24px] font-semibold text-[#111111] mb-[8px]">
            Welcome back
          </h1>
          <p className="text-[14px] text-[#6B6B6B]">
            Sign in to view your reports
          </p>
        </div>

        {/* Error message */}
        {(error || localError) && (
          <div className="flex items-start gap-[8px] p-[12px] bg-[#FEE2E2] rounded-[8px] mb-[16px]">
            <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#991B1B]">{error || localError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-[16px]">
          {/* Email input */}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
                setLocalError("");
              }}
              placeholder="you@email.com"
              disabled={isLoading}
              className="w-full h-[44px] px-[16px] bg-white border border-[#E5E5E5] rounded-[8px] text-[15px] text-[#111111] placeholder:text-[#6B6B6B] outline-none focus:border-[#1A6BFA] transition-colors disabled:opacity-50"
            />
          </div>

          {/* Password input */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
                setLocalError("");
              }}
              placeholder="Password"
              disabled={isLoading}
              className="w-full h-[44px] px-[16px] bg-white border border-[#E5E5E5] rounded-[8px] text-[15px] text-[#111111] placeholder:text-[#6B6B6B] outline-none focus:border-[#1A6BFA] transition-colors disabled:opacity-50"
            />
            <div className="text-right mt-[8px]">
              <button
                type="button"
                className="text-[13px] text-[#1A6BFA] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[44px] bg-[#1A6BFA] text-white text-[15px] font-medium rounded-[8px] hover:bg-[#1557CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-[16px] my-[24px]">
          <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
          <span className="text-[13px] text-[#6B6B6B]">or</span>
          <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
        </div>

        {/* Google sign in */}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => navigate("/dashboard")}
          className="w-full h-[44px] border border-[#E5E5E5] text-[#111111] text-[15px] font-medium rounded-[8px] hover:border-[#1A6BFA] transition-colors flex items-center justify-center gap-[8px] disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20454Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            continueAsGuest();
            navigate("/dashboard");
          }}
          className="w-full mt-[12px] h-[44px] border border-[#1A6BFA] text-[#1A6BFA] text-[15px] font-medium rounded-[8px] hover:bg-[#EFF6FF] transition-colors disabled:opacity-50"
        >
          Continue as Guest
        </button>

        {/* Sign up link */}
        <div className="text-center mt-[24px]">
          <span className="text-[14px] text-[#6B6B6B]">
            Don't have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-[14px] text-[#1A6BFA] hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
