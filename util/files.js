import fs from 'fs';

/**
 * Writes a file piping progresively
 * @param {string} filePath path of the file to be written
 * @param {NodeJS.ReadableStream} data file contents
 * @returns {Promise} a promise that resolves after the file has been written
 */
export function writeFile(filePath, data) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        writeStream.on('finish', resolve);
        data.on('error', reject);
        data.pipe(writeStream);
    });
}