import request from "supertest";
import { app } from '../..';

afterAll(() => {
    // Нужно закрывать knex (knex.destroy())
    // Пока --forceExit
    // app.close()    
})

describe('tasks controller', () => {
    it('should be validation wrong (page string)', (done) => {
        request(app)
            .post('/tasks:list')
            .send({ page: 'wrong', limit: 20 })
            .expect(400)
            .expect((res) => {
                res.body.message = 'validation error';
                res.body.errors.length = 1
            })
            .end(done)
    })

    it('should be validation wrong (page negative)', (done) => {
        request(app)
            .post('/tasks:list')
            .send({ page: -1, limit: 20 })
            .expect(400)
            .expect((res) => {
                res.body.message = 'validation error';
                res.body.errors.length = 1
            })
            .end(done)
    })
})
