const runExec = require("../../../run.exec")
const path = require('path')
const actionName = 'juejinSignin'
const script = async () => await runExec(path.join(__dirname, './task.json'))
module.exports = {
    script,
		actionName,
		isFunc: true,
		action: {
				name:  actionName,
				descript: '掘金签到。'
		},
    result: "掘金签到成功"
}