import request from "supertest";
import { app } from '../..';

afterAll(() => {
    // Нужно закрывать knex (knex.destroy())
    // Пока --forceExit
    // app.close()    
})

describe('tasks controller', () => {
    it('test', (done) => {
        request(app)
            .post('/tasks:list')
            .send({ page: 'wrong', limit: 20 })
            .expect(400)
            .expect((res) => {
                res.body.message = 'validation error';
                res.body.errors.length = 1
            })
            .send({ page: '1', limit: 20 })
            .expect(400)
            .expect((res) => {
                res.body.id = 'validation error';
                res.body.errors.length = 1
            })
            .end(done)
    })
})
