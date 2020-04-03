<template>
	<div>
		<goback></goback>
		<el-tabs v-model='activeName'>
			<el-tab-pane :label='$t("aside.detaTenant")'name='first'>
				<cusDetails :tit='cusSeeID' v-if='cusSeeID'></cusDetails>
			</el-tab-pane>
			<el-tab-pane :label='$t("customer.logicList")'name='second' v-if='port'>
				<logicPort :tenantID='cusSeeID' v-if='cusSeeID'></logicPort>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.pointLine")'name='three' v-if='pointSpecial'>
				<points-to :customerID='cusSeeID' v-if='cusSeeID'></points-to>  <!--向子组件传id即可    根据id在子组件内进行判断-->
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.virtualLine")'name='four' v-if='virtualSpecial'>
				<virtualNetwork :customerID='cusSeeID' v-if='cusSeeID'></virtualNetwork>
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
				cusSeeID:this.$route.query.seeId,//详情界面的id
				activeName:'first',
				pointSpecial:this.recursion( this.$store.state.aside ,"aside.pointSpecial").show,//点的专线
				virtualSpecial:this.recursion( this.$store.state.aside ,"aside.virtualSpecial").show,//组网
				port:this.recursion( this.$store.state.aside ,"aside.logicManage").show,//逻辑口
			}
		},
	

	}
</script>

<style>
</style>