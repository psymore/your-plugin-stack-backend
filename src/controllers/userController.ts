import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../prisma";
import { IUserInput } from "../models/user-model";

// Utility function to check if the error is an instance of Error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(200).json({ message: "All users list:", allUsers });
  } catch (error) {
    if (isError(error)) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password }: IUserInput = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created", result });
  } catch (error) {
    if (isError(error)) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ message: "Get user:", user });
  } catch (error) {
    if (isError(error)) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const result = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    if (!result) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(204).send(`User with ID ${id} successfully deleted`);
  } catch (error) {
    if (isError(error)) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};
