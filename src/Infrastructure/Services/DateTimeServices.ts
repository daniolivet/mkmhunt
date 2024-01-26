import { IDateTimeServices } from "../../Domain/IDateTimeServices";

export class DateTimeServices implements IDateTimeServices {

    /**
     * Get current date.
     * 
     * @returns string
     */
    public getCurrentDate(): string {
        const currentDateTime = new Date();
        const currentMonth = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
        const currentDate = currentDateTime.getDate().toString().padStart(2, '0');
        const currentHour = currentDateTime.getHours().toString().padStart(2, '0');
        const currentMinutes = currentDateTime.getMinutes().toString().padStart(2, '0');

        return `${currentDateTime.getFullYear()}-${currentMonth}-${currentDate} ${currentHour}:${currentMinutes}`;
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
