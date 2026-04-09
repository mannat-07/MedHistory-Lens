import { useNavigate } from "react-router";
import {
  Upload,
  Shield,
  Lock,
  Zap,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  Brain,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleUploadClick = () => {
    if (isAuthenticated) {
      navigate("/processing");
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 overflow-hidden">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                MedHistory
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 hover:text-blue-600 transition">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-blue-600 transition">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-slate-600 hover:text-blue-600 transition">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-slate-600 hover:text-blue-600 transition">
                FAQ
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/signin")}
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-blue-600/20 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#features" className="block px-4 py-2 text-slate-600 hover:bg-blue-50 rounded">
                Features
              </a>
              <a href="#how-it-works" className="block px-4 py-2 text-slate-600 hover:bg-blue-50 rounded">
                How It Works
              </a>
              <a href="#pricing" className="block px-4 py-2 text-slate-600 hover:bg-blue-50 rounded">
                Pricing
              </a>
              <button
                onClick={() => navigate("/signup")}
                className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 bg-blue-100/50 rounded-full border border-blue-200">
                <span className="text-sm font-medium text-blue-700">✨ AI-Powered Health Insights</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Understand Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Health Reports
                </span>
              </h1>

              <p className="text-xl text-slate-600 max-w-md">
                Upload your lab reports. Get instant AI analysis. Track trends over time. Take control of your health.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleUploadClick}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all"
                >
                  Upload Report
                  <ArrowRight className="w-4 h-4 inline-block ml-2" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-slate-900">50K+</div>
                  <div className="text-sm text-slate-600">Reports Analyzed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">99%</div>
                  <div className="text-sm text-slate-600">Accuracy Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">AI Support</div>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-200/50">
                {/* Dashboard Preview Cards */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Your Health Dashboard</h3>
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>

                  {/* Health Metrics Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Glucose", value: "110", unit: "mg/dL", status: "warning" },
                      { label: "HbA1c", value: "6.8", unit: "%", status: "warning" },
                      { label: "Cholesterol", value: "220", unit: "mg/dL", status: "normal" },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
                      >
                        <div className="text-xs font-semibold text-slate-500 uppercase">{metric.label}</div>
                        <div className="text-2xl font-bold text-slate-900 mt-2">{metric.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{metric.unit}</div>
                        <div
                          className={`mt-3 h-1 rounded-full ${
                            metric.status === "warning"
                              ? "bg-gradient-to-r from-amber-400 to-orange-500"
                              : "bg-gradient-to-r from-green-400 to-emerald-500"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>

                  {/* Trend Chart */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-4">3-Month Trend</div>
                    <div className="flex items-end justify-between h-16 gap-2">
                      {[30, 45, 60, 75, 85, 95].map((height, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                    <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-blue-900">AI Insight</div>
                      <div className="text-xs text-blue-700 mt-1">Your glucose levels show a slight upward trend...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to understand and manage your health data effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Instant Report Upload",
                description: "Upload PDF lab reports and get structured data extracted in seconds using AI",
              },
              {
                icon: BarChart3,
                title: "Trend Tracking",
                description: "See how your biomarkers change over time with beautiful interactive charts",
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Get plain-language explanations of your results from our health AI assistant",
              },
              {
                icon: Heart,
                title: "Risk Assessment",
                description: "Understand your disease risk factors with personalized health insights",
              },
              {
                icon: MessageSquare,
                title: "24/7 Chat Support",
                description: "Ask questions about your health metrics and get instant AI responses",
              },
              {
                icon: CheckCircle,
                title: "Health Reminders",
                description: "Get notified about important health milestones and follow-up tests",
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-600/20 transition">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to take control of your health</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Upload Your Report",
                description: "Take a photo or upload a PDF of your lab report",
              },
              {
                step: "2",
                title: "AI Analysis",
                description: "Our AI instantly extracts and analyzes your health metrics",
              },
              {
                step: "3",
                title: "Get Insights",
                description: "Review trends, risks, and get personalized health recommendations",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -top-4 left-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>
                <div className="pt-8 pl-4">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-6 -right-6">
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Health is Private</h2>
            <p className="text-lg text-slate-300">Enterprise-grade security for your medical data</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "End-to-End Encryption", description: "Your data is encrypted in transit and at rest" },
              { icon: Shield, title: "HIPAA Compliant", description: "Full compliance with healthcare data regulations" },
              { icon: CheckCircle, title: "Zero Data Retention", description: "Your reports are never stored on our servers" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Ready to Take Control?</h2>
          <p className="text-xl text-slate-600 mb-8">Join thousands of people managing their health with confidence</p>
          <button
            onClick={handleUploadClick}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all text-lg"
          >
            Upload Your First Report
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-900">MedHistory</span>
              </div>
              <p className="text-sm text-slate-600">Understanding health, one report at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-blue-600 transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-600">© 2026 MedHistory Lens. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-slate-600 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-600 transition">Twitter</a>
              <a href="#" className="hover:text-blue-600 transition">LinkedIn</a>
              <a href="#" className="hover:text-blue-600 transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
