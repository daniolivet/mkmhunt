import { IController } from "./Domain/IController";
import { IWebScrapingRepository } from "./Domain/IWebScrapingRepository";

import { GetCardOffersUseCase } from "./Application/GetCardOffersUseCase";
import { GetCardOffersController } from "./Infrastructure/GetCardOffersController";
import { WebScrapingRepository } from "./Infrastructure/Repository/WebScrapingRepository";
import { ITelegramServices } from "./Domain/ITelegramServices";
import { TelegramServices } from "./Infrastructure/Services/TelegramServices";

const webScrapingRepository: IWebScrapingRepository = new WebScrapingRepository();
const telegramServices: ITelegramServices = new TelegramServices();
const getCardOffersUseCase: GetCardOffersUseCase = new GetCardOffersUseCase(
    webScrapingRepository,
    telegramServices
);
const controller: IController = new GetCardOffersController(getCardOffersUseCase);

controller.execute();
