const { exec } = require('child_process');
function runAppleScript(script) {
	return new Promise((resolve, reject) => {
		exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			} else if (stderr) {
				reject(stderr);
			} else {
				resolve(stdout);
			}
		});
	})
}
function runDelay(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	})
}
module.exports =  {
	runAppleScript,
	runDelay,
}