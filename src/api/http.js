import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
import * as types from '@/api/types';
import {Message,Loading} from'element-ui'
// axios 配置
// 超时时间
axios.defaults.timeout = 10000;
//http://api.tianchi.com   线上
//http://api.tianchic.com  本地测试   
//http://demoapi.tianchic.com 客户测试
axios.defaults.baseURL='http://api.tianchi.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// post请求头
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// http request 拦截器
axios.interceptors.request.use(
	config => {
	//  if (store.state.token) {
	//    	config.headers.Authorization = `token ${store.state.token}`
	//  }
		const token = store.state.token;        
	    token && (config.headers.Authorization = token);   
	    return config
	},
	err => {
	
	    return Promise.reject(err)
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
			console.log('执行跳出 刷新')
			window.location.reload();
		}
		Message.warning({
			message:response.data.message
		})
	}
	return response	
  },
  error => {
    return Promise.reject(error)
  },
)

export default axios