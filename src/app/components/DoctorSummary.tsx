import { VoiceButton } from "./VoiceButton";

interface DoctorSummaryProps {
  summary?: string | null;
}

export function DoctorSummary({ summary }: DoctorSummaryProps) {
  if (!summary) return null;

  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold text-[#111827]">Doctor&apos;s Summary</h3>
        <VoiceButton text={summary} />
      </div>
      <p className="text-sm text-[#334155] whitespace-pre-line leading-relaxed">{summary}</p>
    </div>
  );
}
