import { Router as getRoute } from 'express'
import { AddTodoPayload, EditTodoPayload, TodoActions } from '@app/core/todo'

import { DbErrors } from 'lib/todo/bindings/lowdb'
import { TodoCreateSchema, todoCreateSchema } from 'validation/todos.validation'
import { FnUseRoute } from 'types'

type IdParams = { id: string }

const mapTodo: (payload: TodoCreateSchema) => AddTodoPayload = payload => {
  const { title, notes = [] } = payload
  const partialPayload = { title, notes }

  if (payload.dueDate) {
    return {
      type: 'timedTodo',
      dueDate: payload.dueDate,
      ...partialPayload,
    }
  }

  return { type: 'genericTodo', ...partialPayload }
}

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
    try {
      await todoCreateSchema.validate(req.body)
    } catch (e) {
      res.status(400).send(e)
      return
    }

    actions
      .createOne(mapTodo(req.body))
      .then(todo => res.status(201).json(todo).send())
      .catch(err => res.status(500).json(err).send())
  })

  app.patch<IdParams, any, EditTodoPayload>('/:id', async (req, res) => {
    console.log('body', req.body)
    actions
      .updateOne(req.params.id, req.body)
      .then(todo => res.status(200).json(todo))
  })

  app.patch<IdParams, any, IdParams>('/:id/toggle', async (req, res) => {
    actions
      .toggleTodo(req.params.id, await actions.getOne(req.params.id))
      .then(todo => res.status(201).json(todo).send())
      .catch(err => res.status(500).json(err).send())
  })

  app.delete<IdParams>('/:id', async (req, res) => {
    actions.deleteOne(req.params.id).then(() => res.send(204))
  })

  return app
}
