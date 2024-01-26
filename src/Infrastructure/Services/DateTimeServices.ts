import { IDateTimeServices } from "../../Domain/IDateTimeServices";

export class DateTimeServices implements IDateTimeServices {

    /**
     * Get current date.
     * 
     * @returns string
     */
    public getCurrentDate(): Date {
        return new Date();
    }
    /**
     * Get difference in hours.
     * 
     * @param dateOne 
     * @param dateTwo 
     * @returns number
     */
    public getDifferenceInHours(dateOne: Date, dateTwo: Date): number {
        const diffInMs = Math.abs(dateTwo.getTime() - dateOne.getTime());
        return diffInMs / (1000 * 60 * 60);
    }
}
