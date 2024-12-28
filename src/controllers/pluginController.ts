import { Request, Response } from "express";
import pool from "../config/db";
import { prisma } from "../prisma";

// Get all plugins
export const getAllPlugins = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM plugin");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Get a plugin by ID
export const getPlugin = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM plugin WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Plugin not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Create one or more plugins
export const addPlugins = async (req: Request, res: Response) => {
  const { pluginNames } = req.body; // Expect an array of plugin names
  console.log("pluginNames", pluginNames);

  if (!Array.isArray(pluginNames) || pluginNames.length === 0) {
    res.status(400).json({ error: "Please provide an array of plugin names." });
    return;
  }

  try {
    // Use createMany to insert multiple plugins at once
    const plugins = await prisma.plugin.createMany({
      data: pluginNames.map(name => ({ pluginName: name })),
    });

    res.status(201).json({
      message: `${
        plugins.count
      } plugin(s) successfully added, which are: ${pluginNames.join(", ")}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Update a plugin by ID
export const updatePlugin = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { pluginName } = req.body;
  try {
    const result = await pool.query(
      "UPDATE plugin SET pluginName = $1 WHERE id = $2 RETURNING *",
      [pluginName, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Plugin not found" });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Delete a plugin by ID
export const deletePlugin = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const plugin = await prisma.plugin.delete({
      where: {
        id,
      },
    });

    if (plugin === null) {
      res.status(404).json({ error: "Plugin not found" });
    } else {
      res.status(204).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};
