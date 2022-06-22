/**
 * Date string to append to filenames
 * @param {Date} date 
 * @returns {string}
 */
export function fileDate(date) {
    if(!date) date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${date.getFullYear()}${month}${date.getDate()}${hours}${minutes}${seconds}`;
}