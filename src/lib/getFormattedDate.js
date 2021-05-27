export function getFormattedDate(date) {
    var unformatteddate = new Date(date);
    var month = unformatteddate.getMonth() + 1
    var day = unformatteddate.getDate()
    var year = unformatteddate.getFullYear()
    return day + "/" + month + "/" + year;
}