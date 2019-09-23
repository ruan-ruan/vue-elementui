<template>
	<div>
		<!--虚拟专线的详情的界面-->
		<section>
			<el-form :mdoel='seeForm' ref='seeForm' v-loading='seeLoading' label-width='120px'>
				<el-row>
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item label='专线名称'>
								<el-input v-model='seeForm.name' class='ipt' disabled></el-input>
							</el-form-item>
							<el-form-item label='带宽(Mbps)'>
								<el-input v-model='seeForm.bandwidth'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='专线状态'>
								<el-input v-model='seeForm.status'class='ipt'disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='专线类型'>
								<el-input v-model='seeForm.type'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='租户标识'>
								<el-input v-model='seeForm.tenant_name'class='ipt'disabled></el-input>
							</el-form-item>
						</el-col>						
					</el-col>
				</el-row>
				<el-row class='marT20'>
					<el-col :span='24'>
						<el-col :span='12' v-if='seeForm.type=="DCI"'>
							<h3 class="marB15">DC端A端配置详情</h3>
							<el-form-item label='节点名称'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='A端逻辑口'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='逻辑口状态'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
						</el-col>
						
						<el-col :span='12' v-if='seeForm.type=="DCI"'>
							<h3 class="marB15">DC端Z端配置详情</h3>
							<el-form-item label='节点名称'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='Z端逻辑口'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='逻辑口状态'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12' v-if='seeForm.type!="DCI"'>
							<h3 class="marB15">A(云)端配置详情</h3>						
							<el-form-item label='公有云'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
							<el-form-item label='目标Region'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
							<el-form-item label='公对接链路'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
							<el-form-item label='逻辑口状态'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12' v-if='seeForm.type!="DCI"'>
							<h3 class="marB15">Z(云)端配置详情</h3>						
							<el-form-item label='公有云'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
							<el-form-item label='目标Region'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
							<el-form-item label='公对接链路'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
							<el-form-item label='逻辑口状态'>
								<el-input v-model='seeForm.name'class='ipt' disabled></el-input>
							</el-form-item>
						</el-col>
					</el-col>
				</el-row>
				<el-row class='marT20'>					
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item label='计费模式'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='创建时间'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='计费时间'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='过期时间'>
								<el-input v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
							<el-form-item label='备注'>
								<el-input type='textarea' cols='4' v-model='seeForm.name'class='ipt'disabled></el-input>
							</el-form-item>
						</el-col>
					</el-col>
				</el-row>
			</el-form>
		</section>
	</div>
</template>

<script>

	import {datedialogFormat} from '@/assets/js/index.js'
	
	export default{
		name:'virtualDetails',
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
					tenant_id:'',
					tenant_name:'',
					endpoints:{},
				},
				endpointsData:[],
				seeLoading:false,
			}
		},
		created(){
			console.log(this.titData)
			this.token=sessionStorage.getItem('token');
			console.log(this.titData)
			if(typeof this.titData !=='undefined'){
				this.getPointDetails(this.titData)
			}
			
		},
		methods:{
			getPointDetails(ids){
				//获取点到点的详细信息
				console.log(ids)
				this.$ajax.get('/vll/p2p_vll_info/'+ids+'?token='+this.token)
				.then(res =>{
					console.log(res)
					if(res.status==200){
						if(res.data.status==0){
							console.log(res);
							let str=res.data.data;
							let status='';
							status=res.data.data.status==='serving'?'运行中':"stopping"?'停止中':'failure'?'创建失败':'creating'?'创建中':''
//							if(str.status===''){}
							
							this.seeForm={
								charge_mode:str.charge_mode,
								public_cloud:str.public_cloud,
								bandwidth:str.bandwidth,
								charge_time:datedialogFormat(str.charge_time),
								expiration_time:datedialogFormat(str.expiration_time),
								description:str.description,
								creation_time:datedialogFormat(str.creation_time),
								type:str.type,
								id:str.id,
								name:str.name,
								status:status,
								tenant_name:str.tenant.name,
								endpoints:str.endpoints
							}
							
						
							
							this.endpointsData=res.data.data.endpoints;
							let objA={},objZ={};
							res.data.data.endpoints.forEach(ele => {
								if(ele.name='A端'){
									objA={
										name:ele.name,
										id:ele.id,
										logic_port:{
											id:ele.logic_port.id,
											name:ele.logic_port.name
										},
										ports:{
											id:ele.ports.id,
											name:ele.ports.name,
											status:ele.ports.status
										},
										vlan:ele.vlan
									}
									this.endpointsData.push(objA)
								}else if(ele.name='Z端'){
									objZ={
										name:ele.name,
										id:ele.id,
										logic_port:{
											id:ele.logic_port.id,
											name:ele.logic_port.name
										},
										ports:{
											id:ele.ports.id,
											name:ele.ports.name,
											status:ele.ports.status
										},
										vlan:ele.vlan
									}
									this.endpointsData.push(objZ)
								}
							})
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
				
			}
		}
	}
</script>

<style>
</style>