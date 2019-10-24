<template>
	<div>
		<!--详情的图表部分-->
		<multCharts :titData='networkID'></multCharts>
	</div>
</template>

<script>
//	import chartData from '@/views/resources/virtualDetails/pointsDetails/chartData'
	import multCharts from '@/components/multCharts.vue'

	export default{
		name:'detailsChart',
		props:['detailsID'],
		components:{
			multCharts,
		},
		data(){
			return{
				networkID:this.detailsID,
				chartTit:{
					traffic:'流量展示图',
				},
				
				filters:{
					type:'dc',
					logic:''
				},
				typeData:[
					{
						label:'数据中心',
						value:'dc'
					},{
						label:"公有云",
						value:'sharedCloun'
					}
				],
				logicData:[]
			}
		},
		methods:{
			getFilters(){
				
			}
		}
	}
</script>

<style>
</style>