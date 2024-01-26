import JsonSearchesData from "../../../searches.json";
import { ISearchesJsonRepository } from "../../Domain/ISearchesJsonRepository";
import fs from 'fs';
import { TargetCardData } from "../Types/SearchesJson.types";

export class SearchesJsonRepository implements ISearchesJsonRepository {
    
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
    public setData(json: TargetCardData): void
    {
        fs.writeFile('searches.json', JSON.stringify(json, null, 2), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }
}
