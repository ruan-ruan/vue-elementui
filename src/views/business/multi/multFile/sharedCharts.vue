<template>
	<div>
		<el-form :model='filters' ref='filters':inline='true'>
			<el-form-item>
				<el-select v-model='filters.unit'class='sel_chart'>
					<el-option v-for='(item ,index) in unitData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<el-select v-model='filters.selVal'class='sel_chart'>
					<el-option v-for='(item ,index) in valData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<el-select v-model='filters.selTime'class='sel_chart'>
					<el-option v-for='(item ,index) in timeData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<el-button type='primary' size='small'  @click='ChartData'>搜索</el-button>
			</el-form-item>
			<el-form-item v-if='filters.selTime==="自定义"'>
				<el-date-picker
			      	v-model="filters.time"
			      	type="datetimerange"
			      	range-separator="至"
			      	start-placeholder="开始日期"
			      	end-placeholder="结束日期" class='sel_chart'
			      	>
			    </el-date-picker>
			</el-form-item>
		</el-form>
		<el-row>
			<el-col :span='24'>
				<div style="width: 600px;height: 600px;" ref='chartsa'></div>
				<el-table :data='dataSet' highlight-current-row style='width: 580px;' v-loading='chartLoading'>
				 	<el-table-column prop='name'width='140' align='center'></el-table-column>
				 	<el-table-column prop='now'width='100'label='now' align='center'></el-table-column>
				 	<el-table-column prop='min'width='110'label='min' align='center'></el-table-column>
				 	<el-table-column prop='avg'width='110'label='avg' align='center'></el-table-column>
				 	<el-table-column prop='max'width='110'label='max' align='center'></el-table-column>
				 </el-table>
			</el-col>
			<el-col :span='24'>
				<div style="width: 600px;height: 600px;" ref='chartsz'></div>
				<el-table :data='dataSet' highlight-current-row style='width: 580px;' v-loading='chartLoading'>
				 	<el-table-column prop='name'width='140' align='center'></el-table-column>
				 	<el-table-column prop='now'width='100'label='now' align='center'></el-table-column>
				 	<el-table-column prop='min'width='110'label='min' align='center'></el-table-column>
				 	<el-table-column prop='avg'width='110'label='avg' align='center'></el-table-column>
				 	<el-table-column prop='max'width='110'label='max' align='center'></el-table-column>
				 </el-table>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {datedialogFormat,isChartTime,arrayPro} from '@/assets/js/index.js'   //arrayPro  数组的处理
	
	export default{
		name:'sharedCharts',
		token:'',
		props:['titData'],//获取调用的是偶id    在获取对应的数据
		data(){
			return{
				filters:{
					unit:'Mbps',
					selVal:'平均值',
					selTime:'最近一天',
					time:'',
				},
				selTimeData:[],//获取所选的时间集合
				unitData:['Mbps','PPS'],
				valData:['平均值','最大值','最小值'],
				timeData:['最近一小时','最近一天','最近一周','自定义'],
				trafficData:[],//获取所选的时间和值的类型的内  数据的最大，最小，平均，实时
				chartLoading:false,
				dataSet:[],//不同的时间和不同的值的类型的数据处理后的集合
				chartsDataAll:[],//根据时间的选择获取所需的数据
				title:'',
				optionTraA:{},
				optionTraZ:{},
				sendType:[],//数据请求的发送的时间
				objTime:{
					min:'',
					max:'',
					avg:'',
					now:'',
				},
				chartsVal:[],//根据id获取数据
			}
		},
		watch:{
			filters:{
				handler(newVal,oldVal){
					if(newVal.selTime){//存在新的时间时候
						this.trafficData=this.getTimeData(newVal.selTime);//根据选择类型来获取对应的时间轴的区间
						console.log(this.sendType);
//						this.getChartData()
					}
					if(newVal.selVal){//根据所选的时间的类型，然后获取数据，在根据值的类型对数据进行处理
						
					}
				},
				deep:true
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			console.log(this.titData)
			if(typeof this.titData !=='undefined'){  //获取id下  对应的数据
//				this.getChartData(this.titData)
			}
			this.trafficData=this.getTimeData();
			this.ChartData(this.titData)
//			this.getChartData()
		},
		mounted(){
			this.getChart();
		},
		methods:{
			getTimeData(type='最近一天'){   //获取时间的间隔所有的数据//时间轴的循环的是按照 秒计算的			
				let strTime=[];//用来保存的所选时间，的时间间隔 
				let  end_time='';
				let  start_time='';
				let str=0;//用来保存时间的间隔的值
				//根据所选的时间间不同获取不同的时间间隔的数据
				if(type==='自定义'){
					
					if( (Number( this.filters.time[1])-Number(this.filters.time[0])) > 90 * 24 * 3600 * 1000 ){
						this.$message({
							message:'不能超过当前时间前的三个月！',
							type:'warning'
						})
						this.filters.time[1]=new Date();
						end_time=new Date();
						this.filters.time[0]=Number( this.filters.time[1])-90 * 24 * 3600 * 1000
						str=60*60*1000;
					}else if(Number( this.filters.time[1])-Number(this.filters.time[0])  <= 90 * 24 * 3600 * 1000 &&  Number( this.filters.time[1])-Number(this.filters.time[0]>=  24 * 3600 * 1000 ) ) {
						if( Number( this.filters.time[1] ) > Number( new Date() ) ){
							console.log('zhixing ');
							this.filters.time[1]=new Date();
							end_time=new Date();

						}else if( Number(new Date()) >= Number( this.filters.time[1]) ){
							end_time=this.filters.time[1];
							
						}
						str=60*60*1000;
					}else if( (Number( this.filters.time[1])-Number(this.filters.time[0])) < 24 * 3600 * 1000 ){
						if( Number( this.filters.time[1] ) > Number( new Date() ) ){
							console.log('zhixing ');
							this.filters.time[1]=new Date();
							end_time=new Date();

						}else if( Number(new Date()) >= Number( this.filters.time[1]) ){
							end_time=this.filters.time[1];
							
						}
						str=60*1000;
					}
					start_time=this.filters.time[0];
				}else if(type !=='自定义'){
					end_time=new Date();
					start_time=new Date();
					if(type==='最近一小时'){//间隔每一分钟
						start_time.setTime(start_time.getTime() - 3600 * 1000  );
						str=60*1000;
						console.log(start_time)
					}else if(type==='最近一天'){//间隔五分钟
						
						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 );
						
						str=5*60*1000;
					}else if(type ==='最近一周'){//间隔一个小时
						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 * 7 );
						str=60*60*1000;
					}
				}
				strTime=this.getTimeVal(Number(start_time),Number(end_time),str).data;
				var timeVal=arrayPro.unique(this.getTimeVal(Number(start_time),Number(end_time),str).send).sort(arrayPro.sortNum);
				this.sendType=timeVal;
				
				console.log(strTime)
				
				return strTime;
			},
			getTimeVal(start_time,end_time,str){
				let  timeObj={
					data:[],//时间轴上的集合
					send:[],//需要发送的数据
				}
				let arr=[];
				for(let item =start_time;item<end_time;item+=str){
					//将每一个时间戳转换为标准时间
					timeObj.data.push(arrayPro.datedialogFormat(item/1000))  //获取时间的区间    item现在是毫秒时间  所以需要/1000
					arr.push( isChartTime(item/1000) );
				}
				timeObj.send=arr.map(Number);
				console.log(timeObj.data)
				console.log(timeObj.send);
				return timeObj;//数组
			},
			getData( val,type){
				
				if(type==='自定义'){
					
				}else if(type !=='自定义'){
					if(type==='最近一小时'){//就是当前的数据
						
					}else if(type === '最近一天'){//五分钟间隔数据
						
					}else if(type==='最近一周'){//一小时间隔
						
					}
				}
				
				
				
				
			},
			selectVal(timeVal){  //根据时间  匹配所有的数据
				var findNode=this.chartsDataAll.find(function(obj){
					return obj.time===timeVal;
				})
				this.nodeObj=Object.assign({},findNode);
				return this.nodeObj;
			},
			getChartData(strType=1,ids){//获取数据      根据时间的类型不同进行数据的筛选   strType为间隔,该函数   是在时间改变的时候就要出发
				let selData=[]; //根据选择的开始和结束时间，对该新拼接的数组进行筛选
				let newData=[];//根据时间获取数据拼接到一个新的数组里面
				let sliData=[];//截取后分开的数据
				let staIndex='';
				let endIndex='';
				
				//遍历以后再进行树的排序
				let time='';
				this.sendType.forEach(ele => {
					time=ele.toString();
					this.$ajax.get('/vll/get_vll_flow'+ids+'?token='+this.token,time)
					.then(res => {
						console.log(res);
						if(res.status==200){
							if(res.data.status==0){
//								this.chartsDataAll.push(res.data.data);
								newData.push(res.data.data);
								
								//对获取到的数据   进行遍历，如果存在空缺的数据，则进行补全
//								this.trafficData
								staIndex=arrayPro.findIndex(newData,this.trafficData[0]);
								endIndex=arrayPro.findIndex(newData,this.trafficData[this.trafficData.length-1]);
								selData=newData.slice(staIndex,endIndex);//获取截取后的数组
								//后根据不同的时间间隔获取不同的数据间隔既可：
								for (var i=0;i<selData.length;i+= strType) {
									sliData.push(selData.slice(i,i+strType))   //获取分割后的对象
								}
							}
						}
					}).catch(e => {console.log(e)})
				})
			},
			getValPro(str){//根据数组   获取数据的里面的平均值，最大值，最小值
				
				
			},
			getChart(){
				let that=this;
				let chartsA=this.$echarts.init(this.$refs.chartsa);
				let chartsZ=this.$echarts.init(this.$refs.chartsz);
				
				
				this.optionTraA={
					    title: {
					        text: 'A端',
					        subtext:'带宽'+this.filters.unit,
					        subtextStyle:{
					        	fontSize:'13'
					        },
					        textStyle:{
								fontSize:'14',
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
					        data:['A1端111111','a1端222222','B1端333333','b1端444444','C1端555555','c1端666666',]
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
					        data: that.trafficData
					    },
					    yAxis: {
					        type: 'value'
					    },
					    series: [{
					        name: 'A1端111111',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{},
					        symbol: 'none',
					        data:['11','21','31','51','61','11','21','31','51','61','11','21','31','51','61','11','21','31','51','61','11','21','31','51','61',]
					    },
					    {
					        name: 'a1端222222',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{ },
					        symbol: 'none',
					        data:['31','42','53','65','76','31','42','53','65','76','31','42','53','65','76','31','42','53','65','76','31','42','53','65','76',]
					    },
					    {
					        name: 'B1端333333',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{},
					        data:['111','22','123','435','126','111','22','123','435','126','111','22','123','435','126','111','22','123','435','126','111','22','123','435','126',]
					    },
					    {
					        name: 'b1端444444',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{},
					        data:['122','21','322','511','622','122','21','322','511','622','122','21','322','511','622','122','21','322','511','622','122','21','322','511','622',]
					    },
					    {
					        name: 'C1端555555',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:['17','72','93','435','116','17','72','93','435','116','17','72','93','435','116','17','72','93','435','116','17','72','93','435','116','17','72','93','435','116',]
					    },
					    {
					        name: 'c1端666666',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1,
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:['15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6',]
					    }]
					};
					
					chartsA.setOption(this.optionTraA);
					
					
					this.optionTraZ={
					    title: {
					        text: 'Z端',
					        subtext:'带宽'+this.filters.unit,
					        subtextStyle:{
					        	fontSize:'13'
					        },
					        textStyle:{
								fontSize:'14',
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
					        data:['A1端111111','a1端222222','B1端333333','b1端444444','C1端555555','c1端666666',]
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
					        data: that.trafficData
					    },
					    yAxis: {
					        type: 'value'
					    },
					    series: [{
					        name: 'A1端111111',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{},
					        symbol: 'none',
					        data:['11','21','31','51','61','11','21','31','51','61','11','21','31','51','61','11','21','31','51','61','11','21','31','51','61',]
					    },
					    {
					        name: 'a1端222222',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{ },
					        symbol: 'none',
					        data:['31','42','53','65','76','31','42','53','65','76','31','42','53','65','76','31','42','53','65','76','31','42','53','65','76',]
					    },
					    {
					        name: 'B1端333333',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{},
					        data:['111','22','123','435','126','111','22','123','435','126','111','22','123','435','126','111','22','123','435','126','111','22','123','435','126',]
					    },
					    {
					        name: 'b1端444444',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{},
					        data:['122','21','322','511','622','122','21','322','511','622','122','21','322','511','622','122','21','322','511','622','122','21','322','511','622',]
					    },
					    {
					        name: 'C1端555555',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:['17','72','93','435','116','17','72','93','435','116','17','72','93','435','116','17','72','93','435','116','17','72','93','435','116','17','72','93','435','116',]
					    },
					    {
					        name: 'c1端666666',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1,
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:['15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6','15','72','93','115','6',]
					    }]
					};
					chartsZ.setOption(this.optionTraZ);
					
			},
			ChartData(){//获取id下 对应的数据
				let para={
					search_date :'20190811'
				}
				this.$ajax.get('/vll/get_vll_flow/'+this.titData+"?token="+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.chartsVal=res.data.data;
//							this.$emit('sendParend',)
							//筛选  当前的数据是d2d，c2c，d-c
						}
					}
				}).catch(e => {console.log(e)})
			}
		}
	}
</script>

<style>
</style>