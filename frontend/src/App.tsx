import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const [menuAberto, setMenuAberto] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState<"dashboard" | "gastos">(
    "dashboard",
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`overflow-hidden border-r transition-all duration-300 ${
          menuAberto ? "w-60" : "w-0 border-r-0"
        }`}
      >
        <div className="w-60 px-5 pt-20">
          <h2 className="mb-8 text-xl font-semibold">TimeCost</h2>

          <nav className="space-y-4">
            <button
              onClick={() => setPaginaAtual("dashboard")}
              className="cursor-pointer text-sm font-medium"
            >
              Dashboard
            </button>

            <button
              onClick={() => setPaginaAtual("gastos")}
              className="cursor-pointer text-sm font-medium"
            >
              Gastos
            </button>
          </nav>
        </div>
      </aside>

      {paginaAtual === "dashboard" ? (
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      ) : (
        <h1 className="text-2xl font-semibold">Gastos</h1>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4 !cursor-ponter"
        style={{ cursor: "pointer" }}
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir ou fechar menu"
      >
        <Menu />
      </Button>
    </div>
  );
}

export default App;
