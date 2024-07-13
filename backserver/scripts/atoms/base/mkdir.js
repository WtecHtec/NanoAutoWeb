const fs = require('fs')
const path = require('path')

const actionName = 'mkdir'
const mkdir = ({ dirpath }) => {
	const absPath = path.resolve(dirpath)
	try {
		fs.mkdirSync(absPath)
	} catch (err) {
		console.log(err)
	}
	return absPath
}


module.exports = {
	script: mkdir,
	isFunc: true,
	actionName,
	action: {
			name:  actionName,
			descript: '创建一个文件夹。并且返回一个绝对路径',
			args: [
					{
						"name": "dirpath",
						"type": "string",
						"description": "文件夹路径"
				}
			]
	},
	result: "创建一个文件夹成功"
}
