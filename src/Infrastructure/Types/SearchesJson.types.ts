export type TargetCardData = {
    url: string;
    language: string;
    country: string;
    price: string
}

export type SearchesJson = {
    active: boolean;
    cards: ReadonlyArray<TargetCardData>;
}
