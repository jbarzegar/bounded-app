import { Todo, AddTodoPayload, EditTodoPayload } from './entities'
import { ITodoBindings } from './binding'

export interface ITodoActions {
  getAll(): Promise<Todo[]>
  getOne(id: string): Promise<Todo>
  createOne(payload: AddTodoPayload): Promise<Todo>
  updateOne(id: string, payload: EditTodoPayload): Promise<Todo>
  toggleTodo(id: string, old: Todo): Promise<Todo>
  deleteOne(id: string): Promise<void>
}

export class TodoActions implements ITodoActions {
  private binding: ITodoBindings

  constructor(todoBindings: ITodoBindings) {
    this.binding = todoBindings

    // damn it js
    this.createOne = this.createOne.bind(this)
    this.toggleTodo = this.toggleTodo.bind(this)
  }

  async createOne(payload: AddTodoPayload): Promise<Todo> {
    try {
      const todo = await this.binding.add(payload)
      return todo
    } catch (e) {
      throw e
    }
  }

  updateOne(id: string, payload: EditTodoPayload): Promise<Todo> {
    try {
      return this.binding.update(id, payload)
    } catch (e) {
      throw e
    }
  }

  getAll(): Promise<Todo[]> {
    return this.binding.getAll()
  }

  getOne(id: string): Promise<Todo> {
    return this.binding.get(id)
  }

  async toggleTodo(id: string, { status }: Todo): Promise<Todo> {
    try {
      const newStatus = status === 'doing' ? 'done' : 'doing'

      const todo = await this.binding.update(id, {
        status: newStatus,
      })

      return todo
    } catch (e) {
      throw e
    }
  }

  async deleteOne(id: string): Promise<void> {
    try {
      await this.binding.delete(id)
    } catch (e) {
      throw e
    }
  }
}
