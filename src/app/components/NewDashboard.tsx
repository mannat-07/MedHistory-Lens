import { useNavigate } from "react-router";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, AreaChart, Area, Tooltip } from "recharts";
import { AlertCircle, TrendingUp, Sparkles, Stethoscope, Upload, Activity, Heart, Droplets } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { useEffect, useState } from "react";
import { useDashboard } from "../../hooks/useData";

export function NewDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();
  
  const trendData = [
    { name: "Jan", hb: 13.5, wbc: 6.5, sugar: 92 },
    { name: "Feb", hb: 13.8, wbc: 6.8, sugar: 95 },
    { name: "Mar", hb: 14.1, wbc: 7.2, sugar: 88 },
    { name: "Apr", hb: 14.3, wbc: 7.0, sugar: 90 },
    { name: "May", hb: 14.5, wbc: 6.9, sugar: 85 },
    { name: "Jun", hb: 14.8, wbc: 7.5, sugar: 82 },
  ];

  if (isLoading) {
    return (
      <DashboardLayout breadcrumb="Overview">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-[#4C1D95]/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-[#10B981]/40 animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#4C1D95] to-[#10B981] opacity-50 blur-sm animate-pulse"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const riskScore = 28; 

  return (
    <DashboardLayout breadcrumb="Intelligence Overview">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-[#18181B] tracking-tight flex items-center gap-3">
            Health Intelligence 
            <Sparkles className="w-5 h-5 text-[#4C1D95] animate-pulse" />
          </h1>
          <p className="text-[#52525B] text-[14px] mt-1">Real-time analysis of your biomarkers and health trends</p>
        </div>
        <button
          onClick={() => navigate("/upload-report")}
          className="group px-5 py-2.5 bg-white hover:bg-[#FAFAF7] border border-[#E4E4E7] backdrop-blur-md rounded-xl text-[14px] font-semibold transition-all shadow-sm shadow-[#4C1D95]/5 flex items-center gap-2 text-[#18181B]"
        >
          <Upload className="w-4 h-4 text-[#4C1D95] group-hover:scale-110 transition-transform" />
          <span>Analyze Report</span>
          <div className="absolute inset-0 border border-[#4C1D95]/0 group-hover:border-[#4C1D95]/30 rounded-xl transition-colors pointer-events-none" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Blood Pressure" 
            value="118/76" 
            unit="mmHg" 
            trend="-2% vs last month" 
            status="optimal" 
            icon={Heart} 
            color="#10B981" 
          />
          <MetricCard 
            title="Avg. Glucose" 
            value="92" 
            unit="mg/dL" 
            trend="Stable trend" 
            status="optimal" 
            icon={Activity} 
            color="#D97706" 
          />
          <MetricCard 
            title="Cholesterol" 
            value="185" 
            unit="mg/dL" 
            trend="+5% vs last month" 
            status="warning" 
            icon={Droplets} 
            color="#EF4444" 
          />
        </div>

        <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4C1D95]/5 blur-3xl rounded-full" />
          <h3 className="text-[13px] uppercase tracking-wider font-bold text-[#52525B] w-full text-left mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#4C1D95]" /> Health Risk
          </h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#F4F4F5" strokeWidth="12" />
              <circle 
                cx="64" 
                cy="64" 
                r="56" 
                fill="transparent" 
                stroke="url(#gradient)" 
                strokeWidth="12" 
                strokeDasharray="351.85" 
                strokeDashoffset={351.85 - (351.85 * riskScore) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#18181B] tracking-tighter">{riskScore}</span>
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-widest">Score</span>
            </div>
          </div>
          <p className="text-center mt-4 text-[13px] text-[#52525B] font-medium leading-relaxed">
            Your risk profile is currently <span className="text-[#10B981] font-bold">low</span>. Maintain diet to keep indices stable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4C1D95] to-[#10B981] opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
          <h3 className="text-[15px] font-bold text-[#18181B] mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4C1D95]" />
            Biomarker Trends
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4C1D95" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4C1D95" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F4F5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#A1A1AA', fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E4E4E7', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                  itemStyle={{ fontSize: 13, fontWeight: 600 }}
                  labelStyle={{ color: '#18181B', fontWeight: 700, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="hb" name="Hemoglobin" stroke="#4C1D95" strokeWidth={3} fillOpacity={1} fill="url(#colorHb)" />
                <Area type="monotone" dataKey="sugar" name="Glucose" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#FAFAF7] border border-[#E4E4E7] rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-[15px] font-bold text-[#18181B] mb-5 flex items-center gap-2 relative z-10">
            <Stethoscope className="w-5 h-5 text-[#4C1D95]" />
            AI Insights
          </h3>
          
          <div className="space-y-4 flex-1 relative z-10">
            <div className="p-4 bg-white border border-[#E4E4E7] rounded-xl hover:border-[#4C1D95]/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981] group-hover:w-1.5 transition-all" />
              <p className="text-[13px] text-[#52525B] leading-relaxed font-medium">Glucose trajectory is excellent. Continuing your current low-GI diet is recommended.</p>
            </div>
            <div className="p-4 bg-white border border-[#E4E4E7] rounded-xl hover:border-[#4C1D95]/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706] group-hover:w-1.5 transition-all" />
              <p className="text-[13px] text-[#52525B] leading-relaxed font-medium">Cholesterol shows a slight uptick. Substitute dairy with plant-based alternatives this week.</p>
            </div>
            <div className="p-4 bg-white border border-[#E4E4E7] rounded-xl hover:border-[#4C1D95]/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4C1D95] group-hover:w-1.5 transition-all" />
              <p className="text-[13px] text-[#52525B] leading-relaxed font-medium">Hemoglobin is steady. Iron absorption is optimal; continue vitamin C pairings.</p>
            </div>
          </div>
          
          <button onClick={() => navigate("/reports")} className="mt-6 w-full py-2.5 bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] text-[#18181B] text-[13px] font-bold rounded-xl transition-colors shadow-sm">
            View All Insights
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, unit, trend, status, icon: Icon, color }: any) {
  const getStatusColor = () => {
    if (status === "optimal") return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
    if (status === "warning") return "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/20";
    return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
  };

  return (
    <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[12px] uppercase tracking-widest font-bold text-[#52525B]">{title}</h3>
        <div className="w-8 h-8 rounded-lg bg-[#FAFAF7] border border-[#E4E4E7] flex items-center justify-center group-hover:bg-white transition-colors">
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-1 relative z-10 mb-3">
        <span className="text-[32px] font-bold text-[#18181B] tracking-tighter">{value}</span>
        <span className="text-[13px] text-[#A1A1AA] font-semibold">{unit}</span>
      </div>
      <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getStatusColor()}`}>
        {trend}
      </div>
    </div>
  );
}
