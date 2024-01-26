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

    public constructor(
        private readonly webScrapingRepository: IWebScrapingRepository,
        private readonly searcherJsonRepository: ISearchesJsonRepository,
        private readonly telegramServices: ITelegramServices,
        private readonly dateTimeServices: IDateTimeServices
    ){}

    public async execute(): Promise<void>
    {   
        let currentDate: Date = this.dateTimeServices.getCurrentDate();
        let jsonData: SearchesJson = this.searcherJsonRepository.getJsonData();
        
        for( let card of jsonData.cards ){
            let scrapinData: ScrapingData = await this.webScrapingRepository.getData(card.url);
            let sellerCountryFilterIsActive: boolean = this.ensureFilterIsActive(card.url, 'sellerCountry');
            let languageFilterIsActive: boolean = this.ensureFilterIsActive(card.url, 'language');

            if (!card.updated) {
                card.updated = currentDate.toISOString();
                this.searcherJsonRepository.setData(jsonData);
            }
            let hoursDiff: number = this.dateTimeServices.getDifferenceInHours(currentDate, new Date(card.updated));

            if ( !sellerCountryFilterIsActive && !languageFilterIsActive ) {
                let coincidence: number = this.getCardCoincidence(card, scrapinData);

                if (hoursDiff > 5 && coincidence !== -1) {
                    card.updated = currentDate.toISOString();
                    this.searcherJsonRepository.setData(jsonData);
                    this.telegramServices.sendMessage(this.telegramServices.getMessage(scrapinData, card.url, scrapinData.prices[coincidence]));
                }
                continue;
            }

            if (parseFloat(scrapinData.lowestPrice) <= parseFloat(card.price) && hoursDiff > 5 ) {
                card.updated = currentDate.toISOString();
                this.searcherJsonRepository.setData(jsonData);
                this.telegramServices.sendMessage(this.telegramServices.getMessage(scrapinData, card.url, scrapinData.lowestPrice));
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
    private getCardCoincidence(card: TargetCardData, scrapinData: ScrapingData): number {
        const cardIndex = scrapinData.sellerCountry.findIndex((sellerCountry: string, index: number) => {
            return (
                sellerCountry === card.country &&
                scrapinData.cardLanguage[index] === card.language &&
                parseFloat(scrapinData.prices[index]) <= parseFloat(card.price)
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
}
