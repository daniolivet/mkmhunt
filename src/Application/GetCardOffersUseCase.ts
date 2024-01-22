import { ITelegramServices } from "../Domain/ITelegramServices";
import { IWebScrapingRepository } from "../Domain/IWebScrapingRepository";
import { ScrapingData } from "../Infrastructure/Types/WebScrapingRepository.type";
import {
    SearchesJson,
    TargetCardData
} from "../Infrastructure/Types/SearchesJson.types";

export class GetCardOffersUseCase {

    public constructor(
        private readonly webScrapingRepository: IWebScrapingRepository,
        private readonly telegramServices: ITelegramServices
    ){}

    public async execute(jsonData: SearchesJson): Promise<void>
    {
        if ( !jsonData.active ) {
            return;
        }
        
        for( let card of jsonData.cards ){
            let scrapinData: ScrapingData = await this.webScrapingRepository.getData(card.url);
            let sellerCountryFilterIsActive = this.ensureFilterIsActive(card.url, 'sellerCountry');
            let languageFilterIsActive = this.ensureFilterIsActive(card.url, 'language');
            
            if ( !sellerCountryFilterIsActive && !languageFilterIsActive ) {
                this.getCardCoincidence(card, scrapinData);
                continue;
            }

            if ( parseFloat(scrapinData.lowestPrice) <= parseFloat(card.price) ) {
                this.telegramServices.sendMessage(this.getMessage(scrapinData, card.url, scrapinData.lowestPrice));
                continue;
            }

            this.telegramServices.sendMessage('No card found with the price you were looking for. \n Check it out: ' + card.url);
        };
    }

    /**
     * Get card coincidence.
     * 
     * @param card 
     * @param scrapinData 
     * @returns boolean
     */
    private getCardCoincidence(card: TargetCardData, scrapinData: ScrapingData): boolean {
        const cardIndex = scrapinData.sellerCountry.findIndex((sellerCountry: string, index: number) => {
            return (
                sellerCountry === card.country &&
                scrapinData.cardLanguage[index] === card.language &&
                parseFloat(scrapinData.prices[index]) <= parseFloat(card.price)
            );
        });

        if (cardIndex !== -1) {
            this.telegramServices.sendMessage(this.getMessage(scrapinData, card.url, scrapinData.prices[cardIndex]));
            return true;
        }

        this.telegramServices.sendMessage('No card found with the price you were looking for. \n Check it out: ' + card.url);
        return false;
    }

    /**
     * Get message for Telegram.
     * 
     * @param data 
     * @param url 
     * @returns string
     */
    private getMessage(data: ScrapingData, url: string, price: string = ''): string
    {
        let lowestPriceCardInfo: string = 'Lowest price card: \n\n - Price: ' + data.lowestPrice + '€\n - Language: ' + data.cardLanguage[0] + '\n - Country: ' + data.sellerCountry[0];
        let myResearch: string = 'A card was founded with the price you were looking for. \n Price founded => '+ price +'€. \n Check it out: ' + url;

        return lowestPriceCardInfo + '\n\n' + myResearch;
    }

    /**
     * Check if the filter is active.
     * 
     * @param url 
     * @param filterName 
     * @returns boolean
     */
    private ensureFilterIsActive(url: string, filterName: string): boolean {
        const urlObj: URL = new URL(url);

        return urlObj.searchParams.has(filterName);
    }
}
