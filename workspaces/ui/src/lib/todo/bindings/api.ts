import {
  Todo,
  ITodoBindings,
  AddTodoPayload,
  EditTodoPayload,
} from '@app/core/todo'

export class ApiBinding implements ITodoBindings {
  apiUrl: string

  constructor(config: { apiUrl: string }) {
    this.apiUrl = config.apiUrl
  }

  async getAll(): Promise<Todo[]> {
    const resp = await fetch(this.apiUrl)

    if (!resp.ok) throw resp

    const data: Todo[] = await resp.json()

    return data
  }

  async get(id: string): Promise<Todo> {
    // throw new Error('Method not implemented.')
    const resp = await fetch(`${this.apiUrl}/${id}`)

    if (!resp.ok) throw resp

    const data: Todo = await resp.json()

    return data
  }

  async add(payload: AddTodoPayload): Promise<Todo> {
    const resp = await fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    if (!resp.ok) throw resp

    const data: Todo = await resp.json()

    return data
  }

  async update(id: string, updateData: EditTodoPayload): Promise<Todo> {
    const resp = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    })

    if (!resp.ok) throw resp

    const data: Todo = await resp.json()

    return data
  }

  async delete(id: string): Promise<void> {
    try {
      const resp = await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' })

      if (!resp.ok) throw resp

      return
    } catch (e) {
      throw e
    }
  }
}
