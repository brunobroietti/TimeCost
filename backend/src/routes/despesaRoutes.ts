
import { Router } from "express";
import { cadastrarDespesa } from "../controllers/despesaController";

const router = Router();

router.post("/", cadastrarDespesa);

export default router;