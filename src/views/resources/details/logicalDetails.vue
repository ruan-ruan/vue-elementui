<template>
	<div>
		<goback></goback>
		
		<!--逻辑端口列表的详情的界面-->
		<el-tabs v-model='activeName' v-if='boolean'>
			<el-tab-pane label='信息详情' name='first'>
				<logical-port :title='id' ></logical-port>
			</el-tab-pane>
			<el-tab-pane label='点到点专线' name='second' v-if='pointSpecial'>
				<points-to :customer='id' v-if='id' @send='getVal'></points-to>
			</el-tab-pane>
			<el-tab-pane label='虚拟组网专线' name='third' v-if='virtualSpecial'>
				<virtual-network :clounId='id' v-if='id'></virtual-network>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import logicalPort from './logicalPort'
	import pointsTo from '@/views/resources/pointTo'
	import virtualNetwork from './logicalPortchild/virtualNetwork'
	import goback from '@/components/goback'
	
	export default{
		name:'logicalDetails',
		components:{logicalPort,pointsTo,virtualNetwork,goback},
		data(){
			return{
				token:'',
				activeName:'first',
				id:this.$route.query.detailsID,
				boolean:true,
				pointSpecial:this.recursion( this.$store.state.aside ,"aside.pointSpecial").show,//专线
				virtualSpecial:this.recursion( this.$store.state.aside ,"aside.virtualSpecial").show,//组网
			}
		},

		methods:{
			getVal(msg){
				this.boolean=false;
				this.$nextTick(() => {
					this.boolean=true;
					this.id=msg;
				})
			}
		}
	}
</script>

<style>
</style>