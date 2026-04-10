import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Activity, Heart, Droplets, Pill, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
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
        
        if (timeSinceUpload < 10000) {
          setTimeout(() => {
            setRefreshKey(prev => prev + 1);
            refetch();
          }, 2000);
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

  // Helper to format trends for recharts
  const chartData = useMemo(() => {
    if (!data?.trends || Object.keys(data.trends).length === 0) return [];
    if (Array.isArray(data.trends)) return data.trends;
    
    const merged: Record<string, any> = {};
    for (const [metric, points] of Object.entries(data.trends)) {
      if (Array.isArray(points)) {
        points.forEach((point: any) => {
          if (!merged[point.date]) merged[point.date] = { date: point.date };
          merged[point.date][metric] = point.value;
        });
      }
    }
    
    return Object.values(merged);
  }, [data?.trends]);

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Health Overview">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-[16px] text-[#52525B]">Loading health data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout breadcrumb="Health Overview">
        <div className="flex items-center justify-center h-[400px]">
          <div className="flex items-start gap-[8px] p-[16px] bg-[#FEF2F2] rounded-[8px] max-w-[400px]">
            <AlertCircle className="w-[14px] h-[14px] text-[#EF4444] mt-[2px] flex-shrink-0" strokeWidth={1.5} />
            <p className="text-[13px] text-[#EF4444]">
              {error?.message || "Failed to load health data. Please upload a report first."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout breadcrumb="Health Overview">
      <div className="flex gap-[8px] mb-[32px] border-b border-[#E4E4E7]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-[24px] py-[14px] flex items-center gap-[8px] transition-colors relative ${
                activeTab === tab.id
                  ? "text-[#4C1D95]"
                  : "text-[#52525B] hover:text-[#18181B]"
              }`}
            >
              <Icon className="w-[16px] h-[16px]" strokeWidth={1.5} />
              <span className="text-[15px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4C1D95]" />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "blood" && data?.bloodCounts && (
        <div className="space-y-[24px] animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">
            {[
              { label: "WBC", value: data.bloodCounts.wbc, range: "4.5-11.0", unit: "10³/µL" },
              { label: "RBC", value: data.bloodCounts.rbc, range: "4.5-5.5", unit: "10�/µL" },
              { label: "HEMOGLOBIN", value: data.bloodCounts.hemoglobin, range: "12-16", unit: "g/dL" },
              { label: "PLATELETS", value: data.bloodCounts.platelets, range: "150-400", unit: "10³/µL" }
            ].map((metric) => (
              <div key={metric.label} className="bg-white border border-[#E4E4E7] rounded-[20px] p-[20px] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-[12px]">
                  <div className="text-[13px] text-[#52525B] tracking-[0.04em] font-semibold">{metric.label}</div>
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                </div>
                <div className="text-[28px] font-bold text-[#18181B] mb-1">{metric.value ?? "N/A"}</div>
                <div className="text-[12px] text-[#52525B]">{metric.unit} • Normal: {metric.range}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-[24px] p-[28px] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[18px] font-bold text-[#18181B] mb-[24px]">Blood Cell Trends</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="date" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis yAxisId="left" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line yAxisId="left" type="monotone" name="WBC" dataKey="wbc" stroke="#4C1D95" strokeWidth={3} dot={{r:4, fill: '#4C1D95', strokeWidth: 2, stroke:'#fff'}} activeDot={{r: 6}} />
                  <Line yAxisId="left" type="monotone" name="RBC" dataKey="rbc" stroke="#10B981" strokeWidth={3} dot={{r:4, fill: '#10B981', strokeWidth: 2, stroke:'#fff'}} activeDot={{r: 6}} />
                  <Line yAxisId="left" type="monotone" name="Hemoglobin" dataKey="hemoglobin" stroke="#F59E0B" strokeWidth={3} dot={{r:4, fill: '#F59E0B', strokeWidth: 2, stroke:'#fff'}} activeDot={{r: 6}} />
                  <Line yAxisId="right" type="monotone" name="Platelets" dataKey="platelets" stroke="#EF4444" strokeWidth={3} dot={{r:4, fill: '#EF4444', strokeWidth: 2, stroke:'#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#A1A1AA] bg-[#FAFAF7] rounded-[12px] border border-dashed border-[#E4E4E7]">No trend data available</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "heart" && data?.heart && (
        <div className="space-y-[24px] animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {[
              { label: "LDL", value: data.heart.ldl, range: "Optimal: under 100", dot: "bg-[#EF4444]" },
              { label: "HDL", value: data.heart.hdl, range: "Normal: above 40", dot: "bg-[#10B981]" },
              { label: "TOTAL CHOLESTEROL", value: data.heart.totalCholesterol, range: "Normal: under 200", dot: "bg-[#F59E0B]" }
            ].map((metric) => (
              <div key={metric.label} className="bg-white border border-[#E4E4E7] rounded-[20px] p-[20px] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-[12px]">
                  <div className="text-[13px] text-[#52525B] tracking-[0.04em] font-semibold">{metric.label}</div>
                  <div className={`w-2 h-2 rounded-full ${metric.dot}`} />
                </div>
                <div className="text-[28px] font-bold text-[#18181B] mb-1">{metric.value ?? "N/A"}</div>
                <div className="text-[12px] text-[#52525B]">mg/dL • {metric.range}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-[24px] p-[28px] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[18px] font-bold text-[#18181B] mb-[24px]">Cholesterol Trends</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="date" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" name="LDL" dataKey="ldl_cholesterol" stroke="#EF4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  <Line type="monotone" name="HDL" dataKey="hdl_cholesterol" stroke="#10B981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  <Line type="monotone" name="Total" dataKey="total_cholesterol" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#A1A1AA] bg-[#FAFAF7] rounded-[12px] border border-dashed border-[#E4E4E7]">No trend data available</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "organs" && data?.organs && (
        <div className="space-y-[24px] animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">
            {[
              { label: "GLUCOSE", value: data.organs.glucose, range: "Normal: 70-100", unit: "mg/dL", dot: "bg-[#D97706]" },
              { label: "CREATININE", value: data.organs.creatinine, range: "Normal: 0.6-1.2", unit: "mg/dL", dot: "bg-[#10B981]" },
              { label: "ALT", value: data.organs.alt, range: "Normal: under 40", unit: "U/L", dot: "bg-[#10B981]" },
              { label: "AST", value: data.organs.ast, range: "Normal: under 40", unit: "U/L", dot: "bg-[#10B981]" }
            ].map((metric) => (
              <div key={metric.label} className="bg-white border border-[#E4E4E7] rounded-[20px] p-[20px] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-[12px]">
                  <div className="text-[13px] text-[#52525B] tracking-[0.04em] font-semibold">{metric.label}</div>
                  <div className={`w-2 h-2 rounded-full ${metric.dot}`} />
                </div>
                <div className="text-[28px] font-bold text-[#18181B] mb-1">{metric.value ?? "N/A"}</div>
                <div className="text-[12px] text-[#52525B]">{metric.unit} • {metric.range}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-[24px] p-[28px] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[18px] font-bold text-[#18181B] mb-[24px]">Organ Health Trends</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="date" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis yAxisId="left" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line yAxisId="left" type="monotone" name="Glucose" dataKey="glucose" stroke="#D97706" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line yAxisId="left" type="monotone" name="ALT" dataKey="alt" stroke="#10B981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line yAxisId="left" type="monotone" name="AST" dataKey="ast" stroke="#3B82F6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line yAxisId="right" type="monotone" name="Creatinine" dataKey="creatinine" stroke="#4C1D95" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#A1A1AA] bg-[#FAFAF7] rounded-[12px] border border-dashed border-[#E4E4E7]">No trend data available</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "nutrition" && data?.nutrition && (
        <div className="space-y-[24px] animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {[
              { label: "VITAMIN D", value: data.nutrition.vitaminD, range: "Normal: above 30", unit: "ng/mL", dot: "bg-[#F59E0B]" },
              { label: "VITAMIN B12", value: data.nutrition.vitaminB12, range: "Normal: above 200", unit: "pg/mL", dot: "bg-[#10B981]" },
              { label: "IRON", value: data.nutrition.iron, range: "Normal: 60-170", unit: "µg/dL", dot: "bg-[#F59E0B]" }
            ].map((metric) => (
              <div key={metric.label} className="bg-white border border-[#E4E4E7] rounded-[20px] p-[20px] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-[12px]">
                  <div className="text-[13px] text-[#52525B] tracking-[0.04em] font-semibold">{metric.label}</div>
                  <div className={`w-2 h-2 rounded-full ${metric.dot}`} />
                </div>
                <div className="text-[28px] font-bold text-[#18181B] mb-1">{metric.value ?? "N/A"}</div>
                <div className="text-[12px] text-[#52525B]">{metric.unit} • {metric.range}</div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E4E4E7] rounded-[24px] p-[28px] shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-[18px] font-bold text-[#18181B] mb-[24px]">Nutrition Trends</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F4F4F5" vertical={false} />
                  <XAxis dataKey="date" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                  <YAxis yAxisId="left" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#A1A1AA" tick={{fontSize: 12}} tickLine={false} axisLine={false} dx={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E4E4E7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line yAxisId="left" type="monotone" name="Vitamin D" dataKey="vitamin_d" stroke="#F59E0B" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line yAxisId="right" type="monotone" name="Vitamin B12" dataKey="vitamin_b12" stroke="#10B981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line yAxisId="left" type="monotone" name="Iron" dataKey="iron" stroke="#4C1D95" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#A1A1AA] bg-[#FAFAF7] rounded-[12px] border border-dashed border-[#E4E4E7]">No trend data available</div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
