
const actionName = 'previousSong'
const script = `tell application "System Events"
    tell process "QQMusic"
        key code 124 using {control down, command down}
    end tell
end tell
`
module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '下一首歌，切换歌曲'
		},
		result: "切换歌曲,下一首成功"
}