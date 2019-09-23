//手机号的验证
export function isvalidPhone(str){
	const reg=/^1[3|4|5|7|8][0-9]\d{8}$/;
	return reg.test(str)
}
//邮箱的验证
export function isvalidEmail(str){
	const reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
	return reg.test(str);
}

//日志里面的时间戳转换
export function datedialogFormat(value){
	let date = new Date(parseInt(value) * 1000);
    let Y = date.getFullYear() + '-';
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}
export function getTime(value) {
    if (value == "") {
      return "";
    }
    //解析中国标准时间
    let time = new Date(value);
    return parseInt(time.getTime()/1000);
  }
/**
 * chart里面的传参所需的时间格式
 * */
export function isChartTime(value){
	let date = new Date(parseInt(value) * 1000);//时间戳为10位的时候，需要*1000    如果四13位的时候，不需要
    let Y = date.getFullYear();
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 ;
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() ;
    return Y + M + D 
}
/**
 * 数组去重*/
export var arrayPro={
	unique(arr){
	  	var hash=[];
	  	for (var i = 0; i < arr.length; i++) {
	     	if(hash.indexOf(arr[i])==-1){
	     	 hash.push(arr[i]);
	     	}
	  	}
	  return hash;
	},
	sortNum(a,b){
		return a-b;
	},
	datedialogFormat(value){
		let date = new Date(parseInt(value) * 1000);
	    let Y = date.getFullYear() + '-';
	    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
	    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
	    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
	    let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
	    let s = '00';
	    return Y + M + D + h + m + s;
	},
	findIndex(arr,value){//表格数据里面   ，根据时间轴  开始和结束时间   获取  下标，   用于数组的截取
		for(var i=0;i<arr.length;i++){
			if(arr[i].time === value){
				return i;//根据时间找到对应的下标位置
			}
		}
		return -1;
	},
	sortArr(arr, str) {//arr数组   str是属性   查找相同的属性的值  
	    var _arr = [],
	        _t = [],
	        // 临时的变量
	        _tmp;
	
	    // 按照特定的参数将数组排序将具有相同值得排在一起
	    arr = arr.sort(function(a, b) {
	        var s = a[str],
	            t = b[str];
	
	        return s < t ? -1 : 1;
	    });
	
	    if ( arr.length ){
	        _tmp = arr[0][str];
	    }
	    // console.log( arr );
	    // 将相同类别的对象添加到统一个数组
	    for (var i in arr) {
	        if ( arr[i][str] === _tmp ){
	            _t.push( arr[i] );
	        } else {
	            _tmp = arr[i][str];
	            _arr.push( _t );
	            _t = [arr[i]];
	        }
	    }
	    // 将最后的内容推出新数组
	    _arr.push( _t );
	    return _arr;
	},
	test(arr){
		var str=[];
	 	for(var i=0;i<arr.length;i++){
	 		str.push(arr[i].flow)
	 	}
	 	return str
	},
//	valType(data){//获取数组内 flow的最大值，最小值，平均值
//		var max=data[0];//用来比较的值
//		var min=data[data.length-1];
//		var  num=0;//总和
//		var val=0;//平均值
//		let obj={}
//		for(var i=0;i<str.length;i++){ 
//			if(max.age<str[i].age)max.age=str[i].age;
//			if(min.age>str[i].age)min.age=str[i].age;
////			console.log(str[i].age);
//			avg+=str[i].age
//			val=avg/str.length
//		}
//		obj={
//			min:min,
//			max:max,
//			num:num,
//			avg:val
//		}
//		return obj
//	},
	flowObj(data,property){//  data 数组     property是要对比的对象里面的属性
		let d1=[],d2=[];
		for(var item =0 ;item <data.length;item++){
			d1.push(data[item].d1)
			d2.push(data[item].d2)
		}
		//首先判断   d1和d2 内的对象是否为空
		
		
		let avg=0,num=0,obj1={};
		if(JSON.stringify(d1[index]) == '{}'){
			return ;
		}else{
			for(var index=0;index<d1.length;index++){
//			console.log(d1[index])
				num+= eval(d1[index][property])
				avg=num/d1.length
			}
			obj1={
				min:Math.min.apply(Math, d1.map(function(o) {return o[property]})),
				max:Math.max.apply(Math, d1.map(function(o) {return o[property]})),
				avg:avg
			}
		}
		
		let avg2=0,num2=0,obj2={};
		if(JSON.stringify(d2[0][index]) =='{}'){
			return ;
		}else{
			for(var index=0;index<d2.length;index++){
				num2+= eval(d2[index][property])
				avg2=num2/d2.length
			}
			obj2={
				min:Math.min.apply(Math, d2.map(function(o) {return o[property]})),
				max:Math.max.apply(Math, d2.map(function(o) {return o[property]})),
				avg:avg2
			}
		}
		
		let obj={};
		obj={
			d1:obj1,
			d2:obj2
		}
		return obj;//获取flow里面的属性的各个的值的集合
	},
	tim(data){//获取数组里面的数据的最大，最小，平均值，实时流量等
		let num=0,avg=0;
		let obj={};
		if(data){
			for(var index=0;index<data.length;index++){
				num+= eval(data[index])
				avg=num/data.length
			}
			
			obj={
				min:Math.min.apply(Math, data.map(function(o) {return o})),
				max:Math.max.apply(Math, data.map(function(o) {return o})),
				avg:avg,
				now:data[data.length-1]
			}
			return obj;
		}else{
			return false;
		}
		
	},
	sortTime(property){//根据时间进行排序  升序
		return function (a,b){
		 	var value1 = Date.parse( new Date(a[property]));
	        var value2 = Date.parse( new Date(b[property]));
	        return value1-value2  ;
		}
	},
	sortNum(property){
		return function (a,b){
			var value1=a[property];
			var value2=b[property];
			return value1-value2;
		}
	},
	testCharts (data,property,val){   //获取  z  或者a    端 的数据
		let d1=[],d2=[];
		for(var index=0;index<data.length;index++){
			d1.push(data[index].d1)
			d2.push(data[index].d2)
		}

		let d1Charts=[];
		let d2Charts=[];
		d1.forEach(ele => {
			d1Charts.push(ele[property])
		})
		d2.forEach(ele => {
			d2Charts.push(ele[property])
		})
		
		let d1Data=[],d2Data=[]
		d1Charts.forEach(ele => {
			d1Data.push(ele[val])
		})
		d2Charts.forEach(ele => {
			d2Data.push(ele[val])
		})
		let obj={
			d1:d1Data,
			d2:d2Data
		}
		return obj;
	},
	totalData(data1,data2){//两个数组进行相加
		if(isNaN(data1[0])  &&   !isNaN(  data2[0]) ){
			return data2;
		}else if(! isNaN(data1[0]) &&   isNaN(data2[0])){
			return data1;
		}else if(! isNaN(data1[0]) && !isNaN(  data2[0])){
			return data1.map(function(item,index){
				return item + data2[index]
			})
		}else{
			return false;
		}
	
	},
};


