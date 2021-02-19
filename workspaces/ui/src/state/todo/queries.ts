import { useQuery, QueryOptions, UseQueryResult } from 'react-query'
import { Todo } from '@app/core/todo'

import { useTodoActions } from './actions'

export enum Queries {
  all = 'ALL_TODOS',
}

type FnUseQueryGetAllTodos = (
  options?: QueryOptions<Todo[]>
) => UseQueryResult<Todo[]>
export const useQueryGetAllTodos: FnUseQueryGetAllTodos = () => {
  const actions = useTodoActions()
  const query = useQuery(Queries.all, () => actions.getAll())

  return query
}
