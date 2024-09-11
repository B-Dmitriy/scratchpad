import express from 'express'
import * as routes from './routes'
import bodyParser from 'body-parser'
import { errorsMiddleware } from './middlewares/errorMiddleware'

const app = express()
const port = 3000

app.use(bodyParser.json())

app.use('/', routes.tasksRouter)

app.use(errorsMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

export { app }