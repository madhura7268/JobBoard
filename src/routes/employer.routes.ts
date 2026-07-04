import { Router } from "express";
import { createEmployer } from "../controllers/employer.controller";

const router = Router();

router.post("/", createEmployer);

export default router;
