import express from 'express'
import morgan from 'morgan'
import { json as jsonParser } from 'body-parser'
import { TodoActions } from '@app/core/todo'

import { LowDbBindings } from 'lib/todo/bindings/lowdb'
import { todoRoute } from 'routes/todos'

const app = express()

app.use(jsonParser())
app.use(morgan('dev'))

const actions = new TodoActions(new LowDbBindings())

app.use('/todo', todoRoute(actions))

const port = 5000
app.listen(port, () => console.log('listening on port', port))
