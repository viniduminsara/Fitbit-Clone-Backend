import express from 'express';
const app = express();
import dotenv from 'dotenv';
// Set up environment variables before loading the rest of the app
dotenv.config();

import { NodeProcessEvents } from './shared/enums/events/node-process-events.enum';
import { exceptionLogWrapper } from './shared/helpers/exception-log-wrapper.helper';
import { ErrorMessages } from './shared/enums/messages/error-messages.enum';
import cors from "cors";
import mongoose from "mongoose";
import {Express, Request, Response} from 'express';
import responseInterceptor from "./shared/middlewares/response-interceptor";
import UsersRouter from './controllers/user.controller';
import MetricsController from "./controllers/metrics.controller";
import ActivityController from "./controllers/activity.controller";
import {exceptionHandler} from './shared/middlewares/exception-handling.middleware';
import {pageNotFoundExceptionHandler} from './shared/middlewares/page-not-found-exception-handler.middleware';
import {cliLoggerService} from "./services/logger/cli-logger.service";
import {InfoMessages} from "./shared/enums/messages/info-messages.enum";
import {SpecialMessages} from "./shared/enums/messages/special-messages.enum";

process.on(NodeProcessEvents.UncaughtException, (error: unknown) => {
  exceptionLogWrapper(error, ErrorMessages.UncaughtException);
  process.exit(1);
});

process.on(NodeProcessEvents.UnhandledRejection, (error: unknown) => {
  exceptionLogWrapper(error, ErrorMessages.UnhandledRejection);
  process.exit(1);
});

// Apply middlewares
app.use(cors());
app.use(express.json());

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/fitbit-clone').then(() => {
  cliLoggerService.info(InfoMessages.DatabasesConnected);
  cliLoggerService.info(SpecialMessages.DottedLine);
});

// Set up routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Fitbit-Clone-Backend');
});

app.use(responseInterceptor);
app.use('/api/v1/users', UsersRouter);
app.use('/api/v1/metrics', MetricsController);
app.use('/api/v1/activity', ActivityController);

// Handle 404 and exceptions
app.use('*', pageNotFoundExceptionHandler);
app.use(exceptionHandler);

const PORT = Number(process.env.PORT) || 80;

app.listen(PORT, () => {
  cliLoggerService.info(`Server started on port ${PORT}`);
})

// Export the configured app
export default app;
