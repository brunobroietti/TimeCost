
import { Request, Response } from "express";
import { conexao } from "../config/database";

export const buscarRenda = async (req: Request, res: Response) => {
  try {
    const mes = req.query.mes;

    if (
      typeof mes !== "string" ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)
    ) {
      return res.status(400).json({
        mensagem: "Informe um mês válido.",
      });
    }

    const [rendaAtual] = await conexao.execute(
      "SELECT * FROM renda WHERE mes_referencia = ?",
      [mes],
    );

    if ((rendaAtual as any[]).length > 0) {
      return res.status(200).json(rendaAtual);
    }

    const [rendaAnterior] = await conexao.execute(
      `SELECT salario, horas_trabalhadas
       FROM renda
       WHERE mes_referencia < ?
       ORDER BY mes_referencia DESC
       LIMIT 1`,
      [mes],
    );

    if ((rendaAnterior as any[]).length === 0) {
      return res.status(200).json([]);
    }

    const dados = (rendaAnterior as any[])[0];

    await conexao.execute(
      `INSERT INTO renda (salario, horas_trabalhadas, mes_referencia)
       VALUES (?, ?, ?)`,
      [dados.salario, dados.horas_trabalhadas, mes],
    );

    const [novaRenda] = await conexao.execute(
      "SELECT * FROM renda WHERE mes_referencia = ?",
      [mes],
    );

    return res.status(200).json(novaRenda);
  } catch (erro) {
    console.error("Erro ao buscar renda:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao buscar renda.",
    });
  }
};

export const salvarRenda = async (req: Request, res: Response) => {
  try {
    const { salario, horas_trabalhadas, mes_referencia } = req.body;

    if (
      !Number.isFinite(Number(salario)) ||
      Number(salario) <= 0 ||
      !Number.isInteger(Number(horas_trabalhadas)) ||
      Number(horas_trabalhadas) <= 0 ||
      typeof mes_referencia !== "string" ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes_referencia)
    ) {
      return res.status(400).json({
        mensagem: "Informe valores válidos para a renda e o mês.",
      });
    }

    const [rendaExistente] = await conexao.execute(
      "SELECT id FROM renda WHERE mes_referencia = ?",
      [mes_referencia],
    );

    if ((rendaExistente as any[]).length > 0) {
      return res.status(409).json({
        mensagem: "Já existe uma renda cadastrada para esse mês.",
      });
    }

    await conexao.execute(
      `INSERT INTO renda (salario, horas_trabalhadas, mes_referencia)
       VALUES (?, ?, ?)`,
      [salario, horas_trabalhadas, mes_referencia],
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
    const { salario, horas_trabalhadas, mes_referencia } = req.body;

    if (
      !Number.isFinite(Number(salario)) ||
      Number(salario) <= 0 ||
      !Number.isInteger(Number(horas_trabalhadas)) ||
      Number(horas_trabalhadas) <= 0 ||
      typeof mes_referencia !== "string" ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(mes_referencia)
    ) {
      return res.status(400).json({
        mensagem: "Informe valores válidos para a renda e o mês.",
      });
    }

    const [rendaExistente] = await conexao.execute(
      "SELECT id FROM renda WHERE mes_referencia = ?",
      [mes_referencia],
    );

    if ((rendaExistente as any[]).length === 0) {
      return res.status(404).json({
        mensagem: "Renda não encontrada para esse mês.",
      });
    }

    await conexao.execute(
      `UPDATE renda
       SET salario = ?, horas_trabalhadas = ?
       WHERE mes_referencia = ?`,
      [salario, horas_trabalhadas, mes_referencia],
    );

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
