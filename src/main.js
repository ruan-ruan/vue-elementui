// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'

import axios from '@/api/http'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'es6-promise/auto'
import store from './store/index'
import Vuex from 'vuex'
import 'font-awesome/css/font-awesome.css'
import echarts from 'echarts'
import FileSaver from 'file-saver'
import XLSX from 'xlsx';
import moment from 'moment'
import *as types from '@/api/types'
import '@/assets/css/bus.css'
import ajax from '@/api/api'
//import VueAxios from 'vue-axios'

//Vue.use(VueAxios,axios)

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.prototype.$axios=axios
Vue.prototype.bus=new Vue(); //引入时间总线
Vue.prototype.$echarts = echarts 
Vue.prototype.$moment=moment;

Vue.prototype.$ajax=ajax;  //对axios的数据请求的二次封装


Vue.config.productionTip = false;


if (window.sessionStorage.getItem('token')) {
    store.commit(types.LOGIN, window.sessionStorage.getItem('token'))
}
//完成全局的路由的守卫
router.beforeEach( (to,from,next) => {
	var token=sessionStorage.getItem('token');
	var Users=sessionStorage.getItem('user');
	if (to.matched.some(r => r.meta.requireAuth)) {
        if (store.state.token) {
            next();
        } else {
            next({
                path: '/login',
                query:{
                	redirect:to.fullPath
                }
            })
        }
    } else {
        next();
    }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})





