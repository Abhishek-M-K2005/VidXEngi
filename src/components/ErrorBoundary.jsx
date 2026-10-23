import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Captured by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('vq_teams_data');
      localStorage.removeItem('vq_prod_teams_v1');
      localStorage.removeItem('vq_active_team_id');
      localStorage.removeItem('vq_active_session');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0c0e] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#14151b] border border-cyan-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00e5ff] mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold font-mono text-white">Application Refresh Required</h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              A temporary state discrepancy was caught. Click below to reload cleanly.
            </p>
            {this.state.error && (
              <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 text-left font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-32">
                {String(this.state.error.message || this.state.error)}
              </div>
            )}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-[#00e5ff] hover:bg-cyan-300 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition shadow-[0_0_15px_rgba(0,229,255,0.25)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-bold cursor-pointer transition border border-zinc-700"
              >
                <span>Reset Cache &amp; Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
