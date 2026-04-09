import { useState } from "react";
import { getHealthPredictions, getValidAuthToken } from "../../utils/api";

interface PredictionItem {
  name: string;
  percentage: number;
  advice: string;
}

const symptomOptions = ["Fever", "Fatigue", "Headache", "Cough", "Chest Pain", "Dizziness"];

export function PredictionCards() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);

  const toggleSymptom = (value: string) => {
    setSymptoms((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const addCustom = () => {
    const trimmed = customSymptom.trim();
    if (!trimmed) return;
    if (!symptoms.includes(trimmed)) setSymptoms((prev) => [...prev, trimmed]);
    setCustomSymptom("");
  };

  const runPrediction = async () => {
    if (symptoms.length === 0) return;
    setLoading(true);
    try {
      const token = getValidAuthToken();
      if (!token) return;
      const response = await getHealthPredictions(symptoms, token);
      setPredictions(Array.isArray(response?.predictions) ? response.predictions : []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <h3 className="text-base font-semibold text-[#111827] mb-3">AI Health Predictions</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {symptomOptions.map((s) => (
          <button
            key={s}
            onClick={() => toggleSymptom(s)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              symptoms.includes(s) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <input
          value={customSymptom}
          onChange={(e) => setCustomSymptom(e.target.value)}
          placeholder="Add symptom"
          className="flex-1 border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm"
        />
        <button onClick={addCustom} className="px-3 py-2 rounded-lg bg-slate-200 text-sm">
          Add
        </button>
        <button
          onClick={runPrediction}
          disabled={loading || symptoms.length === 0}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
      {predictions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {predictions.map((p) => (
            <div key={p.name} className="border border-[#E5E7EB] rounded-lg p-3 bg-[#F8FAFC]">
              <div className="text-sm text-slate-600">{p.name}</div>
              <div className="text-2xl font-semibold text-slate-900">{p.percentage}%</div>
              <div className="text-xs text-slate-600 mt-1">{p.advice}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
