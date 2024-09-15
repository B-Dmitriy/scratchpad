import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema
        .createTable('users', (table) => {
            table.increments('id');

            table.string('login', 255).notNullable().unique()
                .checkLength('>', 2, 'login_length_min')
                .checkLength('<', 255, 'login_length_max');
            table.string('password', 255).notNullable()
                .checkLength('>', 4, 'password_length_min')
                .checkLength('<', 255, 'password_length_max');
            table.string('email', 255).notNullable().unique()
                .checkLength('<', 255, 'email_length_max');
            table.boolean('confirmed').defaultTo(false);
            table.string('user_link', 255).unique().notNullable();

            const now = knex.fn.now();
            table.datetime('created_at').notNullable().defaultTo(now);
            table.datetime('updated_at').notNullable().defaultTo(now);
        })
        .createTable('tokens', (table) => {
            table.integer('user_id').notNullable();
            table.foreign('user_id').references('users').inTable('users').onDelete('CASCADE');
        })
        .createTable('roles', (table) => {
            table.increments('id');
            table.string('name', 64).notNullable();
        })
        .createTable('tasks', (table) => {
            table.increments('id');
            table.integer('user_id').notNullable();
            table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

            table.string('title', 255).notNullable().unique()
                .checkLength('>', 2, 'title_length');
            table.string('description', 1024)
                .checkLength('<', 1024, 'description_length');
            table.string('status').checkIn(['todo', 'in_progress', 'done']).notNullable().defaultTo('todo');

            const now = knex.fn.now();
            table.datetime('created_at').notNullable().defaultTo(now);
            table.datetime('updated_at').notNullable().defaultTo(now);
        });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema
        .dropTableIfExists('tasks')
        .dropTableIfExists('roles')
        .dropTableIfExists('tokens')
        .dropTableIfExists('users');
}

