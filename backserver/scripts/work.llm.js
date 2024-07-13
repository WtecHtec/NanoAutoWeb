const { getAppleScriptPrompt, NextActionPrompt } = require('../prompts/appscript');
const request = require('../spark/request')
const { actionsMap } = require('../scripts/atoms');
const { runAppleScript, runDelay } = require('./run.osascropt');
const { fixJsonString } = require('../tools/uitls');
const writeFile = require('../tools/writeFile');
const histroy = []
let agentScratch = ''
const MAX_STEP = 10

function getMessage(line) {
	const prompt = getAppleScriptPrompt(line, agentScratch);
	const message = [
		{
			"role": "user",
			"content": prompt
		}
	]
	// 历史记录
	// histroy.forEach(item => {
	// 	message.push({
	// 		"role": "user",
	// 		"content": item[0]
	// 	})
	// 	message.push({
	// 		"role": "system",
	// 		"content": item[1]
	// 	})
	// })
	// message.push({
	// 	"role": "user",
	// 	"content": NextActionPrompt
	// })
	// console.log('message:', message)
	writeFile('./message.txt', prompt)
	return message
}

 function hanldeCurrentStep(message) {
	// console.log('hanldeCurrentStep:', message)
	return new Promise(async (resolve) => {
		try {
			let {content} = message
			if (content.includes('```json')) {
				content = content.substring(content.indexOf('```json') + 8, content.length - 3)
			}
			content = fixJsonString(content)
			// console.log('hanldeCurrentStep:', content)
			content = JSON.parse(content)
			if (Array.isArray(content)) {
				for (let index = 0; index < content.length; index++) {
					const item = content[index];
					const { action, thoughts } = item;
					const { name } = action;
					if (actionsMap[name])  {
						const { script, isFunc } = actionsMap[name]
						if (isFunc) {
							 await script(item)
						} else {
							script && await runAppleScript(script)
						}
						console.log('step:', thoughts && thoughts.speak)
						await runDelay(2000)
					}
				}
				resolve(1)
				return;
			}
			const { action, thoughts, observation } = content
			const { name, args } = action
			const { speak, plan,reasoning, criticism } = thoughts
			if (name === 'finish') {
				console.log('处理完成')
				resolve(1)
				return
			}
			// 执行action，记录当前action的执行结果 agentScratch
			if (actionsMap[name])  {
				const { script, isFunc, result } = actionsMap[name]
				if (isFunc) {
						await script(item)
				} else {
					script && await runAppleScript(typeof script === 'string' ? script : script(args))
				}
				agentScratch = `${agentScratch}\n: observation:${speak}\n execute action result: ${result}`
			}
			// 从response 中拿出来想要用的信息
			const assistantMsg = `plan: ${plan}\nreasoning: ${reasoning}\ncriticism: ${criticism}\nobservation: ${observation}\n`
			histroy.push([NextActionPrompt, assistantMsg])
			resolve(0)
		} catch (error) {
			console.log('hanldeCurrentStep error:', error)
			resolve(-1)
		}
	})
}
async function WorkLLM(line) {
	return new Promise(async (resolve) => {
		let step = 0
		while (step < MAX_STEP) {
			const message = getMessage(line)
			const [err, result] = await request(message)
			// console.log('result:', result)
			if (err === 0 && result && result[0].message) {
				const stepResult = await hanldeCurrentStep(result[0].message)
				if (stepResult === 1) {
					resolve('finish')
					return
				} else {
					step = step + 1
					console.log('step:', step, 
						stepResult === 0 ? ': ---- action 成功' : ': ---- action 错误')
					if (step >= MAX_STEP) {
						console.log('step:', step, 
							stepResult === 0 ? ': ---- action 成功' : ': ---- action 错误',
							'超出最大步数')
						resolve('2')
					}
				}
			} else {
				step = step + 1
				console.log('step:', step, ': ---- llm 错误')
				if (step >= MAX_STEP) {
					console.log('step:', step, ': ---- llm 错误 超出最大步数')
					resolve('2')
				}
			}
		}
	})
}
module.exports = WorkLLM
