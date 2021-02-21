import { Router as getRoute } from 'express'
import { AddTodoPayload, EditTodoPayload, TodoActions } from '@app/core/todo'

import { DbErrors } from 'lib/todo/bindings/lowdb'
import { TodoCreateSchema, todoCreateSchema } from 'validation/todos.validation'
import { FnUseRoute } from 'types'

type IdParams = { id: string }

export const todoRoute: FnUseRoute<TodoActions> = actions => {
  const app = getRoute()

  app.get('/', (_, res) => {
    actions
      .getAll()
      .then(todos => {
        console.log(todos)
        res.status(200).send(todos)
      })
      .catch(err => res.status(400).send(err))
  })

  app.get<IdParams>('/:id', (req, res) =>
    actions
      .getOne(req.params.id)
      .then(todo => res.status(200).json(todo))
      .catch((err: Error) => {
        if (err.message.startsWith(DbErrors.notFound)) res.status(404)
        else res.status(500)

        res.json({ name: err.name, message: err.message })
      })
  )

  app.post<never, any, TodoCreateSchema>('/', async (req, res) => {
    const { body } = req

    try {
      await todoCreateSchema.validate(body)
    } catch (e) {
      console.log('validation error', e)
      res.status(400).send(e)
      return
    }

    const mapTodo: () => AddTodoPayload = () => {
      const { title, notes = [] } = body
      const partialPayload = { title, notes }

      if (body.dueDate) {
        return { type: 'timedTodo', dueDate: body.dueDate, ...partialPayload }
      }

      return { type: 'genericTodo', ...partialPayload }
    }

    actions
      .createOne(mapTodo())
      .then(todo => res.status(201).json(todo).send())
      .catch(err => res.status(500).json(err).send())
  })

  app.patch<IdParams, any, EditTodoPayload>('/:id', async (req, res) => {
    actions
      .updateOne(req.params.id, req.body)
      .then(todo => res.status(200).json(todo))
  })

  app.delete<IdParams>('/:id', async (req, res) => {
    actions.deleteOne(req.params.id).then(() => res.send(204))
  })

  return app
}
