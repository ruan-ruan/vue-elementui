
import {validatenull} from '@/utils/validate'

/**
 * 存储localStorage
 */

export const setStore = (params) => {
	const {
		name,
		content,
		type
		//dateTime
	} = params
	const obj = {
		dataType:typeof(content),
		content:content,
		type:type,
		datetime:new Date().getTime()
	}
	if(type)	window.sessionStorage.setItem(name,JSON.stringify(obj))
	else cwindow.localStorage.setItem(name,JSON.stringify(obj))
}


/**
 * 获取localStorage
 */
export const getStore = (params) => {
	const {
		name
	} = params
	
	let obj ={};
	let content
	obj=window.localStorage.getItem(name)
	if(validatenull(obj)) obj =window.sessionStorage.getItem(name)
	if(validatenull(obj)) return
	obj=JSON.parse(obj)
	if(obj.dataType ===' string '){
		content =obj.content
	}else if(obj.dataType ===' number'){
		content=Number(obj.content)
	}else if (obj.dataType ==='boolean'){
		content=eval(obj.content)
	}else if( obj.dataType ==='object'){
		content= obj.content
	}
	return content
}


/**
 * 删除localStroage
 */
export function removeStore = (params) => {
	const {
		name
	} = params
	window.localStorage.removeItem(name)
	window.sessionStorage.removeItem(name)
}


/**
 * 获取全部的localStroage
 */
export function getAllStore = (params) => {
	const list =[];
	const {
		type
	} = params;
	let len=window.sessionStorage.length;
	for (let i=0; i<len;i++) {
		if(type){
			list.push({
				name:window.sessionStorage.key(i),
				content: getStore ({
					name:window.sessionStorage.key(i),
					type:'session'
				})
			})
		}else{
			list.push({
				name:window.localStorage.key(i),
				content: getStore({
					name:window.localStorage.key(i)
				})
			})
		}
	}
	
	return list
}

/**
 * 清空全部的localStrorage
 */
export const clearStore = (params) => {
	const{
		type
	} = params
	if(type){
		window.sessionStorage.clear()
		return
	}
	window.localStorage.clear()
}





















