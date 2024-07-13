const actionName = 'lightTheme'
const script = `tell application "System Events"
    tell appearance preferences
        set dark mode to false
    end tell
end tell
`
 module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '电脑主题切换浅色主题。'
		},
		result: "切换浅色主题成功"
}