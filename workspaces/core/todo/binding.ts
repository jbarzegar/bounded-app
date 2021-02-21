import { Todo, AddTodoPayload, EditTodoPayload } from './entities'

export interface ITodoBindings {
  getAll(): Promise<Todo[]>
  get(id: string): Promise<Todo>
  add(payload: AddTodoPayload): Promise<Todo>
  update(id: string, updateData: EditTodoPayload): Promise<Todo>
  delete(id: string): Promise<void>
}
