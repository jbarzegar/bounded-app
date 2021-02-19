import {
  Todo,
  mapNewTodo,
  ITodoBindings,
  AddTodoPayload,
  EditTodoPayload,
} from "../";

const sleep = (timeout: number) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(null),
      process.env.NODE_ENV === "test" ? 0 : timeout
    )
  );

export class MockTodoBinding implements ITodoBindings {
  private todos: Todo[];

  constructor(initialTodos: AddTodoPayload[] = []) {
    const todos = initialTodos.map<Todo>((todo) => mapNewTodo(todo));
    this.todos = todos;

    this.add = this.add.bind(this);
  }

  async getAll(): Promise<Todo[]> {
    await sleep(300);
    return this.todos;
  }

  async get(id: string): Promise<Todo> {
    const todo = this.todos.find(this.byId(id));

    if (!todo) throw new Error("notFound");

    await sleep(300);

    return todo;
  }

  async add(payload: AddTodoPayload): Promise<Todo> {
    const newTodo = mapNewTodo(payload);
    this.todos.push(newTodo);

    await sleep(300);
    return newTodo;
  }

  async update(id: string, updateData: EditTodoPayload): Promise<Todo> {
    const todoIndex = this.todos.findIndex(this.byId(id));

    if (todoIndex === -1) throw new Error("notFound");

    const draft = { ...this.todos[todoIndex], ...updateData, id } as Todo;
    this.todos[todoIndex] = draft;

    await sleep(300);

    return draft;
  }

  async delete(id: string): Promise<void> {
    this.todos = this.todos.filter((_) => !this.byId(id)(_));
    await sleep(300);
  }

  private byId: (id: string) => (todo: Todo) => boolean = (id) => (x) =>
    id === x.id;
}
