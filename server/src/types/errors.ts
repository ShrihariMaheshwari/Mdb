export class DatabaseError extends Error {
  constructor(message: string, public code?: string, public cause?: Error) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends DatabaseError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}
