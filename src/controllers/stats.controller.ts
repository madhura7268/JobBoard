import { Request, Response } from "express";
import prisma from "../config/db";

// GET /api/stats
export const getStats = async (req: Request, res: Response) => {
  const totalJobs = await prisma.job.count();
  const totalEmployers = await prisma.employer.count();
  const totalApplications = await prisma.application.count();

  res.status(200).json({ totalJobs, totalEmployers, totalApplications });
};
