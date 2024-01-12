import { IController } from "./Domain/IController";
import { IWebScrapingRepository } from "./Domain/IWebScrapingRepository";

import { GetCardOffersUseCase } from "./Application/GetCardOffersUseCase";
import { GetCardOffersController } from "./Infrastructure/GetCardOffersController";
import { WebScrapingRepository } from "./Infrastructure/Repository/WebScrapingRepository";

const webScrapingRepository: IWebScrapingRepository = new WebScrapingRepository();
const getCardOffersUseCase: GetCardOffersUseCase = new GetCardOffersUseCase(webScrapingRepository);
const controller: IController = new GetCardOffersController(getCardOffersUseCase);

controller.execute();
