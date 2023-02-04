import { DeepMap, FieldError } from "react-hook-form";

export interface ValidationRules {
  required?: boolean
  maxLength?: number
  minLength?: number
  pattern?: RegExp
}

const validationRules = {
  usernameOrEmail: {
    required: true,
    maxLength: 200,
    minLength: 3
  },
  password: {
    required: true,
    maxLength: 15,
    minLength: 8,
    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
  },
  username: {
    required: true,
    maxLength: 30,
    minLength: 3,
    pattern: /^[a-zA-Z0-9_-]{3,30}$/
  },
  email: {
    required: true,
    minLength: 5,
    maxLength: 200,
    pattern: /^[a-zA-z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  },
  votingSubject: {
    maxLength: 500
  },
  teamName: {
    required: true,
    minLength: 3,
    maxLength: 1000,
    pattern: /^[a-zA-Z0-9_-\s]+$/
  }
};

export const invalidPasswordMsg = 'Password must contain uppercase and lowercase letters, numbers and symbols';

export const getValidationMessage = (errors: DeepMap<Record<string, any>, FieldError>, fieldName: string, fieldValidationRules: any, patternMessage?: string): string => {
  if (!errors || Object.keys(errors).length === 0 || !errors[fieldName]) return '';
  switch (errors[fieldName].type) {
    case 'required':
      return 'Field is required';
    case 'minLength':
      return `Field length cannot be less than ${fieldValidationRules.minLength}`
    case 'maxLength':
      return `Field length cannot be greater than ${fieldValidationRules.maxLength}`
    case 'pattern':
      return patternMessage || 'Field is invalid';
    default:
      return 'Field is invalid';
  }
}

export default validationRules;