import { TargetCardData } from "../Infrastructure/Types/SearchesJson.types"

export interface ISearchesJsonRepository { 
    getJsonData(): any
    setData(json: TargetCardData): void
}
