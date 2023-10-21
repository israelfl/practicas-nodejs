import { Router } from "express";
import * as taskController from "../controllers/task.controller";

const router = Router();

router.get("/", taskController.getTasks);
router.get("/done", taskController.getDoneTasks);
router.get("/:id", taskController.getTask);

router.post("/", taskController.addTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
