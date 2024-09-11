import express from 'express'
import * as routes from './routes'
const swaggerUi = require('swagger-ui-express');
import bodyParser from 'body-parser'
import { errorsMiddleware } from './middlewares/errorMiddleware'
const swaggerJsdoc = require('swagger-jsdoc');

const app = express()
const port = 3000

const options = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0',
        },
    },
    apis: ['./src/routes/*'],
};

const openapiSpecification = swaggerJsdoc(options);
app.use(bodyParser.json())

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/', routes.tasksRouter)

app.use(errorsMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

export { app }