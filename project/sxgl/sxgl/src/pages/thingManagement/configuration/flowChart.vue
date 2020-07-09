/*
* @Author: gaoxiong
* @Date: 2018-10-08 09:00:00
* @Last Modified by: gaoxiong
* @Last Modified time: 2018-10-08 09:00:00
* @description 导览图
*/
<template>
  <svg :id="'svg-canvas-' + index"></svg>
</template>
<script>
  import * as d3 from '@/utils/d3';
  import dagreD3 from '@/utils/dagre-d3.js';
  import tipsy from '@/utils/tipsy.js';

  export default {
    name: "flowChart",
    props: {
      width: 0,
      index: 0,
      defaultSelectMatter: {
        type: Function,
        default: null
      },
    },
    data() {
      return {
        treeData: {},
        svg: {},
        isIE9: false
      }
    },
    methods: {
      setWidthAndReset(treeData, index) {
        this.treeData = treeData;
        if (!this.treeData.children || this.treeData.children.length == 0){
          return;
        }
        //compound: true是否为混合视图
        let g = new dagreD3.graphlib.Graph(/*{compound: true}*/).setGraph({})
          .setDefaultEdgeLabel(function () {
            return {};
          });
        //设置节点内容
        for (var i = 0; i < this.treeData.children.length; i++) {
          var label1 = '',
            label2 = '';
          if (this.treeData.children[i].matterName.length > 12) {
            label1 = this.treeData.children[i].matterName.substring(0, 12) + "...";
          } else {
            label1 = this.treeData.children[i].matterName;
          }
          var deptName = this.treeData.children[i].deptName;
          var commitTime = this.treeData.children[i].commitTime && this.treeData.children[i].commitTime != 'null' ? '（' + this.treeData.children[i].commitTime + '工作日）' : "（即办）";
          var address = deptName + commitTime;
          if (address.length > 12) {
            label2 = address.substring(0, 12) + "...";
          } else {
            label2 = address;
          }

          var value = {};
          value.label = label1 + '\n' + label2;
          value.label1 = this.treeData.children[i].matterName;
          value.label2 = address;
          value.rx = value.ry = 5;
          if (this.treeData.children[i].pzType == '01' || this.treeData.children[i].isDefaultHight){ //pzType：01必须提供  02 视情形提供
            //value.style = "fill: #FFD351";
	          value.class = "hight-light"
            this.defaultSelectMatter(this.treeData.children[i]);
          }
          g.setNode(this.treeData.children[i].id, value);
        };
        // 设置路线关系
        this.treeData.children.forEach(function (item) {
          if (item.childList) {
            for (var i = 0; i < item.childList.length; i++) {
              g.setEdge(item.id, item.childList[i], {
                arrowhead: 'vee',//箭头类型
                arrowheadStyle: "fill: #999",//线的颜色
                curve: d3.curveBasis //线的类型曲线
              });
            }
          }
        });

        // Set up an SVG group so that we can translate the final graph.
        this.svg = d3.select("#svg-canvas-" + index);
        var svgGroup = this.svg.append("g"),
          inner = this.svg.select("g");
        // Set up zoom support
        // var zoom = d3.zoom().on("zoom", function () {
        //   inner.attr("transform", d3.event.transform);
        // });
        // this.svg.call(zoom);

        if (!this.isIE9) {
          // Set up zoom support
          var zoom = d3.zoom().on("zoom", function () {
            inner.attr("transform", d3.event.transform);
          });
          this.svg.call(zoom);
        }

        // Create the renderer
        var render = new dagreD3.render();
        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        //设置toolTip的显示
        inner.selectAll("g.node")
          .attr("title", function (v) {
            return "<p class='label1'>" + g.node(v).label1 + "</p><p class='label2'>" + g.node(v).label2 + "</p>";
          }).each(function (v) {
            $(this).tipsy({gravity: "w", opacity: 1, html: true});
          });

        // 设置svg宽度
        this.svg.attr("width", this.width);

        // 计算一个缩放比例
        var initialScale = 1;
        if (this.svg.attr("width") <= g.graph().width) {
          initialScale = this.svg.attr("width") / g.graph().width - 0.01;
        }
       
        if (!this.isIE9) {
            var xCenterOffset = (this.svg.attr("width") - g.graph().width) / 2;
            svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
            //控制缩放的比例
            this.svg.call(zoom.transform, d3.zoomIdentity.translate((this.svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));
            //设置svg高度
            this.svg.attr("height", g.graph().height * initialScale + 40);
        } else if(this.isIE9){
            //设置svg高度
            this.svg.attr("height", g.graph().height + 40);
            //设置svg宽度
            this.svg.attr("width", g.graph().width);
            if(g.graph().width < 1200 && g.graph().width > 0) {
                let leftW = (1200 - g.graph().width)/2;
                this.svg.attr('style', 'margin-left:' + leftW + 'px;' + 'margin-top:20px;');
                // svgGroup.attr("transform", "translate(" + leftW + ", 20)");
            }else {
                this.svg.attr('style', 'margin-left:10px;' + 'margin-top:20px;');
                // this.svg.attr('style', 'margin-left:' + 10 + ';');
                // this.svg.css('marginLeft', 10);
                // svgGroup.attr("transform", "translate(" + 10 + ", 20)");
            }
            // this.svg.css('marginTop', 20); 
        }

        //控制缩放的比例
        // this.svg.call(zoom.transform, d3.zoomIdentity.translate((this.svg.attr("width") - g.graph().width * initialScale) / 2, 20).scale(initialScale));

        
        //节点里面的内容居中
        $('.label g').attr("transform", "translate(0, -17)");
        //节点第二行的内容上间距
        $('.label g text tspan').attr("dy", "15px");
      },
      //高亮
      highlightNode(id) {
        if (this.svg.selectAll){
          this.svg.selectAll("g.node")._groups[0].forEach(function (node) {
            if (node.__data__ == id) {
              $(node).addClass('hight-light');
            }
          });
        }
      },
      //置灰
      resetNode(id){
        if (this.svg.selectAll){
          this.svg.selectAll("g.node")._groups[0].forEach(function (node) {
            if (node.__data__ == id){
              $(node).removeClass('hight-light');
            }
          });
        }
      }
    },
    mounted: function () {
        let Sys = {};
        let ua = navigator.userAgent.toLowerCase();
        if (window.ActiveXObject) {
            Sys.ie = ua.match(/msie ([\d.]+)/)[1];
            if (Sys.ie.indexOf("9") > -1) {
              this.isIE9 = true;
            }
        }

    }
  }
</script>
<style>
  g.hight-light > rect {
    fill: #FFD351;
  }
  /*高亮块字体颜色*/
  g.hight-light g g text > tspan{
    fill: #fff;
  }
  text {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serf;
    font-size: 15px;
    fill: #666;
    text-anchor: middle; /* 文本水平居中 */
  }

  .label g text tspan:last-child {
    font-size: 13px;
  }

  /*.label g {
    transform: translate(0, -13px);
  }*/

  .node rect {
    stroke: #999;
    fill: #fff;
    stroke-width: 1px;
  }

  .edgePath path {
    stroke: #999;
    stroke-width: 1px;
  }

  /* This styles the body of the tooltip */
  .tipsy .label1 {
    font-size: 16px;
  }

  .tipsy .label2 {
    font-size: 14px;
  }

  .tipsy {
    font-size: 10px;
    position: absolute;
    padding: 5px;
    z-index: 100000;
  }

  .tipsy-inner {
    background-color: #464C5B;
    color: #FFF;
    /*max-width: 200px;*/
    padding: 5px 8px 4px 8px;
    text-align: center;
  }

  /* Rounded corners */
  .tipsy-inner {
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
  }

  /* Uncomment for shadow */
  .tipsy-inner {
    box-shadow: 0 0 5px #464C5B;
    -webkit-box-shadow: 0 0 5px #464C5B;
    -moz-box-shadow: 0 0 5px #464C5B;
  }

  .tipsy-arrow {
    position: absolute;
    width: 0;
    height: 0;
    line-height: 0;
    border: 5px dashed #464C5B;
  }

  /* Rules to colour arrows */
  .tipsy-arrow-n {
    border-bottom-color: #464C5B;
  }

  .tipsy-arrow-s {
    border-top-color: #464C5B;
  }

  .tipsy-arrow-e {
    border-left-color: #464C5B;
  }

  .tipsy-arrow-w {
    border-right-color: #464C5B;
  }

  .tipsy-n .tipsy-arrow {
    top: 0px;
    left: 50%;
    margin-left: -5px;
    border-bottom-style: solid;
    border-top: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }

  .tipsy-nw .tipsy-arrow {
    top: 0;
    left: 10px;
    border-bottom-style: solid;
    border-top: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }

  .tipsy-ne .tipsy-arrow {
    top: 0;
    right: 10px;
    border-bottom-style: solid;
    border-top: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }

  .tipsy-s .tipsy-arrow {
    bottom: 0;
    left: 50%;
    margin-left: -5px;
    border-top-style: solid;
    border-bottom: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }

  .tipsy-sw .tipsy-arrow {
    bottom: 0;
    left: 10px;
    border-top-style: solid;
    border-bottom: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }

  .tipsy-se .tipsy-arrow {
    bottom: 0;
    right: 10px;
    border-top-style: solid;
    border-bottom: none;
    border-left-color: transparent;
    border-right-color: transparent;
  }

  .tipsy-e .tipsy-arrow {
    right: 0;
    top: 50%;
    margin-top: -5px;
    border-left-style: solid;
    border-right: none;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }

  .tipsy-w .tipsy-arrow {
    left: 0;
    top: 50%;
    margin-top: -5px;
    border-right-style: solid;
    border-left: none;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }

</style>
