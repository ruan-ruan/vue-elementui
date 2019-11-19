import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
import * as types from '@/api/types';
import {Message} from'element-ui'
// axios 配置
axios.defaults.baseURL='http://api.tianchi.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// http request 拦截器
axios.interceptors.request.use(
config => {
	
    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`
//    axios.defaults.headers.common['Authentication-Token'] = `${store.state.token}`
    }
    return config
},
err => {
	
    return Promise.error(err)
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
				query: { redirect: router.currentRoute.path },
			})
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