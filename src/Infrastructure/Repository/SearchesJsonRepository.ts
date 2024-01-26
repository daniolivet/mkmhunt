import JsonSearchesData from "../../../searches.json";
import { SearchesJson } from "../Types/SearchesJson.types";
import { ISearchesJsonRepository } from "../../Domain/ISearchesJsonRepository";
import fs from 'fs';

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
    public setData(json: SearchesJson): void
    {
        fs.writeFile('searches.json', JSON.stringify(json, null, 2), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }
}
