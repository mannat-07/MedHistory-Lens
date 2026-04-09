import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, CheckCircle } from "lucide-react";

export function SignUp() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return false;
    }

    if (name.length < 2) {
      setLocalError("Name must be at least 2 characters");
      return false;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }

    if (!email.includes("@")) {
      setLocalError("Please enter a valid email");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      await register(email, password, name);
      setSuccess(true);
      // Clear report flag so new users must upload first
      localStorage.removeItem("has_reports");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setLocalError(error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center px-[24px] py-[40px]">
      <div className="w-full max-w-[480px]">
        {/* Success message */}
        {success && (
          <div className="flex items-start gap-[8px] p-[12px] bg-[#DCFCE7] rounded-[8px] mb-[16px]">
            <CheckCircle className="w-[14px] h-[14px] text-[#166534] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#166534]">Account created! Redirecting to your dashboard...</p>
          </div>
        )}

        <div className="w-full bg-white rounded-[16px] border border-[#E5E5E5] p-[40px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          {/* Logo */}
          <div className="text-center mb-[32px]">
            <div className="text-[18px] font-semibold text-[#111111] mb-[8px]">
              MedHistory Lens
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-[32px]">
            <h1 className="text-[24px] font-semibold text-[#111111] mb-[8px]">
              Create account
            </h1>
            <p className="text-[14px] text-[#6B6B6B]">
              Join thousands managing their health
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
          <form onSubmit={handleSignUp} className="space-y-[16px]">
            {/* Name input */}
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError();
                  setLocalError("");
                }}
                placeholder="Full name"
                disabled={isLoading}
                className="w-full h-[44px] px-[16px] bg-white border border-[#E5E5E5] rounded-[8px] text-[15px] text-[#111111] placeholder:text-[#6B6B6B] outline-none focus:border-[#1A6BFA] transition-colors disabled:opacity-50"
              />
            </div>

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
                placeholder="Password (8+ characters)"
                disabled={isLoading}
                className="w-full h-[44px] px-[16px] bg-white border border-[#E5E5E5] rounded-[8px] text-[15px] text-[#111111] placeholder:text-[#6B6B6B] outline-none focus:border-[#1A6BFA] transition-colors disabled:opacity-50"
              />
              <p className="text-[12px] text-[#6B6B6B] mt-[4px]">At least 8 characters with mixed case</p>
            </div>

            {/* Confirm password input */}
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                  setLocalError("");
                }}
                placeholder="Confirm password"
                disabled={isLoading}
                className="w-full h-[44px] px-[16px] bg-white border border-[#E5E5E5] rounded-[8px] text-[15px] text-[#111111] placeholder:text-[#6B6B6B] outline-none focus:border-[#1A6BFA] transition-colors disabled:opacity-50"
              />
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="flex items-center gap-[2px]">
                <div
                  className={`h-[4px] flex-1 rounded-full ${
                    password.length >= 12 ? "bg-[#16A34A]" : password.length >= 8 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                  }`}
                />
                <div
                  className={`h-[4px] flex-1 rounded-full ${
                    password.length >= 12 ? "bg-[#16A34A]" : "bg-[#E5E5E5]"
                  }`}
                />
                <span className="text-[11px] text-[#6B6B6B] ml-[4px]">
                  {password.length >= 12 ? "Strong" : password.length >= 8 ? "Good" : "Weak"}
                </span>
              </div>
            )}

            {/* Terms checkbox */}
            <div className="flex items-start gap-[8px]">
              <input
                type="checkbox"
                id="terms"
                disabled={isLoading}
                className="w-[16px] h-[16px] mt-[2px] cursor-pointer accent-[#1A6BFA]"
              />
              <label htmlFor="terms" className="text-[12px] text-[#6B6B6B] cursor-pointer">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {/* Sign up button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] bg-[#1A6BFA] text-white text-[15px] font-medium rounded-[8px] hover:bg-[#1557CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-[16px] my-[24px]">
            <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
            <span className="text-[13px] text-[#6B6B6B]">or</span>
            <div className="flex-1 h-[1px] bg-[#E5E5E5]" />
          </div>

          {/* Google sign up */}
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
            Sign up with Google
          </button>

          {/* Sign in link */}
          <div className="text-center mt-[24px]">
            <span className="text-[14px] text-[#6B6B6B]">
              Already have an account?{" "}
            </span>
            <button
              onClick={() => navigate("/signin")}
              className="text-[14px] text-[#1A6BFA] hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
