<template>
	<div>
		<!--<goback></goback>-->
		<el-button type='info' size='small' @click='goback'>
			<i class="el-icon-d-arrow-left" aria-hidden="true"></i>{{$t("Public.goback")}}</el-button>
		<el-tabs v-model='activeName'>
			<el-tab-pane :label=' $t("Public.detailed")' name='first'>
				<virtualDetails :titData='pointID'></virtualDetails>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.chart")' name='second'>
				<!--<virtual-chart :titData='pointID'></virtual-chart>-->
				<mult-charts :titData='pointID'></mult-charts>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import goback from '@/components/goback';
	import virtualDetails from '@/views/resources/virtualDetails/pointsDetails/virtualDetails'
//	import virtualChart from '@/views/resources/virtualDetails/pointsDetails/virtualChart'
	import multCharts from '@/components/multCharts'
//	import sharedCharts from '@/components/sharedCharts'
	
	export default{
		name:'poinDetail',
		components:{
			goback,
			virtualDetails,
			multCharts,

		},
		data(){
			return{
				activeName:'first',
				pointID:this.$route.query.pointID,
			}
		},
		created(){
			console.log(this.pointID)
		},
		methods:{
			goback(){
				this.$router.go(-1)
			},
		}
	}
</script>

<style>
</style>