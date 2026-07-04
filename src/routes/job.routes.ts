import { Router } from "express";
import { createJob, getAllJobs } from "../controllers/job.controller";

const router = Router();

router.post("/", createJob);
router.get("/", getAllJobs);

export default router;
