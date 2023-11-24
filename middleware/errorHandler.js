const {
  AppError,
  BadRequest,
  NotFound,
  Unauthorized,
} = require("../util/AppError");

const errorHandler = (error, req, res, next) => {
  console.log(error.message, "message");
  if (error instanceof AppError) {
    return res.status(error.getStatusCode()).json({ message: error.message });
  }

  if (error instanceof BadRequest) {
    console.log(error.message);
    return res.status(error.getStatusCode()).json({ message: error.message });
  }

  if (error instanceof NotFound) {
    console.log(error.message);
    return res.status(error.getStatusCode()).json({ message: error.message });
  }

  if (error instanceof Unauthorized) {
    console.log(error.message, "in error handler");
    return res.status(error.getStatusCode()).json({ message: error.message });
  }

  return res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;
