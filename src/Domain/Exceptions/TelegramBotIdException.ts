export class TelegramBotIdException extends Error {
    constructor() {
        super('Bot ID is missing. Set up in .env file.');
        this.name = 'Telegram Services RunTimeException';
    }
}
