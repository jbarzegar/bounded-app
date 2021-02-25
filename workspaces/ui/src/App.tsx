import { FC, PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ThemeProvider } from 'theme'
import { TodoActions } from '@app/core/todo'
import { MockTodoBinding } from '@app/core/todo/mockBinding'
import { TodoActionProvider } from 'state/todo/actions'
import { TodoRoot } from 'view/TodoRoot'

type AppProviderProps = {
  queryClient?: QueryClient
}
export const AppProvider: FC<PropsWithChildren<AppProviderProps>> = ({
  queryClient = new QueryClient(),
  children,
}) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>{children}</ThemeProvider>
    {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
  </QueryClientProvider>
)

const App: React.FC = () => {
  return (
    <AppProvider>
      <TodoActionProvider bindings={new TodoActions(new MockTodoBinding())}>
        <TodoRoot />
      </TodoActionProvider>
    </AppProvider>
  )
}

export default App
