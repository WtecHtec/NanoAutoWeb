
const actionName = 'openQQMusic'
const script = `tell application "Finder"
    set qqMusicPath to POSIX file "/Applications/QQMusic.app" as alias
    open qqMusicPath
end tell
`
module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '打开QQ音乐应用。'
		},
    result: "打开QQ音乐应用成功"
}