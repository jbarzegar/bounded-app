import { Story, Meta } from '@storybook/react/types-6-0'
import { TodoRoot } from 'view/TodoRoot'
import { MockTodoBinding } from 'lib/todo/bindings/mock'
import { TodoActionProvider } from 'state/todo/actions'
import { AppProvider } from 'App'

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

  return (
    <AppProvider>
      <TodoActionProvider bindings={todoBindings}>
        <TodoRoot />
      </TodoActionProvider>
    </AppProvider>
  )
}

export const EmptyState = () => {
  const todoBindings = new MockTodoBinding()

  return (
    <AppProvider>
      <TodoActionProvider bindings={todoBindings}>
        <TodoRoot />
      </TodoActionProvider>
    </AppProvider>
  )
}
