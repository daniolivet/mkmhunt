import TelegramBot from 'node-telegram-bot-api';

import { ITelegramServices } from "../../Domain/ITelegramServices";

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
}
