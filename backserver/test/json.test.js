let str =  "{'action': {'name': 'openQQMusic', 'args': {}}, 'thoughts': {'plan': ['1. 打开QQ音乐', '2. 播放音乐'], 'criticism': '', 'speak': '当前步骤，打开QQ音乐。', 'reasoning': ''}, 'observation': '目标为打开QQ音乐并播放，目前已完成打开QQ音乐的操作。'}"
// str = str.replace(/'/g, '"')
console.log(eval(str) )
console.log(JSON.parse(str))