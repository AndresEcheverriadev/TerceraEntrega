import winston, { format } from "winston";
import fs from 'fs';
import path from "path";

const logDir = 'logs'; 
if ( !fs.existsSync( logDir ) ) {
    fs.mkdirSync( logDir );
}

export const WarnLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: format.combine(format.simple()),
    }),
    new winston.transports.File({ level: "warn", filename:path.join(logDir, '/warn.log')}),
  ],
});

export const logger = () => (req, res, next) => {
  req.logger = WarnLogger;
  next();
};

export const ErrorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: format.combine(format.simple()),
    }),
    new winston.transports.File({ level: "error",filename:path.join(logDir, '/error.log') }),
  ],
});
