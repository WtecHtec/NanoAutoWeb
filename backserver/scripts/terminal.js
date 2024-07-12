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
    rl.on('line', (line) => {
        if (line.trim() === 'exit') {
            rl.close();
        } else {
            console.log(line);
            typeof callBack === 'function' && callBack(line)
            rl.prompt();
        }
    }).on('close', () => {
        process.exit(0);
    });
}

module.exports = runTerminal
