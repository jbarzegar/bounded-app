import axios, { AxiosInstance } from 'axios'

import {
  Todo,
  ITodoBindings,
  AddTodoPayload,
  EditTodoPayload,
} from '@app/core/todo'

export class ApiBinding implements ITodoBindings {
  apiUrl: string
  api: AxiosInstance

  constructor(config: { apiUrl: string }) {
    this.apiUrl = config.apiUrl

    this.api = axios.create({ baseURL: config.apiUrl })
  }

  async getAll(): Promise<Todo[]> {
    const resp = await this.api.get<Todo[]>('')

    return resp.data
  }

  async get(id: string): Promise<Todo> {
    const resp = await this.api.get<Todo>(id)

    return resp.data
  }

  async add(payload: AddTodoPayload): Promise<Todo> {
    const resp = await this.api.post<Todo>('', payload)

    return resp.data
  }

  async update(id: string, updateData: EditTodoPayload): Promise<Todo> {
    const resp = await this.api.patch(id, updateData)

    return resp.data
  }

  async delete(id: string): Promise<void> {
    try {
      await this.api.delete(id)

      return
    } catch (e) {
      throw e
    }
  }
}
