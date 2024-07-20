const USER_DATA_DIR =  '/Users/shenruqi/Desktop/Code/wtechtec/electron-jest/jest-electron-vite/dist/userData'
const { exec } = require('child_process');
module.exports = (filepath) => {
	return new Promise((resolve,) => {
		exec('flow-stage --filepath ' + filepath + ' --userDataDir ' + USER_DATA_DIR, (error, stdout, stderr) => {  
			if (error) {  
				console.error(`exec error: ${error}`); 
				resolve(); 
				return;
			}
			console.log(`stdout: ${stdout}`);  
			if (stderr) {
				console.error(`stderr: ${stderr}`); 
			}
			resolve();
		})
	})
}
