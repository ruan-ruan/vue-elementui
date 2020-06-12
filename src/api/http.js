import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
import * as types from '@/api/types';
import {Message,Loading} from'element-ui'
// axios 配置
// 超时时间
axios.defaults.timeout = 50000;
//http://api.tianchi.com   本地测试
//http://api.tianchic.com  线上
//http://demoapi.tianchic.com 客户测试
axios.defaults.baseURL='http://api.tianchic.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// http request 拦截器
axios.interceptors.request.use(
	config => {
		const token = store.state.token;
	    token && (config.headers.Authorization = token);
	    return config;
	},
	err => {
	    return Promise.reject(err);
	},
)

// http response 响应拦截器
axios.interceptors.response.use(
  response => {
	if(response.data.status != 0){//当状态吗不是0的时候  这个时候返回的警告信息
		if(response.data.status==101){//如果返回的状态码是101的时候  ，直接返回到登录界面，否则返回对应信息
			store.commit(types.LOGOUT)
				// 只有在当前路由不是登录页面才跳转
			router.currentRoute.path !== '/login' &&
			router.replace({
				path: '/login',
//				query: { redirect: router.currentRoute.path },
			})
			window.location.reload();
		}
		Message.warning({
			message:response.data.message
		})
	}
	return response
  },
  error => {
    return Promise.reject(error);
  },
)

export default axios;
