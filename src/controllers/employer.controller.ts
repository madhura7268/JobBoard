import { Request, Response } from "express";
import prisma from "../config/db";

// POST /api/employers
export const createEmployer = async (req: Request, res: Response) => {
  const { companyName, email } = req.body;

  if (!companyName || !email) {
    res.status(400).json({ error: "Company name and email are required." });
    return;
  }

  const existing = await prisma.employer.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "An employer with this email already exists." });
    return;
  }

  const employer = await prisma.employer.create({
    data: { companyName, email },
  });

  res.status(201).json(employer);
};
