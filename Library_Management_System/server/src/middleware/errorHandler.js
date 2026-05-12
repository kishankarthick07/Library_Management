export function notFound(req, res, next) {
  res.status(404);
  const err = new Error(`Not found — ${req.originalUrl}`);
  next(err);
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  } else {
    console.error(message);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
