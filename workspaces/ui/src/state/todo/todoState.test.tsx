import { PropsWithChildren } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { pick } from 'lodash'

import { AppProvider } from 'App'
import { MockTodoBinding } from 'lib/todo/bindings/mock'
import { AddTodoPayload, TodoActions } from '@app/core/todo/actions'

import { TodoActionProvider } from '.'
import { useQueryGetAllTodos } from './queries'
import {
  useMutationToggleTodo,
  useMutationCreateTodo,
  useMutationDeleteTodo,
} from './mutations'

const sampleTodos: AddTodoPayload[] = [
  { type: 'genericTodo', title: 'Get milk' },
  { type: 'genericTodo', title: 'Sell pasta' },
]

const TestWrapper = ({
  children,
  bindings = new MockTodoBinding(sampleTodos),
}: PropsWithChildren<{ bindings: TodoActions }>) => (
  <AppProvider>
    <TodoActionProvider bindings={bindings}>{children}</TodoActionProvider>
  </AppProvider>
)

describe('useQueryGetAllTodos', () => {
  it('should query for all todos', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useQueryGetAllTodos(),
      {
        wrapper: TestWrapper,
      }
    )

    expect(result.current.status).toEqual('loading')
    expect(result.current.data).toEqual(undefined)

    await waitForNextUpdate()

    expect(result.current.status).toEqual('success')

    const todoIncludesAnId = result.current?.data?.map(_ => _.id).every(Boolean)
    expect(todoIncludesAnId).toBe(true)

    const expectedShape = result.current?.data?.map(t =>
      pick(t, ['type', 'status', 'title'])
    )
    expect(expectedShape).toMatchObject(sampleTodos)
  })
})

describe('useMutationToggleTodo', () => {
  it('should toggle a todo to done', async () => {
    const bindings = new MockTodoBinding(sampleTodos)
    const { result, waitForNextUpdate } = renderHook(
      () => useMutationToggleTodo(),
      {
        wrapper: TestWrapper,
        initialProps: {
          bindings,
        },
      }
    )

    expect(result.current.status).toEqual('idle')
    const [todo] = await bindings.getAll()

    act(() => result.current.mutate({ id: todo.id, done: true }))
    await waitForNextUpdate()

    expect(result.current.status).toEqual('loading')
    await waitForNextUpdate()

    expect(result.current.status).toEqual('success')
    expect(result.current.data?.status).toEqual('done')

    const updatedTodo = await bindings.get(todo.id)
    expect(updatedTodo.status).toEqual('done')
  })
})

describe('useMutationCreateTodo', () => {
  it('should create a new todo item', async () => {
    const bindings = new MockTodoBinding(sampleTodos)
    const { result, waitForNextUpdate } = renderHook(
      () => useMutationCreateTodo(),
      {
        wrapper: TestWrapper,
        initialProps: {
          bindings,
        },
      }
    )

    expect(result.current.status).toEqual('idle')

    const shape: AddTodoPayload = {
      title: 'A new todo',
      type: 'genericTodo',
      notes: ['A note', 'another note'],
    }

    act(() => result.current.mutate(shape))

    await waitForNextUpdate()

    expect(result.current.status).toEqual('loading')

    await waitForNextUpdate()

    expect(result.current.status).toEqual('success')
    expect(result.current.data?.status).toEqual('doing')
    expect(typeof result.current.data?.id).toEqual('string')
    expect(pick(result.current.data, Object.keys(shape))).toMatchObject(shape)
  })
})

describe('useMutationDeleteTodo', () => {
  it('should delete a todo', async () => {
    const bindings = new MockTodoBinding(sampleTodos)
    const { result, waitForNextUpdate } = renderHook(
      () => useMutationDeleteTodo(),
      {
        wrapper: TestWrapper,
        initialProps: {
          bindings,
        },
      }
    )

    expect(result.current.status).toEqual('idle')

    const [todo] = await bindings.getAll()

    act(() => result.current.mutate({ id: todo.id }))

    await waitForNextUpdate()

    expect(result.current.status).toEqual('loading')

    await waitForNextUpdate()

    expect(result.current.status).toEqual('success')

    await expect(() => bindings.get(todo.id)).rejects.toStrictEqual(
      new Error('notFound')
    )
  })
})
