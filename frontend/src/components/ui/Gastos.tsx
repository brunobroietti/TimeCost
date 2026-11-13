
import { useState, type FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Despesa = {
  id: number;
  nome: string;
  valor: number;
  data: string;
};

type GastosProps = {
  mesSelecionado: string;
  onChangeMes: (mes: string) => void;
};

function Gastos({ mesSelecionado, onChangeMes }: GastosProps) {
  const [despesas, setDespesas] = useState<Despesa[]>([
    { id: 1, nome: "Netflix", valor: 39.90, data: "2026-11-05" },
    { id: 2, nome: "Spotify", valor: 21.90, data: "2026-11-08" },
    { id: 3, nome: "Amazon Prime", valor: 19.90, data: "2026-11-10" },
    { id: 4, nome: "Conta de luz", valor: 180, data: "2026-11-12" },
    { id: 5, nome: "Internet", valor: 120, data: "2026-11-15" },
    { id: 6, nome: "Outros gastos", valor: 1468.40, data: "2026-11-18" },
  ]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [despesaEditando, setDespesaEditando] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");

  const despesasDoMes = despesas.filter(
    (despesa) => despesa.data.slice(0, 7) === mesSelecionado
  );

  const totalGastos = despesasDoMes.reduce(
    (total, despesa) => total + despesa.valor,
    0
  );

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (data: string) => {
    return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR");
  };

  const abrirNovoGasto = () => {
    setDespesaEditando(null);
    setNome("");
    setValor("");

    const hoje = new Date();
    const dataHoje = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, "0"),
      String(hoje.getDate()).padStart(2, "0"),
    ].join("-");

    setData(dataHoje);
    setDialogAberto(true);
  };

  const editarGasto = (despesa: Despesa) => {
    setDespesaEditando(despesa.id);
    setNome(despesa.nome);
    setValor(String(despesa.valor));
    setData(despesa.data);
    setDialogAberto(true);
  };

  const salvarGasto = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const novaDespesa = {
      id: despesaEditando ?? Date.now(),
      nome,
      valor: Number(valor),
      data,
    };

    if (despesaEditando !== null) {
      setDespesas(
        despesas.map((despesa) =>
          despesa.id === despesaEditando ? novaDespesa : despesa
        )
      );
    } else {
      setDespesas([...despesas, novaDespesa]);
    }

    setDialogAberto(false);
  };

  const excluirGasto = (id: number) => {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta despesa?"
    );

    if (confirmar) {
      setDespesas(despesas.filter((despesa) => despesa.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <Button
          className="cursor-pointer"
          onClick={abrirNovoGasto}
        >
          Adicionar gasto
        </Button>

        <select
          value={mesSelecionado}
          onChange={(event) => onChangeMes(event.target.value)}
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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Despesa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="w-24 text-right pr-6">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {despesasDoMes.length > 0 ? (
                despesasDoMes.map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell className="pl-6 font-medium">
                      {despesa.nome}
                    </TableCell>

                    <TableCell>
                      {formatarData(despesa.data)}
                    </TableCell>

                    <TableCell>
                      {formatarMoeda(despesa.valor)}
                    </TableCell>

                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => editarGasto(despesa)}
                          aria-label="Editar despesa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => excluirGasto(despesa.id)}
                          aria-label="Excluir despesa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum gasto encontrado neste mês.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <div className="w-64 border-t pt-4 text-right">
          <p className="text-sm text-muted-foreground">
            Total de gastos
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {formatarMoeda(totalGastos)}
          </p>
        </div>
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {despesaEditando !== null
                ? "Editar gasto"
                : "Adicionar gasto"}
            </DialogTitle>

            <DialogDescription>
              Preencha as informações da despesa.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={salvarGasto} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium">
                Nome da despesa
              </label>
              <Input
                id="nome"
                placeholder="Ex.: Netflix"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="valor" className="text-sm font-medium">
                Valor (R$)
              </label>
              <Input
                id="valor"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ex.: 39,90"
                value={valor}
                onChange={(event) => setValor(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="data" className="text-sm font-medium">
                Data
              </label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(event) => setData(event.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="cursor-pointer">
                Salvar gasto
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Gastos;
