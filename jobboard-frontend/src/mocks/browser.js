import { setupWorker } from 'msw/browser'
import { handlers } from './handlers.js'

// Disable MSW for production/real API usage
export const worker = null

// Uncomment the line below to enable MSW for development
// export const worker = setupWorker(...handlers)

