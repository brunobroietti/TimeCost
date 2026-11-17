import { Request, Response } from "express";
import { conexao } from "../config/database";

export const cadastrarDespesa = async (req: Request, res: Response) => {
  try {
    const { nome, valor, data } = req.body;

    if (!nome || valor === undefined || !data) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos.",
      });
    }

    const sql = `
      INSERT INTO despesas (nome, valor, data)
      VALUES (?, ?, ?)
    `;

    const [resultado] = await conexao.execute(sql, [nome, valor, data]);

    return res.status(201).json({
      mensagem: "Despesa cadastrada com sucesso!",
      id: (resultado as any).insertId,
    });
  } catch (erro) {
    console.error("Erro ao cadastrar despesa:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao cadastrar despesa.",
    });
  }
};
