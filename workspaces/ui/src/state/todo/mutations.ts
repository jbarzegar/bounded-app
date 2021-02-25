import { useMutation, MutationOptions, UseMutationResult } from 'react-query'
import { AddTodoPayload, Todo } from '@app/core/todo'

import { useTodoActions } from './actions'

export enum Mutations {
  toggle = 'TOGGLE_TODO',
  create = 'CREATE_TODO',
  delete = 'DELETE_TODO',
}

type MutationFn<Response, Variables, Error = unknown> = (
  options?: MutationOptions<Response, Error, Variables>
) => UseMutationResult<Response, Error, Variables>

type ToggleTodoMutationVariables = { id: string; old: Todo }
type FnUseMutationToggleTodo = MutationFn<Todo, ToggleTodoMutationVariables>
export const useMutationToggleTodo: FnUseMutationToggleTodo = options => {
  const actions = useTodoActions()

  const todoMutation = useMutation(
    Mutations.toggle,
    ({ id, old }) => actions.toggleTodo(id, old),
    options
  )

  return todoMutation
}

export const useMutationCreateTodo: MutationFn<
  Todo,
  AddTodoPayload
> = options => {
  const actions = useTodoActions()
  const todoCreateMutation = useMutation(
    Mutations.create,
    actions.createOne,
    options
  )

  return todoCreateMutation
}

export const useMutationDeleteTodo: MutationFn<
  void,
  { id: string }
> = options => {
  const actions = useTodoActions()
  const todoDeleteMutation = useMutation(
    Mutations.delete,
    ({ id }) => actions.deleteOne(id),
    options
  )

  return todoDeleteMutation
}
