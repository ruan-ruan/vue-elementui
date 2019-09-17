<template>
	<div>
		<section>
			<el-row style='margin-bottom: 40px;'>
				<el-col :span='24' >
					<!--<div ref='charts'></div>-->
					<h2 v-text='unitStatus?traffic:(valStatus?broken:virtual)'></h2>
					<el-form :inline='true' :model='chartFilters' ref='chartFilters' v-loading='chartLoading'>
						<el-form-item >
							<el-select v-model='chartFilters.unit' class='sel_chart' v-if='unitStatus'>
								<el-option v-for='(item,index) in trafficUnit'
									:label='item.label'
									:value='item.value'
									:key='index'></el-option>
							</el-select>
							<el-select v-model='chartFilters.val'class='sel_chart' v-if='valStatus'>
								<el-option v-for='(item,index) in trafficValue'
									:label='item.label'
									:value='item.value'
									:key='index'></el-option>
							</el-select>
							<el-select v-model='chartFilters.date'class='sel_chart'>
								<el-option v-for='(item , index) in trafficDate'
									:label='item.label'
									:value='item.value'
									:key ='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item >
							<el-button @click='getChartsVal' type='primary' size='small'>查询</el-button>
						    <el-date-picker
						      	v-model="chartFilters.time"
						      	type="daterange"
						      	range-separator="至"
						      	start-placeholder="开始日期"
						      	end-placeholder="结束日期" class='sel_chart' v-if="(chartFilters.date)==='自定义'"
						      	>
						    </el-date-picker>
						</el-form-item>
					</el-form>
				</el-col>
				<el-col :span='24'>
					 <div style="width: 600px;height: 600px;" ref="myechart" ></div>
					 <el-table :data='trafficDateValA' highlight-current-row style='width: 580px;'v-if='unitStatus'>
					 	<el-table-column prop='name'width='140' align='center'></el-table-column>
					 	<el-table-column prop='now'width='100'label='now' align='center'></el-table-column>
					 	<el-table-column prop='min'width='110'label='min' align='center'></el-table-column>
					 	<el-table-column prop='avg'width='110'label='avg' align='center'></el-table-column>
					 	<el-table-column prop='max'width='110'label='max' align='center'></el-table-column>
					 </el-table>
					 <div style="width: 600px;height: 600px;" ref="myechartB" v-if='unitStatus'></div> 	
					 <el-table :data='trafficDateValB' highlight-current-row style='width: 580px;'v-if='unitStatus'>
					 	<el-table-column prop='name'width='140' align='center'></el-table-column>
					 	<el-table-column prop='now'width='100'label='now' align='center'></el-table-column>
					 	<el-table-column prop='min'width='110'label='min' align='center'></el-table-column>
					 	<el-table-column prop='avg'width='110'label='avg' align='center'></el-table-column>
					 	<el-table-column prop='max'width='110'label='max' align='center'></el-table-column>
					 </el-table>
				</el-col>
			</el-row>
		</section>
	</div>
</template>

