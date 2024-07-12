
const runTerminal = require('./terminal')
const WorkLLM = require('./work.llm')
runTerminal( async (line) => {
	await WorkLLM(line)
})