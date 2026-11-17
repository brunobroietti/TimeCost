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

export const listarDespesas = async (req: Request, res: Response) => {
  try {
    const [despesas] = await conexao.execute(
      "SELECT * FROM despesas ORDER BY data DESC",
    );

    return res.status(200).json(despesas);
  } catch (erro) {
    console.error("Erro ao listar despesas:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao listar despesas.",
    });
  }
};

export const editarDespesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, valor, data } = req.body;

    if (!nome || valor === undefined || !data) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos.",
      });
    }

    const sql = `
      UPDATE despesas
      SET nome = ?, valor = ?, data = ?
      WHERE id = ?
    `;

    const [resultado] = await conexao.execute(sql, [nome, valor, data, id]);

    if ((resultado as any).affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Despesa não encontrada.",
      });
    }

    return res.status(200).json({
      mensagem: "Despesa atualizada com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao editar despesa:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao editar despesa.",
    });
  }
};

export const excluirDespesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [resultado] = await conexao.execute(
      "DELETE FROM despesas WHERE id = ?",
      [id],
    );

    if ((resultado as any).affectedRows === 0) {
      return res.status(404).json({
        mensagem: "Despesa não encontrada.",
      });
    }

    return res.status(200).json({
      mensagem: "Despesa excluída com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir despesa:", erro);

    return res.status(500).json({
      mensagem: "Erro interno ao excluir despesa.",
    });
  }
};