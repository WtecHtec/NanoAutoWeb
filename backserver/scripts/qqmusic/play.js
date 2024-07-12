
const actionName = 'playMusic'
const script = `tell application "System Events"
    tell process "QQMusic"
       key code 49
    end tell
end tell
`
module.exports = {
    script,
    actionMap: {
        actionName: script,
        action: {
            name:  actionName,
            descript: '播放QQ音乐'
        },
    },
}