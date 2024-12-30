import { Request, Response } from "express";
import { prisma } from "../prisma";
import { IStack } from "../models/stack-model";

export const createStack = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { stackInfo }: { stackInfo: IStack } = req.body;

  try {
    const stack = await prisma.stack.create({
      data: {
        ...stackInfo, // Spread stackInfo but ensure it includes all required fields
        user: {
          connect: {
            id: stackInfo.userId, // Assuming userId is passed in the request and exists in IStack
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
