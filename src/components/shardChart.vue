<template>
	<div>
		<!--图表的数据共享部分-->
		<el-row>
			<el-col :span='24'>
				<div style="width: 1000px;height:500px;" ref='chart' v-loading='chartLoading'></div>
				<el-table :data='user' highlight-current-row style='margin-left: 15%;width: 600px;' v-loading='chartLoading'>
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
//					console.log(newVal);
				},
				deep:true,
				
			},
			user:{
				handler(newVal,oldVal){
//					console.log(newVal);
					newVal.map(item => {
						item.avg=parseInt(item.avg);

						
					})
				},
				deep:true
			}
		},
		mounted(){
			if(JSON.stringify( this.data) !='{}'){//只有存在数据的时候  
				this.getCharts(this.data);
			}

			this.user.map(item => {
				item.avg=parseInt(item.avg)
			})
//			console.log(this.data)
		},
		methods:{
			getCharts(dataObj){
//				console.log(dataObj);
				let that=this;
				let chartsData=this.$echarts.init(this.$refs.chart);
				this.optionTra={
					    title: {
					        text: dataObj.logo_title,//title标志
					        subtext:'带宽'+this.unit,
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
					    },
					    legend: {
					        data:[
					        dataObj.logic_port+'-'+dataObj.vlan+'(总入)',dataObj.logic_port+'-'+dataObj.vlan+'(总出)',
					        dataObj.dev_name1+'-'+dataObj.vlan+'(d1入)', dataObj.dev_name1+'-'+dataObj.vlan+'(d1出)',
					        dataObj.dev_name2+'-'+dataObj.vlan+'(d2入)',  dataObj.dev_name2+'-'+dataObj.vlan+'(d2出)',
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
					        type: 'value',
					        axisTick:true,
					        scale:true,
					        axisLabel: {
					            margin: 2,
					            formatter: function (value, index) {
					                if (value >= 1000 && value < 1000*1024) {
					                    value = value / 1000 + "KB";
					                } else if (value >= 1000*1024 && value <1024*1024) {
					                    value = value / 1000*1024 + "MB";
					                }else if(value>= 1024*1024 && value <1024*1024*1024) {
					                	value=value/1024*1024+'GB';					                	
					                }else if(value >= 1024*1024*1024){
					                	value=value/1024*1024*1024+'TB'
					                }
					                return value;
					            }
					        },
					    },
					    grid: {
					    	left:'13%',
					    	right:'13%',
				        },

					    series: [
					    {
					        name: dataObj.dev_name1+'-'+dataObj.vlan+'(d1入)', //d1
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
					        name:dataObj.dev_name1+'-'+dataObj.vlan+'(d1出)',
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
					        name: dataObj.dev_name2+'-'+dataObj.vlan+'(d2入)', //d2
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
					        name: dataObj.dev_name2+'-'+dataObj.vlan+'(d2出)',
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
					        name:dataObj.logic_port+'-'+dataObj.vlan+'(总入)',
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
					        name: dataObj.logic_port+'-'+dataObj.vlan+'(总出)',
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