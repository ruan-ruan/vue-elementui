<template>
	<div>
		<el-button size='small' @click='goBack()'><i class="fa fa-angle-double-left"></i>{{$t('Public.goback')}}</el-button>
		<el-tabs v-model='activeName'>
			<el-tab-pane :label='$t("Public.nodeDetails")' name='first'>
				<Node :title='id' :physicalPort='physicalValue' :physicalData='physicalData'></Node>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.portInfo")' name='second'>
				<Port :title='id'v-if='id'></Port>
			</el-tab-pane>
			<el-tab-pane  :label='$t("Public.pointLine")' name='thired' v-if='pointSpecial'>
				<!--<Port ></Port>-->
				<points-to :nodeID='id' v-if='id'></points-to>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.virtualLine")' name='fourth' v-if='virtualSpecial'>
				<virtualNetwork :clounId='id' v-if='id'></virtualNetwork>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import pointsTo from '@/views/resources/pointTo'
	import Node from '@/views/nav1/node/details/child/node'
	import Port from '@/views/nav1/node/details/child/port'
	import virtualNetwork from '@/views/nav1/node/details/child/virtualNetwork'
//	import Port from '@/views/nav1/node/details/child/port'
	
	export default {
		name:'Details',
		components:{
			Node,
			Port,
			virtualNetwork,
			pointsTo
		},
		data(){
			return{
				token:'',
				activeName:'first',
				// 在节点的详情界面按钮传递来的id
				id:this.$route.query.detailsID,
				//未知节点的穿过id
				lineUnknown:this.$route.query.id,
				physicalValue:'',
				physicalData:[]
			}
		},
		created(){
			
			this.token =sessionStorage.getItem('token');

		},
		computed:{
			pointSpecial(){
				return this.recursion( this.$store.state.aside ,"aside.pointSpecial").show;
			},
			virtualSpecial(){
				return this.recursion( this.$store.state.aside ,"aside.virtualSpecial").show;
			}
		},
		methods:{
			goBack(){
				//返回
				 this.$router.go(-1)
			},

		},
	}
</script>

<style>
</style>