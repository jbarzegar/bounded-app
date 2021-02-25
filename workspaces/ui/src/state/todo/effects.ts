import { Todo } from '@app/core/todo'
import { useQueryClient } from 'react-query'
import { Queries } from './queries'

type FnUpdater<T> = (oldData: T) => T

type FnUseAllTodoUpdater = () => (updater: FnUpdater<Todo[]>) => void
const useAllTodoUpdater: FnUseAllTodoUpdater = () => {
  const queryClient = useQueryClient()

  return updater => {
    queryClient.setQueryData<Todo[]>(Queries.all, (data = []) => updater(data))
  }
}

export type FnUseUpdateTodo = () => (data: Todo) => Promise<void>
export const useUpdateTodo: FnUseUpdateTodo = () => {
  const updateAllTodos = useAllTodoUpdater()

  return async data => {
    updateAllTodos(old => {
      const copy = [...old]
      const tIndex = copy.findIndex(x => x.id === data.id)

      if (tIndex === -1) return old

      copy[tIndex] = data

      return copy
    })
  }
}

export type FnUseRemoveTodo = () => (id: string) => Promise<void>
export const useRemoveTodo: FnUseRemoveTodo = () => {
  const updateAllTodos = useAllTodoUpdater()

  return async id => updateAllTodos(old => old.filter(x => x.id !== id))
}
