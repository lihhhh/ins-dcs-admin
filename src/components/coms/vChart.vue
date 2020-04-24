<template>
  <div class="cvs" ref="canvas">
  </div>

</template>

<script>
import echarts from "echarts";
import _ from 'lodash';

export default {
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      ops: this.options,
      chart: "",
      debounceChart: "",
      setOps: "",
      resize: ""
    };
  },
  methods: {
    resizeSync() {
      this.chart.resize();
    },
    setoptionsSync() {
      this.chart.setOption(this.ops);
    }
  },
  computed: {
    screen() {
      return this.$store.state.screen;
    }
  },
  watch: {
    screen(val) {
      this.resize()
    },
    options: {
      handler(val) {
        this.ops = val;
        this.setOps();
      },
      deep: true
    }
  },
  mounted() {
    var that = this;
    this.chart = echarts.init(this.$refs["canvas"]);
    this.$emit("init", this.chart);
    this.setOps();
  },
  created() {
    console.log("aaa");
    this.setOps = _.debounce(function() {
      if (!this.chart) return;
      this.chart.setOption(this.ops);
    }, 500);
    this.resize = _.debounce(function() {
      if (!this.chart) return;
      console.log("重绘");
      this.chart.resize();
    }, 500);

    window.addEventListener('resize',()=>{
        this.resize()
    })

  }
};
</script>

<style lang="scss">
.cvs {
  // background: red;
  width: 100%;
  height: 100%;
}
</style>