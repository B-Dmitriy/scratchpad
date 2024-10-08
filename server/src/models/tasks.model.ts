import { database } from '../database';
import { CreateTaskBody, EditTaskBody, Task } from '../types/tasks.types';


export enum DBErrorType {
    CONSTRAINT = 'constraint',
    NOT_FOUND = 'not_found',
    INTERNAL = 'internal',
}

export class DBError {
    type: DBErrorType;
    message: string;

    constructor(type: DBErrorType, message?: string) {
        this.type = type;
        this.message = message || 'database error';
    }

    static Internal() {
        return new DBError(DBErrorType.INTERNAL);
    }

    static Constraint(message: string) {
        return new DBError(DBErrorType.CONSTRAINT, message);
    }

    static NotFound(message?: string) {
        return new DBError(DBErrorType.NOT_FOUND, message || 'not found');
    }
}

class TasksModel {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getTasks(limit: number, page: number): Promise<{ err: DBError | null, list: any }> {
        try {
            const offset = (page - 1) * limit;

            return await database.transaction(async (trx) => {
                const tasks = await trx('tasks').select('*').limit(limit).offset(offset);
                const count = await trx('tasks').count('id').first();

                const total = count?.['count(`id`)'];

                return { err: null, list: { tasks, total, limit, page } };
            });
        } catch (err) {
            console.log(err);
            return { err: DBError.Internal(), list: null };
        }
    }

    async getTaskByID(id: string): Promise<{ err: DBError | null, task: Task | null }> {
        try {
            const task: Task | undefined = await database('tasks').select<Task>('*').where({ id }).first();

            if (!task) return { err: DBError.NotFound(`task with id ${id} not found`), task: null };

            return { err: null, task };
        } catch {
            return { err: DBError.Internal(), task: null };
        }
    }

    async insertTask(data: CreateTaskBody): Promise<{ err: DBError | null, taskID: number | null }> {
        try {
            const idsArray = await database('tasks').insert({ ...data }).returning('id');

            if (idsArray.length < 1) throw DBError.Internal();

            return { err: null, taskID: idsArray[0] };
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('tasks.title') && err.message.match(/unique/ig)) {
                    return { err: DBError.Constraint('task name must be unique'), taskID: null };
                }
                if (err.message.includes('title_length')) {
                    return { err: DBError.Constraint('task name length must be bigger than 2'), taskID: null };
                }
                if (err.message.includes('description_length')) {
                    return { err: DBError.Constraint('description name length must be less than 1024'), taskID: null };
                }
            }
            return { err: DBError.Internal(), taskID: null };
        }
    }

    async updateTask(id: string, data: EditTaskBody): Promise<DBError | null> {
        try {
            const resCount = await database('tasks').update({ ...data, updated_at: database.fn.now() }).where({ id });

            if (resCount < 1) return DBError.NotFound(`task with id ${id} not found`);

            return null;
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('tasks.title') && err.message.match(/unique/ig)) {
                    return DBError.Constraint('task name must be unique');
                }
                if (err.message.includes('title_length')) {
                    return DBError.Constraint('task name length must be bigger than 2');
                }
                if (err.message.includes('description_length')) {
                    return DBError.Constraint('description name length must be less than 1024');
                }
            }
            return DBError.Internal();
        }
    }

    async deleteTask(id: string): Promise<DBError | null> {
        try {
            const deletedID = await database('tasks').where({ id }).del();

            if (!deletedID) return DBError.NotFound(`task with id ${id} not found`);

            return null;
        } catch {
            return DBError.Internal();
        }
    }
}

export const tasksModel = new TasksModel;