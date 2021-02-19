import { Router as getRoute } from "express";
import { DbErrors } from "../../lib/todo/bindings/lowdb";
import { AddTodoPayload, EditTodoPayload, TodoActions } from "@app/core/todo";

type IdParams = { id: string };

export const useTodoRoutes: (actions: TodoActions) => () => void = (
  actions
) => () => {
  const route = getRoute();

  route.get("/", (_, res) =>
    actions
      .getAll()
      .then((todos) => res.status(200).json(todos))
      .catch((err) => res.status(400).send(err))
  );

  route.get<IdParams>("/:id", (req, res) =>
    actions
      .getOne(req.params.id)
      .then((todo) => res.status(200).json(todo))
      .catch((err: Error) => {
        if (err.message.startsWith(DbErrors.notFound)) res.status(404);
        else res.status(500);

        res.json({ name: err.name, message: err.message });
      })
  );

  route.post<never, any, AddTodoPayload>("/", async (req, res) => {
    const payload = req.body;
    actions
      .createOne(payload)
      .then((todo) => res.send(200).json(todo))
      .catch((err) => res.status(500).json(err));
  });

  route.patch<IdParams, any, EditTodoPayload>("/:id", async (req, res) => {
    actions
      .updateOne(req.params.id, req.body)
      .then((todo) => res.status(200).json(todo));
  });

  route.delete<IdParams>("/", async (req, res) => {
    actions.deleteOne(req.params.id).then(() => res.send(204));
  });

  return route;
};
