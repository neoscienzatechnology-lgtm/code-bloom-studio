import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import { track } from "@/lib/analytics";

// Página de rota inexistente. Antes estava em inglês e sem marca — justamente
// quando o aluno já está perdido. #revisao-1.3
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    track("404", { path: location.pathname });
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="mb-6 inline-flex" aria-label="Ir para a página inicial do CodeTier">
          <BrandLogo className="h-12 max-w-[200px]" />
        </Link>

        <p className="text-6xl font-black text-primary/30">404</p>
        <h1 className="mt-2 text-2xl font-black text-foreground">Página não encontrada</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          O endereço que você abriu não existe ou mudou de lugar. Nada foi perdido — seu progresso
          continua salvo.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-full font-black">
            <Link to="/cursos">
              <Compass size={18} className="mr-2" aria-hidden="true" />
              Ver os cursos
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full font-bold">
            <Link to="/">
              <Home size={18} className="mr-2" aria-hidden="true" />
              Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
