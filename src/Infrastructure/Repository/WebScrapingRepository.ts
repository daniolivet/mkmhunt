import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import { ScrapingData } from '../Types/WebScrapingRepository.type';
import { IWebScrapingRepository } from '../../Domain/IWebScrapingRepository';

puppeteer.use(StealthPlugin());

export class WebScrapingRepository implements IWebScrapingRepository {

    /**
     * Get data from the web page doing Scraping method.
     * 
     * @param url string
     * @returns Promise<ScrapingData>
     */
    public async getData(url: string): Promise<ScrapingData>
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

            await browser.close();

            return {
                prices: prices,
                lowestPrice: lowestPrice,
                cardLanguage: cardLanguage,
                sellerCountry: sellerCountry
            };

        } catch (error) {
            console.error('Error:', error);
            return Promise.reject(error);
        }
    }

    /**
     * Get prices of all offers.
     * 
     * @param page Page
     * @returns Promise<string[]>
     */
    private async getPrices(page: Page): Promise<string[]>
    {
        return await page.$$eval('#table .col-offer .price-container .fw-bold', nodes => nodes.map(n => n.textContent ? n.textContent.replace(",", ".").replace(" €", "").trim() : ''));
    }

    /**
     * Get the language of the card. Excluding Playset and Foil from the list.
     *
     * @param page Page
     * @returns Promise<string[]>
     */
    private async getCardLanguage(page: Page): Promise<string[]>
    {
        const target: string = '#table .col-sellerProductInfo .col-product .product-attributes > span[data-original-title]';
        let cardData: Array<string> = await page.$$eval(target, nodes => nodes.map(node => node.getAttribute('data-original-title') || ''));

        return cardData.filter(value => value !== 'Playset' && value !== 'Foil');
    }

    /**
     * Get seller country.
     * 
     * @param page Page
     * @returns Promise<string[]>
     */
    private async getSellerCountry(page: Page): Promise<string[]>
    {
        const target: string = '#table .col-sellerProductInfo .col-seller .seller-name > span[data-bs-original-title]';
        let sellerData = await page.$$eval(target, nodes => nodes.map(node => node.getAttribute('data-bs-original-title') || ''));

        return sellerData
                .filter(value => value.includes("Item location:"))
                .map(value => value.replace('Item location: ', ''));
    }
}
