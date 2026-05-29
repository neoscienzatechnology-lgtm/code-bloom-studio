import { Component, type ErrorInfo, type ReactNode } from "react";

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
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <div className="text-5xl" role="img" aria-label="Capivara">🦫</div>
          <h1 className="text-xl font-black text-foreground">Algo deu errado por aqui</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            A Capy tropeçou em um bug inesperado. Tente recarregar a página — seu progresso fica salvo.
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
