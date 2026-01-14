import React from 'react';
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ValidationBadgeProps {
  status: 'verified' | 'partial' | 'conceptual';
  reason?: string;
}

const ValidationBadge: React.FC<ValidationBadgeProps> = ({ status, reason }) => {
  const config = {
    verified: {
      icon: CheckCircle,
      label: 'Verified',
      className: 'bg-success/10 text-success border-success/20',
      description: 'This fix has been verified against your actual codebase.',
    },
    partial: {
      icon: AlertTriangle,
      label: 'Partially Verified',
      className: 'bg-warning/10 text-warning border-warning/20',
      description: 'This fix is partially verified. Some elements could not be confirmed.',
    },
    conceptual: {
      icon: HelpCircle,
      label: 'Conceptual',
      className: 'bg-muted text-muted-foreground border-border',
      description: 'This is a conceptual fix based on the error pattern. Manual verification recommended.',
    },
  };

  const { icon: Icon, label, className, description } = config[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-sm">{reason || description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ValidationBadge;
