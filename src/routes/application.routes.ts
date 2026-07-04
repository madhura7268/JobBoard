import { Router } from "express";
import { applyForJob, getApplicationsByEmail } from "../controllers/application.controller";

const router = Router();

router.post("/", applyForJob);
router.get("/", getApplicationsByEmail);

export default router;
