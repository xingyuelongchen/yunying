import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import md5 from 'js-md5';
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;
axios.defaults['baseURL'] = process.env.NODE_ENV === 'development' ? '' : 'http://test.congrong-inc.com:7001/manager'; 
Vue.use(Element)
Vue.prototype.axios = axios;
Vue.prototype.md5 = md5;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
