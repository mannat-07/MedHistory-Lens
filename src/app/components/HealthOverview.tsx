import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Activity, Heart, Droplets, Pill, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { useHealthData } from "../../hooks/useData";

export function HealthOverview() {
  const [activeTab, setActiveTab] = useState<"blood" | "heart" | "organs" | "nutrition">("blood");
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data, isLoading, error, refetch } = useHealthData(activeTab);

  // Refetch when tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, refreshKey, refetch]);

  // Refetch if new data was uploaded
  useEffect(() => {
    const checkForNewUpload = () => {
      const refreshTrigger = localStorage.getItem("data_refresh_trigger");
      if (refreshTrigger) {
        const uploadTime = parseInt(refreshTrigger);
        const timeSinceUpload = Date.now() - uploadTime;
        
        // If upload was recent (within last 10 seconds), refetch with delay
        if (timeSinceUpload < 10000) {
          setTimeout(() => {
            console.log("Refetching health overview after upload...");
            setRefreshKey(prev => prev + 1);
            refetch();
          }, 2000);
          
          // Clear the refresh trigger
          localStorage.removeItem("data_refresh_trigger");
        }
      }
    };

    checkForNewUpload();
  }, [refetch]);

  const tabs = [
    { id: "blood" as const, label: "Blood", icon: Droplets },
    { id: "heart" as const, label: "Heart", icon: Heart },
    { id: "organs" as const, label: "Organs", icon: Activity },
    { id: "nutrition" as const, label: "Nutrition", icon: Pill },
  ];

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Health Overview">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-[16px] text-[#6B6B6B]">Loading health data...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <DashboardLayout breadcrumb="Health Overview">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex items-start gap-[8px] p-[16px] bg-[#FEE2E2] rounded-[8px] max-w-[400px]">
            <AlertCircle className="w-[14px] h-[14px] text-[#991B1B] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#991B1B]">
              {error?.message || "Failed to load health data. Please upload a report first."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
      {activeTab === "blood" && data?.bloodCounts && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-4 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">WBC</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.bloodCounts.wbc}</div>
              <div className="text-[12px] text-[#6B6B6B]">10³/µL • Normal: 4.5-11.0</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">RBC</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.bloodCounts.rbc}</div>
              <div className="text-[12px] text-[#6B6B6B]">10⁶/µL • Normal: 4.5-5.5</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">HEMOGLOBIN</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.bloodCounts.hemoglobin}</div>
              <div className="text-[12px] text-[#6B6B6B]">g/dL • Normal: 12-16</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">PLATELETS</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.bloodCounts.platelets}</div>
              <div className="text-[12px] text-[#6B6B6B]">10³/µL • Normal: 150-400</div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h3 className="text-[15px] font-semibold text-[#111111] mb-[20px]">Blood Cell Trends</h3>
            {data.trends && data.trends.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="date" stroke="#6B6B6B" />
                  <YAxis stroke="#6B6B6B" />
                  <Line type="monotone" dataKey="wbc" stroke="#1A6BFA" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="rbc" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-[#6B6B6B]">No trend data available</div>
            )}
          </div>
        </div>
      )}

      {/* Heart Tab */}
      {activeTab === "heart" && data?.heart && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">LDL</div>
                <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.heart.ldl}</div>
              <div className="text-[12px] text-[#6B6B6B]">{"mg/dL • Optimal: under 100"}</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">HDL</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.heart.hdl}</div>
              <div className="text-[12px] text-[#6B6B6B]">{"mg/dL • Normal: above 40"}</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">TOTAL</div>
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.heart.totalCholesterol}</div>
              <div className="text-[12px] text-[#6B6B6B]">{"mg/dL • Normal: under 200"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Organs Tab */}
      {activeTab === "organs" && data?.organs && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">GLUCOSE</div>
                <div className="w-2 h-2 rounded-full bg-[#D97706]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.organs.glucose}</div>
              <div className="text-[12px] text-[#6B6B6B]">mg/dL • Normal: 70-100</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">CREATININE</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.organs.creatinine}</div>
              <div className="text-[12px] text-[#6B6B6B]">mg/dL • Normal: 0.6-1.2</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">ALT</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.organs.alt}</div>
              <div className="text-[12px] text-[#6B6B6B]">{"U/L • Normal: under 40"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === "nutrition" && data?.nutrition && (
        <div className="space-y-[24px]">
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">VITAMIN D</div>
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.nutrition.vitaminD}</div>
              <div className="text-[12px] text-[#6B6B6B]">{"ng/mL • Normal: above 30"}</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">VITAMIN B12</div>
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.nutrition.vitaminB12}</div>
              <div className="text-[12px] text-[#6B6B6B]">{"pg/mL • Normal: above 200"}</div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between mb-[12px]">
                <div className="text-[13px] text-[#6B6B6B] tracking-[0.04em]">IRON</div>
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              </div>
              <div className="text-[24px] font-semibold text-[#111111]">{data.nutrition.iron}</div>
              <div className="text-[12px] text-[#6B6B6B]">µg/dL • Normal: 60-170</div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
