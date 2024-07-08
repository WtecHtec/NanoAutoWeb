<template>
  <div v-html="compiledMarkdown"></div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import markdownIt from 'markdown-it';

export default defineComponent({
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const md = markdownIt();
    const compiledMarkdown = computed(() => md.render(props.content));
    return {
      compiledMarkdown
    };
  }
});
</script>

<style scoped>
/* 你可以在这里添加自定义的样式 */
</style>
