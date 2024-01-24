import TelegramBot from 'node-telegram-bot-api';

import { ITelegramServices } from "../../Domain/ITelegramServices";
import { ScrapingData } from '../Types/WebScrapingRepository.type';

export class TelegramServices implements ITelegramServices {

    private readonly botId: string;
    private readonly chatId: string;
    private readonly telegramBot: TelegramBot;

    public constructor() {
        this.botId = process.env.TL_BOT_ID || '';
        this.chatId = process.env.TL_CHAT_ID || '';
        
        if ( this.botId !== '' ) {
            this.telegramBot = new TelegramBot(this.botId);
        }
    }

    /**
     * Send message to Telegram chat.
     * 
     * @param msg 
     */
    public sendMessage(msg: string): void {
        this.telegramBot.sendMessage(this.chatId, msg);
    }

    /**
     * Get message for Telegram.
     * 
     * @param data 
     * @param url 
     * @returns string
     */
    public getMessage(data: ScrapingData, url: string, price: string = ''): string {
        let lowestPriceCardInfo: string = 'Lowest price card: \n\n - Price: ' + data.lowestPrice + '€\n - Language: ' + data.cardLanguage[0] + '\n - Country: ' + data.sellerCountry[0];
        let myResearch: string = 'A card was founded with the price you were looking for. \n Price founded: ' + price + ' €. \n\n Check it out: ' + url;

        return lowestPriceCardInfo + '\n\n' + myResearch;
    }
}
