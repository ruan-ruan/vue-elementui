<template>
	<div>
		<!--点到点的图表数据-->
		<el-form :inline='true' :model='filters' ref='filters'  >
			<el-form-item label='请选择'>
				<el-select v-model='filters.type'class='sel_chart' @change='selTypeData(filters.type)'>
					<el-option v-for='(item ,index) in typeData' 
						:label='item.label'
						:value='item.data'
						:key='index'></el-option>
				</el-select>
				<el-select v-model='filters.logic' class='sel_chart'>
					<el-option v-for='(item , index) in logicData'
						:label='item.label'
						:value='item.value'
						:key='index'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button size='small'  type='primary' @click='getFilters'> 搜索</el-button>
			</el-form-item>
		</el-form>
		
		
		<el-form :model='filters' ref='filters' :inline='true'>
			<el-form-item >
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
				<el-button type='primary' size='small'  @click='ChartData(titData)'>搜索</el-button>
				
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
			<!--a端-->
			<el-col :span='24'>
				<div style="width: 600px;height: 600px;" ref='chartsa' v-loading='chartLoading'></div>
				<el-table :data='users' highlight-current-row style='width: 580px;' v-loading='chartLoading'>
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
		name:'multCharts',
		props:['titData'],//  titData    点到点的业务id
		data(){
			return{
				token:'',
				filters:{
					unit:'Mbps',
					selVal:'平均值',
					selTime:'最近一天',	
					time:'',
					type:'数据中心',
					logic:'',
				},
				unitData:['Mbps','PPS'],
				valData:['平均值','最大值','最小值'],
				timeData:['最近一小时','最近一天','最近一周','自定义'],
				chartLoading:false,
				chartsVal:[],//表格的数据
				users:[],//图表下面的表格的数据
				usersZ:[],
				trafficData:[],//获取时间  不同的值的类型的集合
				sendType:[],//数据请求的发送的时间
				sliData:[],//截取后的原始数据   需要再次处理
				baseObjA:{},//a的表格属性
//				baseDataA:[],//
				baseObjZ:{},//z的表格属性
				
				valType:'',
				typeData:[{
					label:'数据中心',
					logic_name:'',
					data:[1],//保存数据中心里面的所有的dc的逻辑口的名字和数据
				},{
					label:'公有云',
					logic_name:'',
					data:[2]
				}],
				logicData:[],
			}
		},
		watch:{
			filters:{
				handler(newVal,oldVal){
					if(newVal.selTime){//存在新的时间时候
						this.trafficData=this.getTimeData(newVal.selTime);//根据选择类型来获取对应的时间轴的区间
						
					}
					if(newVal.selVal){//根据所选的时间的类型，然后获取数据，在根据值的类型对数据进行处理
						this.valType=this.seaVal(newVal.selVal)   // 返回值的值的类型   对应的字段
						console.log(this.valType)
					}
				},
				deep:true
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.valType=this.seaVal();
			this.trafficData=this.getTimeData();
			this.ChartData(this.titData);
			
		},
		methods:{
			selTypeData(data){
				console.log(data)
			},
			getFilters(flowType){
				let sliData=[],setObj={} //根据选择的开始和结束时间，对该新拼接的数组进行筛选
								
								flowType.forEach(item => {									
									
//									console.log(item)  this.trafficData
//									staIndex=arrayPro.findIndex(item.flow,'2019-08-11 11:42:00');//获取将要截
//									endIndex=arrayPro.findIndex(item.flow,'2019-08-11 12:42:00');//获取截取的
									staIndex=arrayPro.findIndex(item.flow,this.trafficData[0]);//获取将要截旗起点
									endIndex=arrayPro.findIndex(item.flow,this.trafficData[this.trafficData.length-1]);//获取截取的终点
									setObj={
										id:item.id,
										name:item.name,
										vlan:item.vlan,
										logic_port:item.logic_port,
										physical_ports:item.physical_ports,
										flow:item.flow.slice(staIndex,endIndex),
									}
									sliData.push(setObj)
								})
								this.sliData=sliData;
								// arrayPro.chartData( data  ,'key ','type' )//获取某一个属性的值集合   这里获取数据 还需要  根据单位的不同  进行处理   
							//selData   是根据时间的类型获取的数据    data      后面根据时间和值的类型获取对应的值
								
								var AData=this.selectVal(sliData)[0].data;//A端的数据

								let  objA={//    这里面 的数据   是两个单位情况下显示的数据        所以根据单位的不同 进行判断
									input_bytes_d1:this.dealData('input_bytes',arrayPro.testCharts(AData,'input_bytes',this.valType).d1),
									input_packages_d1:this.dealData('input_packages',arrayPro.testCharts(AData,'input_packages',this.valType).d1),
									output_bytes_d1:this.dealData('output_bytes',arrayPro.testCharts(AData,'output_bytes',this.valType).d1),
									output_packages_d1:this.dealData('output_packages',arrayPro.testCharts(AData,'output_packages',this.valType).d1),
									
									input_bytes_d2:this.dealData('input_bytes',arrayPro.testCharts(AData,'input_bytes',this.valType).d2),
									input_packages_d2:this.dealData('input_packages',arrayPro.testCharts(AData,'input_packages',this.valType).d2),
									output_bytes_d2:this.dealData('output_bytes',arrayPro.testCharts(AData,'output_bytes',this.valType).d2),
									output_packages_d2:this.dealData('output_packages',arrayPro.testCharts(AData,'output_packages',this.valType).d2),

								}
								let objA_total={
									input_bytes_total:arrayPro.totalData(objA.input_bytes_d1,objA.input_bytes_d2),
									input_packages_total:arrayPro.totalData(objA.input_packages_d1,objA.input_packages_d2),
									
									output_bytes_total:arrayPro.totalData(objA.output_bytes_d1,objA.output_bytes_d2),
									output_packages_total:arrayPro.totalData(objA.output_packages_d1,objA.output_packages_d2),

								}
								this.baseObjA={//A端的基本信息    将数据处理后   页添加进去
									logic_port:sliData[0].logic_port.name,
									dev_name1:sliData[0].physical_ports[0].dev.name,
									dev_name2:sliData[0].physical_ports[1].dev.name,
									vlan:sliData[0].vlan,
									
									input_data_d1:this.filters.unit === 'Mbps'? objA.input_bytes_d1 : objA.input_packages_d1,
									output_data_d1:this.filters.unit === 'Mbps'? objA.output_bytes_d1 : objA.output_packages_d1,
									
									input_data_d2:this.filters.unit === 'Mbps'? objA.input_bytes_d2 : objA.input_packages_d2,
									output_data_d2:this.filters.unit === 'Mbps'? objA.output_bytes_d2 : objA.output_packages_d2,
									
									input_data_total:this.filters.unit === 'Mbps'? objA_total.input_bytes_total : objA_total.input_packages_total,
									output_data_total:this.filters.unit === 'Mbps'? objA_total.output_bytes_total : objA_total.output_packages_total,
									
								}
								
								let usersA=[]
								if(this.baseObjA.input_data_total.length ===0 ||this.baseObjA.output_data_total.length===0){
									usersA=[]
								}else{
									let input_name={
										name:this.baseObjA.logic_port+'-'+this.baseObjA.vlan,
									}
									let input_tabA=arrayPro.tim(this.baseObjA.input_data_total)
									
									let output_name={
										name:this.baseObjA.logic_port+'-'+this.baseObjA.vlan,
									}
									let output_tabA=arrayPro.tim(this.baseObjA.output_data_total)
									
									let input_tableA=Object.assign({},input_name,input_tabA);
									let output_tableA=Object.assign({},output_name,output_tabA);
									usersA.push(input_tableA)
									usersA.push(output_tableA)
								}
								this.users=usersA;
								this.getCharts(this.baseObjA);//画图
			},
			ChartData(ids){//获取id下 对应的数据

				let newData=[];//保存每次获取的数据

				let staIndex='';
				let endIndex='';
				var obj={};
				var ChartsData=[];
				var sortID=[];//将id相同的部分里面flow合并即可

//				//遍历以后再进行树的排序
				let time={};

				this.sendType.forEach(ele => {
					time={//根据时间进行数据的获取
						search_date :ele.toString(),
					}
					this.chartLoading=true;
					this.$ajax.get('/vll/get_vll_flow/'+ids+'?token='+this.token,time)
					.then(res => {
						console.log(res)
						this.chartLoading=false;
						if(res.status==200){
							if(res.data.status==0){	
								//数据请求完成     组网的流量数据    判断数据里面的是数据中还是云的      选择什么数据   就对该数据 分别   对该数据进行处理  显示
								let Obj={
									
								}
								if(res.data.data.endpoints){
									
//									newData.push(res.data.data.endpoints);
//									this.typeData[0].data=res.data.data.endpoints
									obj={
										name:'数据中心',
										data:res.data.data.endpoints
									}
									newData.push(obj)
//									newData.push(res.data.data.endpoints)
								}else if(res.data.data.cloud_endpoints){
//									newData.push(res.data.data.cloud_endpoints);
//									this.typeData[1].data=res.data.data.cloud_endpoints
//									newData.push(res.data.data.cloud_endpoints)
									obj={
										name:'公有云',
										data:res.data.data.cloud_endpoints
									}
									newData.push(obj)
								}
								console.log(this.typeData)
								console.log(newData)
								let objVal={}
								newData.forEach(item => {
									console.log(item)
									
									item.data.forEach(el => {
										console.log(el)
										obj={
											id:el.id,
											name:el.name,
											vlan:el.vlan,
											flow:el.flow,
											logic_port:el.logic_port,
											physical_ports:el.physical_ports
										}
										ChartsData.push(obj)  //获取  筛选后的数组    用于数据的遍历	
									})
									let objVal={
										name:item.name,
										ChartsData:ChartsData
									}
								})
								console.log(ChartsData)
								console.log(this.typeData)
								
								sortID=arrayPro.sortArr(ChartsData,'id');//根据id相同部分合并     处理数据	
								console.log(sortID)
							var flowType=[]
								
							var flowObj={},
							obj={};
								sortID.forEach( item => {
									var data=[],vals=[];
									item.forEach(index => {
										data.push(index.flow);
										obj={
											id:index.id,
											name:index.name,
											vlan:index.vlan,
											logic_port:index.logic_port,
											physical_ports:index.physical_ports,
										}
									})
									data.map(function (value,index,array){
									vals=vals.concat(value)
								})
									flowObj={
										id:obj.id,
										name:obj.name,
										vlan:obj.vlan,
										logic_port:obj.logic_port,
										physical_ports:obj.physical_ports,
										flow:vals.sort(arrayPro.sortTime('time'))//进行排序
									}
									flowType.push(flowObj)
								})
								this.selData=flowType   //筛选后的数据   
								console.log(this.selData);
								
//								this.getFilters(flowType)
								
								let sliData=[],setObj={} //根据选择的开始和结束时间，对该新拼接的数组进行筛选
								
								flowType.forEach(item => {									
									
//									console.log(item)  this.trafficData
//									staIndex=arrayPro.findIndex(item.flow,'2019-08-11 11:42:00');//获取将要截
//									endIndex=arrayPro.findIndex(item.flow,'2019-08-11 12:42:00');//获取截取的
									staIndex=arrayPro.findIndex(item.flow,this.trafficData[0]);//获取将要截旗起点
									endIndex=arrayPro.findIndex(item.flow,this.trafficData[this.trafficData.length-1]);//获取截取的终点
									setObj={
										id:item.id,
										name:item.name,
										vlan:item.vlan,
										logic_port:item.logic_port,
										physical_ports:item.physical_ports,
										flow:item.flow.slice(staIndex,endIndex),
									}
									sliData.push(setObj)
								})
								this.sliData=sliData;
								// arrayPro.chartData( data  ,'key ','type' )//获取某一个属性的值集合   这里获取数据 还需要  根据单位的不同  进行处理   
							//selData   是根据时间的类型获取的数据    data      后面根据时间和值的类型获取对应的值
								
								var AData=this.selectVal(sliData)[0].data;//A端的数据

								let  objA={//    这里面 的数据   是两个单位情况下显示的数据        所以根据单位的不同 进行判断
									input_bytes_d1:this.dealData('input_bytes',arrayPro.testCharts(AData,'input_bytes',this.valType).d1),
									input_packages_d1:this.dealData('input_packages',arrayPro.testCharts(AData,'input_packages',this.valType).d1),
									output_bytes_d1:this.dealData('output_bytes',arrayPro.testCharts(AData,'output_bytes',this.valType).d1),
									output_packages_d1:this.dealData('output_packages',arrayPro.testCharts(AData,'output_packages',this.valType).d1),
									
									input_bytes_d2:this.dealData('input_bytes',arrayPro.testCharts(AData,'input_bytes',this.valType).d2),
									input_packages_d2:this.dealData('input_packages',arrayPro.testCharts(AData,'input_packages',this.valType).d2),
									output_bytes_d2:this.dealData('output_bytes',arrayPro.testCharts(AData,'output_bytes',this.valType).d2),
									output_packages_d2:this.dealData('output_packages',arrayPro.testCharts(AData,'output_packages',this.valType).d2),

								}
								let objA_total={
									input_bytes_total:arrayPro.totalData(objA.input_bytes_d1,objA.input_bytes_d2),
									input_packages_total:arrayPro.totalData(objA.input_packages_d1,objA.input_packages_d2),
									
									output_bytes_total:arrayPro.totalData(objA.output_bytes_d1,objA.output_bytes_d2),
									output_packages_total:arrayPro.totalData(objA.output_packages_d1,objA.output_packages_d2),

								}
								this.baseObjA={//A端的基本信息    将数据处理后   页添加进去
									logic_port:sliData[0].logic_port.name,
									dev_name1:sliData[0].physical_ports[0].dev.name,
									dev_name2:sliData[0].physical_ports[1].dev.name,
									vlan:sliData[0].vlan,
									
									input_data_d1:this.filters.unit === 'Mbps'? objA.input_bytes_d1 : objA.input_packages_d1,
									output_data_d1:this.filters.unit === 'Mbps'? objA.output_bytes_d1 : objA.output_packages_d1,
									
									input_data_d2:this.filters.unit === 'Mbps'? objA.input_bytes_d2 : objA.input_packages_d2,
									output_data_d2:this.filters.unit === 'Mbps'? objA.output_bytes_d2 : objA.output_packages_d2,
									
									input_data_total:this.filters.unit === 'Mbps'? objA_total.input_bytes_total : objA_total.input_packages_total,
									output_data_total:this.filters.unit === 'Mbps'? objA_total.output_bytes_total : objA_total.output_packages_total,
									
								}
								
								let usersA=[]
								if(this.baseObjA.input_data_total.length ===0 ||this.baseObjA.output_data_total.length===0){
									usersA=[]
								}else{
									let input_name={
										name:this.baseObjA.logic_port+'-'+this.baseObjA.vlan,
									}
									let input_tabA=arrayPro.tim(this.baseObjA.input_data_total)
									
									let output_name={
										name:this.baseObjA.logic_port+'-'+this.baseObjA.vlan,
									}
									let output_tabA=arrayPro.tim(this.baseObjA.output_data_total)
									
									let input_tableA=Object.assign({},input_name,input_tabA);
									let output_tableA=Object.assign({},output_name,output_tabA);
									usersA.push(input_tableA)
									usersA.push(output_tableA)
								}
								this.users=usersA;
								this.getCharts(this.baseObjA);//画图
							}
						}
					}).catch(e => {console.log(e)})
				})
			},
			dealData(type,data){//根据不同的单位  进行数据处理
				let newData=[]
				data.forEach(ele => {
					if(type === 'input_bytes' || type==='output_bytes'){
						newData.push(ele/60*8)
					}else if(type === 'input_packages' || type==='output_packages'){
						newData.push(ele/60)
					}
				})
				return newData;//不同的属性   换算是不一样的
			},
			seaVal:function(valType='平均值'){//根据值的不同的  获取   不同的类型的值的类型
				let  val=''
				if(valType ==='最大值'){
					val='max';
				}else if(valType ==='最小值'){
					val='avg';
				}else if(valType === '平均值'){
					val='min'
				}
//				console.log(val)
				return val;
			},
			selectVal(data,timeFew=5){//data  是数组     timeFew根据时间 的类型获取的时间间隔   也就是值的间隔      valType是值的类型
				console.log(data)
				//需要获取  逻辑口       以及设备d1    d2的数据      分别是入 和出       所以   一个逻辑口 共有  六条数据
				let strObj={},strData=[]
				for(var i=0;i<data.length;i++){
					  //里面包含a端和z端
					var dataVal=[];  
					var setData=data[i].flow;
					 //将数组进行切割  并求出里面的各个值的类型
					for(var index=0;index<data[i].flow.length;index+=timeFew){
						dataVal.push(data[i].flow.slice(index,index+timeFew))
					}
					strObj={
						name:data[i].name,
						vlan:data[i].vlan,
						flow:dataVal
					}
					strData.push(strObj)
				}
//				console.log(strData)
				let chartsData=[]
				strData.forEach(ele => {
//					console.log(ele)
					let str=[];	
					ele.flow.forEach(item => {
						 let obj={}
						 obj={
						 	d1:{
//						 		ifname:item[0].d1.ifname,
						 		//里面包含 最大 	最小	  平均值	总和
						 		//bps   单位   入
						 		input_bytes:arrayPro.flowObj(item,'input_bytes').d1,	
						 		//pps单位   入
						 		input_packages:arrayPro.flowObj(item,'input_packages').d1,
						 		//bps   出
						 		output_bytes:arrayPro.flowObj(item,'output_bytes').d1,
						 		//pps      出
						 		output_packages:arrayPro.flowObj(item,'output_packages').d1,
						 		
						 		total_input_bytes:arrayPro.flowObj(item,'total_input_bytes').d1,
						 		total_input_packages:arrayPro.flowObj(item,'total_input_packages').d1,
						 		total_output_bytes:arrayPro.flowObj(item,'total_output_bytes').d1,
						 		total_output_packages:arrayPro.flowObj(item,'total_output_packages').d1
						 	},
						 	d2:{
//						 		ifname:item[0].d2.ifname,
						 		//里面包含 最大 	最小	  平均值	总和
						 		//bps   单位   入
						 		input_bytes:arrayPro.flowObj(item,'input_bytes').d2,	
						 		//pps单位   入
						 		input_packages:arrayPro.flowObj(item,'input_packages').d2,
						 		//bps   出
						 		output_bytes:arrayPro.flowObj(item,'output_bytes').d2,
						 		//pps      出
						 		output_packages:arrayPro.flowObj(item,'output_packages').d2,
						 		
						 		total_input_bytes:arrayPro.flowObj(item,'total_input_bytes').d2,
						 		total_input_packages:arrayPro.flowObj(item,'total_input_packages').d2,
						 		total_output_bytes:arrayPro.flowObj(item,'total_output_bytes').d2,
						 		total_output_packages:arrayPro.flowObj(item,'total_output_packages').d2
						 	}
						 }
					str.push(obj)
					})
					let chartObj={
						name:ele.name,
						vlan:ele.vlan,
						data:str,
					}
					
					chartsData.push(chartObj)
				})
				console.log(chartsData);
				return chartsData;//   返回的是  处理完成以后的数组里面的对象    a端和z端所有的数据       下一步是对每一个属性进行  最大值  和最小值进行遍历
			},
			getCharts(dataObjA){//根据数据渲染图表
				
				let that=this;
				let chartsA=this.$echarts.init(this.$refs.chartsa);
//				let chartsZ=this.$echarts.init(this.$refs.chartsz);
				this.optionTraA={
					    title: {
					        text: 'A端',
//					        y:'center',
					        subtext:'带宽'+this.filters.unit,
//					        top:'0px',
//					        right:'0px',
					        subtextStyle:{
					        	fontSize:'13',
					        	top:'14px'
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
					        data:[
					        dataObjA.logic_port+'-'+dataObjA.vlan+'(入)',dataObjA.logic_port+'-'+dataObjA.vlan+'(出)',
					        dataObjA.dev_name1+'-'+dataObjA.vlan+'(d1入)', dataObjA.dev_name1+'-'+dataObjA.vlan+'(d1出)',
					        dataObjA.dev_name2+'-'+dataObjA.vlan+'(d2入)',  dataObjA.dev_name2+'-'+dataObjA.vlan+'(d2出)',
					        ],
					        left:'100px'
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
					        name:dataObjA.logic_port+'-'+dataObjA.vlan+'(入)',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{},
					        symbol: 'none',
					        data:this.baseObjA.input_data_total,//总的入
					    },
					    {
					        name: dataObjA.logic_port+'-'+dataObjA.vlan+'(出)',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{ },
					        symbol: 'none',
					        data:this.baseObjA.output_data_total,//总的出
					    },
					    {
					        name: dataObjA.dev_name1+'-'+dataObjA.vlan+'(d1入)', //d1
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{},
					        data:this.baseObjA.input_data_d1,
					    },
					    {
					        name:dataObjA.dev_name1+'-'+dataObjA.vlan+'(d1出)',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{},
					        data:this.baseObjA.output_data_d1,
					    },
					    {
					        name: dataObjA.dev_name2+'-'+dataObjA.vlan+'(d2入)', //d2
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:this.baseObjA.input_data_d2,
					    },
					    {
					        name: dataObjA.dev_name2+'-'+dataObjA.vlan+'(d2出)',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1,
					        },
					        symbol: 'none',
					        areaStyle:{ },
					        data:this.baseObjA.output_data_d2,
					    }]
					};
					
					chartsA.setOption(this.optionTraA);
				
			},
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
							this.filters.time[1]=new Date();
							end_time=new Date();

						}else if( Number(new Date()) >= Number( this.filters.time[1]) ){
							end_time=this.filters.time[1];
							
						}
						str=60*60*1000;
					}else if( (Number( this.filters.time[1])-Number(this.filters.time[0])) < 24 * 3600 * 1000 ){
						if( Number( this.filters.time[1] ) > Number( new Date() ) ){
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
				return timeObj;//数组
			},
		}
	}
</script>

<style>
	
	
	
</style>