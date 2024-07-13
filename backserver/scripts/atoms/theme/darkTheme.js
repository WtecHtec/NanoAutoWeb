
const actionName = 'darkTheme'
const script = `tell application "System Events"
    tell appearance preferences
        set dark mode to not dark mode
    end tell
end tell
`
module.exports = {
    script,
		actionName,
		action: {
				name:  actionName,
				descript: '电脑主题切换深色主题。'
		},
		result: "切换深色主题。成功"
}