import dotenv from 'dotenv';
dotenv.config();

import { IController } from "./Domain/IController";
import { IWebScrapingRepository } from "./Domain/IWebScrapingRepository";

import { ITelegramServices } from "./Domain/ITelegramServices";

import { TelegramServices } from "./Infrastructure/Services/TelegramServices";

import { WebScrapingRepository } from "./Infrastructure/Repository/WebScrapingRepository";

import { GetCardOffersController } from "./Infrastructure/GetCardOffersController";
import { GetCardOffersUseCase } from "./Application/GetCardOffersUseCase";

// Services
const telegramServices: ITelegramServices = new TelegramServices();

// Repositories
const webScrapingRepository: IWebScrapingRepository = new WebScrapingRepository();

// Use cases
const getCardOffersUseCase: GetCardOffersUseCase = new GetCardOffersUseCase(
    webScrapingRepository,
    telegramServices
);
const controller: IController = new GetCardOffersController(getCardOffersUseCase);

controller.execute();
