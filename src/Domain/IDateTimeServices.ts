export interface IDateTimeServices { 
    getCurrentDate(): Date;
    getDifferenceInHours(dateOne: Date, dateTwo: Date): number;
}
