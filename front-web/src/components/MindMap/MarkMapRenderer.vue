<template>
    <svg class="markmap-container" ref="rootRef" id="markmap" ></svg>
</template>

<script lang="ts">
import { onMounted, ref, defineComponent } from 'vue';
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';
export default  defineComponent({
    name: 'MarkViewRenderer',
    props: {
      data: {
        type: String,
        default: ``
      }
    },
    setup(props) {
        const rootRef = ref(null)
       
        const renderMarkMap = () => {
           
            const transformer = new Transformer();
             const { root } = transformer.transform(props.data);
            const mm = Markmap.create((rootRef as any).value, {}, root) as any;
            // mm.value.setData(root);
            mm.fit();
        }
        onMounted(() => {
            renderMarkMap()
        })
        return {
            rootRef
        };
    }
})
</script>
<style scoped>
.markmap-container {
    height: 360px;
    width: 100%;
}
</style>