import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {

    if (message.startsWith('SQL: ')) message = message.replace('Executing (default): ', '');

    return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        customFormat
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                customFormat
            )
        }),
    ],
});

export default logger;
