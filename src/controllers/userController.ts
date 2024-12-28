import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../prisma";

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(200).json({ message: "All users list:", allUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
      },
    });
    res.status(201).json({ message: "User created", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (user === null) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "Get user:", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    console.log(result);
    if (result === null) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(204).send(`User with ID ${id} successfully deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};
