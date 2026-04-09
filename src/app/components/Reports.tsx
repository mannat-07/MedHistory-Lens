import { DashboardLayout } from "./DashboardLayout";
import { FileText, Download, Calendar, User } from "lucide-react";

const reports = [
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
        <button className="w-full bg-white border-2 border-dashed border-[#1A6BFA] rounded-[12px] p-[32px] mb-[24px] hover:bg-[#EFF6FF] transition-colors group">
          <div className="flex flex-col items-center gap-[12px]">
            <div className="w-[48px] h-[48px] bg-[#EFF6FF] rounded-full flex items-center justify-center group-hover:bg-[#1A6BFA] transition-colors">
              <FileText className="w-[24px] h-[24px] text-[#1A6BFA] group-hover:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#111111] mb-[4px]">Upload New Report</div>
              <div className="text-[13px] text-[#6B6B6B]">Click to browse or drag and drop your medical report</div>
            </div>
          </div>
        </button>

        {/* Reports List */}
        <div className="space-y-[16px]">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-[#1A6BFA] hover:shadow-[0_4px_12px_rgba(26,107,250,0.15)] transition-all"
            >
              <div className="flex items-start justify-between">
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
                      <span className="px-[12px] py-[4px] bg-[#ECFDF5] text-[#065F46] rounded-[6px] text-[11px] font-medium tracking-[0.04em] uppercase">
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-[40px] h-[40px] rounded-[8px] hover:bg-[#F5F5F4] flex items-center justify-center transition-colors">
                  <Download className="w-[20px] h-[20px] text-[#6B6B6B]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
