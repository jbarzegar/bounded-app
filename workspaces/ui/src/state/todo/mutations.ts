import { useMutation, MutationOptions, UseMutationResult } from 'react-query'
import { Todo } from '@app/core/todo/entities'
import { AddTodoPayload } from '@app/core/todo/actions'

import { useTodoActions } from './actions'

export enum Mutations {
  toggle = 'TOGGLE_TODO',
  create = 'CREATE_TODO',
}

type MutationFn<Response, Variables, Error = unknown> = (
  options?: MutationOptions<Response, Error, Variables>
) => UseMutationResult<Response, Error, Variables>

type ToggleTodoMutationVariables = { id: string; done: boolean }
type FnUseMutationToggleTodo = MutationFn<Todo, ToggleTodoMutationVariables>
export const useMutationToggleTodo: FnUseMutationToggleTodo = options => {
  const actions = useTodoActions()

  const calcStatus = (done: boolean) => (done ? 'done' : 'doing')
  const todoMutation = useMutation(
    Mutations.toggle,
    ({ id, done }) => actions.update(id, { status: calcStatus(done) }),
    options
  )

  return todoMutation
}

export const useMutationCreateTodo: MutationFn<
  Todo,
  AddTodoPayload
> = options => {
  const actions = useTodoActions()
  const todoCreateMutation = useMutation(Mutations.create, actions.add, options)

  return todoCreateMutation
}
