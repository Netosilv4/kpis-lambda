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
