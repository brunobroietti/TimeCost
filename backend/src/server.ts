
import express from "express";
import cors from "cors";
import { conexao } from "./config/database";

const app = express();

app.use(cors());
app.use(express.json());
conexao.getConnection()
  .then((connection) => {
    console.log("Conexão com MySQL estabelecida!");

    connection.release();
  })
  .catch((erro) => {
    console.error("Erro ao conectar com MySQL:", erro);
  });

app.get("/", (req, res) => {
  res.send("Backend do TimeCost funcionando!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
