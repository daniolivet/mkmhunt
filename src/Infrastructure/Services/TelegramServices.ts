import TelegramBot from 'node-telegram-bot-api';

import { ITelegramServices } from "../../Domain/ITelegramServices";

export class TelegramServices implements ITelegramServices {

    private readonly botId: string;
    private readonly chatId: string;
    private readonly telegramBot: TelegramBot;

    public constructor() {
        this.botId = '6854946694:AAG2qVjdy4ryl7gd_X4Vu2AE0fiM-qOd5cM';
        this.chatId = '457793421';
        if ( this.botId !== '' ) {
            this.telegramBot = new TelegramBot(this.botId);
        }
    }

    public sendMessage( msg: string ): void {
        this.telegramBot.on('message', (msg: TelegramBot.Message) => {
            const chatId = msg.chat.id;
            console.log(chatId);
        });
        this.telegramBot.sendMessage(this.chatId, msg);
    }
}
