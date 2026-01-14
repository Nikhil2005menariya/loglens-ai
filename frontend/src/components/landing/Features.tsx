import React from 'react';
import { GitBranch, Brain, CheckCircle, History, Search, Zap } from 'lucide-react';

const features = [
  {
    icon: GitBranch,
    title: 'Repo-Aware Debugging',
    description: 'LogLens indexes your codebase and understands your architecture, dependencies, and patterns.',
  },
  {
    icon: Brain,
    title: 'Commit-Aware Memory',
    description: 'Every analysis considers your commit history, understanding how your code evolved.',
  },
  {
    icon: CheckCircle,
    title: 'Validated Fix Suggestions',
    description: 'Get fixes marked as Verified, Partial, or Conceptual based on actual code verification.',
  },
  {
    icon: History,
    title: 'Persistent Reports',
    description: 'All debugging sessions are saved. Review past analyses and track recurring issues.',
  },
  {
    icon: Search,
    title: 'Smart File Matching',
    description: 'Automatically identifies relevant files in your codebase related to the error.',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Get comprehensive debugging reports in seconds, not hours of manual investigation.',
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 relative" id="features">
      <div className="container px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="text-gradient-primary">Debug Smarter</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            LogLens combines AI intelligence with deep repository understanding to deliver debugging insights you can trust.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl glass hover:bg-card/90 transition-all duration-300 hover:shadow-glow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
