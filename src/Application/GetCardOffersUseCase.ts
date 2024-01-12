import { IWebScrapingRepository } from "../Domain/IWebScrapingRepository";

export class GetCardOffersUseCase {

    public constructor(
        private readonly webScrapingRepository: IWebScrapingRepository
    ){}

    public async execute(): Promise<any>
    {
        const info = await this.webScrapingRepository.getData('https://www.cardmarket.com/es/Magic/Products/Singles/The-Lord-of-the-Rings-Tales-of-Middle-earth-Extras/The-One-Ring-V2');
        console.log(info);
    }
}
