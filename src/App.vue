<template>
  <div>
    <div class="login" v-if="!ui.sessionId ">
      <el-form :model="ruleForm" status-icon ref="login" label-width="60px" class="demo-ruleForm">
        <el-form-item label="账号" prop="userName" :rules="{ required: true, message: '请输入账号' }">
          <el-input clearable v-model="ruleForm.userName" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="{ required: true, message: '请输入密码' }">
          <el-input clearable type="password" v-model="ruleForm.password" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('login')" style="width:100%">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="wrap" v-else>
      <div class="app-html">
        <div class="app-menu">
          <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="abcd" @select="e => (index = e)">
            <el-menu-item index="1">
              <i class="el-icon-s-check"></i>
              <span slot="title">身份审核</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-warning"></i>
              <span slot="title">退单处理</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-s-order"></i>
              <span slot="title">订单列表</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="app-body">
          <div class="app-head">
            <div class="item">
              <i class="el-icon-s-unfold" @click="abcd = false" v-if="abcd"></i>
              <i class="el-icon-s-fold" @click="abcd = true" v-else></i>
            </div>
            <div class="item ui">
              <el-avatar :size="34" fit="cover" :src="ui.url" />
              <span style="font-size:14px">{{
                ui.name || "未设置用户名"
              }}</span>
              <el-tag type="primary" size="mini" effect="dark" @click="logout" class="logout">退出</el-tag>
            </div>
          </div>
          <template v-if="index == 1">
            <div class="body" v-if="!abc">
              <div class="app-search">
                <el-form inline size="small" status-icon>
                  <el-form-item prop="phone" label="手机号码">
                    <el-input clearable v-model.number="search.phone" minlength="11" maxlength="11" />
                  </el-form-item>
                  <el-form-item prop="status" label="审核状态">
                    <el-select clearable v-model="search.status" @change="change">
                      <el-option label="全部" value></el-option>
                      <el-option label="已冻结" value="-9"></el-option>
                      <el-option label="待补充资料" value="-1"></el-option>
                      <el-option label="待审核" value="0"></el-option>
                      <el-option label="已认证" value="1"></el-option>
                      <el-option label="认证失败" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="company" label="公司名称">
                    <el-input clearable v-model.number="search.company" minlength="11" maxlength="11" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="success" @click="getData">搜索</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="app-content">
                <el-table tooltip-effect="dark" class="table-box" height="100%" border stripe show-summary :data="tableData" :summary-method="getSummaries" :key="index" v-loading="loading">
                  <el-table-column :resizable="false" show-overflow-tooltip prop="id" label="ID" width="100px" align="center" />
                  <el-table-column align="center" :resizable="false" show-overflow-tooltip prop="name" label="姓名" width="90px" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="phone" label="手机号" align="center" width="150px" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="mid" label="经理ID" align="center" width="100px" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="applyTime" label="申请时间" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="updateTime" label="更新时间" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="statusName" label="审核状态" align="center" width="150px" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="freezed" label="账号状态" align="center" width="100px" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="companyName" label="公司名称" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="msg" label="备注" align="center" />
                  <el-table-column width="100" label="操作" fixed="right" header-align="center">
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" @click="views(scope.row.id)">审核</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="app-page">
                <el-pagination background layout="prev, pager, next" :page-size="page.pageSize" :total="page.total" :current-page="page.pageNum + 1" @current-change="currentPage" hide-on-single-page></el-pagination>
              </div>
            </div>
            <div v-else style="overflow:auto;padding:20px ">
              <div style="padding:10px 10px">
                <span>逐张审核：</span>
                <el-switch v-model="onKey" />
                <el-button style="margin-left:20px" @click="abc = false" size="mini" type="danger">取消</el-button>
              </div>
              <div class="image">
                <template v-for="(item, index) in list">
                  <div class="item" :key="index">
                    <div class="img">
                      <el-image :src="item.url" fit="cover" :preview-src-list="[item.url]" />
                    </div>
                    <div class="content">
                      <div class="info">
                        <div>
                          拒绝原因：<span style="color:red">{{
                            item.msg || "暂无"
                          }}</span>
                        </div>
                        <div>ID：{{ item.id }}</div>
                        <!-- <div>审核状态：{{item.status || '暂无状态'}}</div> -->
                        <div>姓名：{{ item.name || "暂无" }}</div>
                        <div>证件号：{{ item.idCard || "暂无" }}</div>
                        <div>公司名称：{{ item.companyName || "暂无" }}</div>
                        <div>所在城市：{{ item.cityName }}</div>
                        <div>
                          图片类型：{{
                            {
                              person: "身份证人像面",
                              country: "身份证国徽面",
                              hand: "手持身份证",
                              company: "公司照片",
                              business: "机构营业执照",
                              contract: "劳动合同",
                              work: "工牌或名片"
                            }[item.type]
                          }}
                        </div>
                      </div>
                      <template v-if="onKey">
                        <div class="radio">
                          <span>是否通过：</span>
                          <el-radio v-model="item.pass" type="success" :label="true">通过</el-radio>
                          <el-radio v-model="item.pass" type="danger" :label="false">拒绝</el-radio>
                        </div>
                        <div class="msg">
                          <el-input clearable type="textarea" v-model="item.msg" resize="none" v-if="!item.pass" placeholder="请输入审核意见" :rules="{
                              required: true,
                              message: '请输入审核意见'
                            }" />
                        </div>
                        <el-button @click="onSubmit(item)" type="primary" style="width:100%;margin:10px auto">提交</el-button>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
              <div class="input" v-if="!onKey">
                <div class="radio">
                  <span>是否通过：</span>
                  <el-radio v-model="abcde.pass" :label="true">通过</el-radio>
                  <el-radio v-model="abcde.pass" :label="false">拒绝</el-radio>
                </div>
                <div class="text" v-if="!abcde.pass">
                  <span>审核意见：</span>
                  <el-input clearable type="textarea" v-model="abcde.msg" resize="none" placeholder="请输入审核意见" />
                </div>
              </div>
              <div class="btn">
                <el-button type="danger" @click="abc = false">取消</el-button>
                <el-button v-if="!onKey" type="success" @click="onSubmit(abcde)">提交</el-button>
              </div>
            </div>
          </template>
          <template v-if="index == 2">
            <div class="body">
              <div class="app-search">
                <el-form inline size="small" status-icon>
                  <el-form-item prop="name" label="姓名">
                    <el-input clearable v-model="searchUser.name" />
                  </el-form-item>
                  <el-form-item prop="phone" label="手机号">
                    <el-input clearable v-model="searchUser.phone" minlength="11" maxlength="11" />
                  </el-form-item>
                  <el-form-item prop="idCard" label="身份证号">
                    <el-input clearable v-model="searchUser.idCard" minlength="16" maxlength="18" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="success" @click="getDataUser">搜索</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="app-content">
                <el-table tooltip-effect="dark" class="table-box" height="100%" border stripe :data="tableDataUser" :summary-method="getSummaries" :key="index" v-loading="loading">
                  <el-table-column :resizable="false" show-overflow-tooltip prop="id" label="ID" width="100px" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="name" label="姓名" width="90px" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="idCard" label="身份证号码" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="phone" label="手机号" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="statusName" label="账号状态" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="account" label="余额" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="cityName" label="所在城市" align="center" />
                  <el-table-column :resizable="false" label="操作" width="450" align="center">
                    <template slot-scope="scope">
                      <el-button type="danger" @click="
                          () => {
                            dialog = true;
                            abcdef.id = scope.row.id;
                          }
                        ">修改号码</el-button>
                      <el-button type="danger" @click="initCert(scope.row.id)">重置认证</el-button>
                      <el-button type="danger" @click="freeze(scope.row.id)">冻结</el-button>
                      <el-button type="danger" @click="thaw(scope.row.id)">解冻</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="app-page">
                <el-pagination background layout="prev, pager, next" :page-size="pu.pageSize" :total="pu.total" :current-page="page.pageNum + 1" @current-change="cpu" hide-on-single-page></el-pagination>
              </div>
            </div>
            <el-dialog title="修改手机号码" :visible.sync="dialog" width="450px">
              <el-form :model="abcdef" inline>
                <el-form-item label="新手机号" prop="newPhone" :rules="[
                    {
                      required: true,
                      message: '请输入手机号码',
                      trigger: 'blur'
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: '手机号码错误',
                      trigger: 'blur'
                    }
                  ]">
                  <el-input clearable v-model="abcdef.newPhone" placeholder="请输入新的手机号码" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="changePhone">提 交</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </template>
          <template v-if="index == 3">
            <div class="body">
              <div class="app-search">
                <el-form inline size="small" status-icon>
                  <el-form-item prop="phone" label="手机号/订单号">
                    <el-input clearable v-model="backForm.phone" minlength="11" />
                  </el-form-item>
                  <!-- <el-form-item prop="idCard" label="订单号">
                    <el-input clearable v-model="backForm.order" minlength="16" maxlength="18" />
                  </el-form-item> -->
                  <el-form-item>
                    <el-button type="success" @click="backSearch">搜索</el-button>
                    <el-button type="danger" @click="backOrder">退单</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="app-content">
                <el-table tooltip-effect="dark" class="table-box" border stripe :data="backTable" :key="index" v-loading="loading">
                  <el-table-column :resizable="false" show-overflow-tooltip prop="createDate" label="申请时间" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="loanChannel" label="来源渠道" align="center" />
                  <el-table-column :resizable="false" show-overflow-tooltip prop="loanName" label="用户姓名" align="center" />
                  <el-table-column :resizable="false" prop="managerName" label="经理姓名" align="center" />
                  <el-table-column :resizable="false" prop="managerPhone" label="经理手机号" align="center" />
                  <el-table-column :resizable="false" prop="managerAccount" :formatter="
                      (row, col, val, index) => {
                        return val / 100;
                      }
                    " label="账户余额" align="center" />
                  <el-table-column :resizable="false" prop="takeDate" label="抢单时间" align="center" />
                  <el-table-column :resizable="false" prop="price" label="订单价格" align="center" />
                </el-table>
              </div>
            </div>
            <el-dialog title="修改手机号码" :visible.sync="dialog" width="450px">
              <el-form :model="abcdef" inline>
                <el-form-item label="新手机号" prop="newPhone" :rules="[
                    {
                      required: true,
                      message: '请输入手机号码',
                      trigger: 'blur'
                    },
                    {
                      pattern: /^\d{11}$/,
                      message: '手机号码错误',
                      trigger: 'blur'
                    }
                  ]">
                  <el-input clearable v-model="abcdef.newPhone" placeholder="请输入新的手机号码" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="changePhone">提 交</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </template>
          <template v-if="index == 4">
            <orderList />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body,
