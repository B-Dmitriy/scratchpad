import { Router } from 'express'
import { tasksController } from '../controllers/tasks.controller'

const router = Router()

router.post('/tasks:list', tasksController.getTasks);
router.post('/tasks', tasksController.createTask);
router.get('/tasks/:id', tasksController.getTaksByID);
router.put('/tasks/:id', tasksController.editTask);
router.delete('/tasks/:id', tasksController.deleteTask);

export { router }