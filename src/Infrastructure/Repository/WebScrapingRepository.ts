import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export class WebScrapingRepository {

    public async getData(url: string)
    {
        try {
            url = url.replace('/es/', '/en/');

            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.goto(url);

            let prices        = await this.getPrices(page);
            let lowestPrice   = Math.min(...prices.map(price => parseFloat(price))).toFixed(2);
            let cardLanguage  = await this.getCardLanguage(page);
            let sellerCountry = await this.getSellerCountry(page);

            console.log({
                prices: prices,
                lowestPrice: lowestPrice,
                cardLanguage: cardLanguage,
                sellerCountry: sellerCountry
            });

            await browser.close();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    private async getPrices(page: Page): Promise<string[]>
    {
        return await page.$$eval('#table .col-offer .price-container .fw-bold', nodes => nodes.map(n => n.textContent ? n.textContent.replace(/€|,/g, '.').trim() : ''));
    }

    private async getCardLanguage(page: Page): Promise<string[]>
    {
        return await page.$$eval('#table .col-sellerProductInfo .col-product .product-attributes > span[data-original-title] ', nodes => nodes.map(node => node.getAttribute('data-original-title') || ''));
    }

    private async getSellerCountry(page: Page): Promise<string[]>
    {
        return await page.$$eval('#table .col-sellerProductInfo .col-seller .seller-name > span[data-bs-original-title]', nodes => nodes.map(node => node.getAttribute('data-bs-original-title') || ''));
    }
}
