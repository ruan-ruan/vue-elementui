<template>
	<div>
		<el-row>
			<el-col :span='22'>
				<el-tabs v-model='activeName' >
					<el-tab-pane :label='$t("Public.nodeDetails")' name='first'>
						<details-node :see='seeForm'></details-node>
					</el-tab-pane>
				</el-tabs>
			</el-col>
			<el-col :span='2'>
				<span @click="goback" class="err_no">
					<i class="el-icon-close"></i>
				</span>
			</el-col>
		</el-row>
		
		
	</div>
</template>

<script>
	import {datedialogFormat} from'@/assets/js/index.js'
	import detailsNode from '@/views/nav1/topo/detailsNode'
	export default{
		name:'nodeTab',
		components:{detailsNode},
		data(){
			return{
				activeName:'first',
				token:'',	
				seeForm:{
					time:'',
					name:'',
					status:'',
					data:'',
					Vtep:'',
				},
				nodeId:'',
				seeLoading:false,
				dialogFormVisible:false
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.bus.$on('sendNodeID',(data) =>{

				this.nodeId=data;
				this.getData(data)
			})
			this.getData(this.$store.state.node_id);
			
		},

		methods:{

			goback(){

				this.$emit('goback',false)
			},
			getData(ids){
				this.seeLoading=true;
				this.$ajax.get('/node/node_info/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){

							this.seeLoading=false;

							let str=res.data.data;

							let dc_name=''
							if(!str.dc && typeof(str.dc)!='undefined' && str.dc!=0){
								dc_name=''
							}else{
								dc_name=str.dc.name
							}
							this.seeForm={
								time:datedialogFormat(str.creation_time),
								name:str.name,
//								status:str.status,
								vtep:str.vtep,
								data:dc_name,
								id:str.id
							}

						}
					}
				}).catch(e => {console.log(e)})
			},
			seedetails(){
				this.$router.push({
					path:'/location/index/unknown/nodedetails',
					query:{
						detailsID:this.nodeId
					}
				})
			}
			
		}
	}
</script>

<style >
	.err_no{
		cursor: pointer;
		cursor: pointer;
	}
	.el-tabs{
		padding-left: 10px;
	}
</style>