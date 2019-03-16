// API error handler
module.exports = function(err, req, res, next) {
  // set locals, only providing error in development
  const message = typeof err === 'string' ? err : err.message;
  res.locals.message = message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: message});
};
