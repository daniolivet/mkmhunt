import { Logger, createLogger, format, transports } from 'winston';
import { ILoggerServices } from '../../Domain/ILoggerServices';

export class LoggerServices implements ILoggerServices {

    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.errors({ stack: true }),
                format.splat(),
                format.json()
            ),
            transports: [
                new transports.File({ filename: 'logs/error.log', level: 'error' }),
                new transports.File({ filename: 'logs/info.log', level: 'info' }),
            ]
        });
    }

    /**
     * Log a message with info level
     * 
     * @param message 
     * @returns void
     */
    public logInfo(message: string): void {
        this.logger.info(message);
    }

    /**
     * Log a message with error level
     * 
     * @param message 
     * @returns void
     */
    public logError(message: string): void {
        this.logger.error(message);
    }
}
