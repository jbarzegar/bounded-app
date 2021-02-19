import express from "express";
import { json as jsonParser } from "body-parser";
import morgan from "morgan";
import { LowDbBindings } from "../lib/todo/bindings/lowdb";
import { TodoActions } from "@app/core/todo";
import { useTodoRoutes } from "./routes/todos";

const app = express();

app.use(jsonParser());
app.use(morgan("dev"));

const todoActions = new TodoActions(new LowDbBindings());

app.use("/todo", useTodoRoutes(todoActions));

const port = 5000;
app.listen(port, () => console.log("listening on port", port));
