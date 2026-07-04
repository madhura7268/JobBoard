import { Request, Response } from "express";
import prisma from "../config/db";

// POST /api/applications
export const applyForJob = async (req: Request, res: Response) => {
  const { candidateName, candidateEmail, jobId } = req.body;

  if (!candidateName || !candidateEmail || !jobId) {
    res.status(400).json({ error: "Candidate name, email, and job ID are required." });
    return;
  }

  // Find or create candidate
  let candidate = await prisma.candidate.findUnique({
    where: { email: candidateEmail },
  });

  if (!candidate) {
    candidate = await prisma.candidate.create({
      data: { name: candidateName, email: candidateEmail },
    });
  }

  // Check if job exists
  const job = await prisma.job.findUnique({ where: { id: Number(jobId) } });
  if (!job) {
    res.status(404).json({ error: "Job not found." });
    return;
  }

  // Prevent duplicate applications
  const existing = await prisma.application.findUnique({
    where: {
      candidateId_jobId: {
        candidateId: candidate.id,
        jobId: Number(jobId),
      },
    },
  });

  if (existing) {
    res.status(409).json({ error: "You have already applied for this job." });
    return;
  }

  const application = await prisma.application.create({
    data: {
      candidateId: candidate.id,
      jobId: Number(jobId),
    },
    include: {
      job: { include: { employer: true } },
    },
  });

  res.status(201).json(application);
};

// GET /api/applications?email=...
export const getApplicationsByEmail = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email query parameter is required." });
    return;
  }

  const candidate = await prisma.candidate.findUnique({
    where: { email },
  });

  if (!candidate) {
    res.status(404).json({ error: "No candidate found with this email." });
    return;
  }

  const applications = await prisma.application.findMany({
    where: { candidateId: candidate.id },
    include: {
      job: { include: { employer: true } },
    },
    orderBy: { id: "desc" },
  });

  res.status(200).json(applications);
};
