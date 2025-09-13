import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary Caught Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-red-400 mb-4">❌ Page Error</h1>
              <p className="text-xl text-gray-300 mb-6">
                Something went wrong loading this page.
              </p>
            </div>
            
            <div className="bg-red-900 border border-red-600 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-lg font-semibold text-red-300 mb-3">Error Details:</h2>
              <pre className="text-sm text-red-100 overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-red-300 hover:text-red-100">
                    Stack Trace (click to expand)
                  </summary>
                  <pre className="mt-2 text-xs text-red-200 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Reload Page
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;