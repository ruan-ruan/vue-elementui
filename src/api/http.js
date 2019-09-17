import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
import * as types from '@/api/types'
// axios 配置

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
    return Promise.reject(err)
},
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
//  return response
	if(response.status===200){
		if(response.data.status==0){
			return Promise.resolve(response)
		}else if(response.data.status==101){
			store.commit(types.LOGOUT)   
	          // 只有在当前路由不是登录页面才跳转
	        router.currentRoute.path !== '/login' &&
	        router.replace({
	          path: '/login',
	          query: { redirect: router.currentRoute.path },
	        })
		}
	}
	//下面的也可以实现拦截
//	if(response.data.status==101){
//		store.commit(types.LOGOUT)   
//        // 只有在当前路由不是登录页面才跳转
//      router.currentRoute.path !== '/login' &&
//      router.replace({
//        path: '/login',
//        query: { redirect: router.currentRoute.path },
//      })
//	}else{
//		return response
//	}
  },
  error => {
    return Promise.reject(error.response.data)
  },
)

export default axios