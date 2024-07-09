<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import MarkdownRenderer from '../MarkdownRenderer.vue';

const keyWord = ref('')
// defineProps<{ msg: string }>()
// const markdownContent = ref('');
/**
 * [ { type: use/system, content: string }]
 */
const msgs = reactive([])
const status = ref(true)

const handleSendMessage = async () => {
 const basePrompt = ''
	const canCreate = await window.ai.canCreateTextSession();
	console.log(keyWord.value, canCreate);
	if (!keyWord.value) {
		ElMessage({
			message: '请输入内容!',
			type: 'warning',
  	})
		return
	}
	
	if (canCreate !== "no" && keyWord.value) {
		status.value = false
		const session = await window.ai.createTextSession();
		const prompt =  `${keyWord.value}${basePrompt}`
		msgs.push({ type: 'user', content: keyWord.value })
		keyWord.value = ''
		//  如果需要直接输出结果
		const result = await session.prompt(prompt);
		msgs.push({ type: 'system', content: result })
		console.log(result)
		// markdownContent.value = result
		// 如果需要输出字节流的方式
	 	// const stream = session.promptStreaming(prompt);
		// for await (const chunk of stream) {
		// 	console.log(chunk);
		// }
		status.value = true
	} else {
		ElMessage.error('异常');
	}
}
</script>

<template>
	<div class="common-layout">
    <el-container style="height: 100%;">
		<el-main>
			<div class="common-container">
				<div v-for="(item, index) in msgs" :key="index">
					<div class="common-card-user" v-show="item.type === 'user'">
						<span  class="user-content"> {{ item.content }}</span>
					</div>
					<div v-show="item.type === 'system'" class="common-card-system">
						<MarkdownRenderer  :content="item.content" />
					</div>
				
				</div>
				<el-skeleton v-show="!status" :rows="5" animated />
			</div>
			<el-divider />	
		</el-main>
		<el-footer>
			
			<el-row :gutter="24" style="padding-bottom: 12px;">
				<el-col :span="22">
					<el-input  v-model="keyWord" autosize type="textarea"></el-input>
				</el-col>
				<el-col :span="2">
					<el-button type="primary" @click="handleSendMessage" :disabled="!status">发送</el-button>
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

.common-container {
	flex: 1;
	overflow-y: auto;
	box-sizing: border-box;
}

.common-card-user {
	background-color: #2E67FA;
	padding: 10px 4px;
	margin-bottom: 10px;
	border-radius: 10px;
}
.common-card-system {
	background-color: #fff;
	padding: 10px 4px;
	margin-bottom: 10px;
	border-radius: 10px;
}
.user-content {
	color: #fff;
}
</style>
