type TodoStatus = 'doing' | 'done'

export interface GenericTodo {
  type: 'genericTodo'
  title: string
  notes?: string[]
  status: TodoStatus
}

export interface TimedTodo extends Omit<GenericTodo, 'status' | 'type'> {
  type: 'timedTodo'
  dueDate: Date
  status: TodoStatus | 'due' | 'overdue'
}

export type NewTodo = GenericTodo | TimedTodo
export type Todo = (GenericTodo | TimedTodo) & { id: string }
