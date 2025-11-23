import { Router } from 'express';
import taskController from '../controllers/taskController';

const router = Router();

router.post('/tasks', taskController.createTask.bind(taskController));
router.get('/tasks', taskController.getTasks.bind(taskController));
router.patch('/tasks/:id/complete', taskController.completeTask.bind(taskController));

export default router;

