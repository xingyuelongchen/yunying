<!--
Template Name: stats
Create author: qinglong
Create Time  : 2020-11-01
-->
<template>
  <div class="body">
    <div class="app-search">
      <el-form inline size="small" status-icon>
        <el-form-item prop="phone" label="数据日期">
          <el-date-picker v-model="dateTime" type="datetimerange" @change="setdate" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-content" :key="key">
      <div class="box">
        <div class="item">
          <ve-line v-bind="chartData.all_register_num" />
        </div>
        <div class="item">
          <ve-histogram v-bind="chartData.channel_register_num" />
        </div>
        <div class="item">
          <ve-pie v-bind="chartData.ratio" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
export default {
  name: 'stats',
  data() {
    return {
      key: 0,
      dateTime: null,
      search: { starTime: null, endTime: null },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      chartData: {
        all_register_num: {
          data: {
            columns: [],
            rows: []
          },
          extend: { 'xAxis.0.axisLabel.rotate': 60 },
          'legend-visible': false,
          colors: ['#409EFF', '#20a0ff', '#c23531', '#749f83', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
          settings: {
            grid: { left: 0, right: 0, bottom: 0 },
            showline: [],
            stack: {},
            labelMap: {
              all_register_num: '用户总数'
            },
            yAxisName: ['总注册量']
          }
        },
        channel_register_num: {
          data: {
            columns: [],
            rows: []
          },
          extend: { 'xAxis.0.axisLabel.rotate': 60 },
          'legend-visible': false,
          colors: ['#409EFF', '#20a0ff', '#c23531', '#749f83', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
          settings: {
            grid: { left: 0, right: 0, bottom: 0 },
            showline: [],
            stack: {},
            labelMap: {
              register_num: '注册数量'
            },
            yAxisName: ['渠道注册']
          }
        },
        ratio: {
          data: {
            columns: [],
            rows: []
          },
          'legend-visible': false,
          settings: {
            grid: { left: 0, right: 0, bottom: 0 }
          }
        }
      }
    };
  },
  created() {
    this.getData();
  },

  methods: {
    async getData() {
      let { data } = await axios('/jud/select-channel', {
        params: this.search
      });
      console.log(data);
      if (data.code == 200) {
        let dataaa = {
          // Array => colums放置的是维度的字段组成的数组, 第一个元素是 X 轴坐标; 第二个元素为 Y 轴坐标
          // Array => rows 放置的是源数据, colums数组里的元素,必须在源数据里作为 key 出现;
          loanDate: {
            all_register_num: {
              // 按照日期展示总用户数
              columns: ['date', 'all_register_num'],
              rows: [
                { date: '2020年10月1日', all_register_num: 140 },
                { date: '2020年10月2日', all_register_num: 140 },
                { date: '2020年10月3日', all_register_num: 140 }
              ]
            },
            channel_register_num: {
              // 按照日期展示各渠道注册用户数
              columns: ['date', '渠道1', '渠道2', '渠道3'],
              rows: [
                { date: '2020年10月1日', 渠道1: 15, 渠道2: 35, 渠道3: 10 },
                { date: '2020年10月2日', 渠道1: 15, 渠道2: 35, 渠道3: 10 },
                { date: '2020年10月3日', 渠道1: 15, 渠道2: 35, 渠道3: 10 }
              ]
            },
            ratio: {
              // 展示时间段内,各渠道注册用户总数与所有渠道总数比例
              columns: ['channel', 'channel_register_num'],
              rows: [
                { channel: '渠道1', channel_register_num: 15 },
                { channel: '渠道2', channel_register_num: 15 },
                { channel: '渠道3', channel_register_num: 15 }
              ]
            }
          }
        };
        this.chartData.all_register_num.data.columns = dataaa.loanDate.all_register_num.columns;
        this.chartData.all_register_num.data.rows = dataaa.loanDate.all_register_num.rows;

        this.chartData.channel_register_num.settings.stack = { channel: dataaa.loanDate.channel_register_num.columns };
        this.chartData.channel_register_num.data.columns = dataaa.loanDate.channel_register_num.columns;
        this.chartData.channel_register_num.data.rows = dataaa.loanDate.channel_register_num.rows;

        this.chartData.ratio.data.columns = dataaa.loanDate.ratio.columns;
        this.chartData.ratio.data.rows = dataaa.loanDate.ratio.rows;

        this.key = Math.random();
      }
    },
    backSearch() {},
    setdate() {
      if (this.dateTime) {
        this.search.starTime = this.dateTime[0];
        this.search.endTime = this.dateTime[1];
      } else {
        this.search.starTime = null;
        this.search.endTime = null;
      }
    }
  }
};
</script>
<style lang='less' scoped>
.body {
  overflow: auto;
}
.app-content {
  .box {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .item {
      min-width: 400px;
      width: 100%;
      height: 250px;
    }
  }
}
.app-search {
  display: flex;
  align-items: center;
  padding-top: 15px;
  padding-left: 20px;
  min-height: 60px;
  height: auto;
  max-height: 120px;
}
</style>