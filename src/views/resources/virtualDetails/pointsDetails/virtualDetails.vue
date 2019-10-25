<template>
	<div>
		<!--虚拟专线的详情的界面-->
		<section>
			<el-form :mdoel='seeForm' ref='seeForm' v-loading='seeLoading' label-width='120px'label-position='left'>
				<el-row>
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item label='专线名称：'>
								<span>{{seeForm.name}}</span>
							</el-form-item>
							<el-form-item label='带宽(Mbps)：'>
								<span>{{seeForm.bandwidth}}</span>
							</el-form-item>
							<el-form-item label='专线状态：'>
								<span>{{seeForm.status}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='专线类型：'>
								<span>{{seeForm.typeHtml}}</span>
							</el-form-item>
							<el-form-item label='租户标识：'>
								<span>{{seeForm.tenant.name}}</span>
							</el-form-item>
						</el-col>						
					</el-col>
				</el-row>
				<el-row class='marT20'>
					<el-col :span='24'>
						<el-col :span='12' v-if='seeForm.type== "d2d" '>
							<h3 class="marB15">DC端A端配置详情</h3>
							<dc :dcData='dcFormA'></dc>
							<!--<el-form-item label='节点名称：'>
								<span>{{dcFormA.node_name}}</span>
							</el-form-item>
							<el-form-item label='A端逻辑口：'>
								<span>{{dcFormA.logic_name}}</span>
							</el-form-item>
							<el-form-item label='逻辑口状态：'>
								<span>{{dcFormA.port_status}}</span>
							</el-form-item>-->
						</el-col>
						<!--数据中心互联-->
						<el-col :span='12' v-if='seeForm.type=="d2d"'>
							<h3 class="marB15">DC端Z端配置详情</h3>
							<dc :dcData='dcFormZ'></dc>
							<!--<el-form-item label='节点名称：'>
								<span>{{dcFormZ.node_name}}</span>
							</el-form-item>
							<el-form-item label='Z端逻辑口：'>
								<span>{{dcFormZ.logic_name}}</span>
							</el-form-item>
							<el-form-item label='逻辑口状态：'>
								<span>{{dcFormZ.port_status}}</span>
							</el-form-item>-->
						</el-col>
						<!--云互联-->
						<el-col :span='12' v-if='seeForm.type=="c2c"'>
							<h3 class="marB15">A(云)端配置详情</h3>						
							<cloun :clounData='clFormA'></cloun>
							<!--<el-form-item label='公有云：'>
								<span>{{clFormA.cloud_type}}</span>
							</el-form-item>
							<el-form-item label='目标Region：'>
								<span>{{clFormA.region}}</span>
							</el-form-item>
							<el-form-item label='云对接链路：'>
								<span>{{clFormA.name}}</span>
								<span>{{clFormA.logic_name}}{{clFormA.vlan}}  </span>
							</el-form-item>
							<el-form-item label='逻辑口状态：'>
								<span>{{clFormA.logic_status}}</span>
							</el-form-item>-->
							
						</el-col>
						<el-col :span='12' v-if='seeForm.type=="c2c"'>
							<h3 class="marB15">Z(云)端配置详情</h3>	
							<cloun :clounData='clFormZ'></cloun>
							
							<!--<el-form-item label='公有云：'>

								<span>{{clFormZ.cloud_type}}</span>
							</el-form-item>
							<el-form-item label='目标Region：'>
								<span>{{clFormZ.region}}</span>
							</el-form-item>
							<el-form-item label='云对接链路：'>
								<span>{{clFormZ.name}}</span>
								<span>{{clFormZ.logic_name}}{{clFormZ.vlan}}  </span>
							</el-form-item>
							<el-form-item label='逻辑口状态：'>
								<span>{{clFormZ.logic_status}}</span>
							</el-form-item>-->
						</el-col>
					</el-col>
					
					<!--数据中心到云-->
					<el-col :span='12' v-if='seeForm.type=="d2c"'>
							<h3 class="marB15">A(云)端配置详情</h3>	
							<cloun :clounData='clFormA'></cloun>
							
							<!--<el-form-item label='公有云：'>
								<span>{{clFormA.cloud_type}}</span>
							</el-form-item>
							<el-form-item label='目标Region：'>
								<span>{{clFormA.region}}</span>
							</el-form-item>
							<el-form-item label='云对接链路:'>
								<span>{{clFormA.name}}</span>
								<span>{{clFormA.logic_name}}{{clFormA.vlan}}  </span>
							</el-form-item>
							<el-form-item label='逻辑口状态:'>
								<span>{{clFormA.logic_status}}</span>
							</el-form-item>-->
						</el-col>
						<el-col :span='12' v-if='seeForm.type=="d2c"'>
							<h3 class="marB15">Z(DC)端配置详情</h3>	
							<dc :dcData='dcFormZ'></dc>
							
							<!--<el-form-item label='节点名称：'>
								<sapn>{{dcFormZ.name}}</sapn>
							</el-form-item>
							<el-form-item label='Z端逻辑口：'>
								<span>{{dcFormZ.logic_name}}</span>
							</el-form-item>
							<el-form-item label='逻辑口状态：'>
								<span>{{dcFormZ.port_status}}</span>
							</el-form-item>-->
						</el-col>
					</el-col>
					
					
				</el-row>
				<el-row class='marT20'>					
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item label='计费模式：'>
								<span>{{seeForm.charge_mode}}</span>
							</el-form-item>
							<el-form-item label='创建时间:'>
								<span>{{seeForm.creation_time}}</span>
							</el-form-item>
							<el-form-item label='计费时间：'>
								<span>{{seeForm.charge_time}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='过期时间：'>
								<span>{{seeForm.expiration_time}}</span>
							</el-form-item>
							<el-form-item label='备注：'>
								<span>{{seeForm.description}}</span>
							</el-form-item>
						</el-col>
					</el-col>
				</el-row>
			</el-form>
		</section>
	</div>
</template>

<script>

	import {datedialogFormat , isNull ,isPort ,getPortStatus} from '@/assets/js/index.js'
	
	
	import basic from '@/views/resources/virtualDetails/childs/basic'
	import dc from '@/views/resources/virtualDetails/childs/dc'
	import cloun from '@/views/resources/virtualDetails/childs/cloun'
	
	
	
	export default{
		name:'virtualDetails',
		components:{
			basic,dc,cloun
		},
		props:['titData'],
		data(){
			return{
				token:'',
				seeForm:{
					charge_mode:'',//计费模式
					public_cloud:'',//共有云类型
					bandwidth:'',//带宽
					charge_time:'',//计费时间
					expiration_time:'',//过期时间
					description:'',//备注
					creation_time:'',//创建时间
					type:'',//点到点专线类型					
					id:'',//业务ID
					name:'',//专线名称
					status:'',//状态
					tenant:{
						name:'',
						id:''
					},
					endpoints:{},
					typeHtml:'',
				},
				dcFormA:{
					logic_name:'',
					name:'',
					port_status:'',
				},
				dcFormZ:{
					logic_name:'',
					name:'',
					port_status:'',
				},
				clFormA:{
					cloud_type:'',
					region:'',
					vlan:'',
					name:'',
					logic_name:'',
					logic_status:''
				},
				clFormZ:{
					cloud_type:'',
					region:'',
					vlan:'',
					name:'',
					logic_name:'',
					logic_status:''
				},
				endpointsData:[],
				seeLoading:false,

			}
		},
		created(){
			
			this.token=sessionStorage.getItem('token');
			
			if(typeof this.titData !=='undefined'){
				this.getPointDetails(this.titData)
			}
			
		},
		methods:{
			getPointDetails(ids){
				//获取点到点的详细信息
				this.seeLoading=true;
				this.$ajax.get('/vll/p2p_vll_info/'+ids+'?token='+this.token)
				.then(res =>{
					if(res.status==200){
						if(res.data.status==0){
							this.seeLoading=false;
							var  str=res.data.data;
							let statusVal='';
							statusVal=str.status==='serving'?'运行中':"stopping"?'停止中':'failure'?'创建失败':'creating'?'创建中':''

							

							if (!str.charge_time && typeof(str.charge_time)!="undefined" && str.charge_time!=0){ 
//							     alert("null"); 
							 }
							isNull(str,'charge_time');
							isNull(str,'creation_time');
							isNull(str,'expiration_time');
							

							this.seeForm={
								
								charge_mode:str.charge_mode,//计费模式
								public_cloud:str.public_cloud,//共有云类型
								bandwidth:str.bandwidth,//带宽
								charge_time:str.charge_time==''?'':datedialogFormat(str.charge_time),//计费时间  datedialogFormat
								expiration_time:str.expiration_time==''?'':datedialogFormat(str.expiration_time),//过期时间
								description:str.description,//备注
								creation_time:str.creation_time==''?'':datedialogFormat(str.creation_time),//创建时间
								type:str.type,//点到点专线类型					
								id:str.id,//业务ID
								name:str.name,//专线名称
								status:statusVal,//状态
								tenant:{
									name:str.tenant.name,
									id:str.tenant.id
								},
								endpoints:{},
								typeHtml:str.type==='d2d'?'数据中心互联':'d2c'?'数据中心到云':'云到云互联',
							};
							var  objA={},objZ={};
							if(str.type=='d2d'){
								objA=res.data.data.endpoints.find(item => {
									return item.name == "A端"
								})
								objZ=res.data.data.endpoints.find(item => {
									return item.name == "Z端"
								})
								//A端DC
								this.dcFormA={
									name:objA.name,
									id:objA.id,
									port_status:isPort(objA.ports),
									logic_name:objA.logic_port.name,
									node_name:objA.node.name,
									port_no:objA.ports.port_no,
									
									logic_port:{
										id:objA.logic_port.id,
										name:objA.logic_port.name
									},
									ports:{
										id:objA.ports.id,
										name:objA.ports.name,
										status:objA.ports.status
									},
									vlan:objA.vlan < 0 ? '透传' : 0 ? 'UNTAG':objA.vlan
								}
								//Z端DC
								this.dcFormZ={
									name:objZ.name,
									id:objZ.id,
									port_status:isPort(objZ.ports),
									logic_name:objZ.logic_port.name,
									port_no:objZ.ports.port_no,
									node_name:objZ.node.name,
									
									logic_port:{
										id:objZ.logic_port.id,
										name:objZ.logic_port.name
									},
									ports:{
										id:objZ.ports.id,
										name:objZ.ports.name,
										status:objZ.ports.status
									},
									vlan:objZ.vlan < 0 ? '透传' : 0 ? 'UNTAG':objZ.vlan
								}
								console.log(this.dcFormA)
								console.log(objA)

							}
							if(str.type=='c2c'){

								objA=res.data.data.cloud_endpoints.find(item => {
									return item.name == "A端"
								});
								objZ=res.data.data.endpoints.find(item => {
									return item.name == "Z端"
								});
								//A云
								this.clFormA.cloud_type=objA.cloud_type;
								this.clFormA.region=objA.region;
								this.clFormA.vlan=objA.vlan < 0 ? '透传' : 0 ? 'UNTAG':objA.vlan;
								//Z云
								this.clFormZ.cloud_type=objZ.cloud_type;
								this.clFormZ.region=objZ.region;
								this.clFormZ.vlan=objZ.vlan < 0 ? '透传' : 0 ? 'UNTAG':objZ.vlan;

								
								this.getClounDetails(objA.id,objA.name);
								this.getClounDetails(objA.id,objZ.name);
							}
							
							if(str.type=='d2c'){
								objA=res.data.data.cloud_endpoints.find(item => {
									return item.name == "A端"
								});
								objZ=res.data.data.endpoints.find(item => {
									return item.name == "Z端"
								})
								//A云
								this.clFormA.cloud_type=objA.cloud_type;
								this.clFormA.region=objA.region;
								this.clFormA.vlan=objA.vlan < 0 ? '透传' : 0 ? 'UNTAG':objA.vlan

								this.getClounDetails(objA.id,objA.name)
								//Z端DC
								this.dcFormZ={
									name:objZ.name,
									id:objZ.id,
									port_status:isPort(objZ.ports),
									logic_name:objZ.logic_port.name,
									port_no:objZ.ports.port_no,
									
									logic_port:{
										id:objZ.logic_port.id,
										name:objZ.logic_port.name
									},
									ports:{
										id:objZ.ports.id,
										name:objZ.ports.name,
										status:objZ.ports.status
									},
									vlan:objZ.vlan < 0 ? '透传' : 0 ? 'UNTAG':objZ.vlan
								}
								
							}
							
							
							

						}else {
							this.$message({
								message:res.data.message,
								type:'warning'
							})
						}
					}
				}).catch(e => {
					console.log(e)
				})
				
			},
			getClounDetails(clounID,type){//根据云的id获取云莲路的详情的数据   
				if(type ==='A端'){
					this.$ajax.get('/link/cloud_link_info/'+clounID+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								console.log(res);
								var str=res.data.data;
								this.clFormA.name=str.name;
								this.clFormA.logic_name=str.logic_port.name;
								this.clFormA.logic_status=str.getPortStatus(str.logic_port.physical_port);
							
							}
						}
					}).catch(e => {console.log(e)})
				}else if(type ==='Z端'){
					this.$ajax.get('/link/cloud_link_info/'+clounID+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								console.log(res);
								var str=res.data.data;
								this.clFormZ.name=str.name;
								this.clFormZ.logic_name=str.logic_port.name;
								this.clFormZ.logic_status=str.getPortStatus(str.logic_port.physical_port);
							}
						}
					}).catch(e => {console.log(e)})
				}
				
				
				
			}
		}
	}
</script>

<style>
</style>