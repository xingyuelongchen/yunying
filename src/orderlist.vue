<!--
Template Name: order list
Create author: qinglong
Create Time  : 2020-09-20
-->
 
<template>
  <div class="body" v-if="show">
    <el-page-header @back="()=>this.show=!this.show" content="订单详情">
    </el-page-header>
    <div class="app-content">
      <div class="details">
        <div class="left">
          <el-card header="基本资料:">
            <el-form label-position="left" inline class="demo-table-expand">
              <template v-for="(item,index) in orderDetailFields">
                <el-form-item :label="item.name+':'" :key="index" v-if="item.name !== 'info'">
                  <span>{{ orderDetail[item.prop] }}</span>
                </el-form-item>
              </template>
            </el-form>
          </el-card>
        </div>
        <div class="right">
          <el-card header="信用信息:">
            <el-form label-position="left" inline class="demo-table-expand">
              <template v-for="(item,index) in orderDetailFieldsInfo">
                <el-form-item :label="item.name+':'" :key="index" v-if="item.name !== 'info'">
                  <span>{{ orderDetail.info[item.prop] }}</span>
                </el-form-item>
              </template>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
  <div class="body" v-else>
    <div class="app-search">
      <el-form inline size="small" status-icon>
        <el-form-item prop="name" label="姓名">
          <el-input clearable v-model="search.name" />
        </el-form-item>
        <el-form-item prop="loadPhone" label="手机号">
          <el-input clearable v-model="search.loadPhone" minlength="11" maxlength="11" />
        </el-form-item>
        <el-form-item prop="managerPhone" label="经理手机号">
          <el-input clearable v-model="search.managerPhone" minlength="11" maxlength="11" />
        </el-form-item>
        <el-form-item prop="orderNo" label="订单号">
          <el-input clearable v-model="search.orderNo" minlength="16" maxlength="18" />
        </el-form-item>
        <el-form-item prop="time" label="日期范围">
          <el-date-picker v-model="dateTime" type="datetimerange" @change="setdate" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-content">
      <el-table tooltip-effect="dark" class="table-box" height="100%" border stripe :data="tableData" v-loading="loading">
        <el-table-column :resizable="false" show-overflow-tooltip width="100px" prop="id" label="ID" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip width="100px" prop="name" label="姓名" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip width="250px" prop="order_no" label="订单号" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip prop="phone" label="手机号" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip prop="price" label="价格" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip prop="city_name" label="所在城市" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip prop="apply_money" label="贷款总额" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip prop="loan_for" label="贷款天数" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip prop="loan_days" label="贷款天数" align="center" />
        <el-table-column :resizable="false" show-overflow-tooltip prop="statusname" label="状态" align="center" />
        <el-table-column :resizable="false" width="200px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="views(scope.row)">查看订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="app-page">
      <el-pagination background layout="prev, pager, next" :page-size="page.pageSize" :total="total" :current-page="page.pageNum +1" @current-change="currentChange" hide-on-single-page></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "orderlist",
  data() {
    return {
      search: {},
      dateTime: [],
      show: true,
      orderDetail: {},
      orderDetailFields: [],
      orderDetailFieldsInfo: [],
      total: 0,
      page: { pageNum: 0, pageSize: 30 },
      loading: true,
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  created() {
    this.show = false;
  },
  mounted() {
    this.getData();
    this.orderDetailFields = Object.keys(this.orderDetail).map(e => {
      return {
        name: e,
        prop: e
      };
    });
    this.orderDetailFieldsInfo = Object.keys(
      JSON.parse(this.orderDetail.info)
    ).map(e => {
      return {
        name: e,
        prop: e
      };
    });
  },
  methods: {
    setdate() {
      if (this.dateTime) {
        this.search.starTime = this.dateTime[0];
        this.search.endTime = this.dateTime[1];
      } else {
        this.search.starTime = null;
        this.search.endTime = null;
      }
    },
    async views(item) {
      let { data } = await axios("/backend/order/listDetails", {
        params: { orderNo: item.order_no }
      });
      if (data.code == 200) {
        this.orderDetail = data.data;
        this.orderDetailFields = Object.keys(data.data).map(e => {
          return {
            name: e,
            prop: e
          };
        });
      }
      this.show = true;
    },
    getSearch() {
      this.getData();
    },
    async getData() {
      this.loading = true;
      let form = { ...this.page, ...this.search };
      if (this.search.starTime && this.search.endTime) {
        form = { ...this.page, ...this.search };
      } else if (
        this.search.name ||
        this.search.loadPhone ||
        this.search.managerPhone ||
        this.search.orderNo
      ) {
        form = this.search;
      }
      let obj = {};
      Object.keys(form).forEach(e => {
        if (form[e] !== null) obj[e] = form[e];
      });
      let { data } = await axios("/backend/order/list", {
        params: obj
      });
      if (data.code == 200) {
        this.tableData = data.data.list;
        this.total = data.data.total;
      }
      this.loading = false;
    },
    currentChange(val) {
      this.page.pageNum = val - 1;
      this.getData();
    }
  }
};
</script>
<style lang="less">
.body {
  // display: grid;
  // grid-template-rows: 60px auto 60px;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: column;
  overflow: hidden;
  &.active {
    grid-template-rows: 60px auto;
    overflow: hidden;
  }
}
.app-content {
  padding: 0 20px;
  overflow: hidden;
  flex: 1 1 auto;
  .table-box {
    td {
      padding: 5px;
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
.app-page {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 15px;
  height: 65px;
  .el-pagination {
    padding: 0;
  }
}
.el-page-header {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.details {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  > div {
    flex: 1;
    // border: 1px solid #ccc;
    // padding: 20px;
  }
  .right {
    margin-left: 20px;
  }
}
</style>
