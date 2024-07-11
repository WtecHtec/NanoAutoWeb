<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import MindMapRenderer from './MindMapRenderer.vue';
interface IMsg {
	type:  string
	content: string
	summary: object
}
const keyWord = ref('')
// defineProps<{ msg: string }>()
// const markdownContent = ref('');
/**
 * [ { type: use/system, content: string }]
 */
const msgs = reactive<IMsg[]>([])
const status = ref(true)

const handleSendMessage = async () => {
//  const basePrompt = ''

	if (!keyWord.value) {
		ElMessage({
			message: '请输入内容!',
			type: 'warning',
  		})
		return
	}
	
	// if (keyWord.value) {
	// 	status.value = false
	// 	const prompt =  `${keyWord.value}${basePrompt}`
	// 	msgs.push({ type: 'user', content: keyWord.value })
		
	// 	keyWord.value = ''
	// 	//  如果需要直接输出结果
	// 	const [code, result] = await post('/spark', { prompt })
	// 	if (code === 0) {
	// 		const { data } = result
	// 		let content = ''
	// 		if (Array.isArray(data)) {
	// 			data.forEach(item => {
	// 				const { message } = item;
	// 				content += `${message.content}\n`
	// 			})
	// 		}
	// 		msgs.push({ type: 'system', content })
	// 	} else {
	// 		ElMessage.error('异常');
	// 	}
	// 	// markdownContent.value = result
	// 	// 如果需要输出字节流的方式
	//  	// const stream = session.promptStreaming(prompt);
	// 	// for await (const chunk of stream) {
	// 	// 	console.log(chunk);
	// 	// }
	// 	status.value = true
	// } else {
	// 	ElMessage.error('异常');
	// }
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
						<MindMapRenderer  :data="item.summary" />
					</div>
				
				</div>
				<el-skeleton v-show="!status" :rows="5" animated />
			</div>
			<el-divider />	
		</el-main>
		<el-footer>
			
			<el-row :gutter="24" style="padding-bottom: 12px;">
				<el-col :span="22">
					<el-input placeholder="请输入文章链接" v-model="keyWord"  type="input"></el-input>
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
	padding: 10px;
	margin-bottom: 10px;
	border-radius: 10px;
}
.common-card-system {
	background-color: #fff;
	padding: 10px;
	margin-bottom: 10px;
	border-radius: 10px;
	border: 1px solid #E5E5E5;
}
.user-content {
	color: #fff;
}
</style>
