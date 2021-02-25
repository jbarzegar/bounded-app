import { AddTodoPayload } from '@app/core/todo'
import { LowDbBindings, DbErrors } from '.'
import MemoryAdapter from 'lowdb/adapters/Memory'

const sampleTodos: AddTodoPayload[] = [
  { type: 'genericTodo', title: 'Get milk' },
  {
    type: 'genericTodo',
    title: 'Sell pasta',
    notes: ['Ravioli Ravioli give me the formioli?'],
  },
]

const createTestBindings = () =>
  sampleTodos.reduce((db, todo) => {
    //side effects bad
    db.add(todo)

    return db
  }, new LowDbBindings(new MemoryAdapter('')))

describe('lowdb bindings', () => {
  it('should get all todos', async () => {
    const bindings = createTestBindings()

    const allTodos = await bindings.getAll()
    expect(allTodos.length).toEqual(sampleTodos.length)
  })

  it('should get a todo by id', async () => {
    const bindings = createTestBindings()
    const [firstTodo] = await bindings.getAll()

    expect(bindings.get(firstTodo.id)).resolves.toEqual(firstTodo)
  })

  it('should error when attempting to get a unknown todo', () => {
    try {
      const bindings = createTestBindings()

      const badId = 'bad id'
      expect(bindings.get(badId)).rejects.toEqual(
        new Error(
          `${DbErrors.notFound}: todo with id: ${badId} could not be found`
        )
      )
    } catch (e) {}
  })

  it('should create a todo', async () => {
    const bindings = createTestBindings()

    const newTodo = await bindings.add({
      type: 'genericTodo',
      title: 'Do something funny',
      notes: ['Impressions?'],
    })

    expect(bindings.get(newTodo.id)).resolves.toEqual(newTodo)
  })

  it('should update a todo', async () => {
    const bindings = createTestBindings()

    const [, todo] = await bindings.getAll()
    const updateData = { notes: ['something about spaghetti'] }

    const updatedTodo = await bindings.update(todo.id, updateData)

    const expected = { ...todo, ...updateData }
    expect(updatedTodo).toEqual(expected)

    const uT = await bindings.get(updatedTodo.id)
    expect(uT.notes).toEqual(updateData.notes)
  })

  it('should throw not found when updating with unknown id', async () => {
    const badId = 'some bad id'
    const bindings = createTestBindings()

    const updateData = { notes: ['something about spaghetti'] }
    expect(bindings.update(badId, updateData)).rejects.toThrowError(
      `${DbErrors.notFound}: todo with id: ${badId} could not be found`
    )
  })

  it('should delete a todo', async () => {
    const bindings = createTestBindings()
    const [firstTodo] = await bindings.getAll()

    await bindings.delete(firstTodo.id)

    expect(bindings.get(firstTodo.id)).rejects.toThrowError(
      `${DbErrors.notFound}: todo with id: ${firstTodo.id} could not be found`
    )
  })
})
