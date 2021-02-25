import { FC, useState } from 'react'
import { useField, Formik, Form } from 'formik'
import {
  Box,
  Button,
  IconButton,
  Card,
  Checkbox,
  Container,
  CircularProgress as Spinner,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@material-ui/core'

import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons'
import { Header } from 'components/Header'
import {
  useMutationToggleTodo,
  useQueryGetAllTodos,
  useMutationCreateTodo,
  useMutationDeleteTodo,
  Queries,
} from 'state/todo'
import { useQueryClient } from 'react-query'
import { Todo } from '@app/core/todo'

type FieldProps = {
  id?: string
  name: string
  label: string
  helperText?: string
}
const Field: FC<FieldProps> = ({ helperText, ...props }) => {
  const [field, { touched, error }] = useField(props)

  return (
    <Box my={2}>
      <TextField
        {...props}
        {...field}
        error={touched && !!error}
        helperText={!!error ? error : helperText}
      />
    </Box>
  )
}
type NewTodoProps = {
  onCreate(values: { title: string }): any
}
const NewTodo: FC<NewTodoProps> = ({ onCreate }) => {
  return (
    <Card>
      <Formik
        initialValues={{
          title: '',
        }}
        onSubmit={values => onCreate(values)}
      >
        <Form>
          <Box padding={2}>
            <Field name='title' label='Title' />

            <Button color='primary' variant='contained' type='submit'>
              Save
            </Button>
          </Box>
        </Form>
      </Formik>
    </Card>
  )
}

const TodoList = () => {
  const queryClient = useQueryClient()
  const { status, data = [], refetch } = useQueryGetAllTodos()
  const toggleTodoMutation = useMutationToggleTodo({
    onSuccess(data) {
      queryClient.setQueryData<Todo[]>(Queries.all, old => {
        if (!old) return []

        const copy = [...old]
        const tIndex = copy.findIndex(x => x.id === data.id)

        if (tIndex === -1) return old

        copy[tIndex] = data

        return copy
      })
    },
  })
  const deleteTodoMutation = useMutationDeleteTodo({
    onSuccess() {
      refetch()
    },
  })

  const toggleTodo = (id: string, old: Todo) =>
    toggleTodoMutation.mutate({ id, old })

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
                onChange={e => toggleTodo(todo.id, todo)}
              />
              <ListItemText>{todo.title}</ListItemText>
              <Box ml='auto'>
                <IconButton
                  onClick={() =>
                    deleteTodoMutation.mutateAsync({ id: todo.id })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  )
}

type View = 'listTodos' | 'addNewTodo'
export const TodoRoot: FC = () => {
  const [currentView, setCurrentView] = useState<View>('listTodos')
  const createMutation = useMutationCreateTodo({
    onSuccess() {
      setCurrentView('listTodos')
    },
  })

  const addNewTodo = () => setCurrentView('addNewTodo')

  return (
    <Container>
      {currentView === 'listTodos' && (
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
      )}
      {currentView === 'addNewTodo' && (
        <Box py={3} display='flex' alignItems='center'>
          <IconButton onClick={() => setCurrentView('listTodos')}>
            <ArrowBackIcon />
          </IconButton>
          <Box ml={1}>
            <Header variant='h3'>Add new todo</Header>
          </Box>
        </Box>
      )}

      {currentView === 'addNewTodo' && (
        <NewTodo
          onCreate={values =>
            createMutation.mutate({ ...values, type: 'genericTodo' })
          }
        />
      )}

      {currentView === 'listTodos' && <TodoList />}
    </Container>
  )
}
