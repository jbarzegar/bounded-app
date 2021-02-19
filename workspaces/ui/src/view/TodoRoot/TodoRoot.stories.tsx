import { Story, Meta } from '@storybook/react/types-6-0'
import { TodoActions } from '@app/core/todo'
import { MockTodoBinding } from '@app/core/todo/mockBinding'

import { AppProvider } from 'App'
import { TodoRoot } from 'view/TodoRoot'
import { TodoActionProvider } from 'state/todo/actions'

export default {
  title: 'View/TodoRoot',
  component: TodoRoot,
} as Meta

export const Mounted: Story = () => {
  const todoBindings = new MockTodoBinding([
    {
      type: 'genericTodo',
      title: 'Get Milk',
    },
    {
      type: 'timedTodo',
      title: 'Do taxes',
      dueDate: new Date('March 02 2021'),
      notes: ['Follow up with company a', 'Follow up with company b'],
    },
    {
      type: 'genericTodo',
      title: 'Buy some fridge magnets',
    },
  ])

  const bindings = new TodoActions(todoBindings)

  return (
    <AppProvider>
      <TodoActionProvider bindings={bindings}>
        <TodoRoot />
      </TodoActionProvider>
    </AppProvider>
  )
}

export const EmptyState = () => {
  const todoBindings = new MockTodoBinding()
  const bindings = new TodoActions(todoBindings)
  return (
    <AppProvider>
      <TodoActionProvider bindings={bindings}>
        <TodoRoot />
      </TodoActionProvider>
    </AppProvider>
  )
}
