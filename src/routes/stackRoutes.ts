import express from "express";
import { createStack } from "../controllers/stackController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// router.get('/stacks', getAllStacks);
// router.get('/stacks/:id', getStackById);
router.post("/create-stack", authMiddleware, createStack);
// router.put('/stacks/:id', updateStack);
// router.delete('/stacks/:id', deleteStack);

export default router;
