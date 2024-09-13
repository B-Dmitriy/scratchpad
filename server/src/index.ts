import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { swagger } from './routes/swagger.routes';
import { tasksRouter } from './routes/tasks.routes';
import { errorsMiddleware } from './middlewares/error.middleware';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use('/swagger', swagger.serve, swagger.setup);

app.use('/', tasksRouter);

app.use(errorsMiddleware);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

export { app };