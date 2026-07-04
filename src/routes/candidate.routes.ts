import { Router } from "express";
import { createCandidate } from "../controllers/candidate.controller";

const router = Router();

router.post("/", createCandidate);

export default router;
