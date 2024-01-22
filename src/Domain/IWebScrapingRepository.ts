import { ScrapingData } from "../Infrastructure/Types/WebScrapingRepository.type";

export interface IWebScrapingRepository {

    getData(url: string): Promise<ScrapingData>;

}
