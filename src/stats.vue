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
      <el-card header="loanDate">
        <div class="w">
          <div class="title">register</div>
          <div class="box">
            <div class="item">
              <ve-line v-bind="chartData.register.all" :loading="loading" />
            </div>
            <div class="item">
              <ve-histogram v-bind="chartData.register.channel" :loading="loading" />
            </div>
            <div class="item">
              <ve-pie v-bind="chartData.register.ratio" :loading="loading" />
            </div>
          </div>
        </div>
        <div class="w">
          <div class="title">LoanBuy</div>
          <div class="box">
            <div class="item">
              <ve-line v-bind="chartData.LoanBuy.all" :loading="loading" />
            </div>
            <div class="item">
              <ve-histogram v-bind="chartData.LoanBuy.channel" :loading="loading" />
            </div>
            <div class="item">
              <ve-pie v-bind="chartData.LoanBuy.ratio" :loading="loading" />
            </div>
          </div>
        </div>
        <div class="w">
          <div class="title">EffectNum</div>
          <div class="box">
            <div class="item">
              <ve-line v-bind="chartData.EffectNum.all" :loading="loading" />
            </div>
            <div class="item">
              <ve-histogram v-bind="chartData.EffectNum.channel" :loading="loading" />
            </div>
            <div class="item">
              <ve-pie v-bind="chartData.EffectNum.ratio" :loading="loading" />
            </div>
          </div>
        </div>
      </el-card>

      <el-card header="managerDate">
        <div class="w">
          <div class="title">allManagerPassNum</div>
          <div class="box">
            <div class="item">
              <ve-line v-bind="chartData.ManagerPassNum.all" :loading="loading" />
            </div>
            <div class="item">
              <ve-histogram v-bind="chartData.ManagerPassNum.channel" :loading="loading" />
            </div>
            <div class="item">
              <ve-pie v-bind="chartData.ManagerPassNum.ratio" :loading="loading" />
            </div>
          </div>
        </div>
        <div class="w">
          <div class="title">allManagerRegisterNum</div>
          <div class="box">
            <div class="item">
              <ve-line v-bind="chartData.ManagerRegisterNum.all" :loading="loading" />
            </div>
            <div class="item">
              <ve-histogram :loading="loading" v-bind="chartData.ManagerRegisterNum.channel" />
            </div>
            <div class="item">
              <ve-pie v-bind="chartData.ManagerRegisterNum.ratio" :loading="loading" />
            </div>
          </div>
        </div>

      </el-card>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
