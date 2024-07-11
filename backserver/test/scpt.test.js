
const { runAppleScript, runDelay } = require('../scripts/run.osascropt.js')
  
// 定义一个AppleScript字符串  
const appleScript = `  
tell application "System Events"  
    tell appearance preferences  
        set dark mode to false  
    end tell  
end tell  
`;  

const openQQMusic = `tell application "Finder"
    set qqMusicPath to POSIX file "/Applications/QQMusic.app" as alias
    open qqMusicPath
end tell
`
const  playMusic = `tell application "System Events"
    tell process "QQMusic"
       key code 49
    end tell
end tell
`

async function main() {
	await runAppleScript(openQQMusic)
	await runDelay(2000)
	await runAppleScript(playMusic)
}

main()