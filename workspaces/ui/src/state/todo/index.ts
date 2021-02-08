import {
  useQuery,
  useMutation,
  MutationOptions,
  UseMutationResult,
  QueryOptions,
  UseQueryResult,
} from 'react-query'

import { useTodoActions, useToggleTodoAction } from 'actions/todo'
import { Todo } from '@app/core/todo/entities'

export enum Queries {
  all = 'ALL_TODOS',
}

export enum Mutations {
  toggle = 'TOGGLE_TODO',
}

type ToggleTodoMutationVariables = { id: string; checked: boolean }
type FnUseToggleTodo = (
  options?: MutationOptions<Todo, unknown, ToggleTodoMutationVariables>
) => UseMutationResult<Todo, unknown, ToggleTodoMutationVariables>
export const useMutationToggleTodo: FnUseToggleTodo = options => {
  const toggleTodo = useToggleTodoAction()

  const todoMutation = useMutation(
    Mutations.toggle,
    ({ id, checked }: ToggleTodoMutationVariables) => toggleTodo(id, checked),
    options
  )

  return todoMutation
}

type FnUseQueryGetAllTodos = (
  options?: QueryOptions<Todo[]>
) => UseQueryResult<Todo[]>
export const useQueryGetAllTodos: FnUseQueryGetAllTodos = () => {
  const actions = useTodoActions()
  const query = useQuery(Queries.all, () => actions.getAll())

  return query
}
