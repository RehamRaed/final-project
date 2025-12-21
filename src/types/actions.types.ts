import { Tables } from './database.types'

export type UpdateTaskActionResult =
  | {
      success: true
      data: Tables<'tasks'>
    }
  | {
      success: false
      error: string
    }
