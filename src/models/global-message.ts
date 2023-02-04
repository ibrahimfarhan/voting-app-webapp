export interface GlobalMessage {
  type?: 'success' | 'error' | 'info' | 'warning'
  content?: string
  displayDuration?: number
}