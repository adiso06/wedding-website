import { Component, ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1 className="error-headline">BREAKING: Technical Difficulties</h1>
            <h2 className="error-subheadline">
              Our servers encountered an unexpected issue
            </h2>
            <div className="error-details">
              <p>
                <strong>EDITOR'S NOTE:</strong> We apologize for the interruption. 
                Our technical team (a single developer) is investigating this issue.
              </p>
              {this.state.error && (
                <details className="error-stack">
                  <summary>Technical Details (for developers)</summary>
                  <pre>{this.state.error.message}</pre>
                </details>
              )}
            </div>
            <button onClick={this.handleReset} className="error-button">
              Refresh Page
            </button>
            <p className="error-footer">
              If this problem persists, please contact the editorial board via the RSVP form.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



