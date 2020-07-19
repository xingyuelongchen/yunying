import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import md5 from 'js-md5';
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
if (Date.now() < new Date('2020-07-20 23:59').getTime()) {
  axios.defaults['baseURL'] = process.env.NODE_ENV === 'development' ? '' : 'http://test.congrong-inc.com/manager';
  Vue.use(Element)
  Vue.prototype.axios = axios;
  Vue.prototype.md5 = md5;
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");
}
