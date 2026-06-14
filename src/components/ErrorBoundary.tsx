import { Component, type ErrorInfo, type ReactNode } from "react";
import { captureError } from "@/lib/analytics";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro inesperado na interface:", error, info);
    captureError(error, { componentStack: info.componentStack });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <svg viewBox="0 0 64 64" className="h-14 w-14 text-foreground" fill="none" role="img" aria-label="Erro">
            <path d="M31 16 C16 27 16 37 31 48" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
            <path d="M35 16 C49 27 49 37 35 48" stroke="#44D62C" strokeWidth="7" strokeLinecap="round" />
          </svg>
          <h1 className="text-xl font-black text-foreground">Algo deu errado por aqui</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            O app tropeçou em um bug inesperado. Tente recarregar a página — seu progresso fica salvo.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
