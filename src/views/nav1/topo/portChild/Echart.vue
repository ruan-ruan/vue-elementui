<template>
	<div>
		<!--这是topo里面的流量视图-->
		<el-col :span='24'>
			<div style="width: 100%;height: 500px;"ref='charts' v-loading='loading'></div>
		</el-col>
	</div>
</template>
<script >
	export default{
		name:'Echart',
		props:{
			trafficData:{//父组件传递的时间轴的数据
				type:Array,
				default:function  () {
					return [];
				}
			},
			datas:{
				type:Object,
				default:function(){
					return {}
				}
			},
			load:{
				type:Boolean,
				default:false
			},
			unit:{
				type:String,
				default:'Mbps'
			}
		},
		data(){
			return {
				optionTra:null,
			}
		},
		computed:{
			loading(){
				return this.load;
			}
		},
		created(){

			
		},
		watch:{
			datas:{
				handler:function(newVal,oldval){
					this.getChrats( newVal )
				},
				deep:true
			},
			trafficData:{
				handler:function(newVal,oldVal){
				},
				deep:true
			}
		},
		methods:{
			getChrats(data){
				let that=this;
				let chartsData=that.$echarts.init(that.$refs.charts);
				that.optionTra= {
				    tooltip: {
				        trigger: 'axis',
				        position: function (pt) {
				            return [pt[0], '100%'];
				        },
				        formatter:function  (data) {
				        	var str='';
				        	for(let item =0;item<data.length;item++){
				        		if(that.unit === 'Mbps'){
				        			if (data[item]['value'] >= 1000 && data[item]['value'] < 1000*1024) {
					                    data[item]['value'] =  ( data[item]['value'] / 1000).toFixed(2)  + "KB";
					               } else if (data[item]['value'] >= (1000*1024) && data[item]['value'] < (1000*1024*1024)) {
					                    data[item]['value'] = ( data[item]['value'] / (1000*1024) ).toFixed(2)  + "MB";
					                }else if(data[item]['value'] >= (1000*1024*1024)  && data[item]['value'] <(1000*1024*1024*1024)) {

					                	data[item]['value']=  (data[item]['value']/(1000*1024*1024)).toFixed(2) +'GB';
					                } 
					                else if(data[item]['value'] >= (1000*1024*1024*1024)){
					                	data[item]['value']=( data[item]['value']/(1000*1024*1024*1024) ).toFixed(2) +'TB'
					                }else{
					                	data[item]['value']=data[item]['value']+'bps';
					                }
				        		}else{
					 				data[item]['value']=Math.round(data[item]['value'])	+'pps'
				        		}
				        		str+=data[item]['seriesName']+':'+data[item]['value']+'<br/>'
				        	}
				        	return data[0].axisValueLabel+'<br/>'+ str;
				        }
				    },
				    title: {
				        left: 'left',
				        text: '流量图',
				    },
				    toolbox: {
				        feature: {
				            dataZoom: {
				                yAxisIndex: 'none'
				            },
				            restore: {},
				            saveAsImage: {}
				        }
				    },
				    legend: {
				        data: ['入口', '出口']
				    },
				    xAxis: {
				        type: 'category',
				        boundaryGap: false,
				        data: that.trafficData,
				       
				    },
				    
				    yAxis: {
				        type: 'value',
				        boundaryGap: [0, '100%'],
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
				    },
				    dataZoom: [{
				        type: 'inside',
				        start: 0,
				        end: 10
				    }, {
				        start: 0,
				        end: 10,
				        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				        handleSize: '80%',
				        handleStyle: {
				            color: '#fff',
				            shadowBlur: 3,
				            shadowColor: 'rgba(0, 0, 0, 0.6)',
				            shadowOffsetX: 2,
				            shadowOffsetY: 2
				        }
				    }],
				    series: [
				    {
				            name: '入口',
				            type: 'line',
				            smooth: true,
				            symbol: 'none',
				            sampling: 'average',
				            itemStyle: {
				                color: 'rgb(4,253,134)'
				            },
					        areaStyle:{
					        	normal: {
				                    color:that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                        offset: 0,
				                        color: 'rbb(195,248,223)'
				                    }, {
				                        offset: 1,
				                		color: 'rgb(4,253,134)'
				                    }])
				                }	
					        },
				            data: data.int
				        } ,
				        {
				            name: '出口',
				            type: 'line',
				            smooth: true,
				            symbol: 'none',
				            sampling: 'average',
				            itemStyle: {
				                color: 'rgb(7,159,252)'
				            },
				            areaStyle: {
				                color: that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
				                    offset: 0,
				                    color: 'rgb(190,227,250)'
				                }, {
				                    offset: 1,
				                    color: 'rgb(7,159,252)'
				                }])
				            },
				            data: data.out
				        }
				    ]
				};
				chartsData.setOption(that.optionTra);
			}
		}
		
	}
	
	
	
	
</script>