import type { Router } from 'express'

export type FnUseRoute<Actions extends Record<string, any>> = (
  actions: Actions
) => Router
