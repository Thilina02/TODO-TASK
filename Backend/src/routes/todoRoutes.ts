import { Router } from 'express';
import todoController from '../controllers/todoController';

const router = Router();

router.post('/todos', todoController.createTodo.bind(todoController));
router.get('/todos', todoController.getTodos.bind(todoController));
router.patch('/todos/:id/complete', todoController.completeTodo.bind(todoController));

export default router;

