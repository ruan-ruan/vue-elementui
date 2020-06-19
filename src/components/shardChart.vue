<template>
	<div>
		<!--图表的数据共享部分-->
		<el-row>
			<el-col :span='24'>
				<div style="width: 1000px;height:500px;" ref='chart' v-loading='chartLoading'></div>
				<el-table :data='tabs' highlight-current-row class='chart' v-loading='chartLoading'>
				 	<el-table-column prop='name'width='140' align='center'></el-table-column>
				 	<el-table-column prop='now' width='100'label='now' align='center'>
				 	</el-table-column>
				 	<el-table-column prop='min' width='110'label='min' align='center'>
				 	</el-table-column>
				 	<el-table-column prop='avg' width='110'label='avg' align='center'>
				 	</el-table-column>
				 	<el-table-column prop='max' width='110'label='max' align='center'>
				 	</el-table-column>
				 </el-table>
			</el-col>
		</el-row>
	</div>
</template>


<script>
	
	export default{
		name:'shardChart',
		props:['data','trafficData','unit','user','chartLoading'],//data数据    trafficData时间轴
		data(){
			return {
				optionTra:null,
				users:[],
			}
		},
		watch:{
			data:{
				handler(newVal,oldVal){
					this.getCharts(newVal);
				},
				deep:true,
				
			},
			user:{
				handler(newVal,oldVal){
					newVal.map(item => {
						item.avg=parseInt(item.avg);

					})
				},
				deep:true
			}
		},
		computed:{
			tabs(){
				var str=[];
				if(this.unit === "Mbps"){
					this.user.map(item => {
						var obj={}
						for(var i in item){
							if(i !=='name'){
								if( item[i] <(1000*1024)){
					        		obj[i] = (item[i]/(1000)).toFixed(2)+'KB'
					        	}else if(item[i] >=(1000*1024) && item[i] < (1000*1024*1024*10)){
					        		obj[i]  = (item[i]/(1000*1024)).toFixed(2)+'MB'
					        	}else if(item[i]>= ( 1000*1024*1024*10 ) && item[i]<(1000*1024*1024*1024)){
					        		obj[i]  = (item[i]/(1000*1024*1024)).toFixed(2)+'GB'
					        	}else if(item[i] >= (1000*1024*1024*1024)){
					        		obj[i]  = (item[i]/(1000*1024*1024*1024)).toFixed(2)+'TB'
					        	}
							}else{obj['name']=item[i]}
						}
						str.push(obj)
					})
				}else{
					str=this.user;
				}
				return str;
			}
		},
		mounted(){
			var base=null;
			if(JSON.stringify( this.data) !='{}'){//只有存在数据的时候  
				console.log(this.data)
				this.getCharts(this.data);
			}
			this.user.map(item => {
				if(isNaN(item.avg)){
					item.avg=0
				}else{
					item.avg=parseInt(item.avg)
				}
			})
		},
		methods:{
			getCharts(dataObj){

				let that=this;
				let chartsData=this.$echarts.init(this.$refs.chart);
				this.optionTra={
					    title: {
					        text: dataObj.logo_title,//title标志
					        subtext:this.$t('topology.footerBtn.bandwidth')+that.unit,
					        subtextStyle:{
					        	fontSize:'13',
					        },
					        textStyle:{
								fontSize:'14',
							},
//							x:'5%',
//							y:'5%'
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

					        formatter:function(data){
//					        	console.log('进入')
					        	var str='';
//								console.log(data)
					        	data.map((item,index) => {
					 				if( that.unit === "Mbps" ){
						 				if(typeof item.value  ==='undefined'){
						        			item.value=0
						        		}else {
						        			if (item.value >= 1000 && item.value < 1000*1024) {
							                    item.value =  ( item.value / 1000).toFixed(2)  + "KB";
							               } else if (item.value >= (1000*1024) && item.value < (1000*1024*1024)) {
							                    item.value = ( item.value / (1000*1024) ).toFixed(2)  + "MB";
							                }else if(item.value >= (1000*1024*1024)  && item.value <(1000*1024*1024*1024)) {
	
							                	item.value=  (item.value/(1000*1024*1024)).toFixed(2) +'GB';
							                } 
							                else if(item.value >= (1000*1024*1024*1024)){
							                	item.value=( item.value/(1000*1024*1024*1024) ).toFixed(2) +'TB'
							                }else{
							                	item.value=item.value+'bps';
							                }
						        		}	
					 				}else{
					 					item.value=Math.round(item.value)
					 				}
					        		str+=item.seriesName+':'+item.value+'<br/>'
					        	})
					        	return data[0].axisValueLabel+'<br/>'+ str;

					       	}
					    },
					    legend: {
					        data:[
//					        '(d1入)' 
					        dataObj.logic_port+'-'+dataObj.vlan+this.$t('Public.totalIn'),dataObj.logic_port+'-'+dataObj.vlan+this.$t('Public.totalOut'),
					        dataObj.dev_name1+'-'+dataObj.vlan+'('+'d1'+this.$t("Public.enter")+')'  , dataObj.dev_name1+'-'+dataObj.vlan+'('+'d1'+this.$t("Public.out")+')' ,
					        dataObj.dev_name2+'-'+dataObj.vlan+'('+'d2'+this.$t("Public.enter")+')',  dataObj.dev_name2+'-'+dataObj.vlan+'('+'d2'+this.$t("Public.out")+')',
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
					        data: that.trafficData,
					    },
					    yAxis: {
					       
					        axisTick:true,
					        scale:true,
					        boundaryGap: [0, '100%'],
//					        splitNumber:(1000*1024),
//					        max:1000*1024*1024*20,
//					        min:0,
//					        splitNumber:1024,
//					        maxInterval:(1024*1000),
					        
//					        minInterval:1000*1024,
//					        max:function(data){
////					        	return 1000*1000*1000*4
////					        	return 1000*1024*1024*5;
////					        	data.max>=1000 &&
////					        	if( data.max <(1000*1024)){
////					        		return 1000*1024*10
////					        	}else if(data.max >=(1000*1024) && data.max < (1000*1024*1024)){
////					        		let str=Math.round( data.max/(1000*1024) )
////					        		return 1000*1024*str*2;
////					        	}else if(data.max>= ( 1000*1024*1024 ) && data.max<(1000*1024*1024*1024)){
////					        		let str=Math.round( data.max/(1000*1024*1024) )
////					        		return str*2*1000*1000*1000;
////					        	}else if(data.max >= (1000*1024*1024*1024)){
//////					        		return 1000*1024*1024*1024*10
////					        	}
//					        },
					        axisLabel: {
					            margin: 2,
					            boundaryGap: false,
					            formatter: function (value, index) {
					            	if(that.unit === "Mbps"){
					            		 if (value >= 1000 && value < 1000*1024) {
						                    value =  Math.round( value / 1000  )  + "KB";
						                } else if (value >= (1000*1024) && value <(1000*1024*1024*10)) {
						                    value = Math.round( value / (1000*1000) ) + "MB";
						                }else if(value>= (1000*1024*1024*10) && value <=(1024*1024*1024*1000)) {
						                	value=Math.round( value / (1000*1000*1000))+'GB';
						                } else if(value >= (1000*1024*1024*1024)){
						                	value= Math.round( value/(1000*1000*1000*1000) ) +'TB'
						                }else{
						                	value = value + 'bps';
						                }
					            	}
					               
					                return value;
					            },
					        },
					         type: 'value',
					    },
					    grid: {
					    	left:'13%',
					    	right:'13%',
				        },

					    series: [
					    {
					        name: dataObj.dev_name1+'-'+dataObj.vlan+'('+'d1'+this.$t("Public.enter")+')' , //d1入
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
   					        itemStyle: {
				                normal: {
				                    color: '#C23531'
				                }
				           	},
					        symbol: 'none',
					        areaStyle:{
					        	normal: {
				                    color:this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                        offset: 0,
				                        color: '#C23531'
				                    }, {
				                        offset: 1,
				                        color: '#ffe'
				                    }])
				                }	
					        },
					        data:dataObj.input_data_d1,
					    },
					    {
					        name:dataObj.dev_name1+'-'+dataObj.vlan+'('+'d1'+this.$t("Public.out")+')' ,//d1出
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        itemStyle: {
				                normal: {
				                    color: '#2F4554'
				                }
				           	},
					        symbol: 'none',
					        areaStyle:{
					        	normal: {
				                    color:this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                        offset: 0,
				                        color: '#2F4554'
				                    }, {
				                        offset: 1,
				                        color: '#ffe'
				                    }])
				                }
					        },
					        data:dataObj.output_data_d1,
					    },
					    {
					        name: dataObj.dev_name2+'-'+dataObj.vlan+'('+'d2'+this.$t("Public.enter")+')', //d2入
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        itemStyle: {
				                normal: {
				                    color: '#61A0A8'
				                }
				           	},
					        symbol: 'none',
					        areaStyle:{
					        	normal: {
				                    color:this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                        offset: 0,
				                        color: '#61A0A8'
				                    }, {
				                        offset: 1,
				                        color: '#ffe'
				                    }])
				                }
					        },
					        data:dataObj.input_data_d2,
					    },
					    {
					        name: dataObj.dev_name2+'-'+dataObj.vlan+'('+'d2'+this.$t("Public.out")+')',//d2出
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1,
					        },
					        itemStyle: {
				                normal: {
				                    color: '#D48265'
				                }
				           	},
					        symbol: 'none',
					        areaStyle:{
					        	normal: {
				                    color:this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                        offset: 0,
				                        color: '#D48265'
				                    }, {
				                        offset: 1,
				                        color: '#ffe'
				                    }])
				                }
					        },
					        data:dataObj.output_data_d2,
					    },{
					        name:dataObj.logic_port+'-'+dataObj.vlan+this.$t('Public.totalIn'),
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        itemStyle: {
				                normal: {
				                    color: '#91C7AE'
				                }
				           	},
					        areaStyle:{
					        	normal: {
				                    color:this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                        offset: 0,
				                        color: '#91C7AE'
				                    }, {
				                        offset: 1,
				                        color: '#ffe'
				                    }])
				                }
					        },
					        symbol: 'none',
					        data:dataObj.input_data_total,//总的入
					    },
					    {
					        name: dataObj.logic_port+'-'+dataObj.vlan+this.$t('Public.totalOut'),
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        itemStyle: {
				                normal: {
				                    color: '#045851'
				                }
				           	},
					        areaStyle:{
					        	normal: {
				                    color:this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                        offset: 0,
				                        color: '#045851'
				                    }, {
				                        offset: 1,
				                        color: '#ffe'
				                    }])
				                }
					        },
					        symbol: 'none',
					        data:dataObj.output_data_total,//总的出
					    }]
					};
					
					chartsData.setOption(this.optionTra);
			}
		}
	}
	
	
	
</script>
<style type="text/css" soped>
	.chart{
		margin: auto;
		width:600px;
	}
</style>