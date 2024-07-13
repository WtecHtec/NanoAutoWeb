
const actionName = 'searchMusic'
// const script = `tell application "System Events"
//     tell process "QQMusic"
//         keystroke "f" using {command down}
//     end tell
// end tell
// `

const script = ({keyWord}) => `tell application "System Events"
    tell process "QQMusic"
				keystroke "f" using {command down}
				delay 2
        keystroke "${keyWord}"
				key code 36
    end tell
end tell
`

module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '打开QQ音乐搜索框,输入关键词搜索音乐。',
				args: [
					{
						"name": "keyWord",
						"type": "string",
						"description": "关键词、歌曲名、歌手名"
				}
			]
		},
		result: "打开QQ音乐搜索框成功"
}