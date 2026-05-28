import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ERROR_BOUNDARY] Caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Safe recovery redirect
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#03110D] flex flex-col justify-between p-6 text-[#E0E7E5] font-sans selection:bg-[#2FE081]/30">
          {/* Header */}
          <div className="flex items-center gap-3 py-4 border-b border-[#142D24] shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#E83F3F]/10 flex items-center justify-center border border-[#E83F3F]/30 animate-pulse">
              <span className="text-[#E83F3F] font-bold text-sm">!</span>
            </div>
            <h1 className="text-[18px] font-black text-[#E83F3F] tracking-wide uppercase">System Alert</h1>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-center items-center py-8 text-center max-w-[340px] mx-auto gap-6">
            <div className="w-20 h-20 rounded-full bg-[#E83F3F]/10 flex items-center justify-center border border-[#E83F3F]/20 relative">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E83F3F" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div className="absolute inset-0 bg-[#E83F3F]/5 rounded-full filter blur-xl animate-pulse" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-[20px] font-black tracking-wide text-white">Something Went Wrong</h2>
              <p className="text-[#E0E7E5]/70 text-sm leading-relaxed">
                The application encountered an unexpected runtime error.
              </p>
            </div>

            {/* Diagnostics */}
            <div className="w-full text-left bg-[#051A14] border border-[#142D24] rounded-xl p-4 overflow-x-auto max-h-[160px] text-xs font-mono text-[#E83F3F]/80">
              <div className="font-bold text-white mb-1">Diagnostics:</div>
              {this.state.error ? this.state.error.toString() : 'Unknown runtime crash'}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pb-6 w-full flex flex-col items-center gap-3 shrink-0">
            <button
              onClick={this.handleReset}
              className="w-full max-w-[340px] py-4 bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-xl text-[#03110D] font-black text-sm tracking-wider uppercase shadow-[0_0_24px_rgba(47,224,129,0.15)] border border-[#50FFAA]/30 active:scale-[0.98] transition-transform"
            >
              Reset & Go to Home
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="text-[#2FE081] hover:underline text-xs tracking-wider uppercase font-bold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
