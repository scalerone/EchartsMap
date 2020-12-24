<template>
    <div class="map-box">
        <div class="select-box">
<!--            <el-select-->
<!--                    v-model="value1"-->
<!--                    multiple-->
<!--                    collapse-tags-->
<!--                    style="margin-left: 20px;"-->
<!--                    placeholder="请选择">-->
<!--                <el-option-->
<!--                        v-for="item in nodes"-->
<!--                        :key="item.name"-->
<!--                        :label="item.name"-->
<!--                        :value="item.name">-->
<!--                </el-option>-->
<!--            </el-select>-->
<!--            <el-button type="info"  >筛选</el-button>-->
<!--            <el-button slot="append" type="info"  icon="el-icon-search" @click="handleSearch">筛选</el-button>-->
            <el-form :inline="true" :model="formInline" ref="ruleForm" class="demo-form-inline">
                <el-form-item label="章节">
                    <el-select v-model="formInline.chapter" placeholder="请选择章节" @change="handleSearch">
                            <el-option
                                    v-for="item in nodes.filter(i=>i.name.indexOf('章')!==-1)"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目">
                    <el-select v-model="formInline.category" placeholder="请选择类目" @change="handleSearch">
                        <el-option
                                v-for="item in categoryArr"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="亚目">
                    <el-select v-model="formInline.suborder" placeholder="请选择" @change="handleSearch">
                        <el-option
                                v-for="item in suborderArr"
                                :key="item.name"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
<!--                <el-form-item label="扩展码">-->
<!--                    <el-select v-model="formInline.code" placeholder="请选择" @change="handleSearch">-->
<!--                        <el-option-->
<!--                                v-for="item in codeArr"-->
<!--                                :key="item.name"-->
<!--                                :label="item.name"-->
<!--                                :value="item.name">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
                <el-form-item>
<!--                    <el-button  type="info"  @click="handleSearch">查询</el-button>-->
                    <el-button  type="warning"   @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div  class="chart-box" style="width:100%;height:100%"  ref="myCharts" @contextmenu.prevent="openMenu($event)"></div>
        <!-- 右键菜单-->
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <!-- <li @click="handleClickFolder(rightClickItem)">打开</li>
            <li @click="handleUpdate(rightClickItem)">编辑</li> -->
<!--            <li>复制</li>-->
            <li @click="clearSelectedNodeStyle(true)">去除</li>
        </ul>

    </div>
</template>

