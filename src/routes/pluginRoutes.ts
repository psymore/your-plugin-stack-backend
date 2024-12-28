import express from "express";
import {
  addPlugins,
  deletePlugin,
  getAllPlugins,
  getPlugin,
  updatePlugin,
} from "../controllers/pluginController";

const router = express.Router();

/**
 * @swagger
 * /plugins:
 *   get:
 *     description: Get all plugins
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", getAllPlugins);

/**
 * @swagger
 * /plugins/{id}:
 *   get:
 *     description: Get a plugin by ID
 *     parameters:
 *       - name: id
 *         description: Plugin ID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/:id", getPlugin);

/**
 * @swagger
 * /plugins:
 *   post:
 *     description: Add a new plugin
 *     parameters:
 *       - name: plugin_name
 *         description: Name of the plugin
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/addPlugins", addPlugins);

/**
 * @swagger
 * /plugins/{id}:
 *   put:
 *     description: Update a plugin by ID
 *     parameters:
 *       - name: id
 *         description: Plugin ID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: plugin_name
 *         description: Name of the plugin
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put("/:id", updatePlugin);

/**
 * @swagger
 * /plugins/{id}:
 *   delete:
 *     description: Delete a plugin by ID
 *     parameters:
 *       - name: id
 *         description: Plugin ID
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 */
router.delete("/:id", deletePlugin);

export default router;
