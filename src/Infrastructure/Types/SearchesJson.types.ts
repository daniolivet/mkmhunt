export type TargetCardData = {
    url: string;
    language: string;
    country: string;
    price: string,
    updated?: string
}

export type SearchesJson = {
    cards: ReadonlyArray<TargetCardData>;
}
