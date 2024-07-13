const fs = require('fs')
const path = require('path')

const actionName = 'writeFile'

const writeFile = ({ filepath, data }) => {
	const absPath = path.resolve(filepath)
	fs.writeFileSync(absPath, data)
	return absPath
}


module.exports = {
	script: writeFile,
	isFunc: true,
	actionName,
	action: {
			name:  actionName,
			descript: '将大模型数据写入文件。并且返回一个绝对路径',
			args: [
					{
						"name": "filepath",
						"type": "string",
						"description": "文件路径"
					},
					{
						"name": "data",
						"type": "string",
						"description": "数据"
					}
			]
	},
	result: "大模型数据写入文件成功"
}
