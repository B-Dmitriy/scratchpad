import { knex as knexBuilder } from 'knex'
import { CreateTaskBody, EditTaskBody } from '../types/tasks.types'

import type { Knex } from 'knex'

const knex: Knex = knexBuilder({
    client: 'sqlite3',
    connection: {
        filename: 'data.db',
    },
});

class TasksModel {
    async getTasks() {
        return await knex('tasks').select('*').limit(20)
    }

    async getTaskByID(id: string) {
        return await knex('tasks').select('*').limit(1).where({ id }).first()
    }

    async insertTask(data: CreateTaskBody) {
        return await knex('tasks')
            .insert({ ...data })
            .catch((e) => { throw Error(e) });
    }

    async updateTask(id: string, data: EditTaskBody) {
        return await knex('tasks')
            .update({ ...data, updated_at: knex.fn.now() })
            .catch((e) => { throw Error(e) });
    }

    async deleteTask(id: string) {
        return await knex('tasks')
            .where({ id }).del()
            .catch((e) => { throw Error(e) });
    }
}

const tasksModel = new TasksModel

export { tasksModel }