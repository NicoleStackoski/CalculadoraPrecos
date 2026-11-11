import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: `${error.name}: ${error.message}` };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('A calculadora encontrou um erro de renderização:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-slate-900 px-6 text-center text-white">
          <div className="max-w-md">
            <h1 className="text-xl font-bold">Não foi possível atualizar a calculadora</h1>
            <p className="mt-3 text-sm text-slate-300">
              Recarregue a página para tentar novamente. Detalhes do erro:
            </p>
            {this.state.errorMessage && (
              <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-800 p-3 text-left text-xs text-rose-200">
                {this.state.errorMessage}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Recarregar página
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
