/**
 *
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouter  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */
export function recursionRouter(userRouter = [], allRouter = []) {
    var realRoutes = []
    allRouter.forEach((v, i) => {
        userRouter.forEach((item, index) => {
            if (item.name === v.name) {
                if (item.list && item.list.length > 0) {
                    v.children = recursionRouter(item.list, v.children)
                }
                realRoutes.push(v)
            }
        })
    })
    return realRoutes
}

export function fil(total=[],data){//根据name名字进行路由数据的查找   并将后台返回的show的字段的值取反  赋值给前端的路由的hidden   
//	console.log(total)
	if(data){
		total.forEach(item => {
			data.forEach(ele => {
				if(ele.list && ele.component){
					if(item.name === ele.name){
						item.hidden = !ele.show;
					}
					fil(item.children,ele.list);
				}
			})
		})
	}
}

export function recursion(data, name) {//这个是根据名称 获取的列表的权限集合  
    let result;
    if (!data) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.name === name) {
          result = item;
          break;
        } else if (item.list && item.list.length > 0) {
          result = recursion(item.list, name);
          if(result) return result 
        }
    }
    return result;
}

/**
 *
 * @param  {Array} data 数据
 * @param  {string} code  对应的字段
 */
export function codeVal(data, code) {//这个是根据名称 获取的列表的权限集合  
    let result;
    if (!data) {
        return;
    }
//  if(data.list){
//  	data.list.find(item => {
//  		return item.code === code;
//  	})
//  }
	if(data.length > 0 && data){
		for (var i = 0; i < data.length; i++) {
	        let item = data[i];
	        if(item.code){
		        if (item.list && item.list.length > 0) {

		          result = recursion(item.list, code);
		          if(result) return result ;
		          console.log(results)
		        }else {
		        	if(item.code === code) {
//		        		console.log(item)
			          result = item;
			          break;
			        }
		        }
	        }
	    }
	}
    
//  console.log(result);
    return result;
}




