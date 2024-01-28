import dotenv from 'dotenv';
dotenv.config();

import { IController } from "./Domain/IController";
import { IWebScrapingRepository } from "./Domain/IWebScrapingRepository";

import { ITelegramServices } from "./Domain/ITelegramServices";

import { TelegramServices } from "./Infrastructure/Services/TelegramServices";

import { WebScrapingRepository } from "./Infrastructure/Repository/WebScrapingRepository";

import { GetCardOffersController } from "./Infrastructure/GetCardOffersController";
import { GetCardOffersUseCase } from "./Application/GetCardOffersUseCase";
import { SearchesJsonRepository } from './Infrastructure/Repository/SearchesJsonRepository';
import { ISearchesJsonRepository } from './Domain/ISearchesJsonRepository';
import { DateTimeServices } from './Infrastructure/Services/DateTimeServices';
import { IDateTimeServices } from './Domain/IDateTimeServices';
import { ILoggerServices } from './Domain/ILoggerServices';
import { LoggerServices } from './Infrastructure/Services/LoggerServices';

const loggerServices: ILoggerServices = new LoggerServices();

try {

    // Services
    const telegramServices: ITelegramServices = new TelegramServices();
    const dateTimeServices: IDateTimeServices = new DateTimeServices();

    // Repositories
    const webScrapingRepository: IWebScrapingRepository = new WebScrapingRepository();
    const searchesJsonRepository: ISearchesJsonRepository = new SearchesJsonRepository();

    // Use cases
    const getCardOffersUseCase: GetCardOffersUseCase = new GetCardOffersUseCase(
        webScrapingRepository,
        searchesJsonRepository,
        telegramServices,
        dateTimeServices,
        loggerServices
    );
    const controller: IController = new GetCardOffersController(getCardOffersUseCase);

    controller.execute();

} catch (error: any) {
    let err = error as Error;
    loggerServices.logError('Something went wrong: ' + err.message);
}
