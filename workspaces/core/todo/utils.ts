import { nanoid } from "nanoid";
import type { AddTodoPayload, Todo } from "./entities";

type FnMapNewTodo = (payload: AddTodoPayload) => Todo;
export const mapNewTodo: FnMapNewTodo = (payload) => ({
  id: nanoid(),
  status: "doing",
  ...payload,
});
