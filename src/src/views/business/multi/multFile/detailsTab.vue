<template>
	<div>
		<!--虚拟组网相情感-->
		<goback>返回</goback>
		<el-tabs v-model='activeName'>
			<el-tab-pane label='详细信息' name='first'>
				<details-mult :detailsID='detailsID'></details-mult>
			</el-tab-pane>
			<el-tab-pane label='图表' name='second'>
				<details-chart :detailsID='detailsID'></details-chart>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import goback from '@/components/goback'
	import detailsMult from '@/views/business/multi/multFile/editMultipoint'
	import detailsChart from '@/views/business/multi/multFile/detailsChart'
	export default{
		name:'detailsTab',
		components:{
			detailsMult,goback,detailsChart
		},
		data(){
			return{
				activeName:'first',
				detailsID:this.$route.query.detailsID,
			}
		},
		created(){
			console.log(this.detailsID)
		}
	}
</script>

<style>
</style>