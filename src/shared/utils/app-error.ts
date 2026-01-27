export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // "Operational" means we predicted this error
    // "Non-operational" means a bug
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
