import React from 'react';

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let bgColor = '';
  let textColor = '';
  let dotColor = '';
  let icon = null;

  switch (status.toLowerCase()) {
    case 'draft':
      bgColor = 'bg-[#EAEAEA]'; // lighter version of Draft gray
      textColor = 'text-draft';
      dotColor = 'bg-draft';
      break;
    case 'published':
      bgColor = 'bg-[#E5F0EA]'; // light primary green
      textColor = 'text-published';
      dotColor = 'bg-published';
      break;
    case 'submitted':
      bgColor = 'bg-[#F9F0E1]'; // light terracotta/amber
      textColor = 'text-submitted';
      dotColor = 'bg-submitted';
      break;
    case 'graded':
      bgColor = 'bg-[#E5F0EA]'; 
      textColor = 'text-graded';
      icon = (
        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      );
      break;
    case 'late':
      bgColor = 'bg-[#F9E9E8]';
      textColor = 'text-late';
      dotColor = 'bg-late';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-600';
      dotColor = 'bg-gray-400';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${bgColor} ${textColor}`}>
      {icon ? icon : <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />}
      {status}
    </span>
  );
};
