import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface Point {
  date: string;
  value: number;
}

interface TrendsChartProps {
  glucose?: Point[];
  cholesterol?: Point[];
  hba1c?: Point[];
}

export function TrendsChart({ glucose = [], cholesterol = [], hba1c = [] }: TrendsChartProps) {
  const map = new Map<string, { date: string; glucose?: number; cholesterol?: number; hba1c?: number }>();
  glucose.forEach((p) => map.set(p.date, { ...(map.get(p.date) || { date: p.date }), glucose: p.value }));
  cholesterol.forEach((p) => map.set(p.date, { ...(map.get(p.date) || { date: p.date }), cholesterol: p.value }));
  hba1c.forEach((p) => map.set(p.date, { ...(map.get(p.date) || { date: p.date }), hba1c: p.value }));
  const data = Array.from(map.values());

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <h3 className="text-base font-semibold text-[#111827] mb-3">Trends Chart</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="glucose" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="cholesterol" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="hba1c" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
