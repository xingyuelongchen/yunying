<template>
  <div>
    <div class="login" v-if="!userInfo.sessionId">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="login"
        label-width="60px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="userName" required>
          <el-input v-model="ruleForm.userName" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" required>
          <el-input type="password" v-model="ruleForm.password" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('login')" style="width:100%">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="wrap" v-else>
      <div class="app-html">
        <div class="app-menu">
          <el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse">
            <el-menu-item index="2">
              <i class="el-icon-s-check"></i>
              <span slot="title">身份审核</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="app-body">
          <div class="app-head">
            <div class="item">
              <i class="el-icon-s-unfold" @click="isCollapse = false" v-if="isCollapse"></i>
              <i class="el-icon-s-fold" @click="isCollapse = true" v-else></i>
            </div>
            <div class="item userinfo">
              <el-avatar
                :size="34"
                fit="cover"
                :src="userInfo.url || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
              />
              <span style="font-size:14px">{{userInfo.name || '未设置用户名'}}</span>
              <el-tag type="primary" size="mini" effect="dark" @click="logout" class="logout">退出</el-tag>
            </div>
          </div>
          <div class="app-search">
            <el-form inline size="small" status-icon>
              <el-form-item prop="phone" label="手机号">
                <el-input v-model.number="search.phone" minlength="11" maxlength="11" />
              </el-form-item>
              <el-form-item prop="status" label="审核状态">
                <el-select v-model="search.status">
                  <el-option label="待补充资料" value="-1"></el-option>
                  <el-option label="待审核" value="0"></el-option>
                  <el-option label="已认证" value="1"></el-option>
                  <el-option label="认证失败" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="success" @click="getData">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="app-content">
            <el-table
              max-height="calc(100vh - 160px)"
              tooltip-effect="dark"
              class="table-box"
              height="100%"
              border
              stripe
              show-summary
              :data="tableData"
              :summary-method="getSummaries"
            >
              <el-table-column
                :resizable="false"
                show-overflow-tooltip
                prop="id"
                label="ID"
                width="60px"
                align="center"
              />
              <el-table-column
                :resizable="false"
                show-overflow-tooltip
                prop="name"
                label="姓名"
                width="100px"
              />
              <el-table-column
                :resizable="false"
                show-overflow-tooltip
                prop="phone"
                label="手机号码"
                align="center"
              />
              <el-table-column
                :resizable="false"
                show-overflow-tooltip
                prop="mid"
                label="mid"
                align="center"
                width="90px"
              />
              <el-table-column
                :resizable="false"
                show-overflow-tooltip
                prop="applyTime"
                label="申请时间"
                align="center"
              />
              <el-table-column
                :resizable="false"
                show-overflow-tooltip
                prop="updateTime"
                label="更新时间"
                align="center"
              />
              <el-table-column
                :resizable="false"
                show-overflow-tooltip
                prop="statusName"
                label="审核状态"
                align="center"
              />
              <el-table-column width="100" label="操作" fixed="right" header-align="center">
                <template slot-scope="scope">
                  <!-- <el-button size="mini" type="success">查看</el-button> -->
                  <el-button size="mini" type="danger" @click="views(scope.row.id)">审核</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="app-page">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="page.total"
              @current-change="currentPage"
              hide-on-single-page
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="审核"
      :visible.sync="dialogFormVisible"
      width="1000px"
      height="1000px"
      :close-on-click-modal="false"
    >
      <div>
        <!-- <div style="margin:20px 0">name：{{details.idCard}}</div>
        <div style="margin:20px 0">idCard：{{details.idCard}}</div>
        <div style="margin:20px 0">companyName：{{details.companyName}}</div>
        <div style="margin:20px 0">companyAddress：{{details.cityName}}{{details.companyAddress}}</div>-->
        <div class="image">
          <el-carousel
            :arrow="onKey?'never':'always'"
            :height="onKey?'540px':'400px'"
            :loop="false"
            :autoplay="false"
            ref="swipe"
            indicator-position="none"
            @change="changeSwipe"
          >
            <el-carousel-item v-for="(item,index) in details.imgs" :key="index">
              <div class="img">
                <el-image
                  fit="cover"
                  :preview-src-list="listImg"
                  :src="item.url"
                  style="height:400px"
                />
              </div>
              <el-form
                :model="shenForm"
                status-icon
                :ref="'shen'+index"
                label-width="100px"
                v-if="onKey"
              >
                <el-form-item label="是否通过:" prop="pass" :rules="{required:true,message:'必填项'}">
                  <el-radio v-model="shenForm.pass" :label="true">通过</el-radio>
                  <el-radio v-model="shenForm.pass" :label="false">拒绝</el-radio>
                </el-form-item>
                <el-form-item
                  label="拒绝原因:"
                  prop="msg"
                  v-if="!shenForm.pass"
                  :rules="{required:!shenForm.pass,message:'必填项'}"
                >
                  <el-input type="textarea" v-model="shenForm.msg" autocomplete="on"></el-input>
                </el-form-item>
              </el-form>
            </el-carousel-item>
          </el-carousel>
          <el-form :model="shenForm" status-icon ref="shen" label-width="100px" v-if="!onKey">
            <el-form-item label="是否通过" prop="pass" :rules="{required:true,message:'必填项'}">
              <el-radio v-model="shenForm.pass" :label="true">通过</el-radio>
              <el-radio v-model="shenForm.pass" :label="false">拒绝</el-radio>
            </el-form-item>
            <el-form-item
              label="拒绝原因"
              prop="msg"
              v-if="!shenForm.pass"
              :rules="{required:!shenForm.pass,message:'必填项'}"
            >
              <el-input type="textarea" v-model="shenForm.msg " autocomplete="on"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div style="text-align:center">
          <el-button
            @click="onKey=!onKey"
            type="success"
            style="width:150px"
          >{{onKey?'一键审核':'逐个审核'}}</el-button>
          <el-button @click="shen" type="primary" style="width:150px">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less">
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
    grid-template-rows: 60px 60px auto 40px;
    .app-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;

      .item {
        margin: 0 10px;
      }
      .userinfo {
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
    .app-content {
      padding: 0 20px;
      overflow: hidden;

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
    }
    .app-page {
      padding: 5px 20px;
      .el-pagination {
        padding: 0;
      }
    }
  }
}
</style>

