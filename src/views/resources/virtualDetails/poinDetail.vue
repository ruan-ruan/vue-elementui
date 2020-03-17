<template>
	<div>
		<el-button type='info' size='small' @click='goback'>
			<i class="el-icon-d-arrow-left" aria-hidden="true"></i>{{$t("Public.goback")}}</el-button>
		<el-tabs v-model='activeName' @tab-click='handleClick'>
			<el-tab-pane :label=' $t("Public.detailed")' name='first':key="'first'">
				<virtualDetails :titData='pointID' v-if='isChildUpdate1'></virtualDetails>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.chart")' name='second' :key="'second'" v-if='flow'>
				<mult-charts :titData='pointID' v-if='isChildUpdate2'></mult-charts>
			</el-tab-pane>
			<el-tab-pane label='路径详情' name='three':key="'three'">
				<select-path :titData='pointID'   v-if='isChildUpdate3'></select-path>
			</el-tab-pane>
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
				isChildUpdate1:true,
            	isChildUpdate2:false,
            	isChildUpdate3:false,
				activeName:'first',
				pointID:this.$route.query.pointID,
	  			flow:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointSpecial").list, "vll@get_vll_flow").show,//查看逻辑口的详情
			}
		},

		methods:{
			handleClick(tab){
				if(tab.name == "first") {
	                this.isChildUpdate1 = true;
	                this.isChildUpdate2 = false;
	                this.isChildUpdate3 = false;
	                
	            } else if(tab.name == "second") {
	                this.isChildUpdate1 = false;
	                this.isChildUpdate2 = true;
	                this.isChildUpdate3 = false;
	                
	            }else if(tab.name == "three") {
	                this.isChildUpdate1 = false;
	                this.isChildUpdate2 = false;
	                this.isChildUpdate3 = true;
	                
	            }
			},
			goback(){
				this.$router.go(-1)
			},
		}
	}
</script>

<style>
</style>