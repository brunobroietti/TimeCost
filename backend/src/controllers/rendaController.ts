import { Request, Response } from "express";
import { conexao } from "../config/database";

export const buscarRenda = async (req: Request, res: Response) => {
  try {
    const [renda] = await conexao.execute("SELECT * FROM renda LIMIT 1");

    return res.status(200).json(renda);
  } catch (erro) {
    console.error("Erro ao buscar renda:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar renda",
    });
  }
};

export const salvarRenda = async (req: Request, res: Response) => {
  try {
    const { salario, horas_trabalhadas } = req.body;

    if (
      !salario ||
      !horas_trabalhadas ||
      salario <= 0 ||
      horas_trabalhadas <= 0
    ) {
      return res.status(400).json({
        mensagem: "Informe um salário e uma quantidade de horas válidos.",
      });
    }

    const [renda] = await conexao.execute("SELECT id FROM renda LIMIT 1");

    if ((renda as any[]).length > 0) {
      return res.status(409).json({
        mensagem: "Já existe uma renda cadastrada.",
      });
    }

    await conexao.execute(
      "INSERT INTO renda (salario, horas_trabalhadas) VALUES (?, ?)",
      [salario, horas_trabalhadas],
    );

    return res.status(201).json({
      mensagem: "Renda cadastrada com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao salvar renda:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao salvar renda.",
    });
  }
};

export const editarRenda = async (req: Request, res: Response) => {
  try {
    const { salario, horas_trabalhadas } = req.body;

    if (
      salario === undefined ||
      horas_trabalhadas === undefined ||
      salario <= 0 ||
      horas_trabalhadas <= 0
    ) {
      return res.status(400).json({
        mensagem: "Informe um salário e uma quantidade de horas válidos.",
      });
    }

    const [resultado] = await conexao.execute(
      `UPDATE renda
       SET salario = ?, horas_trabalhadas = ?
       WHERE id = (SELECT id FROM (SELECT id FROM renda LIMIT 1) AS primeira_renda)`,
      [salario, horas_trabalhadas],
    );

    if ((resultado as any).affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Renda não encontrada.",
      });
    }

    return res.status(200).json({
      mensagem: "Renda atualizada com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao editar renda:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao editar renda.",
    });
  }
};