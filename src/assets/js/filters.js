/**
 * {value，format}
 * 	value 值 
 * format 展示的格式
 * */
const timeFormat = (value ,format) => {
	let date = new Date(value*1000);
	let y = date.getFullYear();
	let m = date.getMonth()+1;
	let d = date.getDate();
	let h = date.getHours();
	let min = date.getMinutes();
	let s = date.getSeconds();
	let result = '';
	if(format == undefined){
		result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}  ${
        	h < 10 ? "0" + h : h}:${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
	}
	if (format == "yyyy-mm-dd") {
        result = `${y}-${m < 10 ? "0" + m : m}-${d < 10 ? "0" + d : d}`;
    }
    if (format == "yyyy-mm") {
        result = `${y}-${m < 10 ? "0" + m : m}`;
    }
    if (format == "mm-dd") {
        result = ` ${mm < 10 ? "0" + mm : mm}:${ddmin < 10 ? "0" + dd : dd}`;
    }
    if (format == "hh:mm") {
        result = ` ${h < 10 ? "0" + h : h}:${min < 10 ? "0" + min : min}`;
    }
    if (format == "yyyy") {
        result = `${y}`;
    }
    return result;
}
/**
 * str   是列表里面备注信息部分的处理
 * */
const descriptionValue=function(str){   //对列表的里面的备注信息进行处理  
	var result=''
	if((!str && typeof str !='undefined' && str !=0) || typeof str =='undefined' ){
		result=''
	}else{
		result=str.length>9?str.substring(0,9)+'...':str
	}
	return result;
}

export { timeFormat, descriptionValue}
