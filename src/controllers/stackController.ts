import { Request, Response } from "express";
import { prisma } from "../prisma";
import { IStack } from "../models/stack-model";

export const createStack = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stackInfo }: { stackInfo: IStack } = req.body;

  if (!stackInfo || !stackInfo.userId || !stackInfo.name || !stackInfo.type) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const userId = req.headers["user-id"] as string;

  if (!userId) {
    res.status(400).json({ error: "Missing user ID in headers" });
    return;
  }

  try {
    const stack = await prisma.stack.create({
      data: {
        name: stackInfo.name,
        type: stackInfo.type,
        user: {
          connect: {
            id: parseInt(userId, 10),
          },
        },
      },
    });
    res.status(201).json({ message: "Stack created", stack });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};
