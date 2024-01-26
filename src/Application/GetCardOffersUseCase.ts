import { ITelegramServices } from "../Domain/ITelegramServices";
import { IWebScrapingRepository } from "../Domain/IWebScrapingRepository";
import { ScrapingData } from "../Infrastructure/Types/WebScrapingRepository.type";
import {
    TargetCardData
} from "../Infrastructure/Types/SearchesJson.types";
import { ISearchesJsonRepository } from "../Domain/ISearchesJsonRepository";
import { IDateTimeServices } from "../Domain/IDateTimeServices";

export class GetCardOffersUseCase {

    public constructor(
        private readonly webScrapingRepository: IWebScrapingRepository,
        private readonly searcherJsonRepository: ISearchesJsonRepository,
        private readonly telegramServices: ITelegramServices,
        private readonly dateTimeServices: IDateTimeServices
    ){}

    public async execute(): Promise<void>
    {   
        let currentDate = this.dateTimeServices.getCurrentDate();
        let jsonData = this.searcherJsonRepository.getJsonData();
        
        for( let card of jsonData.cards ){
            let scrapinData: ScrapingData = await this.webScrapingRepository.getData(card.url);
            let sellerCountryFilterIsActive = this.ensureFilterIsActive(card.url, 'sellerCountry');
            let languageFilterIsActive = this.ensureFilterIsActive(card.url, 'language');
            jsonData.updated = currentDate;

            if ( !sellerCountryFilterIsActive && !languageFilterIsActive ) {
                this.getCardCoincidence(card, scrapinData);
                this.searcherJsonRepository.setData(jsonData);
                continue;
            }

            if ( parseFloat(scrapinData.lowestPrice) <= parseFloat(card.price) ) {
                this.telegramServices.sendMessage(this.telegramServices.getMessage(scrapinData, card.url, scrapinData.lowestPrice));
                this.searcherJsonRepository.setData(jsonData);
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
