export interface IDateTimeServices { 
    getCurrentDate(): string;
    getDifferenceInHours(dateOne: Date, dateTwo: Date): number;
}
