<style lang="less">
.dashboard-container {
  margin: 10px;

  .list-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    .list {
      width: 100%;
      height: 400px;
    }
  }
  .warning-row {
    background: #989595 !important;
  }
  .number-style .cell {
    color: #0be614 !important;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>

<template>
  <div class="dashboard-container">
    <div class="filter-container">
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <div class="filter-item" style="margin-left:30px">
        <div style="display:flex">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>

          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName" :cell-class-name="cellClassName" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <chart :data="scope.row"></chart>
          <controlView v-if="name=='oeyes'" :data="scope.row"></controlView>
          <!-- <iframe :src="`http://${scope.row.clientAddress}:8037/index.html`" style="width:375px;height:667px" frameborder="0"></iframe> -->
        </template>
      </el-table-column>
      <el-table-column prop="index" label="index" width="60px">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="80px" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.profile_pic_url" alt="" style="width:50px;border-radius:50%">
        </template>
      </el-table-column>
      <el-table-column prop="username" label="username">
      </el-table-column>
      <el-table-column prop="follower_count" label="follower_count" sortable>
      </el-table-column>
      <el-table-column prop="following_count" label="following_count" sortable>
      </el-table-column>
      <el-table-column prop="media_count" label="media_count" sortable>
      </el-table-column>
      <el-table-column prop="statistical_time" label="统计时间">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.statistical_time).format('YYYY-MM-DD HH:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="verify_time" label="验证时间" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.verify_time">{{$moment(scope.row.verify_time).format('YYYY-MM-DD HH:mm')}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="clientAddress" label="clientAddress" sortable>
      </el-table-column>
      <!-- <el-table-column prop="external_url" label="网站链接" sortable>
      </el-table-column> -->

      <el-table-column prop="taskGroup" label="taskGroup" sortable :width="140">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getInsWatchList } from "@/api/dashboard";

import echarts from "echarts";
import waves from "@/directive/waves"; // waves directive
import chart from "./component";
import controlView from "./component/controlView";

const checkOptions = ["正常", "验证"];

export default {
  name: "Dashboard",
  components: {
    chart,
    controlView
  },
  directives: { waves },
  data() {
    return {
      results: [], // 全部数据
      downloadLoading: false,
      tableData: [],
      checkAll: true,
      checkedCities: ["正常", "验证"],
      cities: checkOptions,
      isIndeterminate: false
    };
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? checkOptions : [];
      this.isIndeterminate = false;
      this.replay();
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
      this.replay();
    },
    replay() {
      if (this.checkedCities.length == 0) {
        this.tableData = [];
      }
      if (this.checkedCities.length == 2) {
        this.tableData = this.results.filter(it => it.clientAddress);
      } else if (this.checkedCities[0] == "正常") {
        this.tableData = this.results.filter(
          it => !it.is_verify && it.clientAddress
        );
      } else if (this.checkedCities[0] == "验证") {
        this.tableData = this.results.filter(
          it => it.is_verify && it.clientAddress
        );
      }
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "username",
          "粉丝数",
          "关注数",
          "发帖数",
          "统计时间",
          "是否被验证(TURE为被验证)",
          "clientAddress",
          "taskGroup",
          "网站链接",
          "备注",
          "tags"
        ];
        const filterVal = [
          "username",
          "follower_count",
          "following_count",
          "media_count",
          "statistical_time",
          "is_verify",
          "clientAddress",
          "taskGroup",
          "external_url",
          "remark",
          "tags"
        ];
        const data = this.formatJson(filterVal, this.tableData);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return this.$moment(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.is_verify) {
        return "warning-row";
      }
      return "";
    },
    cellClassName({ row, column }) {
      if (row[column.label] > 0) {
        return "number-style";
      }
      return "";
    }
  },
  computed: {
    ...mapGetters(["name"])
  },
  created() {
    getInsWatchList().then(results => {
      let datas = results.results;
      this.results = results.results;
      datas.map(it => {
        it.follower_count = it.follower_count || 0;
        it.following_count = it.following_count || 0;
        it.media_count = it.media_count || 0;
        it.following_tag_count = it.following_tag_count || 0;
        it.total_igtv_videos = it.total_igtv_videos || 0;
        it.statistical_time = this.$moment(it.statistical_time).format(
          "YYYY-MM-DD HH:mm"
        );
      });
      this.replay();
    });
  }
};
// dogs,puppylove,dogstagram,dog,puppy,dog_features,doglife,doggies,dogphotography,cutedogsofinstagram
</script>
