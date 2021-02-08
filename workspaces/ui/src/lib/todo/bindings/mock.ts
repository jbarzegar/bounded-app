import { nanoid } from 'nanoid'
import { Todo } from '../entities'
import { TodoActions, AddTodoPayload, EditTodoPayload } from '../actions'

export class MockTodoBinding implements TodoActions {
  todos: Todo[]

  constructor(initialTodos: AddTodoPayload[] = []) {
    const todos = initialTodos.map<Todo>(todo => this.mapNewTodo(todo))

    this.todos = todos
  }

  async getAll(): Promise<Todo[]> {
    return this.todos
  }

  async get(id: string): Promise<Todo> {
    const todo = this.todos.find(this.byId(id))

    if (!todo) throw new Error('notFound')

    return todo
  }

  async add(payload: AddTodoPayload): Promise<Todo> {
    const newTodo = this.mapNewTodo(payload) as Todo
    this.todos.push(newTodo)

    return newTodo
  }

  async update(id: string, updateData: EditTodoPayload): Promise<Todo> {
    const todoIndex = this.todos.findIndex(this.byId(id))

    if (todoIndex === -1) throw new Error('notFound')

    const draft = { ...this.todos[todoIndex], ...updateData, id } as Todo
    this.todos[todoIndex] = draft

    return draft
  }

  async delete(id: string): Promise<void> {
    this.todos = this.todos.filter(_ => !this.byId(id)(_))
  }

  private byId: (id: string) => (todo: Todo) => boolean = id => x => id === x.id
  private mapNewTodo: (p: AddTodoPayload) => Todo = p => ({
    ...p,
    id: nanoid(),
    status: 'doing',
  })
}