<script>

	import {datedialogFormat} from '@/assets/js/index.js'
	
	export default{
		name:'chartData',
		props:['traffic','broken','virtual'], 
		data(){
			return{
				token:'',
				chartFilters:{
					unit:'Mbps',//带宽的单位
					val:'平均值',//选择值的类型
					date:'最近一天',//选择的时间日期
					time:'',//自定义的时候时间
					end_time:'',//截止时间
					start_time:'',//开始时间
				},
				chartLoading:false,
				trafficUnit:[
					{
						label:'Mbps',
						value:'Mbps'
					},{
						label:'PPS',
						value:"PPS"
					}
				],
				trafficValue:[
					{
						label:'平均值',
						value:'平均值'
					},{
						label:"最大值",
						value:'最大值'
					},{
						label:'最小值',
						value:'最小值'
					}
				],
				trafficDate:[
					{
						value:'最近一小时',
						label:'最近一小时'
					},{
						label:'最近一天',
						value:'最近一天'
					},{
						label:'最近一周',
						value:'最近一周'
					},{
						label:'自定义',
						value:'自定义'
					}
				],
				timeData:[],//时间的所有的数据集合
				chartDataA: [10, 212, 21, 54, 260, 830, 710,10, 212, 21, 54, 260, 830, 710,10, 212, 21, 54, 260, 830, 710,10, 212, 21, 54, 260, 830, 710,],
				chartDataZ: [10, 212, 21, 54, 260, 830, 710,10, 212, 21, 54, 260, 830, 710,10, 212, 21, 54, 260, 830, 710,10, 212, 21, 54, 260, 830, 710,],
				trafficDateVal:[],//选择不通的时间区间的的时候显示不同的时间间隔
				trafficDateValA:[],//流量里面的额A断点额数据
				trafficDateValB:[],//流量里面Z端的数据
				unitStatus:true,//单位控制 默认的时候是显示的
				valStatus:true,
				optionTra:{},
				optionBro:{},
				optionVir:{},
				
			}
		},
		watch:{
			'chartFilters.date':function(newVal,oldVal){
				let end_time=new Date();
				let start_time=new Date();
				if(newVal=='自定义'){
					return;
				}else {
					if(newVal=='最近一小时'){
						console.log('进入一个小时')
						start_time.setTime(start_time.getTime() - 3600 * 1000 );;
						
					}else if(newVal=='最近一天'){
						console.log('进入一天')
						
						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 );
					}else if(newVal=='最近一周'){
						console.log('进入一轴')
						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 * 7);
					}
					this.chartFilters.start_time=datedialogFormat(Number(start_time)/1000);
					this.chartFilters.end_time=datedialogFormat(Number(end_time)/1000);
//					this.getChartsVal();
					let data=[];//数据
//					this.getTimeInterval(Number(start_time)/1000,newVal,data);
					this.timeData=this.getTimeData((Number(start_time)/1000),(Number(end_time)/1000))
				}
			},
			'chartFilters.time':function(newVal){
				//自定义的时间部分
				if(newVal){
					this.chartFilters.start_time=datedialogFormat(Number(this.chartFilters.time[0])/1000);
					this.chartFilters.end_time=datedialogFormat(Number(this.chartFilters.time[1])/1000);	
					this.getChartsVal();
				}
			},
			'chartFilters.val':function(newVal,oldVal){
				if(!newVal){
					//不存在新的值的时候，执行平均值
//					this.chartDataA=[]//平均值
					this.chartDataA=this.selectVal('平均值')
				}else if(newVal){
					//当新的值存在的时候
					this.chartDataA=this.selectVal(newVal)
				}
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			if(this.traffic){
				this.unitStatus=true;
				this.valStatus=true;
			}else if(this.broken){
				this.unitStatus=false;
				this.valStatus=true;
			}else if(this.virtual){
				this.unitStatus=false;
				this.valStatus=false;
			}
		},
		mounted(){

			//设置时间的区间
			let  end_time=new Date();
			let  start_time=new Date();
			start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 );
			this.timeData=this.getTimeData((Number(start_time)/1000),(Number(end_time)/1000))
//			this.chartFilters.end_time=datedialogFormat(Number(end_time)/1000);
//			this.chartFilters.start_time=datedialogFormat(Number(start_time)/1000);
			//设置默认显示的平均值
