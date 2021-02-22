import * as yup from 'yup'
import { Todo } from '@app/core/todo'

const toOptional = <T extends Record<string, yup.AnySchema>>(schema: T): T =>
  Object.fromEntries(
    Object.entries(schema).map(([k, v]) => [k, v.optional()])
  ) as T

export const todoCreateSchema = yup.object({
  title: yup.string().required(),
  notes: yup.array(yup.string().required()).optional(),
  dueDate: yup
    .date()
    .min(new Date(), 'New todo cannot be due in the past')
    .optional(),
})

export type TodoCreateSchema = yup.InferType<typeof todoCreateSchema>

type Status = Todo['status']
export const todoUpdateSchema = yup
  .object(toOptional(todoCreateSchema.fields))
  .shape({
    status: yup.string().oneOf(['doing', 'done', 'due', 'overdue']),
  })
