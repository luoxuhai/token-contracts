/**
 * Error handler middleware
 *
 * @param   {Object}    ctx       Koa context
 * @param   {function}  next      Koa next function
 * @returns {void}
 */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.log.error(err.message);
    ctx.status = err.status || 500;
    ctx.body = {
      error: err.message,
    };
  }
};
