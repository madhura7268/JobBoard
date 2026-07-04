import { Request, Response } from "express";
import prisma from "../config/db";

// POST /api/candidates
export const createCandidate = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required." });
    return;
  }

  const existing = await prisma.candidate.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "A candidate with this email already exists." });
    return;
  }

  const candidate = await prisma.candidate.create({
    data: { name, email },
  });

  res.status(201).json(candidate);
};
