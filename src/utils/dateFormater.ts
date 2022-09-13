import moment, { Moment } from "moment";

export const mmDDYYYY = (ddMMYYYY: string) => {
    if (!validateDate(ddMMYYYY)) {
        return null;
    }
    const [day, month, year] = ddMMYYYY.split("/");
    return new Date(`${year}-${month}-${day}`);
}

export const validateDate = (date: string) => {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return dateRegex.test(date);
}

export const isBetweenMonth = (date: Date, month: Moment,) => {
    return moment(date).isAfter(month.startOf("month")) && moment(date).isBefore(month.endOf("month"));
}