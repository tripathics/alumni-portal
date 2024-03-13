/**
 * Error handler middleware
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 */
function errorHandler(err, req, res) {
  console.error(err);
  let statusCode = 500;
  let message = 'An error occured';
  if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('email')) {
    statusCode = 400;
    message = 'Email already exists';
  }
  if (err.message.includes('Invalid API usage')) {
    statusCode = 400;
    message = err.message;
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size too large';
  }

  res.status(statusCode).json({ message, success: false });
}

export default errorHandler;
