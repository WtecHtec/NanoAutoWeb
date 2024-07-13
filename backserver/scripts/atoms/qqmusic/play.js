
const actionName = 'playMusic'
const script = `tell application "System Events"
    tell process "QQMusic"
       key code 49
    end tell
end tell
`
module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '立即播放QQ音乐歌曲。'
		},
		result: "播放音乐成功"
}