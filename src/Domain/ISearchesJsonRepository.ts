import { SearchesJson } from "../Infrastructure/Types/SearchesJson.types"

export interface ISearchesJsonRepository { 
    getJsonData(): any
    setData(json: SearchesJson): void
}
