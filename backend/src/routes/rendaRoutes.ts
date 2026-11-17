import { Router } from "express";
import { buscarRenda, salvarRenda, editarRenda } from "../controllers/rendaController";

const router = Router();

router.get("/", buscarRenda);
router.post("/", salvarRenda);
router.put("/", editarRenda);

export default router;