
const actionName = 'openQQMusic'
const script = `tell application "Finder"
    set qqMusicPath to POSIX file "/Applications/QQMusic.app" as alias
    open qqMusicPath
end tell
`
module.exports = {
    script,
    actionMap: {
        actionName: script,
        action: {
            name:  actionName,
            descript: '打开QQ音乐'
        },
    },
}