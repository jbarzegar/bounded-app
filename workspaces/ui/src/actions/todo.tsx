import {
  useCallback,
  createContext,
  useContext,
  FC,
  PropsWithChildren,
} from 'react'
import { Todo } from '@app/core/todo/entities'
import { TodoActions } from '@app/core/todo/actions'
const todoActionContext = createContext<TodoActions>({} as TodoActions)

export const TodoActionProvider: FC<
  PropsWithChildren<{ bindings: TodoActions }>
> = ({ children, bindings }) => {
  return (
    <todoActionContext.Provider value={bindings}>
      {children}
    </todoActionContext.Provider>
  )
}

export const useTodoActions = () => useContext(todoActionContext)

export const useToggleTodoAction = () => {
  const actions = useTodoActions()

  type FnDoToggle = (id: string, done: boolean) => Promise<Todo>
  const doToggle = useCallback<FnDoToggle>(
    (id, done) => actions.update(id, { status: done ? 'done' : 'doing' }),
    [actions]
  )

  return doToggle
}
