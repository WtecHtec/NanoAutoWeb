<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownRenderer from '../MarkdownRenderer.vue';

const keyWord = ref('')
// defineProps<{ msg: string }>()
const markdownContent = ref('');

const handleCount = async () => {
 const basePrompt = '####输出格式为“markdown”'
	const canCreate = await window.ai.canCreateTextSession();
	if (canCreate !== "no") {
		const session = await window.ai.createTextSession();
		const prompt =  `为我写一首诗${basePrompt}`
		//  如果需要直接输出结果
		const result = await session.prompt(prompt);
		console.log(result)
		markdownContent.value = result
		// 如果需要输出字节流的方式
	 	// const stream = session.promptStreaming(prompt);
		// for await (const chunk of stream) {
		// 	console.log(chunk);
		// }
	}
}
onMounted(() => {
	handleCount()
})
</script>

<template>
	<div class="common-layout">
    <el-container style="height: 100%;">
		<el-main>
			<MarkdownRenderer :content="markdownContent" />
			<el-divider />	
		</el-main>
		<el-footer>
			
			<el-row :gutter="24" style="padding-bottom: 12px;">
				<el-col :span="22">
					<el-input  v-model="keyWord" autosize type="textarea"></el-input>
				</el-col>
				<el-col :span="2">
					<el-button type="primary">发送</el-button>
				</el-col>
			</el-row>
		</el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
	height: 100vh;
}
.el-main {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
