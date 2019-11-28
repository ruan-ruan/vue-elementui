<template>
	<div>
		<!--点到点的图表数据-->
		<!--<goback></goback>-->
		<el-button type='info' size='small' @click='goback' v-show='typeof topoId ==="undefined" ? false:true'>
			<i class="el-icon-d-arrow-left" aria-hidden="true"></i>返回</el-button>
		<el-form :model='filters' ref='filters' :inline='true' v-if='networkingStatus'>
			<el-form-item label='请选择端点'>
				<el-select v-model='filters.type' class='sel_chart'>
					<el-option v-for='(item,index) in  typeData'
						:label='item.label'
						:value='item.value'
						:key='index'></el-option>
				</el-select>
				<el-select v-model='filters.logic_name' class='sel_chart' @change='selLogic(filters.logic_name)'>
					<el-option v-for='(item,index) in  logicData'
						:label='item.name'
						:value='item.id'
						:key='index'></el-option>
				</el-select>
				<el-button size='small' type='primary' @click='ChartData(strVal)'>查询</el-button>
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
				<el-button type='primary' size='small'  @click='ChartData(strVal)'>搜索</el-button>
				
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
			<el-col :span='24' v-if='!networkingStatus' >
				<shard-chart :data='baseObjA' :user='users' :trafficData='trafficData' :unit='filters.unit':chartLoading='chartLoading' v-if='child'></shard-chart>
			</el-col>
			<!--z端-->
			<el-col :span='24' v-if='!networkingStatus' >
				<shard-chart :data='baseObjZ' :user='usersZ' :trafficData='trafficData' :unit='filters.unit':chartLoading='chartLoading' v-if='child'></shard-chart>
			</el-col>
			<!--组网-->
			<el-col :span='24' v-if='networkingStatus'>
				<shard-chart :data='baseObjNet' :user='usersNet' :trafficData='trafficData' :unit='filters.unit':chartLoading='chartLoading' v-if='child'></shard-chart>
			</el-col>
			
		</el-row>
		
		
		


	</div>
</template>

