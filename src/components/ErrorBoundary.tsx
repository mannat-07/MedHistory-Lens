import { ReactNode, Component, ErrorInfo } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[400px] p-[24px]">
            <div className="max-w-[500px] text-center">
              <div className="flex justify-center mb-[16px]">
                <AlertCircle className="w-[48px] h-[48px] text-[#DC2626]" strokeWidth={1.5} />
              </div>
              <h2 className="text-[20px] font-semibold text-[#111111] mb-[8px]">
                Something went wrong
              </h2>
              <p className="text-[14px] text-[#6B6B6B] mb-[16px]">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <div className="p-[16px] bg-[#FEE2E2] rounded-[8px] text-left mb-[16px]">
                <p className="text-[12px] text-[#991B1B] font-mono break-words">
                  {this.state.error?.message || "Unknown error"}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-[24px] py-[12px] bg-[#1A6BFA] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#1557CC] transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
