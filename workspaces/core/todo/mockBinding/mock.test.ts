import { MockTodoBinding } from ".";

describe("mock bindings", () => {
  it("should add a todo", async () => {
    const todoBinding = new MockTodoBinding();

    const newTodo = await todoBinding.add({
      type: "genericTodo",
      title: "Get milk",
      notes: ["Some notes"],
    });

    expect(typeof newTodo.id).toBe("string");
    expect(newTodo.title).toBe("Get milk");
  });

  it("should get all todos", async () => {
    const todoBinding = new MockTodoBinding();

    const todoTitles = ["Get milk", "Get eggs"];
    const createdTodos = await Promise.all(
      todoTitles.map((title) => todoBinding.add({ title, type: "genericTodo" }))
    );

    const allTodos = await todoBinding.getAll();

    expect(allTodos.length).toEqual(createdTodos.length);
  });

  it("should get one todo", async () => {
    const todoBinding = new MockTodoBinding();

    const t = await todoBinding.add({ title: "Get milk", type: "genericTodo" });

    const gotTodo = await todoBinding.get(t.id);

    expect(gotTodo).not.toBeUndefined();
    expect(gotTodo.id).toEqual(t.id);
  });
  it("should update a todo", async () => {
    const todoBinding = new MockTodoBinding();

    const t = await todoBinding.add({ title: "Get milk", type: "genericTodo" });

    const updated = await todoBinding.update(t.id, { title: "Get burgers" });

    expect(updated.title).toEqual("Get burgers");
  });

  it("should delete a todo", async () => {
    const todoBinding = new MockTodoBinding();

    const t = await todoBinding.add({ title: "Get milk", type: "genericTodo" });

    const got = await todoBinding.get(t.id);
    expect(got).not.toBeUndefined();

    await todoBinding.delete(got.id);

    await expect(() => todoBinding.get(got.id)).rejects.toStrictEqual(
      new Error("notFound")
    );
  });
});