<script>
	
	import shardChart from '@/components/shardChart'
	
	
	
	import {datedialogFormat,isChartTime,arrayPro} from '@/assets/js/index.js'   //arrayPro  数组的处理

	export default{
		name:'multCharts',
		props:['titData'],//  titData    点到点的业务id
		components:{
			shardChart
		},
		data(){
			return{
				token:'',
				topoId:this.$route.query.topoId,
//				components:{ goback },
				filters:{
					unit:'Mbps',
					selVal:'平均值',
					selTime:'最近一天',	
					time:'',
					type:'',
					logic_name:''
				},
				typeData:[
					{
						label:'公有云',
						value:'cloud'
					},{
						label:'数据中心',
						value:'dataCenter'
					}
				],
				logicData:[],
				unitData:['Mbps','PPS'],
				valData:['平均值','最大值','最小值'],
				timeData:['最近一小时','最近一天','最近一周','自定义'],
				chartLoading:false,
				chartsVal:[],//表格的数据
				users:[],//图表下面的表格的数据
				usersZ:[],//Z端的数据
				usersNet:[],
				trafficData:[],//获取时间  不同的值的类型的集合
				sendType:[],//数据请求的发送的时间
				sliData:[],//截取后的原始数据   需要再次处理
				baseObjA:{},//a的表格属性
				baseObjZ:{},//z的表格属性
				baseObjNet:{},//组网的表格属性
				userNet:[],//组网的数据
				valType:'',
				timeInterval:0,//时间间隔   用来处理数据
				basicData:[],//这是拿到素有的点和云的数据，需要做一步监听，判断是否存在值
				networkingStatus:false,//控制组网的部分的针对数据筛选的控制显示和隐藏  ，可根据里面下面的筛选的数据   name是否为null的来筛选
				optionTraZ:null,
				optionTraA:null,
				optionNet:null,
				child:true,
				strVal:'',
				loObj:{},
			}
		},
		watch:{
			filters:{
				handler(newVal,oldVal){
					if(newVal.selTime){//存在新的时间时候
						this.trafficData=this.getTimeData(newVal.selTime);//根据选择类型来获取对应的时间轴的区间
//						console.log(this.trafficData)
					}
					if(newVal.selVal){//根据所选的时间的类型，然后获取数据，在根据值的类型对数据进行处理
						this.valType=this.seaVal(newVal.selVal)   // 返回值的值的类型   对应的字段
					}

				},
				deep:true
			},
			baseObjA:{
				handler(newVal,oldVal){
//					console.log(newVal);	
					this.child=false;
					this.$nextTick(() => {
						this.child=true;
					})
				},
				deep:true,
				
			},
			baseObjNet:{
				handler(newVal,oldVal){
					this.child=false;
					this.$nextTick(() => {
						this.child=true;
					})
				},
				deep:true,
			},
			'filters.type':function(newVal,oldVal){//根据选择的端点的类型   选择对应的logic的数据

				this.basicData.map(item => {
					if(newVal == item.type){
						this.logicData.push(item.logic)
					}
				})

			},
			
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.valType=this.seaVal();
			this.trafficData=this.getTimeData();
//			console.log( this.trafficData )
			if(typeof this.titData !=='undefined'){
				this.strVal=this.titData;
			}
			if(typeof this.topoId !=='undefined'){
				this.strVal=this.topoId
			}
			
			this.ChartData(this.strVal);

		},

		methods:{
			selLogic(ids){
				this.loObj={};
			},
			goback(){
				this.$router.go(-1)
			},
			ChartData(ids){//获取id下 对应的数据
				
				let newData=[];//保存每次获取的数据

				var sortID=[];//将id相同的部分里面flow合并即可

//				//遍历以后再进行树的排序
				let time={};

				var selData=[];//选择的时候  展示数据

				this.sendType.map(ele => {
					time={
						search_date :ele.toString(),
					}

					this.chartLoading=true;
					this.$ajax.get('/vll/get_vll_flow/'+ids+'?token='+this.token,time)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
//								console.log(res);
								var endObj={};
								var endData=[];
								//下面对业务类型处理    点到点    和云的额业务     以及组网的数据处理
								if(res.data.data.endpoints){ //点部分数据
									//判断   里面的点的name属性是否为null   ，不是null的时候，这个时候是点到点的数据，否则是虚拟组网的数据
									res.data.data.endpoints.map(item => {
										endObj={//后期可根据逻辑口的id进行数据筛选
											type:'dataCenter',
											logic:item.logic_port,
										}
										endData.push(endObj)
										//这个时候   item.name是null 应该是虚拟组网的数据   这个时候    当隐藏A和Z的表格插件，显示组网的数据的插件  单个插件
										if( (!item.name && typeof (item.name) != 'undefined' && item.name !=0) || item.name=='' ){												
											this.networkingStatus=true;//显示组网的部分的 顶部分的筛选的数据
//											newData.push(item);  //组网的数据
										}
										//这个时候  name不是null   当为点到点的数据
										if(item.name && typeof (item.name) != 'undefined' && item.name !=''){
										//   分别找到对应的点到点的数据   根据时间的不同进行整合

											this.networkingStatus=false;//此时Wie点到点的数据   所以不需要显示
										}
										newData.push(item);
									})
								}
								if(res.data.data.cloud_endpoints){
									res.data.data.cloud_endpoints.map(item => {
										//这个时候   item.name是null 应该是虚拟组网的数据   这个时候    当隐藏A和Z的表格插件，显示组网的数据的插件  单个插件
										if( (!item.name && typeof (item.name) != 'undefined' && item.name !=0) || item.name == ''  ){	
//											newData.push(item);  //组网的数据
											this.networkingStatus=true;
										}
										//这个时候  name不是null   当为点到点的数据
										if(item.name && typeof (item.name) != 'undefined' && item.name !=''){
										//   分别找到对应的点到点的数据   根据时间的不同进行整合
											//  当item.name不为null的时候   这个时候分为两种情况，A端和Z端
											this.networkingStatus=false;
//											newData.push(item);//为点到点的数据
										}
										newData.push(item);
										endObj={
											type:'cloud',
											logic:item.logic_port,
										}
										endData.push(endObj)
									})
								}
								this.basicData=endData;
								sortID=arrayPro.sortArr(newData,'id');//根据id相同部分合并     处理数据   并处理数据  获取到一个新的数组	

								this.selData=sortID;
								let sliData=[]; //根据选择的开始和结束时间，对该新拼接的数组进行筛选
								var start_time=this.trafficData[0];
								var end_time=this.trafficData[this.trafficData.length-1];

								//sortID   是要处理的数据    根据开始时间  start_time和结束时间end_time  并处理拿到的数据的流量的数据之间存在的断点情况
								sliData=arrayPro.dealTime(sortID,start_time,end_time);

								this.sliData=sliData;
								//获取处理后的数据
								this.chartLoading=false;   //处理完数据
								
								//组网的数据     搜索
								if(!this.networkingStatus){//显示   点到点的数据
									//A端
									this.users=this.getPartialData(sliData,'A端').usersNet;
									this.baseObjA=this.getPartialData(sliData,'A端').baseObjNet;

									//Z端
									this.baseObjZ=this.getPartialData(sliData,'Z端').baseObjNet;
									this.usersZ=this.getPartialData(sliData,'Z端').usersNet;
								}else {//显示组网的数据  this.filters.logic_name   为筛选条件
									if(this.filters.logic_name == ''){
										this.usersNet=[];
										this.baseObjNet={};
									}else if(this.filters.logic_name !=''){
										this.usersNet=this.getPartialData(sliData,this.filters.logic_name).usersNet;
										this.baseObjNet=this.getPartialData(sliData,this.filters.logic_name).baseObjNet;
									}

								}
							}

						}
					}).catch(e => {console.log(e)})
				})
			},
			//对截取完以后的A端，Z端  组网的数据的进行处理
			
			getPartialData(sliData,type){//对   A端  ，Z端   组网的单个数据对象的处理整合   type  代表的是需要获取的是A端   Z端  组网的数据   如果找到则返回 ，没有的时候则返回空
				var ZData=[],logicZ=this.loObj;//data一部分的数据table，一部分是对里面的包含的额详细数据数据charts
				var val=[];
				var typeName=''
				if(!this.networkingStatus){//显示点到点的数据
					logicZ=sliData.find(item => {
						return item.name == type;
					})
					typeName=type;
				}else {
					if(type != 'A端' && type != 'Z端' ){
						if(type == ''){
							
						}else{
							logicZ=sliData.find(item => {
								return item.logic_port.id == type;
							})
							//将查找到的逻辑口的数据的id转换为name显示在表格左上角

							if(this.logicData.length !=0){
								typeName=this.logicData.find(ele => { return ele.id == type; }).name;
							}
						}
						
					}
				}
				ZData=this.selectVal(logicZ,this.timeInterval).data
				//Z端
				let  objZ={//    这里面 的数据   是两个单位情况下显示的数据        所以根据单位的不同 进行判断
					input_bytes_d1:this.dealData('input_bytes',arrayPro.testCharts(ZData,'input_bytes',this.valType).d1),
					input_packages_d1:this.dealData('input_packages',arrayPro.testCharts(ZData,'input_packages',this.valType).d1),
					output_bytes_d1:this.dealData('output_bytes',arrayPro.testCharts(ZData,'output_bytes',this.valType).d1),
					output_packages_d1:this.dealData('output_packages',arrayPro.testCharts(ZData,'output_packages',this.valType).d1),

					input_bytes_d2:this.dealData('input_bytes',arrayPro.testCharts(ZData,'input_bytes',this.valType).d2),
					input_packages_d2:this.dealData('input_packages',arrayPro.testCharts(ZData,'input_packages',this.valType).d2),
					output_bytes_d2:this.dealData('output_bytes',arrayPro.testCharts(ZData,'output_bytes',this.valType).d2),
					output_packages_d2:this.dealData('output_packages',arrayPro.testCharts(ZData,'output_packages',this.valType).d2),

				}
				//流量的总和   是d1与d2的数据   总和
				let objZ_total={
					input_bytes_total:arrayPro.totalData( objZ.input_bytes_d1 , objZ.input_bytes_d2 ),
					input_packages_total:arrayPro.totalData( objZ.input_packages_d1 , objZ.input_packages_d2 ),

					output_bytes_total:arrayPro.totalData( objZ.output_bytes_d1, objZ.output_bytes_d2 ),
					output_packages_total:arrayPro.totalData( objZ.output_packages_d1 , objZ.output_packages_d2 ),
					
				}
				//组网的数据处理    点到点的数据处理
				//baseObjNet:{},//组网的表格属性
				//userNet:[],//组网的数据
				let usersZ=[],baseObjZ={};
				
				if(JSON.stringify(logicZ) !='{}'){
					let logicVlanZ=null,deviceZ={};
					if(logicZ.vlan <0){
						logicVlanZ='透传';
					}else if( logicZ.vlan == 0){
						logicVlanZ='UNTAG';	
					}else {
						logicVlanZ=logicZ.vlan;
					}
					if(logicZ.physical_ports.length == 1){//只有一个物理口
						deviceZ={
							dev_name1:logicZ.physical_ports[0].dev.name,
							dev_name2:'',
						}
					}else if(logicZ.physical_ports.length == 2){
						deviceZ={
							dev_name1:logicZ.physical_ports[0].dev.name,
							dev_name2:logicZ.physical_ports[1].dev.name,
						}
					}else if(logicZ.physical_ports.length == 0){
						deviceZ={
							dev_name1:'',
							dev_name2:'',
						}
					}
					baseObjZ={//Z端的基本信息    将数据处理后   页添加进去
						logo_title:typeName,
						logic_port:logicZ.logic_port.name,
						vlan:logicVlanZ,
						dev_name1:deviceZ.dev_name1,
						dev_name2:deviceZ.dev_name2,
						input_data_d1:this.filters.unit === 'Mbps'? objZ.input_bytes_d1 : objZ.input_packages_d1,
						output_data_d1:this.filters.unit === 'Mbps'? objZ.output_bytes_d1 : objZ.output_packages_d1,
						
						input_data_d2:this.filters.unit === 'Mbps'? objZ.input_bytes_d2 : objZ.input_packages_d2,
						output_data_d2:this.filters.unit === 'Mbps'? objZ.output_bytes_d2 : objZ.output_packages_d2,
						
						input_data_total:this.filters.unit === 'Mbps'? objZ_total.input_bytes_total : objZ_total.input_packages_total,
						output_data_total:this.filters.unit === 'Mbps'? objZ_total.output_bytes_total : objZ_total.output_packages_total,
					}


//					if(this.baseObjZ.output_data_total.length===0 || this.baseObjZ.input_data_total.length===0){
//						usersZ=[]
//					}else{
						let input_nameZ={
							name:baseObjZ.logic_port+'-'+baseObjZ.vlan,
						}
						let input_tabZ=arrayPro.tim(baseObjZ.input_data_total)
						
						let output_nameZ={
							name:baseObjZ.logic_port+'-'+baseObjZ.vlan,
						}
						let output_tabZ=arrayPro.tim(baseObjZ.output_data_total)
						
						let input_tableZ=Object.assign({},input_nameZ,input_tabZ);
						let output_tableZ=Object.assign({},output_nameZ,output_tabZ);
						usersZ.push(input_tableZ)
						usersZ.push(output_tableZ)
//					}
////					this.usersZ=usersZ;
				}
				var Total={};
				if(type == ''){
					Total={}
				}else if(type != ''){
					 Total={ 
						baseObjNet:baseObjZ,
						usersNet:usersZ
					}
				}
				return Total;
			},

			dealData(type,data){//根据不同的单位  进行数据处理
//				console.log(data)
				let newData=[]
				data.map(ele => {
					if((!ele && typeof (ele) !== 'undefined' && ele !=0) || isNaN(ele) ||typeof ele =='undefined' ||ele==''){//如果数据是NaN或者null
						newData.push('')
					}else{
						if(type === 'input_bytes' || type==='output_bytes'|| type =='total_input_bytes' || type == 'total_output_bytes'){
							newData.push( parseInt(ele/60*8  ))
	//						newData.push( parseInt(ele/(60*1024*8 ) ))
	//						newData.push(ele/(60*1024*8 ).toFixed(2))
						}else if(type === 'input_packages' || type ==='output_packages'|| type == 'total_input_packages' || type=='total_output_packages'){
							newData.push( parseInt(ele/60) )
	//						newData.push(ele/(60 ).toFixed(2))
						}
					}
					
				})

				return newData;//不同的属性   换算是不一样的
			},
			seaVal:function(valType='平均值'){//根据值的不同的  获取   不同的类型的值的类型
				let  val='';
				if(valType ==='最大值'){
					val='max';
				}else if(valType ==='最小值'){
					val='avg';
				}else if(valType === '平均值'){
					val='min'
				}

				return val;
			},
			selectVal(data , timeFew){//data  是数组     timeFew根据时间 的类型获取的时间间隔   也就是值的间隔      valType是值的类型
				timeFew=timeFew || 5
				//console.log(data);//可根据传值的类型  具体情况而定   A端   Z端    组网
				//需要获取  逻辑口       以及设备d1    d2的数据      分别是入 和出       所以   一个逻辑口 共有  六条数据
				var sval=JSON.parse( JSON.stringify(data) );
				let strObj={};
//				let strData=[];
				var dataVal=[];  
				for( var index=0; index<sval.flow.length; index+=timeFew ){
					dataVal.push(sval.flow.slice(index,index+timeFew))
				}
				strObj={
					name:sval.name,
					vlan:sval.vlan,
					flow:dataVal
				}
//				for(var i=0;i<data.length;i++){
//					  //里面包含a端和z端
//					var dataVal=[];  
//					var setData=data[i].flow;
//
//					 //将数组进行切割  并求出里面的各个值的类型
//					for( var index=0; index<data[i].flow.length; index+=timeFew ){
//						dataVal.push(data[i].flow.slice(index,index+timeFew))
//					}
////					console.log(dataVal)
//					strObj={
//						name:data[i].name,
//						vlan:data[i].vlan,
//						flow:dataVal
//					}
//					strData.push(strObj)
//				};

				
//				let chartsData=[];
//				strData.map(ele => {
					let str=[];	
					strObj.flow.map((item,index) => {		
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

						 	}
						 }
							str.push(obj)
					})
					let chartObj={
						name:strObj.name,
						vlan:strObj.vlan,
						data:str,
					}
