import * as yup from 'yup'

export const todoCreateSchema = yup.object({
  title: yup.string().required(),
  notes: yup.array(yup.string().required()).optional(),
  dueDate: yup
    .date()
    .min(new Date(), 'New todo cannot be due in the past')
    .optional(),
})

export type TodoCreateSchema = yup.InferType<typeof todoCreateSchema>