//			let timeAge=[];
//			for(let index in this.timeData){
//				if(this.timeData[index]=='' ){
//					//如果存在空的值时候，这个时候取前后的两个值平均值既可    判断第一个值和最后一个值不存在的时候
//					if(index=0){
//						this.timeData[index]=(this.timeData.index+1)/2;
//					}else if(index=this.timeData.length-1){
//						this.timeData[index]=(this.timeData.length-2)/2;
//					}else{
//						this.timeData[index]=( (this.timeData.index-1)+(this.timeData.index+1) )/2
//					}
//				}
//			}
//			timeAge.push(this.getVal(this.timeData))
			//显示默认现实的额Mbps
			this.getChartsVal();
			
		},
		methods:{
			getCharts(){
				//提交的时候获取对应的时间
//				this.getTimeData(start_time,end_time);
				
			},
			getTimeData(start_time,end_time){   //获取时间的间隔所有的数据
				//时间轴的循环的是按照 秒计算的
				let strTime=[];//用来保存的所选时间，的时间间隔	
//				let newData=[]
				for(let item =start_time;item<end_time;item+=60){
					//将每一个时间戳转换为标准时间
					strTime.push(datedialogFormat(item))
				}
//				for(let i=0;i<strTime.length;i+=timeVal){
//					newData.push(strTime.slice(i,i+timeVal))
//				}
				return strTime;//数组
			},
			getTimeVal(start_time,end_time){   //返回所选择的时间的内的数据
				//根据选择的时间   最近一天  ，一小时  ，一周  获取对应的 值
				//对于不同的单位的的流量进行重新获取新的数据
				let para={
					start_time:start_time,
					end_time:end_time
				}
				let timeVal=[];
				this.$ajax.get('/'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(para);
							timeVal=res.data.data.items;
						}
					}
				}).catch(e => {
					console.log(e)
				})
				
				return timeVal;
			},
			setTimeVal(time_type){
				//每个时间端不同展示的数据类型也是不一样的额 
				let timeVal=[];//邮过来保存所选时间的内的所有请求的到的数据			
				let endTime=new Date();
				let startTime=new Date();
				let val=0;
				//因为每个区间的抓的数据时间间隔是不一样的，所以，对于不同的时间间隔，获取最大，最小，平均组成的值  即是现在的图
				if(time_type=='最近一小时'){
					start_time.setTime(start_time.getTime() - 3600 * 1000 ); 
					val=1;
				}else if(time_type=='最近一天'){
					start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 );
					val=5
				}else if(time_type=='最近一周'){
					start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 *7);
					val=5
				}else if(time_type=='自定义'){
					val=5;
					start_time.setTime(this.chartFilters.time[0]);
					
				}
				timeVal=this.getTimeVal(start_time,end_time);//获取所选的时间内的所有的数据
				this.test(timeVal,val)
			},
			selectVal(val){
				let  time=this.getTimeVal();
				let data=[];
				//根据选择的值的类型 ，来控制
				if(val=='最大值'){
					data=this.test(time).max;
				}else if(val=='最小值'){
					data=this.test(time).min
				}else if(val=='平均值'){
					data=this.test(time).age;
				}
				return data;
			},
			test:function (str,val){  //获取截取分割后数组内的最大最小平均值
				//str是要遍历的数组，val是遍历过后的数据的间隔   并返回对应的当前的数组间隔的最大，最小，平均值
				
				let min=[],max=[],age=[],arr=[];
				//对数组里面的额数据进行遍历，当数组里面的数据存在两种情况，string和number，对于不同的数组进行判断
				for(let index=0;index<str.length;index++){
				    if(typeof str[index] =='string'){
				        if(str[index]==''){
				            //对空的字符串的值进行填充
				            if(index==0){
				                str[index]=((parseInt(str[index+1])+parseInt(str[index+2]))/2).toString()
				            }else if(index==str[length-1]){
				                str[index]=((parseInt(str[index-1])+parseInt(str[index-2]))/2).toString()
				            }else{
				                str[index]=((parseInt(str[index+1])+parseInt(str[index-1]))/2).toString()
				            }
				        }
				    }
				}
				
				for(let index =0;index<str.length;index+=val){
					arr.push(str.slice(index,index+val))  
				}
				arr.forEach(ele => {
			        min.push(this.strVal(ele.map(Number)).min)
			        max.push(this.strVal(ele.map(Number)).max)
			        age.push(this.strVal(ele.map(Number)).age)
			    })
				    let obj={
				        min:min,
				        max:max,
				        age:age
				    }
				    return obj;
				
				},
			strVal:function (arr){//获取某个数组内的最大，最小，平均
			    let obj={
			        min:0,
			        max:0,
			        age:0
			    }
			    let total=0
			    if(arr.length>1){
			        //当数组的长度的大于一的时候这个时候进行遍历
			        for(let item =0;item <arr.length;item++){
			            let key =arr[item];
			            if(arr[item]>arr[item+1]){
			                arr[item]=arr[item+1];
			                arr[item+1]=key;
			            }
			            obj.min=arr[0];
			            obj.max=arr[arr.length-1];
			            total+=arr[item];
			            obj.age=total/arr.length
			        }
			        console.log(obj.age);console.log(total)
			    }else{
			        obj.min=obj.max=obj.age=arr[0];
			    }
			    return obj;
			},
			getChartsVal(){
				let charts=this.$echarts.init(this.$refs.myechart);

				if(this.traffic ){
					let chartsB=this.$echarts.init(this.$refs.myechartB);
					this.optionTra={
					    title: {
					        text: 'A端',
					        subtext:'带宽'+this.chartFilters.unit,
					        subtextStyle:{
					        	fontSize:'13'
					        },
					        textStyle:{
								fontSize:'14'
							}
					    },
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'cross',
					            animation: false,
					            label: {
					                backgroundColor: '#505765'
					            }
					        },
					    },
					    legend: {
					        data:['A1端','a1端','B1端','b1端','C1端','c1端',]
					    },
					    dataZoom: [
					        {
								type: 'slider',
								xAxisIndex:0,
								show:true,
								realtime:true,
							}
					    ],
					    xAxis: {
					        type: 'category',
					        boundaryGap: false,
					        data: this.timeData
					    },
					    yAxis: {
					        type: 'value'
					    },
					    series: [{
					        name: 'A1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{},
					        symbol: 'none',
					        data:this.chartDataA,
					    },
					    {
					        name: 'a1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{ },
					        symbol: 'none',
					        data:this.chartDataA
					    },
					    {
					        name: 'B1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{
					            
					        },
					        data:this.chartDataA
					    },
					    {
					        name: 'b1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{
					            
					        },
					        data:this.chartDataA
					    },
					    {
					        name: 'C1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:this.chartDataA
					    },
					    {
					        name: 'c1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:this.chartDataA
					    }]
					};
					charts.setOption(this.optionTra);
					
					
					var label={
					    title: {
					        text: 'Z端',
					        subtext:'带宽'+'('+'Mbps'+')',
					        subtextStyle:{
					        	fontSize:'13'
					        },
					        textStyle:{
								fontSize:'14'
							}
					    },
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'cross',
					            animation: false,
					            label: {
					                backgroundColor: '#505765'
					            }
					        },
					    },
					    legend: {
					        data:['A1端','a1端','B1端','b1端','C1端','c1端',]
					    },
					    dataZoom: [
					        {
								type: 'slider',
								xAxisIndex:0,
								show:true,
								realtime:true,
							}
					    ],
					    xAxis: {
					        type: 'category',
					        boundaryGap: false,
					        data: this.timeData
					    },
					    yAxis: {
					        type: 'value'
					    },
					    series: [{
					        name: 'A1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{},
					        symbol: 'none',
					        data: this.chartDataZ
					    },
					    {
					        name: 'a1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{ },
					        symbol: 'none',
					        data: this.chartDataZ
					    },
					    {
					        name: 'B1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{
					            
					        },
					        data: this.chartDataZ
					    },
					    {
					        name: 'b1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{
					            
					        },
					        data: this.chartDataZ
					    },
					    {
					        name: 'C1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{
					            
					        },
					        data: this.chartDataZ
					    },
					    {
					        name: 'c1端',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{
					            
					        },
					        data:this.chartDataZ
					    }]
					};
					chartsB.setOption(label)
				}else if(this.broken){
					this.optionBro={
						title:{
							text:this.broken,
						},
						tooltip:{
							trigger:'axis',
							axisPointer:{
								type:'cross',
								animation:false,
								label:{
									backgroundColor:'#505765'
								},
							}
						},
						legend:{
							data:['专线']
						},
						dataZoom:[
							{
								type: 'slider',
							}
						],
						grid: {
					        bottom: 80,
					    },
					    toolbox: {
					        feature: {
					            saveAsImage: {}
					        }
					    },
					    xAxis: {
//					        type: 'category',
//					        boundaryGap: false,
//					        data: ["1","2","3","4","5"]
							type:'category',
							boundaryGap:false,
							axisLine:{onZero:false},
							data:['2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', ].map(function(str){return str.replace('','\n')})
					    },
					    yAxis: {
					        type: 'value'
					    },
					    series: [
       
					        {
					            name:'val',
					            type:'line',
					            stack: '总量',
					            data:["1","2","3","4","5"]
					        }
					    ]
					    
					}
					charts.setOption(this.optionBro)
				}else if(this.virtual){
					this.optionVir={
						title:{
							text:this.virtual,
						},
						grid:{
							bottom:80
						},
						xAxis: {
					        type: 'category',
					        data:['2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', ].map(function(str){return str.replace('','\n')})
					    },
					    grid:{
							bottom:80
						},
						tooltip:{
							trigger:'axis',
							axisPointer:{
								type:'cross',
								animation:false,
								label:{
									backgroundColor:'#505765'
								},
							}
						},
						legend:{
							data:['丢包']
						},
					    dataZoom:[
							{
								type: 'slider',
							},{
								type:'inside',
							}
						],
					    yAxis: {
					        type: 'value'
					    },
					    series: [{
					        data: [820, 932, 901, 934, 1290, 1330, 1320],
					        type: 'line'
					    }]
					}
					
					charts.setOption(this.optionVir)
				}
			}
		}
	}
</script>

<style>
</style>