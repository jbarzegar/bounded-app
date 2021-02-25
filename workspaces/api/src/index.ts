import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { TodoActions } from '@app/core/todo'

import { LowDbBindings } from 'lib/todo/bindings/lowdb'
import { todoRoute } from 'routes/todos'

const app = express()

app.use(morgan('dev'))

const binding = new LowDbBindings()
const actions = new TodoActions(binding)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/api/todo', todoRoute(actions))


const port = 5000
app.listen(port, () => console.log('listening on port', port))
