
export interface IWebScrapingRepository {

    getData(url: string): Promise<any>;

}
