import G6 from '@antv/g6';

export default function createEdge() {
    G6.registerEdge('smooth', {
        draw(cfg, group) {
          const { startPoint, endPoint } = cfg as any;
          const hgap = Math.abs(endPoint.x - startPoint.x);
      
          const path = [
            ['M', startPoint.x, startPoint.y],
            [
              'C',
              startPoint.x + hgap / 4,
              startPoint.y,
              endPoint.x - hgap / 2,
              endPoint.y,
              endPoint.x,
              endPoint.y,
            ],
          ];
      
          const shape = group.addShape('path', {
            attrs: {
              stroke: '#AAB7C4',
              path,
              lineWidth: 2,
            },
            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            name: 'smooth-path-shape',
          });
          return shape;
        },
      });
}
