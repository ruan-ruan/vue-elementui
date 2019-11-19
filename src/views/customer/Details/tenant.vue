<template>
	<div>
		<goback></goback>
		<el-tabs v-model='activeName'>
			<el-tab-pane :label='$t("aside.detaTenant")'name='first'>
				<cusDetails :tit='cusSeeID'></cusDetails>
			</el-tab-pane>
			<el-tab-pane :label='$t("customer.logicList")'name='second'>
				<logicPort :tenantID='cusSeeID'></logicPort>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.pointLine")'name='three'>
				<points-to :customerID='cusSeeID'></points-to>  <!--向子组件传id即可    根据id在子组件内进行判断-->
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.virtualLine")'name='four'>
				<virtualNetwork :customerID='cusSeeID'></virtualNetwork>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import cusDetails from '@/views/customer/Details/cusOperation'
	import logicPort from '@/views/resources/port'
	import pointsTo from '@/views/resources/pointTo'
	import virtualNetwork from '@/views/customer/Details/tenantDetails/virtualNetwork'
	import goback from '@/components/goback'

	
	export default{
		name:'tenant',
		components:{
			cusDetails,
			logicPort,
			pointsTo,
			goback,
			virtualNetwork,
		},
		data(){
			return{
				token:'',
				cusSeeID:this.$route.query.id,
				activeName:'first',

			}
		},
	

	}
</script>

<style>
</style>