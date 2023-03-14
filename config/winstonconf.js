import winstonLogger from "winston";
import { winstonLoggerFilePath } from "../components/constants";

// Create logger instance with custom logging transports
winstonLogger.createLogger({
	level: 'info',
	transports: [
		new winstonLogger.transports.Console({
			format: winstonLogger.format.combine(
				winstonLogger.format.colorize(),
				winstonLogger.format.json()
			)
		}),
		new winstonLogger.transports.File(winstonLoggerFilePath),
	],
});

// Add the most used transport
winstonLogger.add(winstonLogger.transports.File(winstonLoggerFilePath));