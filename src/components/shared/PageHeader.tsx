import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  icon?: LucideIcon;
}

export default function PageHeader({ title, action, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-gray-500" />}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {action}
    </div>
  );
}