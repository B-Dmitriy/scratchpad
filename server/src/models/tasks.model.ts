import { knex as knexBuilder } from 'knex'
import { CreateTaskBody } from '../types/tasks.types'

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
            .insert({ title: data.title, description: data.description })
            .catch((e) => { throw Error(e) });
    }
}

const tasksModel = new TasksModel

export { tasksModel }