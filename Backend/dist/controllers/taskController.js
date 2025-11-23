"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskService_1 = __importDefault(require("../services/taskService"));
class TaskController {
    async createTask(req, res) {
        try {
            const { title, description } = req.body;
            if (!title || typeof title !== 'string' || title.trim().length === 0) {
                res.status(400).json({ error: 'Title is required' });
                return;
            }
            const task = await taskService_1.default.createTask({
                title: title.trim(),
                description: description?.trim() || undefined,
            });
            res.status(201).json(task);
        }
        catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getTasks(req, res) {
        try {
            const tasks = await taskService_1.default.getRecentTasks(5);
            res.status(200).json(tasks);
        }
        catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async completeTask(req, res) {
        try {
            const taskId = parseInt(req.params.id, 10);
            if (isNaN(taskId)) {
                res.status(400).json({ error: 'Invalid task ID' });
                return;
            }
            const task = await taskService_1.default.getTaskById(taskId);
            if (!task) {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            await taskService_1.default.markTaskAsCompleted(taskId);
            res.status(200).json({ message: 'Task marked as completed' });
        }
        catch (error) {
            console.error('Error completing task:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.default = new TaskController();
//# sourceMappingURL=taskController.js.map