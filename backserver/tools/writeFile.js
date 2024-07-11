const fs = require('fs');
/**
 * 将数据写入文件
 * @param {string} path 文件路径
 * @param {string} data 文件数据
 * @returns {Promise<void>}
 */
const writeFile = async (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = writeFile