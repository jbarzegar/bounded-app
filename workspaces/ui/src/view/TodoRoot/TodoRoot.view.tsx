import { FC, ChangeEvent } from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  CircularProgress as Spinner,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { Header } from 'components/Header'

import { useMutationToggleTodo, useQueryGetAllTodos } from 'state/todo'

const TodoList = () => {
  const { refetch, status, data = [] } = useQueryGetAllTodos()
  const toggleTodoMutation = useMutationToggleTodo({
    onSuccess() {
      refetch()
    },
  })

  type FnHandleChange = (
    id: string
  ) => (event: ChangeEvent<HTMLInputElement>) => any
  const handleChange: FnHandleChange = id => event =>
    toggleTodoMutation.mutate({ id, checked: event.currentTarget.checked })

  return (
    <Card>
      {status === 'loading' && <Spinner />}
      {status === 'success' && data?.length <= 0 && (
        <Box padding={2}>
          <Header variant='subtitle1'>You have no todos</Header>
        </Box>
      )}
      {status === 'success' && data.length > 0 && (
        <List>
          {data.map(todo => (
            <ListItem key={todo.id}>
              <Checkbox
                color='primary'
                checked={todo.status === 'done'}
                onChange={handleChange(todo.id)}
              />
              <ListItemText>{todo.title}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  )
}

export const TodoRoot: FC = () => {
  return (
    <Container>
      <Box
        py={3}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Header variant='h3'>Todos</Header>
        <Button color='primary' variant='contained' endIcon={<AddIcon />}>
          Add Todo
        </Button>
      </Box>

      <TodoList />
    </Container>
  )
}
