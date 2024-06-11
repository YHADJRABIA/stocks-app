import { ZodError } from 'zod'

export const getErrorMessage = (error: unknown): string => {
  let message: string

  if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Something went wrong' // TODO: internationalise
  }
  return message
}

interface ZodErrors {
  message: string
}

export const getZodErrors = (error: ZodError): ZodErrors => {
  let zodErrors = { message: '' }
  error.issues.forEach(issue => {
    zodErrors = { ...zodErrors, message: issue.message }
  })
  return zodErrors
}
