import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema
        .createTable('tasks', (table) => {
            table.increments('id');
            table.string('title', 255).notNullable().unique().checkLength('>', 2, 'title_length');
            table.string('description', 1024).checkLength('<', 1024, 'description_length');
            table.string('status').checkIn(['todo', 'in_progress', 'done']).notNullable().defaultTo('todo');

            const now = knex.fn.now();
            table.datetime('created_at').notNullable().defaultTo(now);
            table.datetime('updated_at').notNullable().defaultTo(now);
        });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('tasks');
}

