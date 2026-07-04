import { Request, Response } from "express";
import prisma from "../config/db";

// POST /api/jobs
export const createJob = async (req: Request, res: Response) => {
  const { title, description, location, salary, employerId } = req.body;

  if (!title || !description || !location || !salary || !employerId) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  const employer = await prisma.employer.findUnique({
    where: { id: Number(employerId) },
  });

  if (!employer) {
    res.status(404).json({ error: "Employer not found." });
    return;
  }

  const job = await prisma.job.create({
    data: {
      title,
      description,
      location,
      salary,
      employerId: Number(employerId),
    },
  });

  res.status(201).json(job);
};

// GET /api/jobs
export const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await prisma.job.findMany({
    include: { employer: true },
    orderBy: { id: "desc" },
  });

  res.status(200).json(jobs);
};
