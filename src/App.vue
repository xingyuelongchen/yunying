<template>
  <div>
    <div class="login" v-if="!userInfo.sessionId">
      <el-form :model="ruleForm" status-icon ref="login" label-width="60px" class="demo-ruleForm">
        <el-form-item label="账号" prop="userName" :rules="{required:true,message:'请输入账号'}">
          <el-input v-model="ruleForm.userName" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="{required:true,message:'请输入密码'}">
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
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            :collapse="abcd"
            @select="e=>index=e"
          >
            <el-menu-item index="1">
              <i class="el-icon-s-check"></i>
              <span slot="title">身份审核</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="app-body">
          <div class="app-head">
            <div class="item">
              <i class="el-icon-s-unfold" @click="abcd = false" v-if="abcd"></i>
              <i class="el-icon-s-fold" @click="abcd = true" v-else></i>
            </div>
            <div class="item userinfo">
              <el-avatar :size="34" fit="cover" :src="userInfo.url " />
              <span style="font-size:14px">{{userInfo.name || '未设置用户名'}}</span>
              <el-tag type="primary" size="mini" effect="dark" @click="logout" class="logout">退出</el-tag>
            </div>
          </div>
          <template v-if="index== 1">
            <div class="body" v-if="!abc">
              <div class="app-search">
                <el-form inline size="small" status-icon>
                  <el-form-item prop="phone" label="手机号">
                    <el-input v-model.number="search.phone" minlength="11" maxlength="11" />
                  </el-form-item>
                  <el-form-item prop="status" label="审核状态">
                    <el-select v-model="search.status">
                      <el-option label="全部" value></el-option>
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
                    align="center"
                    :resizable="false"
                    show-overflow-tooltip
                    prop="name"
                    label="姓名"
                    width="150px"
                  />
                  <el-table-column
                    :resizable="false"
                    show-overflow-tooltip
                    prop="phone"
                    label="手机号码"
                    align="center"
                    width="150px"
                  />
                  <el-table-column
                    :resizable="false"
                    show-overflow-tooltip
                    prop="mid"
                    label="mid"
                    align="center"
                    width="100px"
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
                    width="150px"
                  />
                  <el-table-column
                    :resizable="false"
                    show-overflow-tooltip
                    prop="msg"
                    label="备注"
                    align="left"
                  />
                  <el-table-column width="100" label="操作" fixed="right" header-align="center">
                    <template slot-scope="scope">
                      <el-button size="mini" type="danger" @click="views(scope.row.id)">审核</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="app-page">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :page-size="page.pageSize"
                  :total="page.total"
                  @current-change="currentPage"
                  hide-on-single-page
                ></el-pagination>
              </div>
            </div>
            <div v-else style="overflow:auto;padding:20px ">
              <div style="padding:10px 10px">
                <span>逐张审核：</span>
                <el-switch v-model="onKey" />
                <el-button
                  style="margin-left:20px"
                  @click="abc = false"
                  size="mini"
                  type="danger"
                >取消</el-button>
              </div>
              <div class="image">
                <template v-for="(item,index) in list">
                  <div class="item" :key="index">
                    <div class="img">
                      <el-image :src="item.url" fit="cover" :preview-src-list="[item.url]" />
                    </div>
                    <div class="content">
                      <div class="info">
                        <div>审核状态：{{item.status || '暂无状态'}}</div>
                        <div>
                          图片类型：{{ {
                          person: "身份证人像面",
                          country: "身份证国徽面",
                          hand: "手持身份证",
                          company: "公司照片",
                          business: "机构营业执照",
                          contract: "劳动合同",
                          work: "工牌或名片"
                          }[item.type] }}
                        </div>
                        <div>所在城市：{{item.cityName}}</div>
                        <div>ID：{{item.id}}</div>
                      </div>
                      <template v-if="onKey">
                        <div class="radio">
                          <span>是否通过：</span>
                          <el-radio v-model="item.pass" type="success" :label="true">通过</el-radio>
                          <el-radio v-model="item.pass" type="danger" :label="false">拒绝</el-radio>
                        </div>
                        <div class="msg">
                          <el-input
                            type="textarea"
                            v-model="item.msg"
                            resize="none"
                            v-if="!item.pass"
                            placeholder="请输入审核意见"
                            :rules="{required:true,message:'请输入审核意见'}"
                          />
                        </div>
                        <el-button
                          @click="onSubmit(item)"
                          type="primary"
                          style="width:100%;margin:10px auto"
                        >提交</el-button>
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
                  <el-input
                    type="textarea"
                    v-model="abcde.msg"
                    resize="none"
                    placeholder="请输入审核意见"
                  />
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
                  <el-form-item prop="phone" label="手机号">
                    <el-input v-model.number="searchUser.phone" minlength="11" maxlength="11" />
                  </el-form-item>
                  <el-form-item prop="idCard" label="身份证号">
                    <el-input v-model.number="searchUser.idCard" minlength="16" maxlength="18" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="success" @click="getDataUser">搜索</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="app-content">
                <el-table
                  tooltip-effect="dark"
                  class="table-box"
                  height="100%"
                  border
                  stripe
                  show-summary
                  :data="tableDataUser"
                  :summary-method="getSummaries"
                >
                  <el-table-column
                    :resizable="false"
                    show-overflow-tooltip
                    prop="id"
                    label="ID"
                    width="100px"
                    align="center"
                  />
                  <el-table-column
                    :resizable="false"
                    show-overflow-tooltip
                    prop="name"
                    label="姓名"
                    width="90px"
                  />
                  <el-table-column
                    align="center"
                    :resizable="false"
                    show-overflow-tooltip
                    prop="idCard"
                    label="身份证号码"
                  />
                  <el-table-column
                    align="center"
                    :resizable="false"
                    show-overflow-tooltip
                    prop="phone"
                    label="手机号"
                  />
                  <el-table-column
                    align="center"
                    :resizable="false"
                    show-overflow-tooltip
                    prop="statusName"
                    label="状态"
                  />
                  <el-table-column
                    :resizable="false"
                    show-overflow-tooltip
                    prop="account"
                    label="account"
                  />
                  <el-table-column
                    :resizable="false"
                    show-overflow-tooltip
                    prop="cityName"
                    label="所在城市"
                  />
                </el-table>
              </div>
              <div class="app-page">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :page-size="pageUser.pageSize"
                  :total="pageUser.total"
                  @current-change="currentPageUser"
                  hide-on-single-page
                ></el-pagination>
              </div>
            </div>
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
    .body {
      display: grid;
      grid-template-rows: 60px auto 60px;
      overflow: hidden;
      &.active {
        grid-template-rows: 60px auto;
        overflow: hidden;
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
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 15px;
      .el-pagination {
        padding: 0;
      }
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
</style>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  name: "home",
  data() {
    return {
      index: "1",
      list: [],
      onKey: true,
      tableData: [],
      tableDataUser: [],
      abc: false,
      abcd: false,
      abcde: { pass: true, type: null },
      userInfo: { sessionId: "" },
      search: { status: "0", phone: null },
      searchUser: {},
      page: { pageNum: 0, pageSize: 30 },
      pageUser: { pageNum: 0, pageSize: 30 },
      ruleForm: { userName: "", password: "" }
    };
  },
  watch: {
    userInfo() {
      this.getData();
      this.getDataUser();
    }
  },
  created() {
    let session = window.sessionStorage.getItem("userinfo");
    if (session) {
      this.userInfo = JSON.parse(session);
      this.getData();
      this.getDataUser();
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("userinfo");
      this.userInfo = {};
      this.index = "1";
    },
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let form = {
            ...this.ruleForm,
            password: this.md5(this.ruleForm.password)
          };
          let { data } = await axios(
            "http://test.congrong-inc.com/manager/backend/login",
            {
              params: form
            }
          );
          if (data.code == 200) {
            this.userInfo = data.data;
            window.sessionStorage.setItem(
              "userinfo",
              JSON.stringify(data.data)
            );
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
      let { data } = await axios(
        "http://test.congrong-inc.com/manager/backend/audit/auditList",
        {
          params: Object.assign({}, this.page, this.search)
        }
      );
      if (data.code == 200) {
        this.tableData = data.data.list || [];
        this.page.total = data.data.total;
      }
    },
    async views(id) {
      let { data } = await axios(
        "http://test.congrong-inc.com/manager/backend/audit/detail",
        {
          params: { id: id }
        }
      );
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
      let { data } = await axios(
        "http://test.congrong-inc.com/manager/backend/audit/audit",
        {
          method: "post",
          params: form
        }
      );
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
      let { data } = await axios(
        "http://test.congrong-inc.com/manager/backend/manager/list",
        {
          params: Object.assign({}, this.pageUser, this.searchUser)
        }
      );
      if (data.code == 200) {
        this.tableDataUser = data.data.list || [];
        this.pageUser.total = data.data.total;
      }
    },
    currentPageUser(val) {
      this.pageUser.pageNum = val - 1;
      this.getDataUser();
    }
  },
  filters: {
    mapType(val) {
      return [val];
    }
  }
};
</script> 