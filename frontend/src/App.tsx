import { useState, type FormEvent } from "react";
import { Menu } from "lucide-react";
import Gastos from "./components/ui/Gastos";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function App() {
  const [menuAberto, setMenuAberto] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState<"dashboard" | "gastos">(
    "dashboard",
  );

  const [dialogAberto, setDialogAberto] = useState(false);
  const [salario, setSalario] = useState("");
  const [horasTrabalhadas, setHorasTrabalhadas] = useState("");

  const [mesSelecionado, setMesSelecionado] = useState("2026-11");

  const totalGastos = 1850;

  const salarioNumerico = Number(salario);
  const horasNumericas = Number(horasTrabalhadas);

  const valorHora =
    salarioNumerico > 0 && horasNumericas > 0
      ? salarioNumerico / horasNumericas
      : 0;

  const horasNecessarias = valorHora > 0 ? totalGastos / valorHora : 0;

  const totalMinutos = Math.round(horasNecessarias * 60);
  const horasInteiras = Math.floor(totalMinutos / 60);
  const minutosRestantes = totalMinutos % 60;

  const saldoRestante = salarioNumerico > 0 ? salarioNumerico - totalGastos : 0;

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const salvarRenda = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (salarioNumerico <= 0 || horasNumericas <= 0) {
      return;
    }

    setDialogAberto(false);
  };

  const nomeMes = new Date(`${mesSelecionado}-02T12:00:00`).toLocaleDateString(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`shrink-0 overflow-hidden border-r transition-all duration-300 ${
          menuAberto ? "w-60" : "w-0 border-r-0"
        }`}
      >
        <div className="w-60 px-5 pt-20">
          <h2 className="mb-8 text-xl font-semibold">TimeCost</h2>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setPaginaAtual("dashboard")}
              className={`cursor-pointer rounded-md px-3 py-2 text-left text-sm ${
                paginaAtual === "dashboard"
                  ? "bg-secondary font-semibold"
                  : "hover:bg-secondary"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setPaginaAtual("gastos")}
              className={`cursor-pointer rounded-md px-3 py-2 text-left text-sm ${
                paginaAtual === "gastos"
                  ? "bg-secondary font-semibold"
                  : "hover:bg-secondary"
              }`}
            >
              Gastos
            </button>
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-8 pb-10 pt-20">
        {paginaAtual === "dashboard" ? (
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acompanhe seus gastos e sua renda.
                </p>
              </div>

              <select
                value={mesSelecionado}
                onChange={(event) => setMesSelecionado(event.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="2026-11">Novembro 2026</option>
                <option value="2026-10">Outubro 2026</option>
                <option value="2026-09">Setembro 2026</option>
                <option value="2026-08">Agosto 2026</option>
                <option value="2026-07">Julho 2026</option>
                <option value="2026-06">Junho 2026</option>
              </select>
            </div>

            <Card>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h2 className="font-semibold">Minha renda</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {salarioNumerico > 0 && horasNumericas > 0
                      ? `${formatarMoeda(salarioNumerico)} por mês · ${horasNumericas} horas mensais`
                      : "Configure seu salário e suas horas trabalhadas."}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setDialogAberto(true)}
                >
                  {salarioNumerico > 0
                    ? "Editar informações"
                    : "Configurar renda"}
                </Button>
              </CardContent>
            </Card>

            <div>
              <h2 className="mb-4 text-lg font-semibold">
                Resumo de {nomeMes}
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Horas para pagar os gastos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold tracking-tight">
                      {valorHora > 0
                        ? `${horasInteiras}h ${String(minutosRestantes).padStart(2, "0")}min`
                        : "—"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tempo de trabalho necessário
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total de gastos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold tracking-tight">
                      {formatarMoeda(totalGastos)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Despesas do mês selecionado
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Saldo restante
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold tracking-tight">
                      {salarioNumerico > 0 ? formatarMoeda(saldoRestante) : "—"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Salário menos os gastos
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <Gastos
            mesSelecionado={mesSelecionado}
            onChangeMes={setMesSelecionado}
          />
        )}
      </main>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-4"
        style={{ cursor: "pointer" }}
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir ou fechar menu"
      >
        <Menu />
      </Button>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar minha renda</DialogTitle>
            <DialogDescription>
              Informe seu salário mensal e quantas horas trabalha por mês. Essas
              informações serão usadas nos cálculos do Dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={salvarRenda} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="salario" className="text-sm font-medium">
                Salário mensal (R$)
              </label>
              <Input
                id="salario"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ex.: 3000"
                value={salario}
                onChange={(event) => setSalario(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="horasTrabalhadas" className="text-sm font-medium">
                Horas trabalhadas por mês
              </label>
              <Input
                id="horasTrabalhadas"
                type="number"
                min="1"
                step="1"
                placeholder="Ex.: 220"
                value={horasTrabalhadas}
                onChange={(event) => setHorasTrabalhadas(event.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="cursor-pointer">
                Salvar informações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;