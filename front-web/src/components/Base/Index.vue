<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Container,
	Main,
	Footer,
} from '@element-plus/icons-vue'
import MarkdownRenderer from '../MarkdownRenderer.vue';

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
    <el-container>
      <el-main> <MarkdownRenderer :content="markdownContent" /></el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
