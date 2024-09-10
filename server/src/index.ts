import express from 'express'
import { router } from './routes'
import bodyParser from 'body-parser'
import { errorsMiddleware } from './middlewares/errorMiddleware'

const app = express()
const port = 3000

app.use(bodyParser.json())

app.use('/', router)

app.use(errorsMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})