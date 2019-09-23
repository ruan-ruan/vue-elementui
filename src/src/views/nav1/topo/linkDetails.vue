<template>
	<div>
		<el-form :model='filters' ref='filters' label-wdith='80px' v-loading='linkLoading' v-if='formStatus'>
			<el-form-item>
				<el-button size='small' type='primary' @click='charts(filters.id)'>图表</el-button>
			</el-form-item>
			<el-form-item label='链路状态:'>
				<span v-text='filters.status'></span>
			</el-form-item>
			<el-form-item label='总带宽(Mbps):'>
				<span v-text='filters.bandwidth'></span>
			</el-form-item>
			<el-form-item label='物理带宽(Mbps):'>
				<span v-text='filters.physical_bandwidth'></span>
			</el-form-item>
			<el-form-item label='剩余带宽(Mbps):'>
				<span v-text='filters.remain_bandwidth'></span>
			</el-form-item>
			<el-form-item label='链路开销:'>
				<span v-text='filters.link_cost'></span>
			</el-form-item>
			<el-form-item label='链路检测:'>
				<span v-text='filters.monitoring'></span>
			</el-form-item>
			<el-form-item label='A端:'>
				<span v-text='filters.aPort'></span>
			</el-form-item>
			<el-form-item label='A端描述:'>
				<span v-text='filters.aDesc'></span>
			</el-form-item>
			<el-form-item label='Z端:'>
				<span v-text='filters.zPort'></span>
			</el-form-item>
			<el-form-item label='Z端描述:'>
				<span v-text='filters.zDesc'></span>
			</el-form-item>
			<el-form-item label='备注:'>
				<span v-text='filters.description'></span>
			</el-form-item>
		</el-form>

		<el-form :model='filters' ref='filters' v-loading='linkLoading' label-width='80px' v-if='!formStatus'>
			<el-form-item>
				<el-button size='small' type='primary' @click='charts(filters.id)' >图表</el-button>
			</el-form-item>
			<el-form-item label='云链路名称'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='公有云'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='链路状态'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='区域'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='接入点'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='逻辑口'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='逻辑口状态'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='带宽(Mbps)'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='接口驱动'>
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item label='备注'>
				<span v-text='filters.name'></span>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	
	export default{
		name:'linkDetails',
		props:['seeDetails'],
		data(){
			return{
				linkLoading:false,
				filters:{},
				formStatus:true,


				token:'',
				
			}
		},
		watch:{
			seeDetails:{
				handler(newVal,oldVal){
					console.log(newVal)
					this.linksData(newVal)
				},
				deep:true
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.linksData(this.seeDetails)
		},
		methods:{
			
			linksData(obj){
				if(obj.type==='link'){
					this.formStatus=true;
					this.linkLoading=true;
					console.log('执行link')
					this.$ajax.get('/link/link_info/'+obj.id+'?token='+this.token)
					.then(res => {
						console.log(res);
						if(res.status==200){
							if(res.data.status==0){
								this.linkLoading=false;
								var str=res.data.data;
								let obj={}
								if(str.monitoring){
									obj.sta='开启'
								}else{
									obj.sta='关闭'
								}
								this.filters={
									id:str.id,
									status:str.status,
									bandwidth:str.bandwidth,
									physical_bandwidth:str.physical_bandwidth,
									remain_bandwidth:str.bandwidth-str.physical_bandwidth,
									link_cost:str.link_cost,
									monitoring:obj.sta,
									aPort:str.a_node.name+'-'+str.a_ip+'-'+str.a_vlan,
									aDesc:str.a_desc,
									zPort:str.z_node.name+'-'+str.z_ip+'-'+str.z_vlan,
									zDesc:str.z_desc,
									description:str.description,
								};
								console.log(this.filters)
							}
						}
					}).catch(e => {console.log(e)})
				}else{
					this.formStatus=false;
					this.linkLoading=true;
					console.log('执行云');
					this.$ajax.get('/link/cloud_link_info/'+obj.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								console.log(res)
								this.linkLoading=false;
								let str=res.data.data;
								let obj={}
								if(str.type==='ali'){
									obj.typeName='阿里云'
								}else if(str.type==='tencent'){
									obj.typeName='腾讯云'
								}else if(str.type==='other'){
									obj.typeName='其他'
								}
								this.filters={
									id:str.id,
									name:str.name,
									type:obj.name,
									status:'',
									region_id:str.region_id,//区域  这里原始数据是id  需要处理
									access_point_id:str.access_point_id,//同上
									logic_port_name:str.logic_port.name,
									logic_port_status:str.logic_port.status,
									bandwidth:str.bandwidth,
									interface_driver:str.interface_driver,
									description:str.description
								}
							}
						}
						
					}).catch(e => {console.log(e)})
				}
			},
			charts(ids){
				console.log(ids);//跳转到流量监控的界面
				
			}
		}
	}
	
</script>

<style>
</style>