
const openQQMusic = require('./open')
const playMusic = require('./play')
const searchMusic = require('./search')
const nextSong = require('./nextSong')
const previousSong = require('./previousSong')
const actionsMap = {
	[openQQMusic.actionName]: openQQMusic,
	[playMusic.actionName]: playMusic,
	[searchMusic.actionName]: searchMusic,
	[nextSong.actionName]: nextSong,
	[previousSong.actionName]: previousSong,
	finish:{
		action: {
			"name": "finish",
			"descript": "完成用户目标",
		},
		result: "完成用户目标"
	},
}

function getActionsDescript() {
    let actionsDescript = ''
		let index = 0
    for (const key in actionsMap) {
				index = index + 1
        const action = actionsMap[key].action
        actionsDescript += `${index}、action:"${action.name}",description:"${action.descript}";\n`
    }
    return actionsDescript
}

module.exports = {
    actionsMap,
    actionsDescript: getActionsDescript(),
}