import React, { useState } from 'react';
import { X, GitBranch, Webhook, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getWebhookUrl } from '@/lib/api';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, repoUrl: string) => Promise<void>;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const webhookUrl = getWebhookUrl();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    await onSubmit(name, repoUrl);
    setIsLoading(false);
    setStep(1);
    setName('');
    setRepoUrl('');
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setName('');
    setRepoUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 glass-strong rounded-xl shadow-elevated animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              {step === 1 ? (
                <GitBranch className="h-5 w-5 text-primary" />
              ) : (
                <Webhook className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {step === 1 ? 'Add New Project' : 'Set Up Webhook'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Step {step} of 2
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project Name
                </label>
                <Input
                  id="name"
                  placeholder="My Awesome Project"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="repoUrl" className="text-sm font-medium">
                  GitHub Repository URL
                </label>
                <Input
                  id="repoUrl"
                  placeholder="https://github.com/username/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the full URL to your GitHub repository
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <h3 className="text-sm font-semibold text-warning mb-2 flex items-center gap-2">
                  <Webhook className="h-4 w-4" />
                  Webhook Setup (Required)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Setting up the webhook keeps LogLens in sync with your repository and enables commit-aware debugging.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    1
                  </span>
                  <div>
                    <p className="text-sm">Go to your GitHub repository</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Settings → Webhooks → Add webhook
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-sm mb-2">Add this Payload URL:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 text-xs bg-muted rounded-lg font-mono overflow-x-auto">
                        {webhookUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    3
                  </span>
                  <div>
                    <p className="text-sm">Configure the webhook</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                      <li>• Content type: <code className="code-inline">application/json</code></li>
                      <li>• Select: <strong>Just the push event</strong></li>
                      <li>• Click <strong>Add webhook</strong> to save</li>
                    </ul>
                  </div>
                </div>
              </div>

              <a
                href={`${repoUrl}/settings/hooks/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Open webhook settings in GitHub
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          {step === 2 && (
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={step === 1 ? !name || !repoUrl : isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : step === 1 ? (
              'Next'
            ) : (
              'Create Project'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
