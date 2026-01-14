import React from 'react';
import { GitBranch, FileCode, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: GitBranch,
    title: 'Connect GitHub Repo',
    description: 'Link your repository and set up the webhook. LogLens will index your codebase and stay updated with every push.',
  },
  {
    number: '02',
    icon: FileCode,
    title: 'Paste Error or Log',
    description: 'Copy any runtime error, stack trace, or log output. Our parser understands multiple formats and languages.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Get Verified Fix',
    description: 'Receive a detailed analysis with root cause, matched files, fix suggestions, and a confidence score based on your actual code.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden" id="how-it-works">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="text-gradient-primary">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From error to fix in three simple steps
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative flex gap-6 mb-12 last:mb-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-primary/50 to-transparent" />
              )}

              {/* Step number circle */}
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <step.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-primary">{step.number}</span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