export var isTopo={
	//根据带宽的大小筛选   获取
	dealBandWidth(a,property,value){// a  是数组     property 是属性    value是要比对的值
		var b=a.filter(item => {
			return item[property]==value;
		})
		return a= a.filter(item => {
			 let idList= b.map(v => v[property])
			 return !idList.includes(item[property])
		 })
	} ,
	isBandWidth(a,property,value){
		if(value !=='显示其他带宽链路'){
			 return a.filter(item => {
			 	return item[property]==value;
			 })
		}else{
			return a.filter(item => {
			 	return item[property]!=1&&item[property]!=10&&item[property]!=40&&item[property]!=100;
			})
		}
		
	 }
}









export function isValidNumber(str){
	const reg=/^\d/g;
	return reg.test(str);
}


//逻辑口的状态的判断
export 	function getPortStatus(arr){
	let statusVal='';
	if(arr.length>1){
//		console.log('进入两个端口');
		if(arr[0].status==='UP'&& arr[1].status==="UP"){
			statusVal='UP';
		}else if(arr[0].status==='DOWN'&& arr[1].status==="DOWN"){
			statusVal='DOWN';
		}else{
			statusVal='异常';
		}
	}else if(arr.length==1){
//		console.log('进入一个端口')
		if(arr[0].status==='UP'){
			statusVal='UP';
		}else if(arr[0].status==='DOWN'){
			statusVal='DOWN';
		}
	}
//console.log(statusVal)
return statusVal
}
//正整数的验证
export function isValidinteger(str){
	let reg=/^[1-9]\d*$/;
	return reg.test(str);
}
export function isStatus(str){//根据endpoints   来判断的额端口的状态
	
	
}

