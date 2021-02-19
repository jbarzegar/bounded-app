// need to  create a custom omit here
// https://github.com/microsoft/TypeScript/issues/28791#issuecomment-443520161
/**
 * > Pick isn't distributive over union types, when the input type is a union it is effectively treated as a single object type with only the common properties, each having a union of the respective property types.
 */

type AllKeys<T> = T extends T ? keyof T : never;
type Omit<T, K extends AllKeys<T>> = T extends T
  ? Pick<T, Exclude<keyof T, K>>
  : never;

type TodoStatus = "doing" | "done";

export interface GenericTodo {
  type: "genericTodo";
  title: string;
  notes?: string[];
  status: TodoStatus;
}

export interface TimedTodo extends Omit<GenericTodo, "status" | "type"> {
  type: "timedTodo";
  dueDate: Date;
  status: TodoStatus | "due" | "overdue";
}

export type NewTodo = GenericTodo | TimedTodo;
export type Todo = (GenericTodo | TimedTodo) & { id: string };

export type AddTodoPayload = Omit<Todo, "status" | "id">;
export type EditTodoPayload = Partial<Omit<Todo, "id">>;
