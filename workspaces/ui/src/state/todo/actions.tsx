import {
  createContext,
  useContext,
  FC,
  PropsWithChildren,
  useMemo,
} from 'react'
import { TodoActions } from '@app/core/todo/actions'
const todoActionContext = createContext<TodoActions>(undefined as any)

export const TodoActionProvider: FC<
  PropsWithChildren<{ bindings: TodoActions }>
> = ({ children, bindings }) => {
  const value = useMemo(() => bindings, [bindings])
  return (
    <todoActionContext.Provider value={value}>
      {children}
    </todoActionContext.Provider>
  )
}

export const useTodoActions = () => {
  const ctx = useContext(todoActionContext)

  if (!ctx && process.env.NODE_ENV !== 'development')
    throw new Error(
      'Todo actions not found. Component must be wrapped in <TodoActionProvider /> before being able to consume actions'
    )

  return ctx
}
