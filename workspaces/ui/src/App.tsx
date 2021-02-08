import { TodoActionProvider } from 'actions/todo'
import { TodoActions } from 'types/TodoRoot.types'
import { TodoRoot } from 'view/TodoRoot'

const App: React.FC = () => {
  return (
    <TodoActionProvider bindings={{} as TodoActions}>
      <TodoRoot />
    </TodoActionProvider>
  )
}

export default App
