import { ITelegramServices } from "../Domain/ITelegramServices";
import { IWebScrapingRepository } from "../Domain/IWebScrapingRepository";
import { ScrapingData } from "../Infrastructure/Types/WebScrapingRepository.type";
import {
    SearchesJson,
    TargetCardData
} from "../Infrastructure/Types/SearchesJson.types";
import fs from 'fs';

export class GetCardOffersUseCase {

    public constructor(
        private readonly webScrapingRepository: IWebScrapingRepository,
        private readonly telegramServices: ITelegramServices
    ){}

    public async execute(jsonData: SearchesJson): Promise<void>
    {   
        for( let card of jsonData.cards ){
            let scrapinData: ScrapingData = await this.webScrapingRepository.getData(card.url);
            let sellerCountryFilterIsActive = this.ensureFilterIsActive(card.url, 'sellerCountry');
            let languageFilterIsActive = this.ensureFilterIsActive(card.url, 'language');
            
            if ( !sellerCountryFilterIsActive && !languageFilterIsActive ) {
                this.getCardCoincidence(card, scrapinData);
                continue;
            }

            if ( parseFloat(scrapinData.lowestPrice) <= parseFloat(card.price) ) {
                this.telegramServices.sendMessage(this.telegramServices.getMessage(scrapinData, card.url, scrapinData.lowestPrice));
            }
        };
    }

    /**
     * Get card coincidence.
     * 
     * @param card 
     * @param scrapinData 
     * @returns boolean
     */
    private getCardCoincidence(card: TargetCardData, scrapinData: ScrapingData): void {
        const cardIndex = scrapinData.sellerCountry.findIndex((sellerCountry: string, index: number) => {
            return (
                sellerCountry === card.country &&
                scrapinData.cardLanguage[index] === card.language &&
                parseFloat(scrapinData.prices[index]) <= parseFloat(card.price)
            );
        });

        if (cardIndex !== -1) {
            this.telegramServices.sendMessage(this.telegramServices.getMessage(scrapinData, card.url, scrapinData.prices[cardIndex]));
        }
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