import 'v-charts/lib/style.css';
export default {
  name: 'stats',
  data() {
    return {
      loading: true,
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
        register: {
          all: {
            title: { text: '总注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            colors: ['#409EFF'],
            toolbox: {
              feature: {
                magicType: { type: ['line', 'bar'] },
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              labelMap: {
                all_register_num: '用户总数'
              },
              yAxisName: ['总注册量']
            }
          },
          channel: {
            title: { text: '渠道注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              legendLimit: 5,
              yAxisName: ['渠道注册']
            }
          },
          ratio: {
            title: { text: '渠道注册占比' },
            data: {
              columns: [],
              rows: []
            },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              legendLimit: 5,
              // labelLine: { show: true },
              label: { show: false, position: 'inside' },
              radius: 150
            }
          }
        },
        LoanBuy: {
          all: {
            title: { text: '总注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            colors: ['#409EFF'],
            toolbox: {
              feature: {
                magicType: { type: ['line', 'bar'] },
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              labelMap: {
                all_register_num: '用户总数'
              },
              yAxisName: ['总注册量']
            }
          },
          channel: {
            title: { text: '渠道注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              legendLimit: 5,
              yAxisName: ['渠道注册']
            }
          },
          ratio: {
            title: { text: '渠道注册占比' },
            data: {
              columns: [],
              rows: []
            },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              legendLimit: 5,
              // labelLine: { show: true },
              label: { show: false, position: 'inside' },
              radius: 150
            }
          }
        },
        EffectNum: {
          all: {
            title: { text: '总注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            colors: ['#409EFF'],
            toolbox: {
              feature: {
                magicType: { type: ['line', 'bar'] },
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              labelMap: {
                all_register_num: '用户总数'
              },
              yAxisName: ['总注册量']
            }
          },
          channel: {
            title: { text: '渠道注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              legendLimit: 5,
              yAxisName: ['渠道注册']
            }
          },
          ratio: {
            title: { text: '渠道注册占比' },
            data: {
              columns: [],
              rows: []
            },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              legendLimit: 5,
              // labelLine: { show: true },
              label: { show: false, position: 'inside' },
              radius: 150
            }
          }
        },
        ManagerRegisterNum: {
          all: {
            title: { text: '总注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            colors: ['#409EFF'],
            toolbox: {
              feature: {
                magicType: { type: ['line', 'bar'] },
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              labelMap: {
                all_register_num: '用户总数'
              },
              yAxisName: ['总注册量']
            }
          },
          channel: {
            title: { text: '渠道注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              legendLimit: 5,
              yAxisName: ['渠道注册']
            }
          },
          ratio: {
            title: { text: '渠道注册占比' },
            data: {
              columns: [],
              rows: []
            },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              legendLimit: 5,
              label: { show: false, position: 'inside' },
              radius: 150
            }
          }
        },
        ManagerPassNum: {
          all: {
            title: { text: '总注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            colors: ['#409EFF'],
            toolbox: {
              feature: {
                magicType: { type: ['line', 'bar'] },
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              labelMap: {
                all_register_num: '用户总数'
              },
              yAxisName: ['总注册量']
            }
          },
          channel: {
            title: { text: '渠道注册数' },
            data: {
              columns: [],
              rows: []
            },
            extend: { 'xAxis.0.axisLabel.rotate': 60 },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              showline: [],
              stack: {},
              legendLimit: 5,
              yAxisName: ['渠道注册']
            }
          },
          ratio: {
            title: { text: '渠道注册占比' },
            data: {
              columns: [],
              rows: []
            },
            'legend-visible': false,
            'judge-width': true,
            height: '100%',
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            settings: {
              legendLimit: 5,
              label: { show: false, position: 'inside' },
              radius: 150
            }
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
      let { data } = await axios('/backend/order/select-channel', {
        params: this.search
      });
      if (data.code == 200) {
        // loanDate register
        this.chartData.register.all.data = data.data.loanDate.allLoanRegisterNum;
        this.chartData.register.channel.settings.stack = { channel: data.data.loanDate.channelLoanRegisterNum.columns };
        this.chartData.register.channel.data = data.data.loanDate.channelLoanRegisterNum;
        this.chartData.register.ratio.data = data.data.loanDate.ratioLoanRegister;
        // allLoanBuyNum
        this.chartData.LoanBuy.all.data = data.data.loanDate.allLoanBuyNum;
        this.chartData.LoanBuy.channel.settings.stack = { channel: data.data.loanDate.channelLoanBuyNum.columns };
        this.chartData.LoanBuy.channel.data = data.data.loanDate.channelLoanBuyNum;
        this.chartData.LoanBuy.ratio.data = data.data.loanDate.ratioLoanBuy;

        //
        this.chartData.EffectNum.all.data = data.data.loanDate.allLoanEffectNum;
        this.chartData.EffectNum.channel.settings.stack = { channel: data.data.loanDate.channelLoanEffectNum.columns };
        this.chartData.EffectNum.channel.data = data.data.loanDate.channelLoanEffectNum;
        this.chartData.EffectNum.ratio.data = data.data.loanDate.ratioLoanEffect;

        //
        // managerDate register
        this.chartData.ManagerRegisterNum.all.data = data.data.managerDate.allManagerRegisterNum;
        this.chartData.ManagerRegisterNum.channel.settings.stack = { channel: data.data.managerDate.channelManagerRegisterNum.columns };
        this.chartData.ManagerRegisterNum.channel.data = data.data.managerDate.channelManagerRegisterNum;
        this.chartData.ManagerRegisterNum.ratio.data = data.data.managerDate.ratioManager;

        this.chartData.ManagerPassNum.all.data = data.data.managerDate.allManagerPassNum;
        this.chartData.ManagerPassNum.channel.settings.stack = { channel: data.data.managerDate.channelManagerPassNum.columns };
        this.chartData.ManagerPassNum.channel.data = data.data.managerDate.channelManagerPassNum;
        this.chartData.ManagerPassNum.ratio.data = data.data.managerDate.ratioManagerPass;

        this.key = Math.random();
      }
      this.loading = false;
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
  height: 100%;
  overflow: auto !important;
  .el-card {
    margin: 20px 0;
    .w {
      overflow: hidden;
      width: 100%;
      margin-top: 20px;
      border: 1px solid #f5f5f5;
      padding: 0 5px;
    }
    .title {
      line-height: 40px;
      font-size: 20px;
      margin: 0 -5px;
      margin-bottom: 10px;
      background: #f5f5f5;
      padding: 3px 5px;
    }
  }
  .box {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .item {
      min-width: 400px;
      width: 100%;
      height: 400px;
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