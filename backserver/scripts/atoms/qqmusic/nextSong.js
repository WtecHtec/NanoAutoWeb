
const actionName = 'nextSong'
const script = `tell application "System Events"
    tell process "QQMusic"
        key code 123 using {control down, command down}
    end tell
end tell
`
module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '上一首歌，切换歌曲'
		},
		result: "切换歌曲,上一首成功"
}