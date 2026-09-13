import React, { ErrorInfo, ReactNode } from 'react';
import { sanitizeErrorMessage } from '../services/securityCore';
import { ShieldAlert, RefreshCw, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  sanitizedError: string;
}

export class SafeErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      sanitizedError: '',
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      sanitizedError: sanitizeErrorMessage(error),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, internal stack traces and file paths are strictly redacted
    console.error('[MAKI Security Boundary] Shielded system fault:', {
      name: error.name,
      message: sanitizeErrorMessage(error.message),
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, sanitizedError: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[320px] p-6 rounded-lg bg-black/90 border border-red-500/60 font-mono text-neutral-200 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-500/80 flex items-center justify-center text-red-400 mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold mb-1 tracking-wider uppercase">
            <Terminal className="w-3.5 h-3.5" />
            <span>Sovereign Security Boundary Triggered</span>
          </div>

          <h3 className="text-base font-bold text-white mb-2">
            {this.props.fallbackTitle || 'Execution Halted for User Protection'}
          </h3>

          <div className="w-full bg-red-950/20 border border-red-500/30 rounded p-3 text-xs text-red-300/90 mb-4 text-left">
            <span className="text-red-400 font-bold">[SANITIZED FAULT]: </span>
            <span>{this.state.sanitizedError || 'Execution failed. Debug traces redacted to prevent information disclosure.'}</span>
          </div>

          <p className="text-[11px] text-neutral-400 mb-5 max-w-md">
            All stack traces, memory heap pointers, and local system paths have been purged from client view to maintain complete anonymity and information isolation.
          </p>

          <button
            onClick={this.handleReset}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>REBOOT SECURE TERMINAL</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
