import {
  useState,
  type FormEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  despesas: Despesa[];
  setDespesas: Dispatch<SetStateAction<Despesa[]>>;
};

function Gastos({
  mesSelecionado,
  onChangeMes,
  despesas,
  setDespesas,
}: GastosProps) {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [despesaEditando, setDespesaEditando] = useState<number | null>(null);

  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");

  const despesasDoMes = despesas.filter(
    (despesa) => despesa.data.slice(0, 7) === mesSelecionado,
  );

  const totalGastos = despesasDoMes.reduce(
    (total, despesa) => total + despesa.valor,
    0,
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

  const salvarGasto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (despesaEditando !== null) {
        const resposta = await fetch(
          `http://localhost:3000/despesas/${despesaEditando}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome,
              valor: Number(valor),
              data,
            }),
          },
        );

        if (!resposta.ok) {
          throw new Error("Erro ao editar despesa.");
        }

        const despesaAtualizada = {
          id: despesaEditando,
          nome,
          valor: Number(valor),
          data,
        };

        setDespesas(
          despesas.map((despesa) =>
            despesa.id === despesaEditando ? despesaAtualizada : despesa,
          ),
        );
      } else {
        const resposta = await fetch("http://localhost:3000/despesas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            valor: Number(valor),
            data,
          }),
        });

        if (!resposta.ok) {
          throw new Error("Erro ao cadastrar despesa.");
        }

        const resultado = await resposta.json();

        const novaDespesa = {
          id: resultado.id,
          nome,
          valor: Number(valor),
          data,
        };

        setDespesas([...despesas, novaDespesa]);
      }

      setDialogAberto(false);
    } catch (erro) {
      console.error("Erro ao salvar despesa:", erro);
    }
  };

  const excluirGasto = async (id: number) => {
    try {
      const resposta = await fetch(`http://localhost:3000/despesas/${id}`, {
        method: "DELETE",
      });

      if (!resposta.ok) {
        throw new Error("Erro ao excluir despesa.");
      }

      setDespesas(despesas.filter((despesa) => despesa.id !== id));
    } catch (erro) {
      console.error("Erro ao excluir despesa:", erro);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <Button className="cursor-pointer" onClick={abrirNovoGasto}>
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
                <TableHead className="w-24 text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {despesasDoMes.length > 0 ? (
                despesasDoMes.map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell className="pl-6 font-medium">
                      {despesa.nome}
                    </TableCell>

                    <TableCell>{formatarData(despesa.data)}</TableCell>

                    <TableCell>{formatarMoeda(despesa.valor)}</TableCell>

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
          <p className="text-sm text-muted-foreground">Total de gastos</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatarMoeda(totalGastos)}
          </p>
        </div>
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {despesaEditando !== null ? "Editar gasto" : "Adicionar gasto"}
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
                placeholder="Ex: Netflix"
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
                placeholder="Ex: 39,90"
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
