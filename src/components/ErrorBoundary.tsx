import React from 'react';

interface Props {
  children: React.ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Top-level error boundary. Prevents a single component throw from
 * blanking the entire app. Ships a readable fallback with a Reload
 * button and clear messaging.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        role="alert"
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: '#0B1017', color: '#F8FAFC' }}
      >
        <div
          className="max-w-md w-full rounded-2xl p-6"
          style={{ background: '#151D28', border: '1px solid rgba(212, 175, 55, 0.25)' }}
        >
          <div
            className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
            style={{ background: 'rgba(212, 175, 55, 0.15)' }}
            aria-hidden
          >
            <span style={{ color: '#D4AF37', fontSize: 22 }}>!</span>
          </div>
          <h1 className="text-xl font-semibold mb-1">Something went wrong</h1>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            The app hit an unexpected error. Reload the page to try again — if it
            keeps happening, our team has been notified in the console logs.
          </p>
          <details className="mb-4 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <summary className="cursor-pointer select-none">Technical detail</summary>
            <pre className="mt-2 whitespace-pre-wrap break-words">
              {this.state.error.message}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="h-11 px-5 rounded-full font-semibold"
            style={{ background: '#D4AF37', color: '#101820' }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
