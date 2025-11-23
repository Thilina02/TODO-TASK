import { Request, Response } from 'express';
import todoService from '../services/todoService';

class TodoController {
  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;

      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const todo = await todoService.createTodo({
        title: title.trim(),
        description: description?.trim() || undefined,
      });

      res.status(201).json(todo);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTodos(req: Request, res: Response): Promise<void> {
    try {
      const todos = await todoService.getRecentTodos(5);
      res.status(200).json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async completeTodo(req: Request, res: Response): Promise<void> {
    try {
      const todoId = parseInt(req.params.id, 10);

      if (isNaN(todoId)) {
        res.status(400).json({ error: 'Invalid todo ID' });
        return;
      }

      const todo = await todoService.getTodoById(todoId);
      if (!todo) {
        res.status(404).json({ error: 'Todo not found' });
        return;
      }

      await todoService.markTodoAsCompleted(todoId);
      res.status(200).json({ message: 'Todo marked as completed' });
    } catch (error) {
      console.error('Error completing todo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new TodoController();

