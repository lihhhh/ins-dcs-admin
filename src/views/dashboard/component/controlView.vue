<style lang="less">
.status-space {
  .chart {
    height: 400px;
  }
}
</style>
<template>
  <div class="status-space">
    <iframe :src="`http://${data.clientAddress}:8037/index.html`" style="width:375px;height:667px" frameborder="0"></iframe>
    <el-button @click="ins_online">上线10分钟</el-button>
    <el-button @click="update_data">更新头像</el-button>
  </div>
</template>
<script>
import request from "@/utils/request";

export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  methods: {
    ins_online() {
      return request({
        url: `http://${this.data.clientAddress}:8037/exec/script`,
        method: "post",
        data: {
          ...this.data,
          script: "ins_online",
          time: 1000 * 60 * 10
        }
      });
    },
    update_data() {
      return request({
        url: `http://${this.data.clientAddress}:8037/exec/script`,
        method: "post",
        data: {
          ...this.data,
          script: "update_data",
          data_touxiang: JSON.stringify({
            data: "http://47.57.124.172:8038/image/random",
            status: true
          })
        }
      });
    }
  }
};
</script>



