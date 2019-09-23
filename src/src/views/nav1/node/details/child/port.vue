<template>
	<div>
		<!--端口信息-->
		<!--顶部标签-->
		<el-tabs type='border-card'>
			<el-tab-pane label='物理端口1'>
				<portChilds :titleOne='idOne'></portChilds>
			</el-tab-pane>
			<el-tab-pane label='物理端口2' v-if='equipStatue'>
				<portChilds :titleTwo='idTwo'></portChilds>
			</el-tab-pane>
			<el-tab-pane label='逻辑端口1'>
				<logicalPort :titleOne='idOne'></logicalPort>
			</el-tab-pane>
			<el-tab-pane label='逻辑端口2' v-if='equipStatue'>
				<logicalPort :titleTwo='idTwo'></logicalPort>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import portChilds from '@/views/nav1/node/details/child/portsChild/portChilds'
	import logicalPort from '@/views/nav1/node/details/child/portsChild/logicalPort'
	

	export default{
		name:'port',
		//这里的传的值是从总的界面传递的id
		token:'',
		props:['title'],  //,'physicalPort','physicalData'
		components:{
			portChilds,logicalPort
		},
		data(){
			return{
				idOne:[],
				idTwo:[],
				node_equip:[],
				equipStatue:false,
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getUsers(this.title)
		},
		methods:{
			getUsers(id){
				this.$ajax.get('/node/device_info/'+id+'/ports'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.physicalData=res.data.data.items;
							if(res.data.data.items.length===1){
								this.physicalValue=1;
								this.equipStatue=false;
							}else if(res.data.data.items.length===2){
								this.physicalValue=2;
								this.equipStatue=true;
							}
						}
					}
				}).catch(e => {
					console.log(e)
				})
			}
		}

	}
</script>

<style>
</style>