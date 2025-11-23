import { Request, Response } from 'express';
import taskService from '../services/taskService';

class TaskController {
  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const task = await taskService.createTask({
        title: title.trim(),
        description: description?.trim() || undefined,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getRecentTasks(5);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async completeTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = parseInt(req.params.id, 10);

      if (isNaN(taskId)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }

      const task = await taskService.getTaskById(taskId);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      await taskService.markTaskAsCompleted(taskId);
      res.status(200).json({ message: 'Task marked as completed' });
    } catch (error) {
      console.error('Error completing task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new TaskController();

