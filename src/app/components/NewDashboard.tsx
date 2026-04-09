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
            <div className="absolute inset-0 rounded-full border-2 border-[#8B5CF6]/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-[#10B981]/40 animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#10B981] opacity-50 blur-sm animate-pulse"></div>
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
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight flex items-center gap-3">
            Health Intelligence 
            <Sparkles className="w-5 h-5 text-[#8B5CF6] animate-pulse" />
          </h1>
          <p className="text-[#64748B] text-[14px] mt-1">Real-time analysis of your biomarkers and health trends</p>
        </div>
        <button
          onClick={() => navigate("/upload-report")}
          className="group px-5 py-2.5 bg-white hover:bg-gray-50 border border-[#E2E8F0] backdrop-blur-md rounded-xl text-[14px] font-medium transition-all shadow-sm shadow-[#8B5CF6]/5 flex items-center gap-2 text-[#0F172A]"
        >
          <Upload className="w-4 h-4 text-[#8B5CF6] group-hover:scale-110 transition-transform" />
          <span>Analyze Report</span>
          <div className="absolute inset-0 border border-[#8B5CF6]/0 group-hover:border-[#8B5CF6]/30 rounded-xl transition-colors pointer-events-none" />
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
            color="#F59E0B" 
          />
          <MetricCard 
            title="Cholesterol" 
            value="185" 
            unit="mg/dL" 
            trend="+5% vs last month" 
            status="warning" 
            icon={Droplets} 
            color="#F43F5E" 
          />
        </div>

        <div className="bg-white/70 border border-[#E2E8F0] backdrop-blur-xl rounded-2xl p-6 shadow-sm shadow-gray-200/50 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 blur-3xl rounded-full" />
          <h3 className="text-[13px] uppercase tracking-wider font-semibold text-[#64748B] w-full text-left mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#8B5CF6]" /> Health Risk
          </h3>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
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
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#0F172A] tracking-tighter">{riskScore}</span>
              <span className="text-[10px] text-[#64748B] uppercase tracking-widest">Score</span>
            </div>
          </div>
          <p className="text-center mt-4 text-[13px] text-[#475569] font-medium">
            Your risk profile is currently <span className="text-[#10B981] font-semibold">low</span>. Maintain diet to keep indices stable.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/70 border border-[#E2E8F0] backdrop-blur-xl rounded-2xl p-6 shadow-sm shadow-gray-200/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#10B981] opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
          <h3 className="text-[15px] font-semibold text-[#0F172A] mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
            Biomarker Trends
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', borderColor: 'rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: 13, fontWeight: 500 }}
                  labelStyle={{ color: '#6D28D9', fontWeight: 600, marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="hb" name="Hemoglobin" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorHb)" />
                <Area type="monotone" dataKey="sugar" name="Glucose" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-b from-purple-50/50 to-white/50 border border-[#E2E8F0] backdrop-blur-xl rounded-2xl p-6 shadow-sm shadow-[#8B5CF6]/5 relative overflow-hidden flex flex-col">
          <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[100%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-overlay" />
          
          <h3 className="text-[15px] font-semibold text-[#6D28D9] mb-5 flex items-center gap-2 relative z-10">
            <Stethoscope className="w-5 h-5 text-[#8B5CF6] drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
            AI Insights
          </h3>
          
          <div className="space-y-4 flex-1 relative z-10">
            <div className="p-4 bg-white/60 border border-[#E2E8F0] rounded-xl hover:bg-white transition-colors group cursor-pointer relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981] group-hover:w-1.5 transition-all shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <p className="text-[13px] text-[#334155] leading-relaxed font-medium">Glucose trajectory is excellent. Continuing your current low-GI diet is recommended.</p>
            </div>
            <div className="p-4 bg-white/60 border border-[#E2E8F0] rounded-xl hover:bg-white transition-colors group cursor-pointer relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F59E0B] group-hover:w-1.5 transition-all shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <p className="text-[13px] text-[#334155] leading-relaxed font-medium">Cholesterol shows a slight uptick. Substitute dairy with plant-based alternatives this week.</p>
            </div>
            <div className="p-4 bg-white/60 border border-[#E2E8F0] rounded-xl hover:bg-white transition-colors group cursor-pointer relative overflow-hidden shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B5CF6] group-hover:w-1.5 transition-all shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
              <p className="text-[13px] text-[#334155] leading-relaxed font-medium">Hemoglobin is steady. Iron absorption is optimal; continue vitamin C pairings.</p>
            </div>
          </div>
          
          <button onClick={() => navigate("/ai-prediction")} className="mt-6 w-full py-2.5 bg-white hover:bg-purple-50 border border-[#E2E8F0] hover:border-[#8B5CF6]/30 text-[#6D28D9] text-[13px] font-semibold rounded-xl transition-colors backdrop-blur-sm z-10 shadow-sm">
            View Full Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ title, value, unit, trend, status, icon: Icon, color }: any) {
  const getStatusColor = () => {
    if (status === "optimal") return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
    if (status === "warning") return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";
    return "text-[#F43F5E] bg-[#F43F5E]/10 border-[#F43F5E]/20";
  };

  return (
    <div className="bg-white/70 border border-[#E2E8F0] backdrop-blur-xl rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-500">
      <div className="absolute -top-10 -right-10 w-24 h-24 blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[13px] uppercase tracking-wider font-semibold text-[#64748B]">{title}</h3>
        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:bg-gray-50 transition-colors">
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-1 relative z-10 mb-3">
        <span className="text-[32px] font-bold text-[#0F172A] tracking-tighter">{value}</span>
        <span className="text-[13px] text-[#64748B] font-medium">{unit}</span>
      </div>
      <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusColor()}`}>
        {trend}
      </div>
    </div>
  );
}
