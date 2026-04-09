import { useNavigate } from "react-router";
import { FileText, Upload, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { useState, useRef } from "react";
import { uploadReport, getValidAuthToken } from "../../utils/api";
import { DashboardLayout } from "./DashboardLayout";

export function UploadReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    setSuccess(false);
    
    if (!selectedFile.name.endsWith('.pdf')) {
      setError("Please select a PDF file");
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#1A6BFA]', 'bg-[#EFF6FF]');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-[#1A6BFA]', 'bg-[#EFF6FF]');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#1A6BFA]', 'bg-[#EFF6FF]');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const token = getValidAuthToken();
      if (!token) {
        setError("Your session expired. Please sign in again.");
        return;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 20, 80));
      }, 300);

      const response = await uploadReport(file, token);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.status === "success" || response.success === true) {
        setSuccess(true);
        localStorage.setItem("has_reports", "true");
        // Set refresh flag for components to refetch data
        localStorage.setItem("data_refresh_trigger", Date.now().toString());
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(response.detail || "Failed to process report");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout breadcrumb="Upload Report">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <div className="mb-[32px] text-center">
          <h1 className="text-[28px] font-semibold text-[#111111] mb-[8px]">Upload Your Medical Report</h1>
          <p className="text-[15px] text-[#6B6B6B]">
            Upload a PDF of your lab report to get instant AI analysis of your health metrics.
          </p>
        </div>

        {/* Upload Zone */}
        <div className="bg-white border-2 border-dashed border-[#E5E5E5] rounded-[12px] p-[48px] mb-[32px] hover:border-[#1A6BFA] transition-colors" 
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}>
          <div className="flex flex-col items-center gap-[16px]">
            <div className="w-[64px] h-[64px] bg-[#EFF6FF] rounded-full flex items-center justify-center">
              <Upload className="w-[32px] h-[32px] text-[#1A6BFA]" strokeWidth={1.5} />
            </div>
            
            <div className="text-center">
              <div className="text-[16px] font-semibold text-[#111111] mb-[4px]">
                {file ? file.name : "Drop your PDF here"}
              </div>
              <div className="text-[13px] text-[#6B6B6B] mb-[16px]">
                or click to select a file (max 10MB)
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-[24px] py-[10px] bg-[#1A6BFA] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#0D47A1] transition-colors"
            >
              Select File
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-[12px] p-[16px] bg-[#FEE2E2] rounded-[8px] mb-[24px]">
            <AlertCircle className="w-[16px] h-[16px] text-[#991B1B] flex-shrink-0 mt-[2px]" strokeWidth={1.5} />
            <div className="text-[13px] text-[#991B1B]">{error}</div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-[12px] p-[16px] bg-[#ECFDF5] rounded-[8px] mb-[24px]">
            <CheckCircle className="w-[16px] h-[16px] text-[#065F46] flex-shrink-0 mt-[2px]" strokeWidth={1.5} />
            <div className="text-[13px] text-[#065F46]">Report uploaded successfully! Redirecting to dashboard...</div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mb-[24px]">
            <div className="flex items-center gap-[12px] mb-[8px]">
              <Loader className="w-[16px] h-[16px] text-[#1A6BFA] animate-spin" />
              <span className="text-[13px] text-[#6B6B6B]">Processing your report...</span>
            </div>
            <div className="w-full h-[4px] bg-[#E5E5E5] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#1A6BFA] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        {!success && (
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full py-[12px] bg-[#1A6BFA] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#0D47A1] transition-colors disabled:bg-[#CCCCCC] disabled:cursor-not-allowed"
          >
            {uploading ? "Processing..." : "Upload & Analyze Report"}
          </button>
        )}

        {/* Info */}
        <div className="mt-[32px] p-[16px] bg-[#F0F9FF] rounded-[8px]">
          <div className="text-[12px] text-[#0C5BA7] space-y-[8px]">
            <div className="flex gap-[8px]">
              <div className="text-[14px]">✓</div>
              <span>Supports PDF lab reports from any medical facility</span>
            </div>
            <div className="flex gap-[8px]">
              <div className="text-[14px]">✓</div>
              <span>AI extracts key biomarkers automatically</span>
            </div>
            <div className="flex gap-[8px]">
              <div className="text-[14px]">✓</div>
              <span>Your data is secured and never shared</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
