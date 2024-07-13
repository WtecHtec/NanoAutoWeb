
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


const openCodeToVscode = `

-- 显示对话框以选择文件或文件夹
set chosenPath to POSIX path of "/Users/shenruqi/Desktop/Code/WxminiGame/Game01"

-- 检查用户是否选择了文件或文件夹
if chosenPath is not equal to "" then
    -- 打开Visual Studio Code并指定路径
    tell application "Visual Studio Code"
        activate
        open chosenPath
    end tell
else
    display dialog "没有选择文件或文件夹。"
end if

`

async function main() {
	// await runAppleScript(openQQMusic)
	// await runDelay(2000)
	// await runAppleScript(playMusic)
	await runAppleScript(openCodeToVscode)
}

main()