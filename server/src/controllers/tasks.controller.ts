import { tasksModel } from '../models/tasks.model'
import { CreateTaskBody } from '../types/tasks.types'

import type { Request, Response, NextFunction } from 'express'

class TasksController {
    async getTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const tasks = await tasksModel.getTasks()

            res.json(tasks)
        } catch (err) {
            next(err)
        }
    }

    async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateTaskBody = req.body

            const tasks = await tasksModel.insertTask(body)

            res.json(tasks)
        } catch (err) {
            next(err)
        }
    }

    async getTaksByID(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id || '';

            const task = await tasksModel.getTaskByID(id);

            res.json(task)
        } catch (err) {
            next(err)
        }

    }
}

const tasksController = new TasksController()

export { tasksController }