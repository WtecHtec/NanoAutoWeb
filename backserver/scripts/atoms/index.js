const qqmusicAtoms = require('./qqmusic')
const themeAtoms = require('./theme')
const baseAtoms = require('./base')
const vscodeAtoms = require('./vscode')
const juejinAtoms = require('./juejin')
const actionsMap = Object.assign(
	baseAtoms.actionsMap,
	themeAtoms.actionsMap,
	qqmusicAtoms.actionsMap,
	vscodeAtoms.actionsMap,
	juejinAtoms.actionsMap)

function getActionsDescript() {
	let actionsDescript = ''
	let index = 0
	for (const key in actionsMap) {
		index = index + 1
		const action = actionsMap[key].action
		actionsDescript += `action: ${action.name}, descript:${action.descript}`
		actionsDescript += action.args ? `,args:${JSON.stringify(action.args)};\n` : ';\n'
	}
	return actionsDescript
}
module.exports = {
	actionsMap,
	actionsDescript: getActionsDescript(),
}