<script>
  import echarts from 'echarts'
  import resize from "./mixins/resize";
  import dataJson from "../assets/link.json";

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
          //level1
          {
            name: '第十章：呼吸系统疾病（J00-J99）',
          },
          //level2
          {
            name: '呼吸系统的其他疾病（J95-J99）',
          },
          {
            name: '慢性下呼吸道疾病（J40-J47）',
          },
          {
            name: '急性上呼吸道感染（J00-J06）',
          },
          {
            name: '上呼吸道的其他疾病（J30-J39）',
          },
          {
            name: '外部物质引起的肺部疾病（J60-J70）',
          },
          {
            name: '流行性感冒和肺炎（J09-J18）',
          },
          {
            name: '主要影响间质的其他呼吸性疾病（J80-J84）',
          },
          {
            name: '胸膜的其他疾病（J90-J94）',
          },
          {
            name: '其他急性下呼吸道感染（J20-J22）',
          },
          {
            name: '下呼吸道化脓性和坏死性情况（J85-J86）',
          },
          //level3
          {
            name: '哮喘持续状态J46',
          },
          {
            name: '其他慢性阻塞性肺病J44',
          },
          {
            name: '急性喉炎和气管炎J04',
          },
          {
            name: '其他呼吸性疾患J98',
          },
          {
            name: '急性鼻窦炎J01',
          },
          {
            name: '声带和喉疾病,不可归类在他处者J38',
          },
          {
            name: '含硅[矽]粉尘引起的肺尘埃沉着病J62',
          },
          {
            name: '细菌性肺炎,不可归类在他处者J15',
          },
          {
            name: '其他间质性肺疾病J84',
          },
          {
            name: '其他胸膜情况J94',
          },
          {
            name: '急性细支气管炎J21',
          },
          {
            name: '肺和纵隔脓肿J85',
          },
          //level4
          {
            name: '哮喘持续状态J46.x',
          },
          {
            name: '其他特指的慢性阻塞性肺病J44.8',
          },
          {
            name: '未特指的慢性阻塞性肺病J44.9',
          },
          {
            name: '急性喉炎J04.0',
          },
          {
            name: '膈疾患J98.6',
          },
          {
            name: '其他的急性鼻窦炎J01.8',
          },
          {
            name: '喉的其他疾病J38.7',
          },
          {
            name: '其他含硅［矽］粉尘引起的肺尘埃沉着病J62.8',
          },



        ],
        links: [
          //level1------其中value一定要变为小数，否则展示不全
          {

            source: '第十章：呼吸系统疾病（J00-J99）',
            target: '呼吸系统的其他疾病（J95-J99）',
            value: 0.1,
          },
          {

            source: '第十章：呼吸系统疾病（J00-J99）',
            target: '慢性下呼吸道疾病（J40-J47）',
            value: 0.2,
          },
          {
            source: '第十章：呼吸系统疾病（J00-J99）',
            target: '急性上呼吸道感染（J00-J06）',
            value: 0.3,
          },
          {
            source: '第十章：呼吸系统疾病（J00-J99）',
            target: '上呼吸道的其他疾病（J30-J39）',
            value: 0.4,
          },
          {
            source: '第十章：呼吸系统疾病（J00-J99）',
            target: '外部物质引起的肺部疾病（J60-J70）',
            value: 0.5,
          },
          {
            "source": "第十章：呼吸系统疾病（J00-J99）",
            "target": "流行性感冒和肺炎（J09-J18）",
            "value": 0.69999
          },
          {
            "source": "第十章：呼吸系统疾病（J00-J99）",
            "target": "主要影响间质的其他呼吸性疾病（J80-J84）",
            "value": 0.788
          },
          {
            "source": "第十章：呼吸系统疾病（J00-J99）",
            "target": "胸膜的其他疾病（J90-J94）",
            "value": 0.69999
          },
          {
            "source": "第十章：呼吸系统疾病（J00-J99）",
            "target": "其他急性下呼吸道感染（J20-J22）",
            "value": 0.9999
          },
          {
            "source": "第十章：呼吸系统疾病（J00-J99）",
            "target": "下呼吸道化脓性和坏死性情况（J85-J86）",
            "value": 0.100002
          },
          //level2-level3
          {
            source: '呼吸系统的其他疾病（J95-J99）',
            target: '其他呼吸性疾患J98',
            value: 0.6654,
          },
          {
            "source": "慢性下呼吸道疾病（J40-J47）",
            "target": "哮喘持续状态J46",
            "value": 0.331584
          },
          {
            "source": "慢性下呼吸道疾病（J40-J47）",
            "target": "其他慢性阻塞性肺病J44",
            "value": 0.22459701
          },
          {
            "source": "急性上呼吸道感染（J00-J06）",
            "target": "急性喉炎和气管炎J04",
            "value": 0.2142822
          },
          {
            "source": "急性上呼吸道感染（J00-J06）",
            "target": "急性鼻窦炎J01",
            "value": 0.287364
          },
          {
            "source": "上呼吸道的其他疾病（J30-J39）",
            "target": "声带和喉疾病,不可归类在他处者J38",
            "value": 0.3080484
          },
          {
            "source": "外部物质引起的肺部疾病（J60-J70）",
            "target": "含硅[矽]粉尘引起的肺尘埃沉着病J62",
            "value": 0.501996
          },
          {
            "source": "流行性感冒和肺炎（J09-J18）",
            "target": "细菌性肺炎,不可归类在他处者J15",
            "value": 0.13872606
          },
          {
            "source": "主要影响间质的其他呼吸性疾病（J80-J84）",
            "target": "其他间质性肺疾病J84",
            "value": 0.1514931
          },
          {
            "source": "胸膜的其他疾病（J90-J94）",
            "target": "其他胸膜情况J94",
            "value": 0.1135299
          },
          {
            "source": "其他急性下呼吸道感染（J20-J22）",
            "target": "急性细支气管炎J21",
            "value": 0.2639538
          },
          {
            "source": "下呼吸道化脓性和坏死性情况（J85-J86）",
            "target": "肺和纵隔脓肿J85",
            "value": 0.354321
          },
          //level3-level4
          {
            "source": "哮喘持续状态J46",
            "target": "哮喘持续状态J46.x",
            "value": 0.331584
          },
          {
            "source": "其他慢性阻塞性肺病J44",
            "target": "其他特指的慢性阻塞性肺病J44.8",
            "value": 0.1169520
          },
          {
            "source": "其他慢性阻塞性肺病J44",
            "target": "未特指的慢性阻塞性肺病J44.9",
            "value": 0.1822590
          },
          {
            "source": "急性喉炎和气管炎J04",
            "target": "急性喉炎J04.0",
            "value": 0.1313037
          },
          {
            "source": "其他呼吸性疾患J98",
            "target": "膈疾患J98.6",
            "value": 0.9702
          },
          {
            "source": "急性鼻窦炎J01",
            "target": "其他的急性鼻窦炎J01.8",
            "value": 0.7755
          },
          {
            "source": "声带和喉疾病,不可归类在他处者J38",
            "target": "喉的其他疾病J38.7",
            "value": 0.735537
          },
          {
            "source": "含硅[矽]粉尘引起的肺尘埃沉着病J62",
            "target": "其他含硅［矽］粉尘引起的肺尘埃沉着病J62.8",
            "value": 0.500841
          },



        ],
       // links:dataJson.links,
       // nodes:dataJson.data,
        formInline: {
          chapter: '',
          category: '',
          suborder: '',
          code:'',
        },
        chapterArr:[],
        categoryArr:[
          {
            name: '呼吸系统的其他疾病（J95-J99）',
          },
          {
            name: '慢性下呼吸道疾病（J40-J47）',
          },
          {
            name: '急性上呼吸道感染（J00-J06）',
          },
          {
            name: '上呼吸道的其他疾病（J30-J39）',
          },
          {
            name: '外部物质引起的肺部疾病（J60-J70）',
          },
          {
            name: '流行性感冒和肺炎（J09-J18）',
          },
          {
            name: '主要影响间质的其他呼吸性疾病（J80-J84）',
          },
          {
            name: '胸膜的其他疾病（J90-J94）',
          },
          {
            name: '其他急性下呼吸道感染（J20-J22）',
          },
          {
            name: '下呼吸道化脓性和坏死性情况（J85-J86）',
          },
        ],
        suborderArr:[
          {
            name: '哮喘持续状态J46',
          },
          {
            name: '其他慢性阻塞性肺病J44',
          },
          {
            name: '急性喉炎和气管炎J04',
          },
          {
            name: '其他呼吸性疾患J98',
          },
          {
            name: '急性鼻窦炎J01',
          },
          {
            name: '声带和喉疾病,不可归类在他处者J38',
          },
          {
            name: '含硅[矽]粉尘引起的肺尘埃沉着病J62',
          },
          {
            name: '细菌性肺炎,不可归类在他处者J15',
          },
          {
            name: '其他间质性肺疾病J84',
          },
          {
            name: '其他胸膜情况J94',
          },
          {
            name: '急性细支气管炎J21',
          },
          {
            name: '肺和纵隔脓肿J85',
          },
        ],
        codeArr:[],



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
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.formInline = {
          chapter: '',
          category: '',
          suborder: '',
          code:'',
        }
        this.clearSelectedNodeStyle(true)
      },
      handleSearch(){
        console.log('handleSearch')
        let searchText = '';

        if(this.formInline.category){
          searchText = this.formInline.category
        }
        if(this.formInline.suborder){
          searchText = this.formInline.suborder
        }
        if(this.formInline.code){
          searchText = this.formInline.code
        }

        let searchObj = {
          data:{
            name:searchText
          }
        }
        if(!searchText){
          this.$message.warning('请选择要高亮的项')
          return ;
        }
        this.echartsMapClick(searchObj)
      },
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
            trigger: 'item',
            transitionDuration: 0,//防止页面抖动
            formatter: function (params) {
                // console.log('formatter',params)
              return params.name + ": "  +(params.value+'').slice(2)
            }
          },
          animation: false,
          series: [{
            type: 'sankey',
            // layout: 'none',
            // focusNodeAdjacency: 'allEdges',
            data: this.nodes,
            links: this.links,
            levels: [
              {
              depth: 0,
              itemStyle: {
                color: '#fbb4ae'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            }, {
              depth: 1,
              itemStyle: {
                color: '#b3cde3'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            }, {
              depth: 2,
              itemStyle: {
                color: '#ccebc5'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            }, {
              depth: 3,
              itemStyle: {
                color: '#decbe4'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            }],
            lineStyle: {
              curveness: 0.5
            }
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
        this.top = params.event.offsetY+80;
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
        /*height: 100%;*/
        height: calc(100% - 100px);
        position: relative;
        display: flex;
        flex-direction: column;
        /*background: url("../assets/bg1.jpg") no-repeat;*/
        background-size: 100% 100%;
        .select-box{
            /*position: absolute;*/
            /*top:20px;*/
            /*left: 10px;*/
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chart-box{
            height: 100%;
            box-sizing: border-box;
        }
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
