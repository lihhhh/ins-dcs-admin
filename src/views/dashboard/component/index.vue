<style lang="less">
.status-space {
  .chart {
    height: 400px;
  }
}
</style>
<template>
  <div class="status-space">
    <div class="chart">
      <MyChart :options="options"></MyChart>
    </div>
  </div>
</template>
<script>
import MyChart from "@/components/MyChart";
import { getInsWatchStatus } from "@/api/dashboard";
import echarts from "echarts";
import Chance from "chance";

export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  components: {
    MyChart
  },
  data() {
    var colors = ["#5793f3", "#d14a61", "#675bba"];
    return {
      options: {
        tooltip: {
          trigger: "axis",
          position: function(pt) {
            return [pt[0], "10%"];
          }
        },
        title: {
          position: "left",
          text: "instagram数据分析"
        },
        legend: {
          data: ["关注数", "被关注数", "发帖数", "任务记录"]
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"]
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        tooltip: {
          trigger: "axis"
          // formatter: item => {
          //   debugger;
          //   let data = item.data.data;
          //   return `${this.$moment(item.data.createTime).format(
          //     "YYYY-MM-DD HH:mm"
          //   )}:${data.script}`;
          // }
        },
        series: [
          {
            name: "关注数",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(255, 20, 70)"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 70, 180)"
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)"
                }
              ])
            },
            data: []
          },
          {
            name: "被关注数",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(155, 0, 131)"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(155, 100, 68)"
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)"
                }
              ])
            },
            data: []
          },
          {
            name: "发帖数",
            type: "line",
            smooth: true,
            symbol: "none",
            sampling: "average",
            itemStyle: {
              color: "rgb(50, 0, 131)"
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(50, 0, 68)"
                },
                {
                  offset: 1,
                  color: "rgb(255, 70, 131)"
                }
              ])
            },
            data: []
          },
          {
            name: "任务记录",
            type: "scatter",
            itemStyle: {
              color: "#ccc"
            },
            tooltip: {
              trigger: "item",
              formatter: item => {
                debugger;
                let data = item.data.data;
                return `${this.$moment(item.data.createTime).format(
                  "YYYY-MM-DD HH:mm"
                )}:${data.script}`;
              }
            },
            emphasis: {
              label: {
                show: true,
                position: "right",
                color: "blue",
                fontSize: 16
              }
            },
            data: []
          }
        ]
      }
    };
  },
  created() {
    let colors = {
      ins_online: "#ccc",
      ins_auto_play: "#1890ff",
      copy_post: "green",
      spider_oeyes: "yellow",
      update_data: "#CDDC39",
      send_many_messages: "#b3522f"
    };

    this.options.title.subtext = `${this.$props.data.owner}->${
      this.$props.data.username
    }`;
    getInsWatchStatus({ pk: this.$props.data.pk }).then(results => {
      let mintime = new Date(results.results[0].statistical_time);
      let maxtime = new Date(
        results.results[results.results.length - 1].statistical_time
      );
      let maxss = maxtime.getTime() - mintime.getTime();
      this.options.series[0].data = results.results.map(it => {
        return it.following_count;
      });
      this.options.series[1].data = results.results.map(it => {
        return it.follower_count;
      });
      this.options.series[2].data = results.results.map(it => {
        return it.media_count;
      });
      this.options.series[3].data = results.events.map(it => {
        let time = new Date(it.createTime).getTime();
        let timeLine = time - mintime.getTime();
        const chance = new Chance(it.data.script);
        debugger;
        return {
          ...it,
          itemStyle: {
            color: colors[it.data.script] || "black"
          },
          value: [(timeLine / maxss) * this.options.series[2].data.length, 2]
        };
      });

      this.options.xAxis.data = results.results.map(it => {
        return this.$moment(it.statistical_time).format("YYYY-MM-DD HH:mm");
      });
    });
  }
};
</script>



