
const openVsCode = require('./openVsCode')
const openCodeToVscode = require('./openCodeToVscode')
const actionsMap = {
	[openVsCode.actionName]: openVsCode,
	[openCodeToVscode.actionName]: openCodeToVscode,
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