html {
  padding: 0;
  margin: 0;
}
.login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 400px;
  height: 150px;
  border-radius: 5px;
  padding: 40px 20px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
}

.app-html {
  min-width: 1000px;
  display: flex;
  justify-content: space-between;
  height: 100vh;
  overflow: hidden;
  .app-menu {
    border-right: 1px solid #e6e6e6;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
      border: none;
    }
    .el-menu {
      border: none;
    }
  }
  .app-body {
    flex: auto;
    display: grid;
    grid-template-rows: 60px auto;
    .app-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;

      .item {
        margin: 0 10px;
      }
      .ui {
        display: flex;
        justify-content: center;
        align-items: center;
        span,
        .el-avatar,
        .el-tag {
          margin-left: 15px;
        }
        .logout {
          cursor: pointer;
        }
      }
    }
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
  }
  .image {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .item {
      width: 260px;
      border: 1px solid #ccc;
      margin: 5px;
      .img {
        width: 260px;
        height: 200px;
        overflow: hidden;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        padding: 20px 20px 10px;
        .info {
          > div {
            margin-bottom: 10px;
          }
        }
        .radio {
          margin-bottom: 10px;
        }
      }
    }
  }
  .btn {
    text-align: center;
    overflow: hidden;
    margin: 20px auto;
  }
  .input {
    border-top: 1px dashed #ccc;
    margin-top: 20px;
    .radio {
      padding: 20px 10px;
    }
    .el-textarea {
      width: 300px;
    }
    .text {
      padding: 0 10px;
      span {
        vertical-align: top;
      }
    }
  }
}
</style>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "home",
  components: { orderList: () => import("./orderlist.vue") },
  data() {
    return {
      index: "1",
      list: [],
      abcdef: {},
      abc: false,
      abcd: false,
      onKey: true,
      dialog: false,
      tableData: [],
      searchUser: {},
      tableDataUser: [],
      ui: { sessionId: "" },
      abcde: { pass: true, type: null },
      page: { pageNum: 0, pageSize: 30 },
      search: { status: "0", phone: null, company: null },
      pu: { pageNum: 0, pageSize: 30 },
      ruleForm: { userName: "", password: "" },
      backForm: {},
      backTable: [],
      loading: true
    };
  },
  watch: {
    ui() {
      this.getData();
      this.getDataUser();
    }
  },
  created() {
    let session = window.sessionStorage.getItem("ui");
    if (session) {
      this.ui = JSON.parse(session);
      this.getData();
      this.getDataUser();
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("ui");
      this.ui = {};
      this.index = "1";
    },
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let form = {
            ...this.ruleForm,
            password: this.md5(this.ruleForm.password)
          };
          let { data } = await axios("/backend/login", {
            params: form
          });
          if (data.code == 200) {
            this.ui = data.data;
            window.sessionStorage.setItem("ui", JSON.stringify(data.data));
            document.cookie = `sessionId=${data.data.sessionId}`;
            this.getData();
          } else {
            this.$alert(data.msg, "登录错误", {
              confirmButtonText: "确定",
              type: "warning"
            });
          }
        } else {
          return false;
        }
      });
    },
    currentPage(val) {
      this.page.pageNum = val - 1;
      this.getData();
    },
    getSummaries(val) {
      return val;
    },
    async getData() {
      let form = this.page;
      if (this.search.phone) {
        form = this.search;
        this.page.pageNum = 0;
      } else {
        form = Object.assign({}, this.page, this.search);
      }
      let { data } = await axios("/backend/audit/auditList", {
        params: form
      });
      if (data.code == 200) {
        this.tableData = data.data.list || [];
        this.page.total = data.data.total;
      }
      this.loading = false;
    },
    async views(id) {
      let { data } = await axios("/backend/audit/detail", {
        params: { id: id }
      });
      if (data.code == 200) {
        this.list = data.data.imgs.map(e => {
          return {
            ...data.data,
            ...e,
            pass: true
          };
        });
        this.abc = true;
        this.abcde.id = id;
      }
    },
    async onSubmit(form) {
      form = {
        id: form.id,
        type: form.type,
        msg: form.msg,
        pass: form.pass
      };
      if (!form.pass && !form.msg) {
        this.$alert("请输入审核意见", "提示", {
          type: "warning"
        });
        return;
      }
      let { data } = await axios("/backend/audit/audit", {
        method: "post",
        params: form
      });
      if (data.code == 200) {
        if (!this.onKey) {
          this.abc = false;
          this.abcde = {};
        }
        this.getData();
        this.$message.success("审核成功");
      } else {
        this.$message.error(data.msg);
      }
    },
    async getDataUser() {
      this.loading = true;
      let form = this.pu;
      if (
        this.searchUser.name ||
        this.searchUser.phone ||
        this.searchUser.idCard
      ) {
        form = this.searchUser;
        this.pu.pageNum = 0;
      }
      let { data } = await axios("/backend/manager/list", {
        params: form
      });
      if (data.code == 200) {
        this.tableDataUser = data.data.list || [];
        this.pu.total = data.data.total;
      }
      this.loading = false;
    },
    change() {
      console.log(0);
      this.page.pageNum = 0;
    },
    cpu(val) {
      this.pu.pageNum = val - 1;
      this.getDataUser();
    },
    async changePhone() {
      let { data } = await axios("/backend/manager/changePhone", {
        method: "post",
        params: this.abcdef
      });
      if (data.code == 200) {
        this.getDataUser();
        this.abcdef = {};
        this.$message.success("修改成功");
        this.dialog = false;
      } else {
        this.$message.error(data.msg);
      }
    },

    async freeze(id) {
      let { data } = await axios("/backend/manager/freeze", {
        method: "post",
        params: { id: id }
      });
      if (data.code == 200) {
        this.$message.success("冻结成功");
        this.getDataUser();
      } else {
        this.$message.error("已经冻结，请勿重复操作");
      }
    },

    async thaw(id) {
      let { data } = await axios("/backend/manager/thaw", {
        method: "post",
        params: { id: id }
      });
      if (data.code == 200) {
        this.$message.success("解冻成功");
        this.getDataUser();
      } else {
        this.$message.error("已经解冻，请勿重复操作");
      }
    },

    async initCert(id) {
      let { data } = await axios("/backend/manager/initCert", {
        method: "post",
        params: { id: id }
      });
      if (data.code == 200) {
        this.$message.success("重置成功");
        this.getDataUser();
      } else {
        if (data.code == -8) {
          this.$message.error("账号已冻结，状态不可更改");
          this.getDataUser();
        } else {
          this.$message.error("已经重置，请勿重复操作");
        }
      }
    },

    async backOrder() {
      let { data } = await axios("/backend/refund", {
        method: "post",
        params: this.backForm
      });
      if (data.code == 200) {
        this.backTable = [];
        this.$message.success("退单成功");
        // this.backSearch();
      } else {
        if (data.code == -3) {
          this.$message.error(
            "校验失败，订单不存在 | 已退过 | 超时 | 有订单没流水！"
          );
          // this.backSearch();
        } else {
          this.$message.error(data.msg);
        }
      }
    },

    async backSearch() {
      this.loading = true;
      // let { data } = await axios("http://www.congrong-inc.com/backend/orderInfo",{
      let { data } = await axios("/backend/orderInfo", {
        method: "post",
        params: this.backForm
      });
      if (data.code == 200) {
        this.backTable = [data.data];
      } else {
        this.backTable = [];
        if (data.code == -3) {
          this.$message.error("查询失败");
        } else {
          this.$message.error(data.msg);
        }
      }
      this.loading = false;
    }
  }
};
</script>

