export function SkeletonMetricCard() {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="flex items-start justify-between mb-[12px]">
        <div className="h-[14px] bg-[#E5E5E5] rounded w-[80px]" />
        <div className="w-2 h-2 rounded-full bg-[#E5E5E5]" />
      </div>
      <div className="h-[28px] bg-[#E5E5E5] rounded w-[120px] mb-[8px]" />
      <div className="h-[12px] bg-[#E5E5E5] rounded w-[60px]" />
    </div>
  );
}

export function SkeletonMetricCardGrid() {
  return (
    <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
      {[...Array(3)].map((_, i) => (
        <SkeletonMetricCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] mb-[32px]">
      <div className="h-[20px] bg-[#E5E5E5] rounded w-[200px] mb-[24px] animate-pulse" />
      <div className="space-y-[8px] animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[40px] bg-[#E5E5E5] rounded" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[12px] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="h-[18px] bg-[#E5E5E5] rounded w-[200px] mb-[16px]" />
      <div className="space-y-[12px]">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[60px] bg-[#E5E5E5] rounded" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div>
      <SkeletonMetricCardGrid />
      <SkeletonChart />
      <SkeletonSection />
    </div>
  );
}
