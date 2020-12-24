<template>
    <div id="sankey">
        <sankey-map v-cloak></sankey-map>
    </div>
</template>

<script>
  import sankeyMap from "@/components/sankeyMap"

  export default {
    name: "sankey",
    components: {
      sankeyMap
    },
    data() {
      return {
        mapList: [{
          type: 'sctterMap',
          name: '分布图',
          index: 1,
        },
          {
            type: 'heatMap',
            name: '热力图',
            index: 2,
          },
          {
            type: 'dotMap',
            name: '散点图',
            index: 3,
          },
          {
            type: 'allMap',
            name: '综合地图',
            index: 4,
          },
        ],
      }
    },
    mounted() {},
    methods: {
      changeList(val) {
        if (val.type == this.currenIndex) {
          return
        }
        this.currenIndex = val.type
      },
    },
  }
</script>

<style lang="scss" scoped>
    #sankey {
        width: 100%;
        height: 100%;
        position: relative;

        .select {
            position: absolute;
            left: 1%;
            top: 15%;
            z-index: 15;

            .select_item {
                padding: 6px 25px;
                color: rgb(179, 239, 255);
                background: rgba(147, 235, 248, .35);
                border-radius: 15px;
                margin: 25px 0;
                cursor: pointer;

                .active {
                    color: rgb(254, 217, 50);
                }
            }
        }
    }
</style>
