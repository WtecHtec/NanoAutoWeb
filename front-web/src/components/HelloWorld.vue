<script setup lang="ts">
import { ref } from "vue";

const count = ref(0)
const handleCount = async () => {

	count.value += 1
  if (!window.ai) return
	const canCreate = await window.ai.canCreateTextSession();
	if (canCreate !== "no") {
		const session = await window.ai.createTextSession();
		//  如果需要直接输出结果
		const result = await session.prompt("为我写一首诗");
		console.log(result)
			// 如果需要输出字节流的方式
	//  const stream = session.promptStreaming("Write me an extra-long poem");
	// for await (const chunk of stream) {
		// console.log(chunk);
		//}
	}


}
</script>

<template>


  <div class="card">
    <button type="button" @click="handleCount">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
