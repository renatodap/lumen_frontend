export class LumenError extends Error {
  code: string;
  userMessage: string;
  statusCode: number;

  constructor(message: string, code: string, userMessage?: string, statusCode = 500) {
    super(message);
    this.name = 'LumenError';
    this.code = code;
    this.userMessage = userMessage || message;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LumenError);
    }
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export function isLumenError(error: unknown): error is LumenError {
  return error instanceof LumenError;
}

export function toLumenError(error: unknown): LumenError {
  if (isLumenError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new LumenError(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      'An unexpected error occurred. Please try again.',
      500
    );
  }

  return new LumenError(
    'Unknown error',
    ErrorCodes.UNKNOWN_ERROR,
    'An unexpected error occurred. Please try again.',
    500
  );
}

export function handleError(error: unknown): string {
  if (isLumenError(error)) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
