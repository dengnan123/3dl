export const loggerMiddleware = (req, res, next) => {
  console.log(`Request...1111`);
  next();
  console.log(`Request...222222`);
};
