import Vue from "vue"
import App from "./App"
import router from "./router"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import "./styles/index.scss"

// Vue.use(ElementUI);
Vue.use(ElementUI, { size: 'small' });
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

//开启js热更新
if (module.hot) {
  module.hot.accept();
}
