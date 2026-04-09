import { DashboardLayout } from "./DashboardLayout";
import { FileText, Download, Calendar, User, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";
import { updateReport, uploadReport } from "../../utils/api";

interface Report {
  id: number;
  date: string;
  title: string;
  doctor: string;
  status: "reviewed" | "pending";
}

const initialReports: Report[] = [
  {
    id: 1,
    date: "March 15, 2026",
    title: "Complete Blood Count (CBC)",
    doctor: "Dr. Sarah Johnson",
    status: "reviewed",
  },
  {
    id: 2,
    date: "February 10, 2026",
    title: "Lipid Panel & Cholesterol",
    doctor: "Dr. Michael Chen",
    status: "reviewed",
  },
  {
    id: 3,
    date: "January 5, 2026",
    title: "Comprehensive Metabolic Panel",
    doctor: "Dr. Sarah Johnson",
    status: "reviewed",
  },
  {
    id: 4,
    date: "December 12, 2025",
    title: "Vitamin & Mineral Analysis",
    doctor: "Dr. Emily Brown",
    status: "reviewed",
  },
];

export function Reports() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);

  const handleUpdateReport = async (reportId: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingId(reportId);
      setError(null);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Not authenticated. Please login first.");
          return;
        }

        const response = await updateReport(reportId, file, token);

        if (response.success) {
          // Update report status to pending
          setReports(
            reports.map((r) =>
              r.id === reportId ? { ...r, status: "pending" } : r
            )
          );
          setSuccess(reportId);
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(response.detail || "Failed to update report");
        }
      } catch (err) {
        console.error("Update error:", err);
        setError(err instanceof Error ? err.message : "Failed to update report");
      } finally {
        setUploadingId(null);
      }
    };

    input.click();
  };

  const handleUploadNewReport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Not authenticated. Please login first.");
          return;
        }

        const response = await uploadReport(file, token);

        if (response.success) {
          // Add new report to list
          const newReport: Report = {
            id: Date.now(),
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            title: response.report_title || "New Medical Report",
            doctor: "Dr. [Pending]",
            status: "pending",
          };
          setReports([newReport, ...reports]);
          setSuccess(newReport.id);
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(response.detail || "Failed to upload report");
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Failed to upload report");
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  return (
    <DashboardLayout breadcrumb="Reports">
      <div className="max-w-[900px]">
        {/* Header */}
        <div className="mb-[32px]">
          <h1 className="text-[28px] font-semibold text-[#111111] mb-[8px]">My Reports</h1>
          <p className="text-[15px] text-[#6B6B6B]">
            View and download your medical reports and test results.
          </p>
        </div>

        {/* Upload New Report */}
        <button 
          onClick={handleUploadNewReport}
          disabled={isUploading}
          className="w-full bg-white border-2 border-dashed border-[#1A6BFA] rounded-[12px] p-[32px] mb-[24px] hover:bg-[#EFF6FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors group">
          <div className="flex flex-col items-center gap-[12px]">
            <div className="w-[48px] h-[48px] bg-[#EFF6FF] rounded-full flex items-center justify-center group-hover:bg-[#1A6BFA] transition-colors">
              <FileText className="w-[24px] h-[24px] text-[#1A6BFA] group-hover:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#111111] mb-[4px]">
                {isUploading ? "Uploading..." : "Upload New Report"}
              </div>
              <div className="text-[13px] text-[#6B6B6B]">Click to browse or drag and drop your medical report</div>
            </div>
          </div>
        </button>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-[12px] p-[12px] bg-[#FEE2E2] rounded-[8px] mb-[24px]">
            <AlertCircle className="w-[16px] h-[16px] text-[#991B1B] flex-shrink-0 mt-[2px]" strokeWidth={1.5} />
            <div className="text-[13px] text-[#991B1B]">{error}</div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-start gap-[12px] p-[12px] bg-[#ECFDF5] rounded-[8px] mb-[24px]">
            <div className="text-[13px] text-[#065F46]">✓ Report uploaded successfully!</div>
          </div>
        )}

        {/* Reports List */}
        <div className="space-y-[16px]">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#1A6BFA] hover:shadow-[0_4px_12px_rgba(26,107,250,0.15)] transition-all"
            >
              <div className="flex items-start justify-between mb-[12px]">
                <div className="flex gap-[16px] flex-1">
                  <div className="w-[48px] h-[48px] bg-[#F5F5F4] rounded-[8px] flex items-center justify-center flex-shrink-0">
                    <FileText className="w-[24px] h-[24px] text-[#6B6B6B]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-[#111111] mb-[8px]">
                      {report.title}
                    </h3>
                    <div className="flex items-center gap-[16px] text-[13px] text-[#6B6B6B]">
                      <div className="flex items-center gap-[6px]">
                        <Calendar className="w-[14px] h-[14px]" strokeWidth={1.5} />
                        {report.date}
                      </div>
                      <div className="flex items-center gap-[6px]">
                        <User className="w-[14px] h-[14px]" strokeWidth={1.5} />
                        {report.doctor}
                      </div>
                    </div>
                    <div className="mt-[8px]">
                      <span
                        className={`px-[12px] py-[4px] rounded-[6px] text-[11px] font-medium tracking-[0.04em] uppercase ${
                          report.status === "reviewed"
                            ? "bg-[#ECFDF5] text-[#065F46]"
                            : "bg-[#FEF3C7] text-[#92400E]"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[8px]">
                  <button
                    onClick={() => handleUpdateReport(report.id)}
                    disabled={uploadingId === report.id}
                    className="px-[16px] py-[8px] bg-[#EFF6FF] text-[#1A6BFA] rounded-[8px] text-[13px] font-medium hover:bg-[#1A6BFA] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-[6px]"
                  >
                    <Upload className="w-[16px] h-[16px]" strokeWidth={1.5} />
                    {uploadingId === report.id ? "Updating..." : "Update"}
                  </button>

                  <button className="w-[40px] h-[40px] rounded-[8px] hover:bg-[#F5F5F4] flex items-center justify-center transition-colors">
                    <Download className="w-[20px] h-[20px] text-[#6B6B6B]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {success === report.id && (
                <div className="text-[12px] text-[#065F46] bg-[#ECFDF5] px-[12px] py-[8px] rounded-[6px]">
                  ✓ Report updated successfully!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
