<template>
    <div class="map-box">
        <div style="width:100%;height:100%" ref="myCharts" @contextmenu.prevent="openMenu($event)"></div>
        <!-- 右键菜单-->
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <!-- <li @click="handleClickFolder(rightClickItem)">打开</li>
            <li @click="handleUpdate(rightClickItem)">编辑</li> -->
            <li>复制</li>
            <li @click="clearSelectedNodeStyle(true)">去除</li>
        </ul>

    </div>
</template>

<script>
  import echarts from 'echarts'
  import resize from "./mixins/resize";

  export default {
    name: "sankeyMap",
    mixins: [resize],
    data() {
      return {
        myCharts: null,
        //右键菜单
        visible: false,
        top: 0,
        left: 0,
        rightClickItem: null,
        //点击选中
        headsArr: [],
        lastLevelNodesArr: [],
        leftNodesArr: [],
        rightNodesArr: [],
        nodes: [
          {
            name: '进入',
          },
          {
            name: '首页',
          },
          {
            name: '个人中心',
          },
          {
            name: '购物车',
          },
          {
            name: '商品',
          },
          {
            name: '订单',
          },
        ],
        links: [
          {

            source: '进入',
            target: '首页',
            value: 5,
          },
          {
            source: '进入',
            target: '个人中心',

            value: 3,
          },
          {

            source: '个人中心',
            target: '购物车',
            value: 8,
          },
          {

            source: '购物车',
            target: '商品',
            value: 8,
          },
          {

            source: '个人中心',
            target: '订单',
            value: 9,
          },
        ]
      }
    },
    watch: {
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    mounted() {
      this.$nextTick().then(() => {
        this.initEcharts()
      })
    },
    methods: {
      //-------右键菜单
      openMenu(e) {
        console.log(e)
        console.log(e.pageX)
        console.log(e.pageY)
      },
      closeMenu() {
        this.visible = false;
      },
      //-------图表
      initEcharts() {
        this.myChart = echarts.init(this.$refs.myCharts)
        this._setOption()
        this.findHeadNode()
        this.getLastLevelNodes()
      },
      _setOption() {
        let option = {
          backgroundColor: '#f3f3f3',
          title: {
            text: 'ICD10-疾病分布桑基图',
            left: 'center',
            top: 30,
            textStyle: {
              color: 'black'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          series: [{
            type: 'sankey',
            layout: 'none',
            // focusNodeAdjacency: 'allEdges',
            lineStyle: {
              color: 'source',
              curveness: 0.5
            },
            data: this.nodes,
            links: this.links,
          }
          ]
        }
        this.myChart.setOption(option, true)
        this.myChart.off('click');
        this.myChart.on('click', this.echartsMapClick);
        this.myChart.on('contextmenu', this.rightClick);

      },
      //点击选中
      echartsMapClick(params) {
        console.log('node params:', params)
        if (!params.data) {
          return
        }
        let currentItem = params.data
        //每次点击先清空
        this.leftNodesArr = [];
        this.rightNodesArr = [];
        this.clearSelectedNodeStyle();
        let currentItemObj;
        if (!currentItem.hasOwnProperty('value')) {
          // 点击的节点
          console.log('currentItem:点击的节点', currentItem)
          currentItemObj =this.links.find((o) => o.target == currentItem.name)
          if (currentItemObj) {
            // this.findLeftLink(currentItemObj)
            // 如果不是末级节点
            if (!this.lastLevelNodesArr.find((v) => v.name === currentItem.name)) {
              this.findRightLink(currentItemObj)
            }
          } else {
            // 如果是1级节点
            this.links.forEach((link) => {
              if (link.source == currentItem.name) {
                console.log('nn link:', link)
                this.findRightLink(link)
              }
            })
          }
          console.log('currentItem:点击的节点', currentItemObj)
        } else {
          // 点击的线
          console.log('currentItem: 点击的线', currentItem)
          currentItemObj = currentItem
          // this.findLeftLink(currentItemObj)
          this.findRightLink(currentItemObj)
        }

        // console.log('左边的节点leftNodesArr', this.leftNodesArr)
        // console.log('右边的节点rightNodesArr', this.rightNodesArr)
        //   let matchedNodes = Array.from(new Set(leftNodesArr.concat(rightNodesArr)))
        // console.log('matchedNodes', matchedNodes)
        if (!currentItem.hasOwnProperty('value')) {
          //第一个是不是根节点
          if (this.rightNodesArr.length > 1 && !this.headsArr.includes(this.rightNodesArr[1].source)) {
            this.rightNodesArr = this.rightNodesArr.slice(1)
          }
        }
        console.log('右边的节点rightNodesArr', this.rightNodesArr)
        this.links.forEach((item) => {
          this.rightNodesArr.forEach((v) => {
            if (item.target === v.target) {
              item.lineStyle = {
                color: 'red',
              }
            }
          })
        })
        this._setOption()
      },
      //右键点击
      rightClick(params) {
        console.log(' rightClick params:', params)
        this.rightClickItem = params.data;
        this.top = params.event.offsetY;
        this.left = params.event.offsetX;
        this.visible = true;
      },
      //---------------------------计算部分start-------------------------------
      // 拿到所有一级节点数组
      findHeadNode() {
        //当前source 不在其他target中
        let headNodesArr = [];
        this.links.forEach((link, index, arr) => {
          if (arr.every((i) => {
            return link.source != i.target
          })) {
            headNodesArr.push(link.source)
          }

        })
        this.headsArr = Object.freeze(Array.from(new Set(headNodesArr)))
        console.log('headsArr', this.headsArr)
      },
      // 拿到所有末级节点数组
      getLastLevelNodes() {
        let tempArr = []
        this.nodes.forEach((node) => {
          if (this.isLastLevelNode(node)) {
            tempArr.push(node)
          }
        })
        // 使用Object.freeze 冻结计算类数据-不要响应式
        this.lastLevelNodesArr = Object.freeze(tempArr)
        console.log('getLastLevelNodes', this.lastLevelNodesArr)
      },
      isLastLevelNode(node) {
        let sourceArr = []
        let targetArr = []
        this.links.forEach((link) => {
          if (node.name === link.source) {
            sourceArr.push(link)
          } else if (node.name === link.target) {
            targetArr.push(link)
          }
        })
        return targetArr.length > 0 && sourceArr.length === 0
      },
      findLeftLink(obj) {
        // console.log('findLeftLink obj', obj)
        if (Object.prototype.toString.call(obj) !== '[object Object]') return;
        this.leftNodesArr.push(obj)
        if (this.headsArr.includes(obj.source)) {
          return ''
        }
        let nextObj = this.links.find((item) => item.target == obj.source)
        return nextObj && this.findLeftLink(nextObj)
      },
      findRightLink(obj) {
        if (!obj) {
          return ;
        }
        this.rightNodesArr.push(obj);
        this.links.filter((item) => item.source == obj.target).map((i) => this.findRightLink(i))
      },
      //清除节点选中样式
      clearSelectedNodeStyle(clickClear=false){
        this.links.forEach((item) => {
          if (item.hasOwnProperty('value')) {
            delete item.lineStyle
          }
        })
        if(clickClear){
          this._setOption()
        }
      },


      //---------------------------计算部分end-------------------------------
    }
  }
</script>

<style lang="scss" scoped>
    .map-box {
        width: 100%;
        height: 100%;
        position: relative;
        /*background: url("../assets/bg1.jpg") no-repeat;*/
        background-size: 100% 100%;

        .contextmenu {
            margin: 0;
            background: #fff;
            z-index: 3000;
            position: absolute;
            list-style-type: none;
            padding: 5px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 400;
            color: #333;
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        }

        .contextmenu li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
        }

        .contextmenu li:hover {
            background: #eee;
        }

    }
</style>
