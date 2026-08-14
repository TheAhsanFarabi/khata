import React from 'react';

type DashboardSummaryCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export const DashboardSummaryCard = ({ title, value, subtitle }: DashboardSummaryCardProps) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {subtitle && <span className="text-sm text-gray-500 font-medium">{subtitle}</span>}
      </div>
    </div>
  );
};
