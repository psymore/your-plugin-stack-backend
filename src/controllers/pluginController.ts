import { Request, Response } from "express";
import { prisma } from "../prisma";

// Utility function to check if the error is an instance of Error
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Get all plugins
export const getAllPlugins = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plugins = await prisma.plugin.findMany();
    res.status(200).json(plugins);
  } catch (error) {
    if (isError(error)) {
      console.error(error.message); // Safely access error message
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// Get a plugin by ID
export const getPlugin = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid plugin ID" });
    return;
  }

  try {
    const plugin = await prisma.plugin.findUnique({
      where: { id },
    });

    if (!plugin) {
      res.status(404).json({ error: "Plugin not found" });
    } else {
      res.status(200).json(plugin);
    }
  } catch (error) {
    if (isError(error)) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// Create one or more plugins
export const addPlugins = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { pluginNames }: { pluginNames: string[] } = req.body;

  if (!Array.isArray(pluginNames) || pluginNames.length === 0) {
    res.status(400).json({ error: "Please provide an array of plugin names." });
    return;
  }

  try {
    const plugins = await prisma.plugin.createMany({
      data: pluginNames.map(name => ({ pluginName: name })),
    });

    res.status(201).json({
      message: `${
        plugins.count
      } plugin(s) successfully added, which are: ${pluginNames.join(", ")}`,
    });
  } catch (error) {
    if (isError(error)) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// Update a plugin by ID
export const updatePlugin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { pluginName }: { pluginName: string } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid plugin ID" });
    return;
  }

  try {
    const updatedPlugin = await prisma.plugin.update({
      where: { id },
      data: { pluginName },
    });

    res.status(200).json(updatedPlugin);
  } catch (error) {
    if (isError(error)) {
      if (error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Plugin not found" });
      } else {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};

// Delete a plugin by ID
export const deletePlugin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid plugin ID" });
    return;
  }

  try {
    await prisma.plugin.delete({
      where: { id },
    });
    res.status(204).json();
  } catch (error) {
    if (isError(error)) {
      if (error.message.includes("Record to delete not found")) {
        res.status(404).json({ error: "Plugin not found" });
      } else {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
};
