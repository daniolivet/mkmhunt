export class TelegramChatIdException extends Error {
    constructor() {
        super('Chat ID is missing. Set up in .env file.');
        this.name = 'Telegram Services RunTimeException';
    }
}
