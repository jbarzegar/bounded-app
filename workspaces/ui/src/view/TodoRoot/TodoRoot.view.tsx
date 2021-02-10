import { FC, useState } from 'react'
import { useField, Formik, Form } from 'formik'
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
  TextField,
} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { Header } from 'components/Header'
import { useMutationToggleTodo, useQueryGetAllTodos } from 'state/todo'

type FieldProps = {
  id?: string
  name: string
  label: string
  helperText?: string
}
const Field: FC<FieldProps> = ({ helperText, ...props }) => {
  const [field, { touched, error }] = useField(props)

  return (
    <TextField
      {...props}
      {...field}
      error={touched && !!error}
      helperText={!!error ? error : helperText}
    />
  )
}
const NewTodo = () => {
  return (
    <Formik
      initialValues={{
        title: '',
      }}
      onSubmit={values => console.log(values)}
    >
      <Form>
        <Field name='title' label='Title' />
        <Button type='submit'>Save</Button>
      </Form>
    </Formik>
  )
}

const TodoList = () => {
  const { status, data = [], refetch } = useQueryGetAllTodos()
  const toggleTodoMutation = useMutationToggleTodo({
    onSuccess() {
      refetch()
    },
  })

  const toggleTodo = (id: string, done: boolean) =>
    toggleTodoMutation.mutate({ id, done })

  return (
    <Card>
      {status === 'loading' && (
        <Box alignItems='center' justifyContent='center' display='flex' p={4}>
          <Spinner />
        </Box>
      )}
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
                onChange={e => toggleTodo(todo.id, e.currentTarget.checked)}
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
  type View = 'listTodos' | 'addNewTodo'

  const [currentView, setCurrentView] = useState<View>('listTodos')

  const addNewTodo = () => setCurrentView('addNewTodo')

  return (
    <Container>
      <Box
        py={3}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Header variant='h3'>Todos</Header>
        <Button
          color='primary'
          variant='contained'
          endIcon={<AddIcon />}
          onClick={addNewTodo}
        >
          Add Todo
        </Button>
      </Box>

      {currentView === 'addNewTodo' && <NewTodo />}

      {currentView === 'listTodos' && <TodoList />}
    </Container>
  )
}
