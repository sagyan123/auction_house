const errorHandler = (err, req, res, next) => {
  let errorArray;
  if (err.message.match(/^(\d{3}):/)) errorArray = err.message.split(": ");

  const statusCode = errorArray ? Number(errorArray[0]) : 500;
  const message = errorArray ? errorArray[1] : err.message;

  res.status(statusCode);
  res.json({ message });
  next();
};

module.exports = errorHandler;
