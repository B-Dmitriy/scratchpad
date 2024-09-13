import { APIError } from '../utils/APIError';
import { DBError, DBErrorType, tasksModel } from '../models/tasks.model';

import type { Request, Response, NextFunction } from 'express';
import type { CreateTaskBody, EditTaskBody, GetTasksListBody } from '../types/tasks.types';

function apiErrorHanler(err: Error | DBError | null) {
    if (!err) return;

    if (err instanceof DBError) {
        switch (err.type) {
            case DBErrorType.CONSTRAINT:
                throw APIError.BadRequest(err.message);
            case DBErrorType.NOT_FOUND:
                throw APIError.NotFound(err.message);
            case DBErrorType.INTERNAL:
                throw APIError.ServerError();
            default:
                throw APIError.ServerError();
        }
    } else {
        throw APIError.ServerError();
    }
}

class TasksController {
    async getTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const body: GetTasksListBody = req.body;

            const { err, list } = await tasksModel.getTasks(body.limit, body.page);

            apiErrorHanler(err);

            res.json(list);
        } catch (err) {
            next(err);
        }
    }

    async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const body: CreateTaskBody = req.body;

            const { err, taskID } = await tasksModel.insertTask(body);

            apiErrorHanler(err);

            res.status(201).json(taskID);
        } catch (err) {
            next(err);
        }
    }

    async getTaksByID(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id || '';

            const { err, task } = await tasksModel.getTaskByID(id);

            apiErrorHanler(err);

            res.json(task);
        } catch (err) {
            next(err);
        }
    }

    async editTask(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const body: EditTaskBody = req.body;

            const err = await tasksModel.updateTask(id, body);

            apiErrorHanler(err);

            res.status(200).end();
        } catch (err) {
            next(err);
        }
    }

    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            const err = await tasksModel.deleteTask(id);

            apiErrorHanler(err);

            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

export const tasksController = new TasksController();