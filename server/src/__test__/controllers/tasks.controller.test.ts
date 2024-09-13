import request from "supertest";
import { app } from '../..';

afterAll(() => {
    // Нужно закрывать knex (knex.destroy())
    // Пока --forceExit
    // app.close()    
});

describe('tasks controller POST /tasks', () => {
    it('should be created new task and deleted they', (done) => {
        request(app)
            .post('/tasks')
            .send({ title: 'Task test 1', description: 'Test description' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body).toHaveProperty('id');

                const creaetedTasksID = res.body.id;

                request(app)
                    .delete(`/tasks/${creaetedTasksID}`)
                    .expect(204)
                    .end(done);

                return done();
            });
    });


    it('should be bad request (title)', (done) => {
        request(app)
            .post('/tasks')
            .send({ title: '', description: '' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.errors).toHaveLength(2);
                expect(res.body.errors[0].msg).toBe('title is required');
                expect(res.body.errors[1].msg).toBe('length must be longer than 2 and shorter than 250');

                return done();
            });
    });
});

describe('tasks controller POST /tasks:list', () => {
    it('should be validation wrong (page string)', (done) => {
        request(app)
            .post('/tasks:list')
            .send({ page: 'wrong', limit: 20 })
            .expect(400)
            .expect((res) => {
                res.body.message = 'validation error';
                res.body.errors.length = 1;
            })
            .end(done);
    });

    it('should be validation wrong (page negative)', (done) => {
        request(app)
            .post('/tasks:list')
            .send({ page: -1, limit: 20 })
            .expect(400)
            .expect((res) => {
                res.body.message = 'validation error';
                res.body.errors.length = 1;
            })
            .end(done);
    });
});

describe('tasks controller DELETE /tasks', () => {
    it('should be bad request (id param)', (done) => {
        request(app)
            .delete('/tasks/wrong')
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.errors).toHaveLength(1);
                expect(res.body.errors[0].msg).toBe('id is required and must be a positive integer');

                return done();
            });
    });

    it('should be not found', (done) => {
        request(app)
            .delete('/tasks/99')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.body.message).toBe('task with id 99 not found');

                return done();
            });
    });
});