<template>
	<div>
		<!--图表的数据共享部分-->
		<el-row>
			<el-col :span='24'>
				<div style="width: 600px;height: 600px;" ref='chart' v-loading='chartLoading'></div>
				<el-table :data='user' highlight-current-row style='width: 580px;' v-loading='chartLoading'>
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
					console.log(newVal);
				},
				deep:true,
				
			},
			user:{
				handler(newVal,oldVal){
					console.log(newVal);
					newVal.map(item => {
						item.avg=parseInt(item.avg);

						
					})
				},
				deep:true
			}
		},
		mounted(){
			this.getCharts(this.data);
			this.user.map(item => {
//				console.log(item)
				item.avg=parseInt(item.avg)
			})
//			console.log(this.trafficData)
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
					        data: that.trafficData
					    },
					    yAxis: {
					        type: 'value',
					        axisTick:true,
					        scale:true,
					        axisLabel: {
					            margin: 2,
					            formatter: function (value, index) {
					                if (value >= 10000 && value < 10000000) {
					                    value = value / 10000 + "万";
					                } else if (value >= 10000000 && value <100000000) {
					                    value = value / 10000000 + "千万";
					                }else if(value>= 100000000) {
					                	value=value/100000000+'亿'
					                }
					                return value;
					            }
					        },
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
					        symbol: 'none',
					        areaStyle:{},
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
					        symbol: 'none',
					        areaStyle:{},
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
					        symbol: 'none',
					        areaStyle:{ },
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
					        symbol: 'none',
					        areaStyle:{ },
					        data:dataObj.output_data_d2,
					    },{
					        name:dataObj.logic_port+'-'+dataObj.vlan+'(总入)',
					        type: 'line',
					        smooth: true,
					        animation: false,
					        lineStyle:{
					        	width:1
					        },
					        areaStyle:{},
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
					        areaStyle:{ },
					        symbol: 'none',
					        data:dataObj.output_data_total,//总的出
					    }]
					};
					
					chartsData.setOption(this.optionTra);
			}
		}
	}
	
	
	
</script>