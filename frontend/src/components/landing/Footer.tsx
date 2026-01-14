import React from 'react';
import { Github, FileText, Shield } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />

          <div className="flex items-center gap-8">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="/privacy"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="h-4 w-4" />
              Privacy
            </a>
            <a
              href="/terms"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4" />
              Terms
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LogLens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
