
import { Router } from "express";
import {
  cadastrarDespesa,
  listarDespesas,
  editarDespesa,
  excluirDespesa,
} from "../controllers/despesaController";

const router = Router();

router.post("/", cadastrarDespesa);
router.get("/", listarDespesas);
router.put("/:id", editarDespesa);
router.delete("/:id", excluirDespesa);

export default router;