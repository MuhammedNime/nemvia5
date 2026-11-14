import React from 'react';
import { AlertTriangle, Home, RotateCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKey?: string;
  onGoHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'خطأ غير متوقع في عرض الواجهة.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[NEMVIA ErrorBoundary]', error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, message: '' });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, message: '' });
    this.props.onGoHome?.();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        dir="rtl"
        className="min-h-[60dvh] flex items-center justify-center p-6 font-['Cairo',sans-serif]"
      >
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-slate-900">حدث خطأ غير متوقع</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              واجهت هذه الشاشة خللاً مفاجئاً. يمكنك المحاولة مجدداً أو العودة للشاشة الرئيسية.
            </p>
          </div>

          {this.state.message && (
            <p
              dir="auto"
              className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-2.5 break-words"
            >
              {this.state.message}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {this.props.onGoHome && (
              <button
                type="button"
                onClick={this.handleGoHome}
                className="min-h-[44px] px-4 py-2.5 bg-[#1677c7] hover:bg-[#125fa0] text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
              >
                <Home className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>
            )}
            <button
              type="button"
              onClick={this.props.onGoHome ? this.handleReset : () => window.location.reload()}
              className="min-h-[44px] px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <RotateCw className="w-4 h-4" />
              <span>{this.props.onGoHome ? 'إعادة المحاولة' : 'إعادة تحميل التطبيق'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
