<template>
    <div id="mind-map-container" class="mind-map-container"></div>
  </template>
  
  <script lang="ts">
  import { onMounted, defineComponent } from 'vue';
  import G6 from '@antv/g6';
  import createEdge from './utils/g6.edge';
  import createNode from './utils/g6.node';
  
  const BaseConfig = {
    nameFontSize: 12,
    childCountWidth: 22,
    countMarginLeft: 0,
    itemPadding: 16,
    nameMarginLeft: 4,
    rootPadding: 18,
  };

  export default  defineComponent({
    name: 'MindMapRenderer',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    setup(props) {
        const renderMindMap = () => {
            createEdge();
            createNode();
            const container = document.getElementById('mind-map-container') as any;
            const width = container.scrollWidth;
            const height = container.scrollHeight || 500;
            const graph = new G6.TreeGraph({
                container: 'mind-map-container',
                width,
                height,
                modes: {
                default: [
                    {
                    type: 'collapse-expand',
                    },
                    'drag-canvas',
                    'zoom-canvas',
                ],
                },
                defaultNode: {
                    type: 'treeNode',
                    anchorPoints: [
                        [0, 0.5],
                        [1, 0.5],
                    ],
                },
                defaultEdge: {
                    type: 'smooth',
                },
                layout: {
                    type: 'compactBox',
                    direction: 'LR',
                    getId: function getId(d: any) {
                        return d.id;
                    },
                    getHeight: function getHeight() {
                        return 16;
                    },
                    getWidth: function getWidth(d: any) {
                        const labelWidth = G6.Util.getTextSize(d.label, BaseConfig.nameFontSize)[0];
                        const width =
                        BaseConfig.itemPadding +
                        BaseConfig.nameMarginLeft +
                        labelWidth +
                        BaseConfig.rootPadding +
                        BaseConfig.childCountWidth;
                        return width;
                    },
                    getVGap: function getVGap() {
                        return 15;
                    },
                    getHGap: function getHGap() {
                        return 30;
                    },
                },
            });
        
            graph.data(props.data);
            graph.render();
            graph.fitView();
        }
        onMounted(() => {
            renderMindMap();
        });
    }
  })
  </script>
  
  <style scoped>
  /* 你可以在这里添加自定义的样式 */
  .mind-map-container {
      height: 400px;
      width: 100%;
  }
  </style>
  