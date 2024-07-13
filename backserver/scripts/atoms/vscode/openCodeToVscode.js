
const actionName = 'openCodeToVscode'
const script = ({codePath}) => `-- 显示对话框以选择文件或文件夹
set chosenPath to POSIX path of "${codePath}"

-- 检查用户是否选择了文件或文件夹
if chosenPath is not equal to "" then
    -- 打开Visual Studio Code并指定路径
    tell application "Visual Studio Code"
        activate
        open chosenPath
    end tell
else
    display dialog "没有选择文件或文件夹。"
end if
`
module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '根据代码文件夹路径打开Vscode。vscode打开代码文件夹',
				args: [
						{
							"name": "codePath",
							"type": "string",
							"description": "代码文件夹路径"
					}
				]
		},
		result: "vscode打开代码文件夹成功"
}