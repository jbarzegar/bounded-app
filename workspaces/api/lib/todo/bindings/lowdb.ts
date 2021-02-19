import lowdb from "lowdb";
import FileSyncAdapter from "lowdb/adapters/FileSync";

import {
  Todo,
  mapNewTodo,
  ITodoBindings,
  AddTodoPayload,
  EditTodoPayload,
} from "@app/core/todo";

/** Use the id of the todo as the index in the db */
export type Schema = {
  todos: Todo[];
};

type DB = lowdb.LowdbSync<Schema>;
type FnCreateDBError = (code: string, ...message: string[]) => Error;
type FnPrintError = (...message: any[]) => void;

export enum DbErrors {
  notFound = "NotFound",
  fatal = "FATAL",
}

export class LowDbBindings implements ITodoBindings {
  private db: DB;

  private printError: FnPrintError = (...message) => {
    if (process.env.NODE_ENV !== "test") console.error(...message);
  };

  private createDbError: FnCreateDBError = (code, ...message) =>
    new Error(`${code}: ${message}`);

  private printUnknownError = () =>
    this.createDbError(DbErrors.fatal, "An unknown error has occurred");

  constructor(adapter = new FileSyncAdapter<Schema>("db.json")) {
    this.db = lowdb(adapter);

    this.db.defaults({ todos: [] }).write();
  }

  async getAll(): Promise<Todo[]> {
    const todos = this.getTodoQuery().value();

    return todos;
  }

  async get(id: string): Promise<Todo> {
    const todo: Todo | undefined = this.getTodoByID(id).value();

    if (!todo) {
      throw this.createDbError(
        DbErrors.notFound,
        `todo with id: ${id} could not be found`
      );
    }

    return todo;
  }

  async add(payload: AddTodoPayload): Promise<Todo> {
    try {
      const newTodo: Todo = mapNewTodo(payload);

      const dbQuery = this.getTodoQuery().push(newTodo);
      dbQuery.write();

      return newTodo;
    } catch (e) {
      this.printError("addError", e);

      throw this.createDbError(DbErrors.fatal, "an unknown error has ocurred");
    }
  }

  async update(id: string, updateData: EditTodoPayload): Promise<Todo> {
    const todo = this.getTodoByID(id);

    if (!todo.value()) {
      throw this.createDbError(
        DbErrors.notFound,
        `todo with id: ${id} could not be found.`
      );
    }

    const todos = [...this.getTodoQuery().value()];
    const index = todos.findIndex((x) => x.id === id);

    todos[index] = { ...todos[index], ...updateData, id } as Todo;

    this.db.set("todos", todos).write();

    return todos[index];
  }

  async delete(id: string): Promise<void> {
    this.db
      .set(
        "todos",
        this.getTodoQuery()
          .filter((x) => x.id !== id)
          .value()
      )
      .write();
  }

  private getTodoQuery() {
    return this.db.get("todos");
  }
  private getTodoByID(id: string) {
    const todos = this.getTodoQuery();

    return todos.find((x) => x.id === id);
  }
}
