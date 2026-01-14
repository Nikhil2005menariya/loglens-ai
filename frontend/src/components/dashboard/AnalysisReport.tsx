import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check, FileCode, AlertCircle, Lightbulb, ListChecks, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ValidationBadge from './ValidationBadge';
import { AnalysisResult } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisReportProps {
  report: AnalysisResult;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['summary', 'rootCause', 'fix'])
  );
  const [copiedFix, setCopiedFix] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleCopyFix = async () => {
    if (!report.aiAnalysis?.fix) return;
    await navigator.clipboard.writeText(report.aiAnalysis.fix);

    setCopiedFix(true);
    setTimeout(() => setCopiedFix(false), 2000);
  };

  const SectionHeader: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
  }> = ({ id, title, icon }) => (
    <button
      onClick={() => toggleSection(id)}
      className="flex items-center gap-3 w-full text-left py-3 hover:text-primary transition-colors"
    >
      {expandedSections.has(id) ? (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      )}
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
    </button>
  );

  const severityColor: Record<string, string> = {
    error: 'text-destructive',
    warning: 'text-warning',
    info: 'text-primary',
  };

  return (
    <div className="glass rounded-xl animate-fade-in-up">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-sm font-mono ${severityColor[report.parsedLog.severity ?? ''] || 'text-foreground'}`}>
              {report.parsedLog.errorType ?? 'Error'}
            </span>
            <ValidationBadge
              status={report.aiAnalysis?.validation?.status ?? 'conceptual'}
              reason={report.aiAnalysis?.validation?.reason}
            />

          </div>
          {report.parsedLog.file && (
            <p className="text-xs text-muted-foreground font-mono">
              {report.parsedLog.file}
              {report.parsedLog.line != null && `:${report.parsedLog.line}`}
            </p>
          )}
        </div>
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Content */}
      <div className="divide-y divide-border">
        {/* Error Summary */}
        <div className="px-4">
          <SectionHeader
            id="summary"
            title="Error Summary"
            icon={<AlertCircle className="h-4 w-4 text-destructive" />}
          />
          {expandedSections.has('summary') && (
            <div className="pb-4 pl-7">
              <p className="text-sm text-muted-foreground">
                {report.parsedLog.message ?? 'No error message available'}
              </p>
            </div>
          )}
        </div>

        {/* Root Cause */}
        <div className="px-4">
          <SectionHeader
            id="rootCause"
            title="Root Cause"
            icon={<Lightbulb className="h-4 w-4 text-warning" />}
          />
          {expandedSections.has('rootCause') && (
            <div className="pb-4 pl-7">
              <p className="text-sm leading-relaxed">
                {report.aiAnalysis.rootCause}
              </p>
            </div>
          )}
        </div>

        {/* Matched Files */}
        {report.matchedFiles.length > 0 && (
          <div className="px-4">
            <SectionHeader
              id="matchedFiles"
              title={`Matched Files (${report.matchedFiles.length})`}
              icon={<FileCode className="h-4 w-4 text-primary" />}
            />
            {expandedSections.has('matchedFiles') && (
              <div className="pb-4 pl-7 space-y-3">
                {report.matchedFiles.map((file, index) => (
                  <div key={index} className="rounded-lg bg-muted/50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-border/50 flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        {file.path}
                        {file.lineStart != null && `:${file.lineStart}`}
                        {file.lineEnd != null && file.lineEnd !== file.lineStart && `-${file.lineEnd}`}
                      </span>
                    </div>
                    <pre className="p-3 text-xs font-mono overflow-x-auto scrollbar-thin">
                      <code>{file.snippet}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fix Suggestion */}
        <div className="px-4">
          <SectionHeader
            id="fix"
            title="Fix Suggestion"
            icon={<Lightbulb className="h-4 w-4 text-success" />}
          />
          {expandedSections.has('fix') && (
            <div className="pb-4 pl-7">
              <div className="relative rounded-lg bg-muted/50 overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyFix}
                    className="h-8 text-xs"
                  >
                    {copiedFix ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="p-4 pt-12 text-sm font-mono overflow-x-auto scrollbar-thin whitespace-pre-wrap">
                  <code>{report.aiAnalysis?.fix ?? 'No fix generated yet.'}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* PR Checklist */}
        {report.aiAnalysis?.checklist?.length > 0 && (
          <div className="px-4">
            <SectionHeader
              id="checklist"
              title="PR Checklist"
              icon={<ListChecks className="h-4 w-4 text-primary" />}
            />
            {expandedSections.has('checklist') && (
              <div className="pb-4 pl-7">
                <ul className="space-y-2">
                  {report.aiAnalysis.checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="h-5 w-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                        {index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Confidence Score */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 pl-7">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Confidence Score</span>
            <div className="flex-1 max-w-xs">
              <Progress value={report.aiAnalysis.confidence * 100} className="h-2" />
            </div>
            <span className="text-sm font-mono text-primary">
              {Math.round(report.aiAnalysis.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
