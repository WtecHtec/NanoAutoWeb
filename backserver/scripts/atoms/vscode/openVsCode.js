const actionName = 'openVsCode'
const script = `tell application "Finder"
    set qqMusicPath to POSIX file "/Applications/Visual Studio Code.app" as alias
    open qqMusicPath
end tell
`
module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '打开Vscode。'
		},
    result: "打开Vscode应用成功"
}