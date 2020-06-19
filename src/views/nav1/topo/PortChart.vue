<template>
	<div>
	<!--这个是topo图里面的所有的业务流量图组件  -->	
	<!--端口流量的展示-->
		<filters :ports='device_port' @fil='filtes' @sourch='getData(a_port)' :bool='isShow'>
			<!--<slot name='a_device'></slot>-->
		</filters>
		<echart  :trafficData='trafficData':datas='datas':load='load':unit='filters.unit' style='height: 500px;width: 100%;'></echart>
		
	</div>
</template>

<script>
	import Filters from './portChild/Filters'
	import Echart from './portChild/Echart';
	
	import {datedialogFormat,isChartTime,arrayPro} from '@/assets/js/index.js' 
	export default{
		name:'PortChart',
		components:{
			Filters,
			Echart
		},
		props:{
			//获取所有 详细的信息部分
			ports:{
				type:Array,
				default:function () {
					return []
				}
			},
			InNode:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				token:this.$store.state.token,
				a_data:[],//a端的数据
				z_data:[],//z端的数据
				datas:{},//包含入口数据和出口数据
				worker:null,//用来保存线程
				filters:{
					change:1,//1的时候显示的是总的流量图,2的时候显示某一个端口的流量图 
					device:'',//根据设备筛选端口  并获取某一个的流量图
					unit:'Mbps',//  根据单位进行筛选显示
					num:'avg',//  显示平均值
					time:'day',//显示最近一天的数据
					cusTime:[],//自定义时间 
//					port:'',//根据子节点，在选择设备的时候显示某一个端口的数据
				},
				timeInterval:'',//根据所选的时间获取间隔值
				sendType:[],
				trafficData:[],//根据当前选择的时间，画出x轴上的刻度线
				mins:[],//获取标准时间格式
				load:false,//是否显示loading
			}
		},
		watch:{
			ports:{
				/**
				 * 1.获取topo里面的所有的数据信息
				 * 		d2d
				 * 		d2c
				 * 		云的情况下是没有端口的 ，所以需要将云的数据排除在外
				 * */
				handler:function(newVal,oldVal){
					this.getData(this.a_port)
				},
				deep:true,
				
			},
			filters:{
				handler:function(newVal,oldVal){
					if(newVal.time){
						this.trafficData=this.time_interval(newVal.time);
					}
//					if(newVal.device){
//						//当设备存在更新的时
//						var arr=[];
//						this.device_port.find(item => {
//							if(item.device.id == newVal.device){
//								arr.push( item.port );// 找到对应的端口的数据
//							}
//						})
//						this.a_port=JSON.parse(JSON.stringify(arr))  ;
////						this.a_port=arr;
////						this.getData(arr)
//					}
					//根据传过来设别的di去查找对应的端口的数据
//					this.getData()
				},
				deep:true
			},
			datas:{
				handler:function(newVal,oldVal){
//					console.log(newVal)
				},
				deep:true
			},
//			a_port:{
//				handler:function(newVal,oldVal){
//					console.log(newVal);
//					this.getData(newVal);
//				},
//				deep:true
//			}
		},
		computed:{
			isShow(){
				//判断标题是否显示
				return this.InNode
			},
			device_port(){//获取的设备  ，然后根据设备筛选端口的数据  这里返回的是一个数组  父组件传过来的是设备和端口的组合数组
				if(this.ports) return this.ports
			},
			a_port(){// 获取所有的端口  数据都是根据父组件传递过来数据决定
				var arr=[];
				if(this.filters.device == ''){
					if( this.ports && this.ports.length !==0 ){
						for(let i=0;i<this.ports.length;i++){
							arr.push( this.ports[i].port )
						}
					}
				}else{
					this.device_port.find(item => {
						if( this.filters.device=== item.device.id ){
							arr.push(item.port)
						}
					})
				}
				return arr;
				
			},
			
		},
		created(){
			this.trafficData=this.time_interval();//第一次加载的时候，显示出来所选择的时间
			if(this.a_port&& this.a_port.length !=0){
				this.getData(this.a_port);
			}
		},
		mounted(){
			this.time_interval()
		},
		methods:{
			getData(arr){
				//在这里获取数据  是根据select的选择框进行展示的
				/**
				 * 默认的时候需要获取所有的数据集合，，所以需要对所有的数据集合id进行拿到对应的数据
				 * 所以这个时候集合传值的时候就是ids数组集合
				 * */
//				if(arr && arr.length){
//					this.baseData(arr);
//					this.load=true;
//				}
				this.baseData(arr);
				this.load=true;
			},
			async baseData(ids){
				
				/**
				 * ids传过来的是端口的数组数据，因为还需要在使用
				 * 当不选择对应id的时候  这个时候显示的是所有的数据，当显示对应的id的时候  ，这个时候才显示对应的数据
				 * 需要判断是所有的数据还是单个端口里面的数据
				 * */
				try {
					//获取单个id情况下的数据集合，
					console.log('获取数据开始时间戳：'+new Date().getTime())
					for(var i=0;i<ids.length;i++){
						var para={};
						var data=[];
						for(let j=0,len=this.sendType;j<len.length;j++){
							para={
								search_date:len[j].toString()
							}
							let res =await this.$ajax.get( '/topology/port_flow/'+ids[i].id+'?token='+this.token,para )
							//获取每一个id的数据
							data.push(...res.data.data);
						};
						console.log('根据规定时间内获取完当前一个端口对应的时间戳：'+new Date().getTime())
						//获取完每个id以后 数据  在下面判断ids是否是是超过两个的数据，用来区别是总的还是单个的数据
						let obj=this.dealTime( this.dealData(data),this.trafficData,this.mins,this.timeInterval,this.filters.num,this.filters.unit );
						if(ids&&ids.length < 2){
							this.datas=obj;//只有一个数据的时候
						}else{
							for(let item in obj){
								for(let k =0 ,paraIn=obj[item];k <paraIn.length;k++){
									if( this.datas[item][k] == undefined || this.datas[item][k]  == null){
										this.datas[item][k] =0
									}
									this.datas[item][k] += Number( paraIn[k] );
								}
							}
						}
						
					}
					console.log('获取数据完成时间戳：'+new Date().getTime())
					this.load=false;
				} catch(err){
					console.log(err)
				}
			},
			dealData(data){
				/**
				 * 在这里处理数据的值，和时间的为正分钟的情况下获取的数据
				 * 第一步先处理数据，并查漏补缺，然后根据时间  直接截取即可
				 * 需要对所有的数据的进行遍历的时候，正分钟的值为下一个数据减去上一个数据然后除以时间差
				 * */
				var copy=[];
				for(let i =0 ;i < data.length;i++){
					var j=i+1;
					if(j<data.length){
						//确保所有的数据都是在这个区间内的时候才可以运行
						if( data[j].input.bytes-data[i].input.bytes <0){
							console.log('存在小于0')
						}
						let preTime=new Date(data[i].time).getTime()/1000;
						let nextTime=new Date(data[j].time).getTime()/1000;
						let timeInt=nextTime-preTime;
						let inBy=Math.round(
							(data[j].input.bytes-data[i].input.bytes<0?0:data[j].input.bytes-data[i].input.bytes) /timeInt
						)
						let inPs=Math.round(
								(data[j].input.packets-data[i].input.packets<0?0:data[j].input.packets-data[i].input.packets) /timeInt
						)
						let ouBy=Math.round(
							(data[j].output.bytes-data[i].output.bytes<0?0:data[j].output.bytes-data[i].output.bytes) /timeInt
						)
						let ouPy=Math.round(
							(data[j].output.packets-data[i].output.packets<0?0:data[j].output.packets-data[i].output.packets) /timeInt
						)
						let  obj={
							time:arrayPro.datedialogFormat(new Date(data[j].time).getTime()/1000),
							input:{
								bytes:inBy,
								packets:inPs
							},
							output:{
								bytes:ouBy,
								packets:ouPy
							}
						};
						copy.push( obj )
					}
				}
				var baseData=JSON.parse(JSON.stringify(copy));
				for(let num=0;num<data.length;num++){
					//获取一个前后两个的时间戳
					var nums=num+1;
					if(nums<copy.length){
						let preTime=new Date(copy[num].time).getTime()/1000; 
						let nextTime =new Date(copy[nums].time).getTime()/1000;
						
						if(nextTime-preTime>60){
							//时间间隔超过一分钟了
							var sliInBy=(copy[nums]['input']['bytes']-copy[num]['input']['bytes'])/ ( nextTime-preTime ) 
							var sliOuBy=(copy[nums]['output']['bytes']-copy[num]['output']['bytes'])/ ( nextTime-preTime )
							var sliInPy=(copy[nums]['input']['packets']-copy[num]['input']['packets'])/ ( nextTime-preTime ) 
							var sliOuPy=(copy[nums]['output']['packets']-copy[num]['output']['packets'])/ ( nextTime-preTime );
							for(var k=preTime+60;k<nextTime;k+=60){
								var para={
									time:arrayPro.datedialogFormat(k),//时间间隔是60秒
									input:{
										bytes:Math.abs(Math.round(sliInBy/60*8) ) ,
										packets:Math.abs(Math.round(sliInPy/60*8)  ) 
									},
									output:{
										bytes: Math.abs( Math.round(sliOuBy/60*8) ) ,
										packets:Math.abs(Math.round(sliOuPy/60*8)  ) 
									}
								}
								baseData.splice(-(copy.length-nums),0,para);//插入所有的值
							}
							baseData[0]={
								input:{
									bytes:0,
									packets:0
								},
								output:{
									bytes:0,
									packets:0
								},
								time:arrayPro.datedialogFormat(new Date( copy[0].time ).getTime()/1000)   
							}
						}
					}
					
				}
				//数组的去重
//				var obj={};
//				baseData=baseData.reduce(function(item,next){
//					obj['time']?'':obj[next.time]=true&&item.push(next);
//					return item;
//				},[])
				//开始时间和结束时间截取当前的时间既可
				return baseData;//返回遍历以后的数据
			},
			dealTime(data,time,mins,interval,num,unit){
				/**
				 * data 处理以后，但是不包含里面在某些时间内不存在的数据集合
				 * time x轴的时间集合  ，时间集合是标准的形式，但是不确定数据存在确实的情况，所以没有办法直接截取  是分割后的数据
				 * timeInterval  时间间隔 数  单位是分钟  
				 * interval   时间间隔
				 * num  根据选择的数据的类型 min max avg
				 * unit 单位  Mbps PPS
				 * */
				for(var j=0;j<data.length;j++){
					for(var i=0;i<mins.length;i++){
						if( data[j].time  === mins[i].time){
							//当默认的需要展示的时间的与数据里面的时间相等时候，将数据的值赋值给时间的
							mins[i]=data[j]
							mins[i]={
								input:{
									bytes:data[j].input.bytes,
									packets:data[j].input.packets
								},
								output:{
									bytes:data[j].output.bytes,
									packets:data[j].output.packets,
								},
								time:mins[i].time
							}
						}
					}
				};
				var sliData=[];
				//获取到处理后的数据，在根据时间间隔处理数据,拿到想要的数据
				for( var item =0;item<mins.length;item+=interval ){
					var sli=mins.slice(item,item+5);
					var para={
						input:{
							bytes:this.dealMath(['input'],['bytes'],sli),
							packets:this.dealMath(['input'],['packets'],sli),
						},
						output:{
							bytes:this.dealMath(['output'],['bytes'],sli),
							packets:this.dealMath(['output'],['packets'],sli),
						},
						time:mins[item].time
					}
					sliData.push(para)
				};
				var send={
					int:[],
					out:[]
				}
				for(let i=0;i<sliData.length;i++){
					//根据单位，数据类型筛选出来需要的数据
					var pa={
						int:[],//入口数据
						out:[],//出口数据
					};
					if( unit === 'Mbps' ){
						//筛选出来 bytes 的数据
						pa={
							int:sliData[i]['input']['bytes'][num],
							out:sliData[i]['output']['bytes'][num],
//							time:dealData[i].time
						}
						send.int.push(pa.int);
						send.out.push(pa.out);
					}else{
						//筛选出来packets的数据
						pa={
							int:sliData[i]['input']['packets'][num],
							out:sliData[i]['output']['packets'][num],
//							time:dealData[i].time
						}
						send.int.push(pa.int);
						send.out.push(pa.out);
					}
				}
				return send;
			},
			dealObj(arr,pro,type){
				var num=0;
				for(let i=0;i<arr.length;i++){
					
				}
			},
			dealMath(pro,type,arr){
				//获取数组里面的所有的值类型数据
				let obj={};
				var add=0;
				for(var item =0 ;item<arr.length;item++){
					add+=arr[item][pro][type];
				}
				obj={
					min:Math.min.apply(Math, arr.map(function(o) {return o[pro][type] })),
					max:Math.max.apply(Math, arr.map(function(o) {return o[pro][type] })),
					avg: Math.round( add/arr.length ) 
				}
				return obj
			},
			time_interval(type='day'){
				/**
				 * 根据时间的选择，获取某一个内的数据显示
				 * interval 根据不同的时间筛选出来不同的时间间隔  作为新的数据
				 * time 返回当前时间处理后的时间
				 * end结束时间
				 * start开始时间
				 * */
				let strTime=[];//用来保存的所选时间，的时间间隔 
				let end_time='';
				let start_time='';
				let str=0;//用来保存时间的间隔的值
				//根据所选的时间间不同获取不同的时间间隔的数据
				if(type==='customize'){
					if( (Number( this.filters.cusTime[1])-Number(this.filters.cusTime[0])) > 90 * 24 * 3600 * 1000 ){
						this.$message({
							message:this.$t('tooltipMes.notThreeJun'),
							type:'warning'
						})
						this.filters.cusTime[1]=new Date();
						end_time=new Date();
						this.filters.cusTime[0]=Number( this.filters.cusTime[1])-90 * 24 * 3600 * 1000
						str=60*60*1000;

					}else if(Number( this.filters.cusTime[1])-Number(this.filters.cusTime[0])  <= 90 * 24 * 3600 * 1000 &&  Number( this.filters.time[1])-Number(this.filters.time[0] )>=  7 * 24 * 3600 * 1000 ) {
//						大于一周,小于三个月
						if( Number( this.filters.cusTime[1] ) > Number( new Date() ) ){
							this.filters.cusTime[1]=new Date();
							end_time=new Date();

						}else if( Number(new Date()) >= Number( this.filters.cusTime[1]) ){
							end_time=this.filters.cusTime[1];
							
						}
						str=60*60*1000;

					}else if( (Number( this.filters.cusTime[1])-Number(this.filters.cusTime[0])) <7* 24 * 3600 * 1000 && (Number( this.filters.time[1])-Number(this.filters.time[0]) )> 3600*1000 ){
//						大于一小时 ,小于一周
						if( Number( this.filters.cusTime[1] ) > Number( new Date() ) ){
							this.filters.cusTime[1]=new Date();
							end_time=new Date();

						}else if( Number(new Date()) >= Number( this.filters.cusTime[1]) ){
							end_time=this.filters.cusTime[1];
							
						}
						str=5*60*1000;
					}else{
//						一个小时以内
						if( Number( this.filters.cusTime[1] ) > Number( new Date() ) ){
							this.filters.cusTime[1]=new Date();
							end_time=new Date();

						}else if( Number(new Date()) >= Number( this.filters.cusTime[1]) ){
							end_time=this.filters.cusTime[1];
						}
						str=60*1000;
					}
					start_time=this.filters.cusTime[0];
				}else if(type !=='customize'){
					end_time=new Date();
					start_time=new Date();
					if(type==='hour'){//间隔每一分钟
						start_time.setTime(start_time.getTime() - 3600 * 1000  );
						str=60*1000;
					}else if(type==='day'){//间隔五分钟
						
						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 );
						
						str=5*60*1000;
					}else if(type ==='week'){//间隔一个小时
						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 * 7 );
						str=5*60*1000;
					}
				}
				
				//根据时间类型获取不同的额时间的间隔数据
				strTime=this.getTimeVal( Number(start_time) , Number(end_time) , str ).data;
				//遍历  获取所有的时间的日期  用来获取数据
				this.sendType=arrayPro.unique(this.getTimeVal(Number(start_time),Number(end_time),str).send).sort(arrayPro.sortNum);
				//获取时间间隔  用来处理数据    单位是分钟
				this.timeInterval=str/(60*1000);
				this.mins=this.getTimeVal( Number(start_time) , Number(end_time) , str ).mins
				return strTime;//获取x轴上的时间点
			},
			getTimeVal(start_time,end_time,str){
				let  timeObj={
					data:[],//时间轴上的集合
					send:[],//需要发送的数据
					mins:[],//获取所有的每一分钟的数据
				}
				for(let j =start_time;j<end_time;j+=(60*1000)){
					
					timeObj.mins.push({
						input:{
							bytes:0,
							packets:0
						},
						output:{
							bytes:0,
							packets:0
						},
						time:arrayPro.datedialogFormat(j/1000)
					})
				}
				for(let item =start_time;item<=end_time;item+=str){
					//将每一个时间戳转换为标准时间
					timeObj.data.push(arrayPro.datedialogFormat(item/1000))  //获取时间的区间    item现在是毫秒时间  所以需要/1000
					timeObj.send.push( Number(isChartTime(item/1000)) );
				}
				return timeObj;//数组
			},
			filtes(msg){
				this.filters=msg;
			},
			
		}
	}
	
	
	
</script>

<style scoped>
	
</style>