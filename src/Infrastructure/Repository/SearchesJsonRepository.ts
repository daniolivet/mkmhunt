import JsonSearchesData from "../../../searches.json";
import { SearchesJson } from "../Types/SearchesJson.types";
import { ISearchesJsonRepository } from "../../Domain/ISearchesJsonRepository";
import { WriteJsonDataException } from "../../Domain/Exceptions/WriteJsonDataException";
import fs from 'fs';
import { ILoggerServices } from "../../Domain/ILoggerServices";

export class SearchesJsonRepository implements ISearchesJsonRepository {
    
    constructor(
        private readonly loggerServices: ILoggerServices
    ) {}

    /**
     * Get json data.
     * 
     * @returns any
     */
    public getJsonData(): any
    {
        return JsonSearchesData;
    }


    /**
     * Set data to searches.json.
     * 
     * @param json TargetCardData
     * @returns void
     */
    public setData(json: SearchesJson): void
    {
        try {
            fs.writeFile('searches.json', JSON.stringify(json, null, 2), (err) => {
                if (err) {
                    throw new WriteJsonDataException(err.message);
                }
            });
        } catch (error: any) {
            let err = error as Error;
            this.loggerServices.logError('Something went wrong: ' + err.message);
        }
    }
}
