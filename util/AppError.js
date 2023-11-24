class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 500;
  }

  getStatusCode() {
    return this.statusCode;
  }
}

class BadRequest extends AppError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFound extends AppError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class Unauthorized extends AppError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = { AppError, NotFound, BadRequest, Unauthorized };
