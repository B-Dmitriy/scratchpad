import { Router } from 'express'
import { tasksController } from '../controllers/tasks.controller'
import { validationMiddleware } from '../middlewares/validation.middleware';
import { body, param, oneOf, check } from 'express-validator';

const tasksRouter = Router()

tasksRouter.post('/tasks:list',
    body('limit').optional().isInt({ min: 1 }).withMessage('limit must be a positive integer'),
    body('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    validationMiddleware,
    tasksController.getTasks
);

tasksRouter.post('/tasks',
    body('title').notEmpty().trim().withMessage('title is required'),
    body('title').trim().isLength({ min: 2, max: 250 }).withMessage('length must be longer than 2 and shorter than 250'),
    body('description').optional().isLength({ max: 1000 }).withMessage('max length for description 1000 chars'),
    validationMiddleware,
    tasksController.createTask);

tasksRouter.get('/tasks/:id',
    param('id').notEmpty().trim().isInt({ min: 1 }).withMessage('id is required and must be a positive integer'),
    validationMiddleware,
    tasksController.getTaksByID);

tasksRouter.put('/tasks/:id',
    param('id').notEmpty().trim().isInt({ min: 1 }).withMessage('id is required and must be a positive integer'),
    body('title').notEmpty().trim().withMessage('title is required'),
    body('title').trim().isLength({ min: 2, max: 250 }).withMessage('length must be longer than 2 and shorter than 250'),
    body('description').optional().isLength({ max: 1000 }).withMessage('max length for description 1000 chars'),
    body('status').trim().notEmpty(),
    oneOf([
        body('status').equals('todo'),
        body('status').equals('in_progress'),
        body('status').equals('done'),
    ], { message: 'status must be in: todo, in_progress, done' }),
    validationMiddleware,
    tasksController.editTask);

tasksRouter.delete('/tasks/:id',
    param('id').notEmpty().trim().isInt({ min: 1 }).withMessage('id is required and must be a positive integer'),
    tasksController.deleteTask);

export { tasksRouter }