const readline = require('readline');

function runTerminal(callBack) {
    // 终端输入
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
    });

    rl.prompt();

    // 监听输入
    rl.on('line', async (line) => {
        if (line.trim() === 'exit') {
            rl.close();
        } else {
            typeof callBack === 'function' &&  await callBack(line)
            rl.prompt();
        }
    }).on('close', () => {
        process.exit(0);
    });
}

module.exports = runTerminal
