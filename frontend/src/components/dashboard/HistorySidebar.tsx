import React from 'react';
import { Clock, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface HistorySidebarProps {
  reports: AnalysisResult[];
  activeReportId: string | null;
  onSelectReport: (reportId: string) => void;
  isLoading?: boolean;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  reports,
  activeReportId,
  onSelectReport,
  isLoading = false,
}) => {
  const getStatusIcon = (status?: string) => {

    switch (status) {
      case 'verified':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'partial':
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      default:
        return <AlertCircle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full bg-card/50 p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          History
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card/50 flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          History
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {reports.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p>No analysis history yet</p>
            <p className="mt-1 text-xs">Submit an error to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {reports.map((report) => {
              const isActive = report.id === activeReportId;

              return (
                <button
                  key={report.id}
                  onClick={() => onSelectReport(report.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-accent border border-primary/30'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getStatusIcon(report.aiAnalysis?.validation?.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {report.parsedLog.errorType ?? 'Error'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {report.parsedLog.message?.slice(0, 50) ?? 'No message'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
