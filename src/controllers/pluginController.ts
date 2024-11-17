import { Request, Response } from "express";
import pool from "../config/db";

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

// Create a new plugin
export const createPlugin = async (req: Request, res: Response) => {
  const { plugin_name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO plugin (plugin_name) VALUES ($1) RETURNING *",
      [plugin_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Update a plugin by ID
export const updatePlugin = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { plugin_name } = req.body;
  try {
    const result = await pool.query(
      "UPDATE plugin SET plugin_name = $1 WHERE id = $2 RETURNING *",
      [plugin_name, id]
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
    const result = await pool.query("DELETE FROM plugin WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Plugin not found" });
    } else {
      res.status(204).json();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};
