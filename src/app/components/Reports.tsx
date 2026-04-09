import { DashboardLayout } from "./DashboardLayout";
import { FileText, Calendar, User, Upload, AlertCircle, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  downloadReport,
  exportReportPdf,
  generateDietPlanForReport,
  getReports,
  updateReport,
  uploadReport,
} from "../../utils/api";
import { DoctorSummary } from "./DoctorSummary";
import { PredictionCards } from "./PredictionCards";
import { Line, LineChart, ResponsiveContainer } from "recharts";

interface Report {
  id: number;
  date: string | null;
  title: string;
  doctor: string;
  status: "reviewed" | "pending";
  summary?: string | null;
  doctor_summary?: string | null;
  doctor_advice?: string | null;
  voice_text?: string | null;
  key_metrics?: Record<string, string | number>;
}

export function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<number | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [activeDietReportId, setActiveDietReportId] = useState<number | null>(null);
  const [dietPlan, setDietPlan] = useState<any | null>(null);
  const [dietLoading, setDietLoading] = useState(false);
  const [exportLoadingId, setExportLoadingId] = useState<number | null>(null);
  const [speakingReportId, setSpeakingReportId] = useState<number | null>(null);

  const formatReportDate = (dateValue: string | null) => {
    if (!dateValue) return "Unknown date";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return dateValue;
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const fetchReports = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      const token = localStorage.getItem("auth_token") || "guest";

      const response = await getReports(token);
      if (!response.success) {
        setError(response.detail || "Failed to fetch reports");
        setReports([]);
        return;
      }

      const fetchedReports: Report[] = Array.isArray(response.reports)
        ? response.reports.map((item: any) => ({
            id: Number(item.id),
            date: item.date ?? null,
            title: item.title || "Medical Report",
            doctor: item.doctor || "Unknown",
            status: item.status === "pending" ? "pending" : "reviewed",
            summary: item.summary || null,
            doctor_summary: item.doctor_summary || null,
            doctor_advice: item.doctor_advice || null,
            voice_text: item.voice_text || null,
            key_metrics: item.key_metrics || {},
          }))
        : [];

      setReports(fetchedReports);
      setError(null);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
      setReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
    };
    loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleDownloadReport = async (reportId: number) => {
    setDownloadingId(reportId);
    setError(null);

    try {
      const token = localStorage.getItem("auth_token") || "guest";

      const blob = await downloadReport(reportId, token);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `report-${reportId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err.message : "Failed to download report");
    } finally {
      setDownloadingId(null);
    }
  };

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
        const token = localStorage.getItem("auth_token") || "guest";

        const response = await updateReport(reportId, file, token);

        if (response.success) {
          setSuccess(reportId);
          
          if (response.doctor_summary) {
            setAiSummary(response.doctor_summary);
          }

          await fetchReports();
          localStorage.setItem("data_refresh_trigger", Date.now().toString());
          
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

  const playDoctorVoice = (reportId: number, text?: string | null) => {
    if (!("speechSynthesis" in window)) {
      setError("Doctor Voice is not supported in this browser.");
      return;
    }
    if (!text) return;
    if (speakingReportId === reportId) {
      window.speechSynthesis.cancel();
      setSpeakingReportId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => /google uk english male/i.test(v.name)) ||
      voices.find((v) => /uk english|india|english/i.test(v.name));
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeakingReportId(reportId);
    utterance.onend = () => setSpeakingReportId(null);
    utterance.onerror = () => {
      setSpeakingReportId(null);
      setError("Doctor Voice could not start on this browser. Please try again.");
    };
    window.speechSynthesis.speak(utterance);
  };

  const openDietPlan = async (reportId: number) => {
    setActiveDietReportId(reportId);
    setDietLoading(true);
    setDietPlan(null);
    try {
      const token = localStorage.getItem("auth_token") || "guest";
      const response = await generateDietPlanForReport(reportId, token, [], language);
      if (response?.success) {
        setDietPlan(response.diet_plan);
      } else {
        setError("Unable to generate personalized diet plan right now.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate diet plan");
    } finally {
      setDietLoading(false);
    }
  };

  const handleExportPdf = async (reportId: number) => {
    setExportLoadingId(reportId);
    try {
      const token = localStorage.getItem("auth_token") || "guest";
      const blob = await exportReportPdf(reportId, token, language);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `medhistory-full-report-${reportId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export report PDF");
    } finally {
      setExportLoadingId(null);
    }
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
        const token = localStorage.getItem("auth_token") || "guest";

        const response = await uploadReport(file, token);

        if (response.success) {
          setSuccess(response.report_id || 0);
          
          if (response.doctor_summary) {
            setAiSummary(response.doctor_summary);
          }

          await fetchReports();
          localStorage.setItem("data_refresh_trigger", Date.now().toString());
          
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

  useEffect(() => {
    if (!activeDietReportId) return;
    openDietPlan(activeDietReportId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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

        {/* AI Summary Block */}
        {aiSummary && (
          <div className="bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC] border border-[#1A6BFA]/20 rounded-[12px] p-[24px] mb-[24px] shadow-sm transform transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-[8px] mb-[12px]">
              <div className="w-[32px] h-[32px] bg-[#1A6BFA]/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-[16px] h-[16px] text-[#1A6BFA]" strokeWidth={2} />
              </div>
              <h2 className="text-[16px] font-semibold text-[#111111]">Doctor&apos;s Summary</h2>
            </div>
            <div className="text-[14px] text-[#4B5563] leading-relaxed">
              {aiSummary}
            </div>
            <button 
              onClick={() => setAiSummary(null)}
              className="mt-[16px] text-[13px] font-medium text-[#1A6BFA] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {isLoadingReports && (
          <div className="text-[14px] text-[#6B6B6B] mb-[24px]">Loading reports...</div>
        )}

        {!isLoadingReports && reports.length === 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] mb-[24px] text-[14px] text-[#6B6B6B]">
            No reports found yet. Upload your first PDF report to see real data here.
          </div>
        )}

        {/* Reports List */}
        <div className="mb-[24px]">
          <PredictionCards />
        </div>
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
                        {formatReportDate(report.date)}
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

                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    disabled={downloadingId === report.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloadingId === report.id ? "Downloading..." : "📥 Download Original PDF"}
                  </button>
                  <button
                    onClick={() => playDoctorVoice(report.id, report.voice_text || report.doctor_summary)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                  >
                    {speakingReportId === report.id ? "🔊 Speaking... (Tap to stop)" : "🔊 Listen to Doctor"}
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {success === report.id && (
                <div className="text-[12px] text-[#065F46] bg-[#ECFDF5] px-[12px] py-[8px] rounded-[6px]">
                  ✓ Report updated successfully!
                </div>
              )}
              {report.doctor_advice && (
                <div className="mt-2 text-[13px] text-[#334155]">Doctor&apos;s Advice: {report.doctor_advice}</div>
              )}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <button onClick={() => openDietPlan(report.id)} className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm">
                  {dietLoading && activeDietReportId === report.id ? "Generating..." : "Personalized Diet Plan"}
                </button>
                <button
                  onClick={() => handleExportPdf(report.id)}
                  disabled={exportLoadingId === report.id}
                  className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm disabled:opacity-50"
                >
                  {exportLoadingId === report.id ? "Exporting..." : "Export Full Report PDF"}
                </button>
              </div>
              <div className="mt-3 h-[90px] bg-[#F8FAFC] rounded-lg p-2">
                <div className="text-[12px] text-[#64748B] mb-1">Progress Comparison (Glucose / Cholesterol)</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={reports.map((r, idx) => ({
                      index: idx + 1,
                      glucose: Number(r.key_metrics?.glucose || 0),
                      cholesterol: Number(r.key_metrics?.total_cholesterol || 0),
                    }))}
                  >
                    <Line type="monotone" dataKey="glucose" stroke="#2563EB" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="cholesterol" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3">
                <DoctorSummary summary={report.doctor_summary} />
              </div>
            </div>
          ))}
        </div>
        {activeDietReportId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setActiveDietReportId(null)}>
            <div className="bg-white rounded-[16px] w-[680px] max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[20px] font-semibold">Personalized Diet Plan</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-sm"
                  >
                    {language === "en" ? "Hindi" : "English"}
                  </button>
                  <button onClick={() => setActiveDietReportId(null)} className="text-slate-500">✕</button>
                </div>
              </div>
              {dietLoading ? (
                <div className="text-sm text-slate-600 animate-pulse">Creating a real personalized diet plan...</div>
              ) : dietPlan ? (
                <div className="space-y-4">
                  {(["breakfast", "lunch", "dinner", "snacks", "avoid"] as const).map((sec) => (
                    <div key={sec}>
                      <div className="text-sm font-semibold uppercase text-slate-600">{sec}</div>
                      <ul className="list-disc pl-5 text-sm text-slate-800">
                        {(dietPlan?.[sec] || []).map((item: string, idx: number) => (
                          <li key={`${sec}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {dietPlan?.doctor_note && (
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm">{dietPlan.doctor_note}</div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-slate-600">No diet plan available yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
