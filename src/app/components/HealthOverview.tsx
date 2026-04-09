import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Activity, Heart, Droplets, Pill } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

const bloodData = [
  { date: "Jan", wbc: 7.2, rbc: 5.1, platelets: 250 },
  { date: "Feb", wbc: 7.5, rbc: 5.0, platelets: 245 },
  { date: "Mar", wbc: 8.1, rbc: 4.9, platelets: 240 },
];

const heartData = [
  { date: "Jan", ldl: 140, hdl: 45, total: 200 },
  { date: "Feb", ldl: 150, hdl: 42, total: 215 },
  { date: "Mar", ldl: 155, hdl: 40, total: 220 },
];

const organData = [
  { date: "Jan", glucose: 95, creatinine: 1.0, alt: 30 },
  { date: "Feb", glucose: 98, creatinine: 1.1, alt: 32 },
  { date: "Mar", glucose: 110, creatinine: 1.0, alt: 35 },
];

const nutritionData = [
  { date: "Jan", vitD: 22, vitB12: 450, iron: 85 },
  { date: "Feb", vitD: 20, vitB12: 430, iron: 80 },
  { date: "Mar", vitD: 18, vitB12: 420, iron: 78 },
];

export function HealthOverview() {
  const [activeTab, setActiveTab] = useState<"blood" | "heart" | "organs" | "nutrition">("blood");

  const tabs = [
    { id: "blood" as const, label: "Blood", icon: Droplets },
    { id: "heart" as const, label: "Heart", icon: Heart },
    { id: "organs" as const, label: "Organs", icon: Activity },
    { id: "nutrition" as const, label: "Nutrition", icon: Pill },
  ];

  return (
    <DashboardLayout breadcrumb="Health Overview">
      {/* Tabs */}
      <div className="flex gap-[8px] mb-[32px] border-b border-[#E5E5E5]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-[20px] py-[12px] flex items-center gap-[8px] transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#1A6BFA]"
                  : "text-[#6B6B6B] hover:text-[#111111]"
              }`}
            >
              <Icon className="w-[16px] h-[16px]" strokeWidth={1.5} />
              <span className="text-[15px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1A6BFA]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Blood Tab */}
      {activeTab === "blood" && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">WBC</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">8.1</div>
              <div className="text-[12px] text-[#6B6B6B]">10³/µL • Normal: 4.5-11.0</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">RBC</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">4.9</div>
              <div className="text-[12px] text-[#6B6B6B]">10⁶/µL • Normal: 4.5-5.5</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">PLATELETS</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">240</div>
              <div className="text-[12px] text-[#6B6B6B]">10³/µL • Normal: 150-400</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-[20px]">Blood Cell Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bloodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <Line type="monotone" dataKey="wbc" stroke="#1A6BFA" strokeWidth={2} dot={{ fill: "#1A6BFA", r: 4 }} />
                <Line type="monotone" dataKey="rbc" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Heart Tab */}
      {activeTab === "heart" && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">LDL CHOLESTEROL</div>
                <div className="w-2 h-2 rounded-full bg-[#D97706]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">155</div>
              <div className="text-[12px] text-[#6B6B6B]">mg/dL • Optimal: &lt;100</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">HDL CHOLESTEROL</div>
                <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">40</div>
              <div className="text-[12px] text-[#6B6B6B]">mg/dL • Optimal: &gt;60</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">TOTAL CHOLESTEROL</div>
                <div className="w-2 h-2 rounded-full bg-[#D97706]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">220</div>
              <div className="text-[12px] text-[#6B6B6B]">mg/dL • Optimal: &lt;200</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-[20px]">Cholesterol Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={heartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <Line type="monotone" dataKey="ldl" stroke="#DC2626" strokeWidth={2} dot={{ fill: "#DC2626", r: 4 }} />
                <Line type="monotone" dataKey="hdl" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Organs Tab */}
      {activeTab === "organs" && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">GLUCOSE</div>
                <div className="w-2 h-2 rounded-full bg-[#D97706]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">110</div>
              <div className="text-[12px] text-[#6B6B6B]">mg/dL • Normal: 70-100</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">CREATININE</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">1.0</div>
              <div className="text-[12px] text-[#6B6B6B]">mg/dL • Normal: 0.7-1.3</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">ALT</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">35</div>
              <div className="text-[12px] text-[#6B6B6B]">U/L • Normal: 7-56</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-[20px]">Organ Function Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={organData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <Line type="monotone" dataKey="glucose" stroke="#1A6BFA" strokeWidth={2} dot={{ fill: "#1A6BFA", r: 4 }} />
                <Line type="monotone" dataKey="creatinine" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === "nutrition" && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">VITAMIN D</div>
                <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">18</div>
              <div className="text-[12px] text-[#6B6B6B]">ng/mL • Normal: 30-100</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">VITAMIN B12</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">420</div>
              <div className="text-[12px] text-[#6B6B6B]">pg/mL • Normal: 200-900</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">IRON</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">78</div>
              <div className="text-[12px] text-[#6B6B6B]">µg/dL • Normal: 60-170</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-[20px]">Vitamin & Mineral Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={nutritionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B6B6B", fontSize: 12 }} />
                <Line type="monotone" dataKey="vitD" stroke="#DC2626" strokeWidth={2} dot={{ fill: "#DC2626", r: 4 }} />
                <Line type="monotone" dataKey="vitB12" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
