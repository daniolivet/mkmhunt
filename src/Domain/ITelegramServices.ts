import { ScrapingData } from "../Infrastructure/Types/WebScrapingRepository.type";

export interface ITelegramServices {
    sendMessage(msg: string): void;
    getMessage(data: ScrapingData, url: string, price: string): string
}
