import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Identifier for debugging — also used as a React key to force remount on `resetKey` change. */
  resetKey?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof console !== "undefined") {
      console.error("[Mestizo Umami] caught render error", error, info);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div className="min-h-screen grid place-items-center px-6 bg-bone text-ink">
          <div className="max-w-sm w-full card-surface px-5 py-6 text-center">
            <div className="eyebrow mb-2">Something burned in the kitchen</div>
            <p className="text-sm text-ink-soft leading-relaxed">
              The page hit an error. Your saved data is safe.
            </p>
            <p className="text-[11px] text-ink-muted mt-3 font-mono break-words">
              {this.state.error.message}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button type="button" onClick={this.reset} className="btn btn-ghost">
                Try again
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = "/"; }}
                className="btn btn-primary"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