<script>
export default {
  name: "home",
  data() {
    return {
      index: 0,
      details: {},
      listImg: [],
      onKey: false,
      tableData: [],
      isCollapse: false,
      shenForm: { pass: true, type: null },
      dialogFormVisible: false,
      userInfo: { sessionId: "" },
      page: { pageNum: 0, pageSize: 30 },
      search: { status: "0", phone: null },
      ruleForm: { userName: "jason", password: "moremoney" },
      rules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    let session = window.sessionStorage.getItem("userinfo");
    if (session) {
      this.userInfo = JSON.parse(session);
      this.getData();
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("userinfo");
      this.userInfo = {};
    },
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let form = {
            ...this.ruleForm,
            password: this.md5(this.ruleForm.password)
          };
          let { data } = await this.axios("/backend/login", {
            params: form
          });
          if (data.code == 200) {
            this.userInfo = data.data;
            window.sessionStorage.setItem(
              "userinfo",
              JSON.stringify(data.data)
            );
            document.cookie = `sessionId=${data.data.sessionId}`;
            this.getData();
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
    changeSwipe(val) {
      this.index = val;
    },
    getSummaries(val) {
      return val;
    },
    async getData() {
      let { data } = await this.axios("/backend/audit/auditList", {
        params: Object.assign({}, this.page, this.search)
      });
      if (data.code == 200) {
        this.tableData = data.data.list.length
          ? data.data.list
          : [
              {
                id: 4,
                phone: "17681833214",
                name: "王亿",
                mid: 7,
                applyTime: "2020-07-13 21:17:17",
                updateTime: "2020-07-13 21:17:17",
                statusName: "AUDITING",
                msg: null
              },
              {
                id: 2,
                phone: "17681859559",
                name: "张杰",
                mid: 6,
                applyTime: "2020-07-12 21:02:46",
                updateTime: "2020-07-12 21:02:46",
                statusName: "AUDITING",
                msg: null
              },
              {
                id: 1,
                phone: "15658000981",
                name: "郑豪",
                mid: 1,
                applyTime: "2020-07-09 22:25:51",
                updateTime: "2020-07-09 22:25:51",
                statusName: "AUDITING",
                msg: null
              }
            ];
        this.page.total = data.data.total;
      }
    },

    async views(id) {
      let { data } = await this.axios("/backend/audit/detail", {
        params: { id: id }
      });
      if (data.code == 200) {
        this.details = data.data;
        this.dialogFormVisible = true;
        this.shenForm.id = id;
        this.listImg = data.data.imgs.map(e => e.url);
      }
    },
    async shen() {
      try {
        if (!this.onKey && (await this.$refs["shen"].validate()));
        if (this.onKey) {
          let d = "shen" + this.index;
          await this.$refs[d][0].validate();
          this.shenForm.type = this.details.imgs[this.index].type;
        }
        let { data } = await this.axios("/backend/audit/audit", {
          method: "post",
          params: this.shenForm
        });
        if (data.code == 200) {
          this.shenForm = { pass: true };
          if (this.onKey) this.$refs["swipe"].next();
          else this.dialogFormVisible = false;
          this.getData();
          this.$message.success("审核成功");
        } else {
          this.$message.error(data.msg);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>