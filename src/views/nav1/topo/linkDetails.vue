<template>
	<div>
		<el-form :model='filters' ref='filters' label-wdith='100px' v-loading='linkLoading' v-if='formStatus'>
			<el-form-item>
				<el-button size='small' type='primary' @click='charts(filters.id)'>
					<!--图表-->
					{{$t('Public.chart')}}
				</el-button>
			</el-form-item>
			<el-form-item :label="$t('Public.linkState')+'：'">
				<span v-text='filters.status'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.sysBandwidth')+'：'">
				<span v-text='filters.bandwidth'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.phyBandwidth')+'：'">
				<span v-text='filters.physical_bandwidth'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.surBandwidth')+'：'">
				<span v-text='filters.remain_bandwidth'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.linkExpen')+'：'">
				<span v-text='filters.link_cost'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.linkCheck')+'：'">
				<span v-text='filters.monitoring'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.aPort')+'：'">
				<span v-text='filters.aPort'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.aportDescribe')+'：'">
				<span v-text='filters.aDesc'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.zPort')+'：'">
				<span v-text='filters.zPort'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.zportDescribe')+'：'">
				<span v-text='filters.zDesc'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.description')+'：'">
				<span v-text='filters.description'></span>
			</el-form-item>
		</el-form>

		<el-form :model='filters' ref='filters' v-loading='linkLoading' label-width='100px' v-if='!formStatus'>
			<el-form-item>
				<el-button size='small' type='primary' @click='charts(filters.id)' >
					<!--图表-->
					{{$t('Public.chart')}}
				</el-button>
			</el-form-item>
			<el-form-item :label="$t('Public.cloudName')+'：'">
				<span v-text='filters.name'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.shardCloud')+'：'">
				<span v-text='filters.type'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.status')+'：'">
				<span v-text='filters.status'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.region')+'：'">
				<span v-text='filters.region_id'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.accessPoint')+'：'">
				<span v-text='filters.access_point_id'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.logic')+'：'">
				<span v-text='filters.logic_port_name'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.logicStatus')+'：'">
				<span v-text='filters.logic_port_status'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.bandwidth')+'：'">
				<span v-text='filters.bandwidth'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.interface_driver')+'：'">
				<span v-text='filters.interface_driver'></span>
			</el-form-item>
			<el-form-item :label="$t('Public.description')+'：'">
				<span v-text='filters.description'></span>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {getPortStatus} from'@/assets/js/index.js'
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

					this.$ajax.get('/link/link_info/'+obj.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.linkLoading=false;
								var str=res.data.data;
								let obj={}
								if(str.monitoring){
									obj.sta=this.$t('Public.open')
								}else{
									obj.sta=this.$t('Public.close')
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
	
							}
						}
					}).catch(e => {console.log(e)})
				}else{
					this.formStatus=false;
					this.linkLoading=true;

					this.$ajax.get('/link/cloud_link_info/'+obj.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.linkLoading=false;
								let str=res.data.data;
								this.filters={
									id:str.id,
									name:str.name,
									type:str.type,
									status:'',
									region_id:str.region,//区域  这里原始数据是id  需要处理
									access_point_id:str.access_point,//同上
									logic_port_name:str.logic_port.name,
									logic_port_status:getPortStatus(str.logic_port.physical_port),
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
				//跳转到流量监控的界面
				this.$ajax.get('/vll/get_vll_flow/'+ids+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$router.push({
									path:'/topology/charts',
									query:{
										topoId:ids
									}
								});
							}
						}
					}).catch(e => {console.log(e)})
	
			}
		}
	}
	
</script>

<style>
</style>