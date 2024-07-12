
const openQQMusic = require('./open')
const playMusic = require('./play')
const actionsMap = {
    ...openQQMusic.actionMap,
    ...playMusic.actionMap,
}

function getActionsDescript() {
    let actionsDescript = ''
    for (const key in actionsMap) {
        const action = actionsMap[key]
        actionsDescript += `1、action:${action.name},description:${action.descript};`
    }
    return actionsDescript
}

module.exports = {
    actionsMap,
    actionsDescript: getActionsDescript(),
}