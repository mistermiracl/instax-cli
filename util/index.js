/**
 * Time string representation for various uses
 * @param {Date} date 
 * @returns {string}
 */
export function datetimerepr(date) {
    const datePart = daterepr(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${datePart}${hours}${minutes}${seconds}`;
}

export function daterepr(date) {
    if(!date) date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${date.getFullYear()}${month}${date.getDate()}`;
}

export function filenameFromUrl(url, extension = true) {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1].split('?')[0];
    return extension ? filename : filename.split('.')[0];
}

export function extensionFromMIME(mime) {
    return mime.split('/')[1];
}