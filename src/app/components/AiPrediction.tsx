import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Search, Sparkles, AlertTriangle, Info } from "lucide-react";

const commonSymptoms = [
  "Fever",
  "Headache",
  "Fatigue",
  "Chest Pain",
  "Shortness of Breath",
  "Nausea",
  "Dizziness",
  "Cough",
  "Abdominal Pain",
  "Joint Pain",
];

interface PredictionResult {
  disease: string;
  probability: number;
  risk: "low" | "medium" | "high";
  description: string;
  suggestedActions: string[];
}

const mockResults: PredictionResult[] = [
  {
    disease: "Type 2 Diabetes",
    probability: 72,
    risk: "high",
    description: "Based on your elevated HbA1c and glucose levels, along with reported fatigue symptoms.",
    suggestedActions: [
      "Schedule appointment with endocrinologist",
      "Get HbA1c test every 3 months",
      "Follow recommended diet plan",
      "Monitor blood sugar daily",
    ],
  },
  {
    disease: "Cardiovascular Risk",
    probability: 55,
    risk: "medium",
    description: "Elevated cholesterol levels and family history indicate moderate cardiovascular risk.",
    suggestedActions: [
      "Consult with cardiologist",
      "Lipid panel test quarterly",
      "Regular exercise routine",
      "Consider statins if recommended",
    ],
  },
  {
    disease: "Vitamin D Deficiency",
    probability: 85,
    risk: "medium",
    description: "Current vitamin D levels are significantly below normal range.",
    suggestedActions: [
      "Vitamin D supplementation (as prescribed)",
      "Increase sun exposure (15-20 min daily)",
      "Include vitamin D rich foods",
      "Retest in 3 months",
    ],
  },
];

export function AiPrediction() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length > 0) {
      setShowResults(true);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", border: "border-[#FCA5A5]" };
      case "medium":
        return { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", border: "border-[#FCD34D]" };
      case "low":
        return { bg: "bg-[#ECFDF5]", text: "text-[#065F46]", border: "border-[#6EE7B7]" };
      default:
        return { bg: "bg-[#F5F5F4]", text: "text-[#6B6B6B]", border: "border-[#E5E5E5]" };
    }
  };

  return (
    <DashboardLayout breadcrumb="AI Prediction">
      <div className="max-w-[900px]">
        {/* Header */}
        <div className="mb-[32px]">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <Sparkles className="w-[20px] h-[20px] text-[#1A6BFA]" strokeWidth={1.5} />
            <h1 className="text-[28px] font-semibold text-[#111111]">AI Health Prediction</h1>
          </div>
          <p className="text-[15px] text-[#6B6B6B]">
            Analyze your symptoms using AI to identify potential health risks and get personalized recommendations.
          </p>
        </div>

        {/* Search Input */}
        <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[24px]">
          <label className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[12px] block">
            SEARCH SYMPTOMS
          </label>
          <div className="relative">
            <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#6B6B6B]" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type symptoms you're experiencing..."
              className="w-full pl-[48px] pr-[16px] py-[12px] border border-[#E5E5E5] rounded-[8px] text-[15px] text-[#111111] placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#1A6BFA] focus:border-transparent"
            />
          </div>
        </div>

        {/* Common Symptoms */}
        <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[24px]">
          <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[16px]">
            COMMON SYMPTOMS
          </div>
          <div className="flex flex-wrap gap-[8px]">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-[16px] py-[8px] rounded-[8px] text-[14px] font-medium transition-all ${
                  selectedSymptoms.includes(symptom)
                    ? "bg-[#1A6BFA] text-white"
                    : "bg-[#F5F5F4] text-[#6B6B6B] hover:bg-[#E5E5E5]"
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[24px]">
            <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em] mb-[12px]">
              SELECTED SYMPTOMS ({selectedSymptoms.length})
            </div>
            <div className="flex flex-wrap gap-[8px] mb-[16px]">
              {selectedSymptoms.map((symptom) => (
                <div
                  key={symptom}
                  className="px-[12px] py-[6px] bg-[#EFF6FF] text-[#1A6BFA] rounded-[6px] text-[13px] font-medium flex items-center gap-[6px]"
                >
                  {symptom}
                  <button
                    onClick={() => toggleSymptom(symptom)}
                    className="hover:bg-[#1A6BFA] hover:text-white rounded-full w-[16px] h-[16px] flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAnalyze}
              className="w-full bg-[#1A6BFA] text-white py-[12px] px-[24px] rounded-[8px] text-[15px] font-semibold hover:bg-[#1557D0] transition-colors flex items-center justify-center gap-[8px]"
            >
              <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.5} />
              Analyze with AI
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-[24px]">
            {/* Info Banner */}
            <div className="flex items-start gap-[12px] p-[16px] bg-[#EFF6FF] border border-[#BFDBFE] rounded-[12px]">
              <Info className="w-[18px] h-[18px] text-[#1A6BFA] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-[14px] text-[#1A6BFA] font-medium mb-[4px]">AI Analysis Complete</p>
                <p className="text-[13px] text-[#1A6BFA]">
                  Based on your medical history, current symptoms, and lab results. This is not a diagnosis - please consult with a healthcare professional.
                </p>
              </div>
            </div>

            {/* Prediction Cards */}
            {mockResults.map((result, index) => {
              const colors = getRiskColor(result.risk);
              return (
                <div
                  key={index}
                  className={`bg-white border-2 ${colors.border} rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]`}
                >
                  <div className="flex items-start justify-between mb-[16px]">
                    <div>
                      <h3 className="text-[18px] font-semibold text-[#111111] mb-[4px]">
                        {result.disease}
                      </h3>
                      <p className="text-[13px] text-[#6B6B6B]">{result.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[32px] font-semibold text-[#111111]">
                        {result.probability}%
                      </div>
                      <div className={`px-[12px] py-[4px] ${colors.bg} rounded-[6px] text-[11px] font-medium tracking-[0.04em] ${colors.text} uppercase`}>
                        {result.risk} Risk
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-[16px]">
                    <div className="flex items-center gap-[8px] mb-[12px]">
                      <AlertTriangle className="w-[14px] h-[14px] text-[#6B6B6B]" strokeWidth={1.5} />
                      <span className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">SUGGESTED ACTIONS</span>
                    </div>
                    <ul className="space-y-[8px]">
                      {result.suggestedActions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-[8px]">
                          <div className="w-[4px] h-[4px] rounded-full bg-[#1A6BFA] mt-[7px] flex-shrink-0" />
                          <span className="text-[14px] text-[#111111]">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}

            {/* CTA */}
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-center">
              <p className="text-[15px] text-[#6B6B6B] mb-[16px]">
                Want to discuss these results with a healthcare professional?
              </p>
              <button className="bg-[#1A6BFA] text-white py-[12px] px-[32px] rounded-[8px] text-[15px] font-semibold hover:bg-[#1557D0] transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
