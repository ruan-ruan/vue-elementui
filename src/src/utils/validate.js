/**
 * 创建时间19/3/16
 */

export function isvalidUsername(str){
	const valid_map=['admin','editor']
	return valid_map.indexOf( str.trim() ) >=0
}

/**
 * 验证url的合法性
 */

export function validateUrl(urlVal){
	const urlreg=/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
	return urlreg.test(urlVal)
}

/**
 * 小写字母
 */

export function validateLowerCase(str){
	const reg=/^[a-z]+$/;
	return reg.test(str)
}

/**
 * 大写字母
 */

export function validateUpperCase(str){
	const reg=/^[A-Z]+$/;
	return reg.test(str);
}

/**
 * 大小写字母
 */
export function validatAlphabets(str){
	const reg=/^[a-zA-Z]+$/;
	return reg.test(str)
}

/**
 * 判断是否为空
 */
export function validatenull(val){
	if(typeof val==='boolean'){
		return false;
	}
	if(val instanceof Array){
		if(val.length===0) return true;
		
	}else if(val instanceof Object){
		if(JSON.stringify(val)==="{}") return true;
	}else{
		if(val==='null'|| val=null ||val==='underfined' ||val==undefined|| val==='')
		return false;
	}
	return false;
}

/**
 * 判断手机号码是否正确
 */

export function isvalidatemobile(phone){
	const list=[];
	let result=true;
	let msg='';
	var isPhone= /^0\d{2,3}-?\d{7,8}$/;
// 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
// const isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
	if(!validatenull(phone)){
		if(phone.length === 11){
			if( isPhone.test(phone)){
				msg='手机号码格式不正确'
			}else{
				result=false;
			}
		}else{
			msg='手机号码长度不是11位'
		}
	}else{
		msg='手机号码不能为空'
	}
	list.push(result);
	list.push(msg);
	return list;
}


/**邮箱验证部分的代码待编写*/












