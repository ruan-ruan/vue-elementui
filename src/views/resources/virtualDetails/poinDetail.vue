<template>
	<div>
		<!--<goback></goback>-->
		<el-button type='info' size='small' @click='goback'>
			<i class="el-icon-d-arrow-left" aria-hidden="true"></i>{{$t("Public.goback")}}</el-button>
		<el-tabs v-model='activeName'>
			<el-tab-pane :label=' $t("Public.detailed")' name='first'>
				<virtualDetails :titData='pointID'></virtualDetails>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.chart")' name='second' v-if='flow'>
				<mult-charts :titData='pointID'></mult-charts>
			</el-tab-pane>
			<!--<el-tab-pane label='路径详情' name='three'>
				<selectPath :titData='pointID'></selectPath>
			</el-tab-pane>-->
		</el-tabs>
	</div>
</template>

<script>
	import goback from '@/components/goback';
	import virtualDetails from '@/views/resources/virtualDetails/pointsDetails/virtualDetails'
	import multCharts from '@/components/multCharts'
	import selectPath from '@/views/resources/virtualDetails/pointsDetails/selectPath'
	export default{
		name:'poinDetail',
		components:{
			goback,
			virtualDetails,
			multCharts,
			selectPath
		},
		data(){
			return{
				activeName:'first',
				pointID:this.$route.query.pointID,
	  			flow:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list, "vll@get_vll_flow").show,//查看逻辑口的详情
				
			}
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