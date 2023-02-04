// Map server errors to webapp errors.
export const errors: { [key: string]: string } = {
  'Validation Error': 'Invalid data',
  'Authentication is required': 'Authentication is required'
};

export const getError = (message: string = ''): string => errors[message] || message;