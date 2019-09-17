<template>
	<div>
		<section>
			<!--表格的具体的数据-->
			<chartData :traffic='chartTypes.traffic'></chartData>
			<chartData :broken='chartTypes.broken'></chartData>
			<chartData :virtual='chartTypes.virtual'></chartData>
		</section>
	</div>
</template>

<script>
	
	import chartData from '@/views/resources/virtualDetails/pointsDetails/chartData'
	export default{
		name:'virtualChart',
		components:{chartData},
		data(){
			return{
				token:''	,
				chartTypes:{
					traffic:'流量',
					broken:'延时',
					virtual:'丢包率'
				},
//				trafficChart:{
//					unit:'Mbps',
//					val:'平均值',
//					date:'最近一小时',
//					start_time:'',
//					end_time:'',
//					time:''
//				},
				trafficData:[],
				optionA:{}
			}
		},
		watch:{
//			'trafficChart.date':function(newVal,oldVal){
//				let  end_time=new Date();
//				let  start_time=new Date();
//				if(!newVal){
//					start_time.setTime(start_time.getTime() - 3600 * 1000);
//				}else{
//					if(newVal=='最近一小时'){
//						start_time.setTime(start_time.getTime() - 3600 * 1000 );
//						this.mysel_chartfDate=false;
//					}else if(newVal=='最近一天'){
//						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 );
//						this.mysel_chartfDate=false;
//					}else if(newVal=='最近一周'){
//						start_time.setTime(start_time.getTime() - 3600 * 1000 * 24 * 7);
//						this.mysel_chartfDate=false;
//					}else if(newVal=='自定义'){
//						this.mysel_chartfDate=true;
//					}
//				}
//				this.trafficChart.end_time=end_time;
//				this.trafficChart.start_time=start_time;
//			}
		},
		created(){
//			this.token=sessionStorage.getItem('token');
		},
		
	}
</script>

<style>
</style>