//					
//					chartsData.push(chartObj)
//				})
//				console.log(chartsData)
				return chartObj;//   返回的是  处理完成以后的数组里面的对象    a端和z端所有的数据       下一步是对每一个属性进行  最大值  和最小值进行遍历
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
				//根据时间类型获取不同的额时间的间隔数据
				strTime=this.getTimeVal( Number(start_time) , Number(end_time) , str ).data;
				//遍历  获取所有的时间的日期  用来获取数据
				var timeVal=arrayPro.unique(this.getTimeVal(Number(start_time),Number(end_time),str).send).sort(arrayPro.sortNum);
				this.sendType=timeVal;
//				console.log(timeVal)
				this.timeInterval=str/(60*1000);
				
				//console.log(this.timeInterval);//获取时间间隔  用来处理数据    单位是分钟
				
				return strTime;
			},
			getTimeVal(start_time,end_time,str){
				let  timeObj={
					data:[],//时间轴上的集合
					send:[],//需要发送的数据
				}
				let arr=[];
				for(let item =start_time;item<=end_time;item+=str){
					//将每一个时间戳转换为标准时间
					timeObj.data.push(arrayPro.datedialogFormat(item/1000))  //获取时间的区间    item现在是毫秒时间  所以需要/1000
					arr.push( isChartTime(item/1000) );
				}
				timeObj.send=arr.map(Number);
//				console.log(timeObj)
				return timeObj;//数组
			},
		}
	}
</script>

<style>
	
	
	
</style>