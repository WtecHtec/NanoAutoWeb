
const actionName = 'inputSearch'
const script = ({keyWord}) => `tell application "System Events"
    tell process "QQMusic"
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
				descript: '在QQ音乐搜索框,输入关键词、歌曲名、歌手名搜索音乐。',
				args: [
						{
							"name": "keyWord",
							"type": "string",
							"description": "关键词、歌曲名、歌手名"
					}
				]
		},
		result: "输入关键词、歌曲名、歌手名成功"
}