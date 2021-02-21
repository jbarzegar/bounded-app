import express from 'express'
import { json as jsonParser } from 'body-parser'
import morgan from 'morgan'
import { LowDbBindings } from '../lib/todo/bindings/lowdb'
import { TodoActions } from '@app/core/todo'
import { useTodoRoute } from './routes/todos'

const app = express()

app.use(jsonParser())
app.use(morgan('dev'))

const actions = new TodoActions(new LowDbBindings())

app.use('/todo', useTodoRoute(actions))

const port = 5000
app.listen(port, () => console.log('listening on port', port))
