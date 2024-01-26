import { ITelegramServices } from "../Domain/ITelegramServices";
import { IDateTimeServices } from "../Domain/IDateTimeServices";
import { IWebScrapingRepository } from "../Domain/IWebScrapingRepository";
import { ISearchesJsonRepository } from "../Domain/ISearchesJsonRepository";
import {
    SearchesJson,
    TargetCardData
} from "../Infrastructure/Types/SearchesJson.types";
import { ScrapingData } from "../Infrastructure/Types/WebScrapingRepository.type";

export class GetCardOffersUseCase {

    private scrapingData: ScrapingData;

    public constructor(
        private readonly webScrapingRepository: IWebScrapingRepository,
        private readonly searcherJsonRepository: ISearchesJsonRepository,
        private readonly telegramServices: ITelegramServices,
        private readonly dateTimeServices: IDateTimeServices
    ){}

    public async execute(): Promise<void>
    {   
        let jsonData: SearchesJson = this.searcherJsonRepository.getJsonData();
        
        for( let card of jsonData.cards ){
            this.scrapingData = await this.webScrapingRepository.getData(card.url);
            let sellerCountryFilterIsActive: boolean = this.ensureFilterIsActive(card.url, 'sellerCountry');
            let languageFilterIsActive: boolean = this.ensureFilterIsActive(card.url, 'language');

            if (!card.updated) {
                card.updated = this.dateTimeServices.getCurrentDate().toISOString();
                this.searcherJsonRepository.setData(jsonData);
            }
            let hoursDiff: number = this.dateTimeServices.getDifferenceInHours(this.dateTimeServices.getCurrentDate(), new Date(card.updated));

            if ( !sellerCountryFilterIsActive && !languageFilterIsActive ) {
                let coincidence: number = this.getCardCoincidence(card);

                if (hoursDiff > 2 && coincidence !== -1) {
                    this.sendCoincidenceMessage(card, jsonData, this.scrapingData.prices[coincidence]);
                }
                continue;
            }

            if (parseFloat(this.scrapingData.lowestPrice) <= parseFloat(card.price) && hoursDiff > 2) {
                this.sendCoincidenceMessage(card, jsonData, this.scrapingData.lowestPrice);
            }
        };
    }

    /**
     * Get card coincidence.
     * 
     * @param card 
     * @param scrapinData 
     * @returns number
     */
    private getCardCoincidence(card: TargetCardData): number {
        const cardIndex = this.scrapingData.sellerCountry.findIndex((sellerCountry: string, index: number) => {
            return (
                sellerCountry === card.country &&
                this.scrapingData.cardLanguage[index] === card.language &&
                parseFloat(this.scrapingData.prices[index]) <= parseFloat(card.price)
            );
        });

        return cardIndex;
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

    /**
     * Send a message when a coincidence is found.
     * 
     * @param card 
     * @param jsonData 
     * @param prices 
     */
    private sendCoincidenceMessage(card: TargetCardData, jsonData: SearchesJson, prices: string): void { 
        card.updated = this.dateTimeServices.getCurrentDate().toISOString();
        this.searcherJsonRepository.setData(jsonData);
        this.telegramServices.sendMessage(this.telegramServices.getMessage(this.scrapingData, card.url, prices));
    }
}
