import { logEvents } from "./logger.js";

const errorHandler = (err, req, res, next) => {
  const logMsg = `${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\n\n`
  logEvents(logMsg, 'errLog.log')
  console.log(err.stack)

  const status = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)
  return res.status(status).json({message: err.message, isError: true})
}

export default errorHandler;