export function exportCom(comp){//对返回的数据的组件的进行导入
	return () => import(comp+'.vue');
}
export function exportIcon(icon){//对引入的icon进行导入
	return require('@/assets/images/aside/'+icon+'.png');
}

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
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + '  ';
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}
export function dealNull(str,property){
//	console.log(str);
	str.map( item => {
		if( !item[property] && typeof(item[property]) && item[property] !=0){
			item[property]=''
		}else if(typeof item[property] == 'undefined'){
			item[property]=''
		}
	})
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
 * 在图表格数据请求的参数
 * */
export function isChartTime(value){
	var str=Math.round(value)//取整数
	let date = new Date(parseInt(str) * 1000);//时间戳为10位的时候，需要*1000    如果四13位的时候，不需要
	let Y = date.getFullYear() + '';
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '' : date.getMonth() + 1 + '';
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
//  let Y = date.getFullYear();
//  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 ;
//  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() ;
//	console.log(Y+M+D)

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
//		console.log(new Date(arr[0].time).getTime()/1000   );
//		console.log(new Date(value).getTime()/1000   );
//		for(var i=0;i<arr.length;i++){
//			if(arr[i].time === value){
//				console.log(i)
//				return i;//根据时间找到对应的下标位置
//			}
//		}
		for(var i=0;i<arr.length;i++){
			if( new Date(arr[i].time).getTime() === new Date(value).getTime()  ){
//				console.log(i)
				return i;//根据时间找到对应的下标位置
			}
		}
		return -1;
	},
	dataIsNot( start,end,type){//当根据时间截取对应的下标的时候，数据不够的时候   ，需要补填数据
		//start 开始时间   end结束时间    type  选择是开始时间下标找不到  补数据  还是  结束时间下标找不到返回数据  timeVal是选择的时间类型  
		var  data=[];
		if(type == 'startIndex'){
			for(var index = new Date(start).getTime()/1000; index < new Date(end).getTime()/1000 ; index +=60){
				var obj={
					d1:{
						input_bytes: 0,
						input_packages: 0,
						mac_address: 0,
						output_bytes: 0,
						output_packages: 0,
					},
					d2:{
						input_bytes: 0,
						input_packages: 0,
						mac_address: 0,
						output_bytes: 0,
						output_packages: 0,
					},
					time:datedialogFormat(index)
				};
				data.push(obj);
			}
		}else if(type == 'endIndex'){
			for(var index = new Date(start).getTime()/1000+60; index < new Date(end).getTime()/1000 ; index +=60){//这个时候  是结束的时间没有找到   因为 所有的flow里面已经包含最后一个值，也就是造册假数据第一个值，冲突，所以需要加一个间隔
				var obj={
					d1:{
						input_bytes: 0,
						input_packages: 0,
						output_bytes: 0,
						output_packages: 0,
					},
					d2:{
						input_bytes: 0,
						input_packages: 0,
						output_bytes: 0,
						output_packages: 0,
					},
					time:datedialogFormat(index)
				};
				data.push(obj);
			}
		}
		return data;
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
//		console.log(arr)
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
	    _arr.push( _t );//  得到合并相同id的两层嵌套的数据
//	    console.log(_arr);
	    //处理数据  得到新的数组
	    var newData=[];
	    for(var index=0;index<_arr.length;index++){
	    	var obj={},flowData=[];
	    	_arr[index].map(item => {
	    		flowData=flowData.concat(item.flow);
	    		obj={
	    			id:item.id,
	    			logic_port:item.logic_port,
	    			name:item.name,
	    			physical_ports:item.physical_ports,
	    			vlan:item.vlan,
	    			flow:flowData
	    		}
	    	})
	    	newData.push(obj)
	    }
//	    console.log(newData)
	    return newData;
	},
	dealTime(Data,start,end){
		
		//Data是被处理的数据   start 是开始时间   end是结束时间    因为数据是每分钟一次    为排查中间断点  ，需要获取时间的集合每分钟的间隔集合
		var extractDatatime=[],newData=[];
		var timeData=[];
		for(var index=new Date(start).getTime()/1000; index<new Date(end).getTime()/1000; index+=60  ){//获取每分钟的时间的间隔所有的数据
			timeData.push( index )//获取开始到结束时间的所有的数据集合
		}
		for(var i=0;i<Data.length;i++){
			var totalObj={},totalData=[],childObj={};

			var tim=[];//提取时间集合
			Data[i].flow.map( (item,index) => {
//				tim.push( item.time  ) //
				tim.push(new Date(item.time).getTime()/1000)
			})
			for(var val=0;val<timeData.length;val++){
				if(tim.indexOf( timeData[val] ) !=-1){
					totalData.push( Data[i].flow.find(item => {return new Date(item.time).getTime()/1000 == timeData[val] ;})  )
				}else{
					childObj={
						d1:{
							input_bytes: 0,
							input_packages: 0,
							output_bytes: 0,
							output_packages: 0,
						},
						d2:{
							input_bytes: 0,
							input_packages: 0,
							output_bytes: 0,
							output_packages: 0,
						},
						time:arrayPro.datedialogFormat( timeData[val] )
					}
					totalData.push(childObj)
				}
			}
			totalObj={
				id:Data[i].id,
				logic_port:Data[i].logic_port,
				name:Data[i].name,
				physical_ports:Data[i].physical_ports,
				vlan:Data[i].vlan,
				flow:totalData
			}
			
			newData.push(totalObj)
		}
//		console.log(newData);
		return newData;
	},
	test(arr){
		var str=[];
	 	for(var i=0;i<arr.length;i++){
	 		str.push(arr[i].flow)
	 	}
	 	return str
	},

	flowObj(data,property){//  data 数组     property是要对比的对象里面的属性
//		console.log(data);
//		console.log(property)
		let d1=[],d2=[];
		if(data.length !=0){
			for(var item =0 ;item <data.length;item++){
				d1.push(data[item].d1)
				d2.push(data[item].d2)
			}
		}
//		console.log(d1);
//		console.log(d2)
		//首先判断   d1和d2 内的对象是否为空
		let avg=0,num=0,obj1={},i=0,newData1=[];
		for (var index =0;index<d1.length;index ++) {
			if(JSON.stringify( d1[index] ) == '{}'){
				d1[index][property]={
					min:null,avg:null,max:null
				}
			}else if( !(!d1[index][property] && typeof(d1[index][property]) !='undefined' && d1[index][property] !=0 ) || typeof d1[index][property] !='undefined' || d1[index][property] != ''){
				i++;
				newData1.push(d1[index])
				num+= eval(d1[index][property]);
			}
			
		}
		if(i==0 ){
			avg=null
		}else{
		avg=num/i;
//		avg=num/d1.length;
		}

		obj1={
			min:Math.min.apply(Math, newData1.map(function(o) {return o[property]})),
			max:Math.max.apply(Math, newData1.map(function(o) {return o[property]})),
			avg:avg
		}

		let avg2=0,num2=0,obj2={},j=0,newData2=[];

		for (var index =0;index<d2.length;index ++) {
			if(JSON.stringify( d2[index]) == '{}'){
				d2[index][property]={
					min:null,avg:null,max:null
				}
			}else if( !(!d2[index][property] && typeof(d2[index][property]) !='undefined' && d2[index][property] !=0 ) || d2[index][property] !='' || typeof d2[index][property] !='undefined' ){
				j++;
				newData2.push(d2[index])
				num2+= eval(d2[index][property]);
			}
			
		}
		if(j ==0){
			avg2=null;
		}else{
			avg2=num2/j;
//		avg2=num2/d2.length;
		}

		obj2={
			min:Math.min.apply(Math, newData2.map(function(o) {return o[property]})),
			max:Math.max.apply(Math, newData2.map(function(o) {return o[property]})),
			avg:avg2
		}

		let obj={};
		obj={
			d1:obj1,
			d2:obj2
		}

//		console.log(obj);
		return obj;//获取flow里面的属性的各个的值的集合
	},
	tim(data){//获取数组里面的数据的最大，最小，平均值，实时流量等

		let num=0,avg=0;
		let obj={},i=0;
		if(data){
			for(var index=0;index<data.length;index++){
				if( (!data[index] && typeof(data[index]) !='undefined' && data[index] !=0  ) || data[index] =='' || typeof (data[index]) =='undefined' ){
					//  当算平均值的时候   如果数据的null，undefined或者空字符串    这个时候相当于数值加0
//					num+=0;
				}else {
					i++
					num+= parseInt(data[index])	
				}
			}
			avg=num/i;
//			avg=num/data.length
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
	testCharts (data ,property, val){   //获取  z  或者a    端 的数据
		data.map(str => {//线对数据进行处理  判断里面的是否存在NAN
			for(var item in str){
				for (var val in str[item]){
					for(var index in str[item][val]){
						if( isNaN( str[item][val][index] ) || !isFinite( str[item][val][index] )){//当数据为NaN的时候 获取无穷大的时候  这个时候给一个空的字符
							str[item][val][index]=0;
						}
					}
				}
			}
		})
		let d1=[],d2=[];
		for(var index=0;index<data.length;index++){
			d1.push(data[index].d1)
			d2.push(data[index].d2)
		}
		
		let d1Charts=[];
		let d2Charts=[];
		d1.map(ele => {
//			console.log()
			d1Charts.push(ele[property])
		})
		d2.map(ele => {
			d2Charts.push(ele[property])
		})

		let d1Data=[],d2Data=[];
		
		
		d1Charts.map(ele => {
			d1Data.push(ele[val]);
			
		})
		d2Charts.map(ele => {
			d2Data.push(ele[val])
		})
		let obj={
			d1:d1Data,
			d2:d2Data
		}
//		console.log(obj)
		return obj;
	},

	totalData(data1,data2){//两个数组进行相加  d1 与d2数据进行进行相加
//		console.log(data1)
		if(data1  && data2){
			for(var i=0;i<data1.length;i++){
				if(isNaN( data1[i] ) || ( !data1[i] && typeof(data1[i]) !='undefined' && data1[i] !=0 ) || data1[i] =='' ){
					data1[i]=0;
				}
			}
			for(var j=0;j<data2.length;j++){
				if(isNaN( data2[j] ) || ( !data2[j] && typeof(data2[j]) !='undefined' && data2[j] !=0 ) || data2[i] =='' ){
					data2[j]=0;
				}
			}
			
			return data1.map(function(item,index){
				if( (!item && typeof (item) !='undefined' && item !=0 ) && !( !data2[index] && typeof (data2[index]) !='undefined' && data2[index] !=0 ) ){
					return data2[index];
				}else if(  !(!item && typeof (item) !='undefined' && item !=0 ) && ( !data2[index] && typeof (data2[index]) !='undefined' && data2[index] !=0 ) ){
					return item;
				}else if( !(!item && typeof (item) !='undefined' && item !=0 ) && !( !data2[index] && typeof (data2[index]) !='undefined' && data2[index] !=0 )  ){
					return item + data2[index]
				}else {
					return 0;
				}
				
			})
		}
		
		
		
//		if(isNaN(data1[0])  &&   !isNaN(  data2[0]) ){
//			return data2;
//		}else if(! isNaN(data1[0]) &&   isNaN(data2[0])){
//			return data1;
//		}else if(! isNaN(data1[0]) && !isNaN(  data2[0])){
//			return data1.map(function(item,index){
//
//				return item + data2[index]
//			})
//		}else{
//			return false;
//		}
	
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
	isBandWidth(a,property,value){//设置现在目前的带宽
		 return a.filter(item => {
		 	return item[property]==value;
		 })
	},
	isBandVal(str){//显示其他的带宽
		let arr=[];
		str.map(ele => {
			if(ele.bandwidth !==1&& ele.bandwidth!==10&&ele.bandwidth!==40&&ele.bandwidth!==100){
				arr.push(ele)
			}
		})
//		console.log(arr)
		return arr;
	}
}


export function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}
export function isNumberInteger(str){//正整数
	const reg=/^[1-9]\d/g;
	return reg.test(str);
}
//节点里面的添加的时候对vlan的填写的处理
export function isVlan(val){
	var num= val.split(',');
	var newVal=[];
	var newData=[];
	var data=[];
	var  str={
		bool:true,//未知节点添加的端口区间，处理
		dataVal:[]
	};
	console.log(num)
	num.map(ele => {//获取切割后的数组
		if(ele.indexOf('-') !==-1){
			newVal.push(ele.split('-'))
		}else{
			newVal.push(ele.split(','))
		}
	})
	newVal.map(ele => {
		if(ele.length>1){//判断  数据是区间还是单个的 
			for(var i=ele[0];i<= ele[1];i++ ){//区间的时候   遍历
				data.push(i)
			}
		}else {  //当为单个的数据的时候   直接转化为数字  添加
			data.push( ele)
		}
	});

	data.map(ele => {
		if(!isNaN(ele) ){
			if(parseInt(ele)  <2 || parseInt(ele) >4094){
				str.bool=false
			}
			if( newData.indexOf(ele) == -1 ){
				newData.push(ele)
			}
		}else if(isNaN(ele)){
			str.bool=false
		}
	})
	console.log(str)
	return str;
};
export function isTest(val){
	var num=val.split(',');//首先将输入的字符串分割开成数组
	var newVal=[];
	var newData=[];
	var  str={
		bool:true,//未知节点添加的端口区间，处理
		dataVal:[]
	};
	var data=[]

	num.map(ele => {//获取切割后的数组
		if(ele.indexOf('-') !==-1){
			newVal.push(ele.split('-'))
		}else{
			newVal.push(ele.split(','))
		}
	})
	newVal.map(ele => {
		if(ele.length>1){//判断  数据是区间还是单个的 
			for(var i=ele[0];i<= ele[1];i++ ){//区间的时候   遍历
				data.push(i)
			}
		}else {  //当为单个的数据的时候   直接转化为数字  添加
			data.push( ele[0])
		}
	})
	data.map(ele => {
		if(!isNaN(ele) ){
//			if(ele.indexOf('.') !==-1){
//				return false;
//			}else{
				if(ele>54 || ele<1){
					str.bool=false
				}
				if( newData.indexOf(ele) == -1 ){
					newData.push(ele)
				}	
//			}
		}else if(isNaN(ele)){
//			console.log(ele)
			str.bool=false
		}
	})
//	console.log(str)
	str.dataVal=newData;
	return str;
};

export function isValidNumber(str){
	const reg=/^[1-9]\d*$/g;
	return reg.test(str);
};

export function isJust(str){
	const reg=/^[0-9]\d*$/g;
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
	return statusVal
}

export function isPortStatus(arr){//针对于 单个逻辑口内的时候数据处理
	let statusVal='';
	if(arr.length>1){

		if(arr[0].port.status==='UP'&& arr[1].port.status==="UP"){
			statusVal='UP';
		}else if(arr[0].port.status==='DOWN'&& arr[1].port.status==="DOWN"){
			statusVal='DOWN';
		}else{
			statusVal='异常';
		}
	}else if(arr.length==1){

		if(arr[0].port.status==='UP'){
			statusVal='UP';
		}else if(arr[0].port.status==='DOWN'){
			statusVal='DOWN';
		}
	}
	return statusVal
}

export function isPort(arr){//针对于 单个逻辑口内的时候数据处理
	let statusVal='';
	if(arr.length>1){
//		console.log('进入两个端口');
		if(arr[0].status==='UP'&& arr[0].status==="UP"){
			statusVal='UP';
		}else if(arr[0].status==='DOWN'&& arr[0].status==="DOWN"){
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
	return statusVal
}



//正整数的验证
export function isValidinteger(str){
	let reg=/^[1-9]\d*$/;
	return reg.test(str);
}
export function deepClone(data){  //设置权限的时候  给按钮添加控制部分
	data.map(ele => {
		ele.disabled=false;
		if(ele.list){
			if( ele.list.length>0){
				deepClone(ele.list);
			}
		}
	})
}
export function cloneTopo(data,obj,index,vals,links){
	var sel=[];
	if(data){
		data.map(item =>{
			if(item.node.id === obj.node.id){
				data=[];
				sel.push(obj);
				vals[index].style.width=50;
				vals[index].style.height=50;
				links.map(w => {
					data.push(w.target_val)
				})
				data=unique(data);

			}else {
				return ;
			}
		})
		cloneTopo(data,obj,index,vals,links)
	}
	return sel;
}

 function unique(arr1) {
  	const res = new Map();
  	return arr1.filter((a) => !res.has(a.node.id) && res.set(a.node.id, 1))
}

export function Clone(data){  //角色的详情部分   所有的数据都是不可以点击的
	data.map(ele => {
		ele.disabled=true;
		if(ele.list){
			Clone(ele.list);
		}
	})
}
export function CloneVal(data){//当权限是  all的时候   默认的是全部选中的
	var arr=[];
	if(data.list){
		data.list.map(ele => {
			if(ele.code){
				arr.push(ele.code)
			}
			else{
				var temp=CloneVal(ele.list)
				arr=arr.concat(temp)
			}
		})
		return arr
	}
}


export function descriptionValue(str){   //对列表的里面的备注信息进行处理  
	let strData=[]
	str.map(ele => {
		//所有的备注信息的输入的时候 进行处理
		if(!ele.description && typeof(ele.description)!='undefined' && ele.description!=0 ){//判断是否为null
			ele.descriptionVal=''
		}else if( ele.description  ===''){//判断是否为空字符串
			ele.descriptionVal=''
		}else{
			if(ele.description.length>10){
				ele.descriptionVal=ele.description.substring(0,9)+'...'
			}else{
				ele.descriptionVal=ele.description;
			}
		}	
	})
//	return strData;
}
/*
 * 数组   => 根据数组里对象的某个属性进行排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * 
 **/
export function sortVal(attr,rev){
        if(rev ==  undefined){  //第二个参数没有传递 默认升序排列
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }
        
        return function(a,b){
            a = a[attr];
            b = b[attr];
            if(a < b){
                return rev * -1;
            }
            if(a > b){
                return rev * 1;
            }
            return 0;
        }
    }


//当获取当详情的时候  处理里面的数据
export function isNull(val,prototype){
	if (! val[prototype] && typeof( val[prototype])!="undefined" &&  val[prototype]!=0){ 
	   val[prototype]=''
	}
}
