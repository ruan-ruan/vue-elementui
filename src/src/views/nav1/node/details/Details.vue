<template>
	<div>
			<el-button size='small' @click='goBack()'><i class="fa fa-angle-double-left"></i>返回</el-button>
		<el-tabs v-model='activeName'>
			<el-tab-pane label='节点详情' name='first'>
				<Node :title='id' :physicalPort='physicalValue' :physicalData='physicalData'></Node>
			</el-tab-pane>
			<el-tab-pane label='端口信息' name='second'>
				<Port :title='id'></Port>
			</el-tab-pane>
			<el-tab-pane label='点到点专线' name='thired'>
				<!--<Port ></Port>-->
				<points-to :nodeID='id'></points-to>
			</el-tab-pane>
			<el-tab-pane label='虚拟组网专线' name='fourth'>
				<virtualNetwork :clounId='id'></virtualNetwork>
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
				id:this.$route.params.id,
				//未知节点的穿过id
				lineUnknown:this.$route.query.id,
				physicalValue:'',
				physicalData:[]
			}
		},
		created(){
			console.log(this.id)
			this.token =sessionStorage.getItem('token');
		},
		methods:{
			goBack(){
				//返回
				 this.$router.go(-1)
			},
			getUsers(id){
				this.$ajax.get('/node/device_info/'+id+'/ports'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.physicalData=res.data.data.items;
							console.log(res)
							if(res.data.data.items.length===1){
								console.log('这个时候只有一个物理端口')
								this.physicalValue=1
							}else if(res.data.data.items.length===2){
								console.log('这个时候只有两个物理端口');
								this.physicalValue=2
							}
						}
					}
				}).catch(e => {
					console.log(e)
				})
			}
		},
	}
</script>

<style>
</style>