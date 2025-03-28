export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
  
  class ErrorHandler extends Error {
    constructor(message, statusCode) {
      super(message);
      this.message = message;
      this.statusCode = statusCode;
      this.statusCode = statusCode;
    }
  }
  
  export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
  
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid, Try again!`;
      err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is expired, Try again!`;
      err = new ErrorHandler(message, 400);
    }
    if (err.name === "CastError") {
      const message = `Invalid ${err.path}`,
        err = new ErrorHandler(message, 400);
    }
  
    const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message)
          .join(" ")
      : err.message;
  
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  export default ErrorHandler;

  //DATABASE_URL = "mongodb+srv://surunderkumar192002:PdezTW4Aj06YRrIG@authapp-2025.jegcl.mongodb.net/"
  //"mongodb+srv://surunderkumar192002:PdezTW4Aj06YRrIG@authapp-2025.jegcl.mongodb.net/?retryWrites=true&w=majority&appName=AuthApp-2025"