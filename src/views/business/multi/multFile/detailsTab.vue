<template>
	<div>
		<!--虚拟组网详情-->
		<goback>返回</goback>
		<el-tabs v-model='activeName'>
			<el-tab-pane :label='$t("Public.detailed")' name='first'>
				<details-mult :detailsID='detailsID'></details-mult>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.chart")' name='second'>
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
	}
</script>

<style>
</style>