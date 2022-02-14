const winston = require('winston');
 
const logger = winston.createLogger({
    level: 'info',
    exitOnError: false,
    format: winston.format.combine(winston.format.timestamp({format:'DD-MM-YYYY-hh-mm-ss'}),winston.format.json()),
    transports: [
      new winston.transports.File({ filename: `./logs/testAuthMS.log` }),
      new winston.transports.Console()
    ],
  });

exports.logger=logger