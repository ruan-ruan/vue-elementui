<template>
	<div>
		<!--端口信息-->
		<!--顶部标签-->
		<el-tabs type='border-card'>
			<el-tab-pane label='物理端口1'>
				<portChilds :titleOne='base1' ></portChilds>
			</el-tab-pane>
			<el-tab-pane label='物理端口2' v-if='equipStatue'>
				<portChilds :titleTwo='base2'></portChilds>
			</el-tab-pane>
			<el-tab-pane label='逻辑端口1'>
				<logicalPort :titleOne='base1ID'></logicalPort>
			</el-tab-pane>
			<el-tab-pane label='逻辑端口2' v-if='equipStatue'>
				<logicalPort :titleTwo='base2ID'></logicalPort>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import portChilds from '@/views/nav1/node/details/child/portsChild/portChilds'
//	import logicalPort from '@/views/nav1/node/details/child/portsChild/logicalPort'
	import logicalPort from '@/views/resources/port'

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
				obj:{},
				base1:{},
				base2:{},
				dataVal:[],
				base1ID:'',
				base2ID:'',
				ids1:''
			}
		},
		created(){
			console.log(this.title)
			this.token=sessionStorage.getItem('token');
			this.getUsers(this.title)
		},
		watch:{
			base1:{
				handler(newVal,oldVal){
					console.log(newVal);
					this.base1ID=newVal.id;
				},
				deep:true,
			},
			base2:{
				handler(newVal,oldVal){
					console.log(newVal);
					this.base2ID=newval.id;
				},
				deep:true
			}
		},
		methods:{
			getUsers(id){
				this.$ajax.get('/node/node_info/'+id+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							console.log(res.data.data.devices.length)
							this.obj=res.data.data;
							if(res.data.data.devices){
								if(res.data.data.devices.length==2){
									this.equipStatue=true
									
//									this.base1=res.data.data.devices[0];
//									this.base2=res.data.data.devices[1];
									this.base1=res.data.data.devices.find((item ) => {
										return item['sign']=='d1'
									})
									this.base2=res.data.data.devices.find((item ) => {
										return item['sign']=='d2'
									})
									console.log(this.base1)
									console.log(this.base2)
								}else{
									this.equipStatue=false
									this.base1=res.data.data.devices.find((item ) => {
										return item['sign']=='d1'
									})
								}
							}
							this.ids1=this.obj.devices[0].id

							this.getList(this.obj.devices[0].id)
							
						}
					}
				})
				.catch(e => {console.log(e)})
			},
			getList(ids){
				this.$ajax.get('/node/device_info/'+ids+'/ports'+'?token='+this.token)
				.then(res => {
					console.log(res)
					if(res.status==200){
						if(res.data.status==0){
							this.dataVal=res;
//							this.physicalData=res.data.data.items;
//							if(res.data.data.items.length===1){
//								this.physicalValue=1;
//								this.equipStatue=false;
//							}else if(res.data.data.items.length===2){
//								this.physicalValue=2;
//								this.equipStatue=true;
//							}
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