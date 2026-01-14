import React, { useState, useRef, useEffect } from 'react';
import { Send, Command, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisInputProps {
  onSubmit: (logs: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const AnalysisInput: React.FC<AnalysisInputProps> = ({ onSubmit, isLoading = false, disabled = false }) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (value.trim() && !isLoading && !disabled) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [value]);

  return (
    <div className="glass rounded-xl p-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your error, stack trace, or logs here..."
          disabled={disabled || isLoading}
          className="w-full min-h-[120px] max-h-[300px] bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-sm"
          rows={4}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <kbd className="px-2 py-1 rounded bg-muted font-mono text-[10px]">
            <Command className="h-3 w-3 inline" /> + Enter
          </kbd>
          <span>to analyze</span>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading || disabled}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Analyze
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisInput;
