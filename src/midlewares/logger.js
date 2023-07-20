import chalk from "chalk";

// @middleware logger
export function requestLogger(req, res, next) {
  console.log(chalk.yellow(req.method) + ` : ${req.url}`);
  next();
}
