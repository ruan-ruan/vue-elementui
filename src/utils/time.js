

export function dateFormats(value){
	let date=new Date(parseInt(value)*1000);
	let Y=date.getFullYear()+'-';
	let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
	let D=date.getDate() <10? '0' +date.getDate() +'':date.getDate()+'';
	let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	return Y + M + D + h + m + s
}


export function	dateFormat(row,column){
	//当数据绑定在表格中  直接转换的时候
        let date = new Date(parseInt(row.creation_time) * 1000);
        let Y = date.getFullYear() + '-';
        let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
		
	}

export const str={
	validatePass:function(rule,value,callback){
		//第一次输入密码
		if(value===''){
			callback(new Error('请输入密码'))
		}else{
			callback()
		}
	},
	validatePass2:function(rule,value,callback,pass){
		if(value===''){
			callback(new Error('请再次输入密码'))
		}else if(value!==pass){
			callback(new Error('两次输入的密码不一致'))
		}else{
			callback()
		}
	},
	Mobile:function(rule,value,callback){
		if(!value){
			return callback(new Error('手机号不能为空'))
		}else{
			const reg=/^1[3|4|5|7|8][0-9]\d{8}&/
			if(reg.test(value)){
				callback()
			}else{
				return callback(new Error('请输入正确的手机号'))
			}
		}
	}
}
