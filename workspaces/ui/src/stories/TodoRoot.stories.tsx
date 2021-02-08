import { Story, Meta } from '@storybook/react/types-6-0'
import { QueryClient, QueryClientProvider } from 'react-query'

import { ThemeProvider } from 'theme'
import { TodoRoot } from 'view/TodoRoot'
import { TodoActionProvider } from 'actions/todo'
import { MockTodoBinding } from 'lib/todo/bindings/mock'

export default {
  title: 'View/TodoRoot',
  component: TodoRoot,
} as Meta

export const Mounted: Story = () => {
  const queryClient = new QueryClient()
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TodoActionProvider bindings={todoBindings}>
          <TodoRoot />
        </TodoActionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export const EmptyState = () => {
  const queryClient = new QueryClient()
  const todoBindings = new MockTodoBinding()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TodoActionProvider bindings={todoBindings}>
          <TodoRoot />
        </TodoActionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
