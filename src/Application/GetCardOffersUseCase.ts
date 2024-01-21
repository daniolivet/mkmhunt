import { ITelegramServices } from "../Domain/ITelegramServices";
import { IWebScrapingRepository } from "../Domain/IWebScrapingRepository";

export class GetCardOffersUseCase {

    public constructor(
        private readonly webScrapingRepository: IWebScrapingRepository,
        private readonly telegramServices: ITelegramServices
    ){}

    public async execute(): Promise<any>
    {
        let data = await this.webScrapingRepository.getData('https://www.cardmarket.com/es/Magic/Products/Singles/The-Lord-of-the-Rings-Tales-of-Middle-earth-Extras/The-One-Ring-V2');
        // let targetCardLanguage: string = 'English';
        // let targetSellerCountry: string = 'Spain';
        let lowestPriceCardInfo: string = 'Lowest price card: \n\n - Price: ' + data.lowestPrice + '€\n - Language: ' + data.cardLanguage[0] + '\n - Country: ' + data.sellerCountry[0];
        let myResearch: string = 'My research: \n\n - Language: ' + data.cardLanguage + '\n - Country: ' + data.sellerCountry;
        let message: string = lowestPriceCardInfo;
        


        this.telegramServices.sendMessage(message);

        
        

    }
}
