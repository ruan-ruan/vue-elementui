<template>
	<div>
		<span class="title_h3"style="font-size: 12px;">通过此配置的界面，可以用专线连接数据中心到公有云服务提供商()比如阿里李云，AWS并可以自行定义转此案的起始时间/终止时间以及带宽</span>
		<el-row>
			<el-col :span='24'>
				<el-col :span='18'>
					<h3 class="title_h3">第一步:创建数据中心互联的虚拟专线 <span class="cli_toTip" title='创建任意两个数据中心之间的二层虚拟专线'>?</span></h3>
					<topForm @formVal='getVal' ref='basicForm'></topForm>
					<h3 class="title_h3">第二步:业务两端基础信息配置</h3>
					<el-row>
						<el-col :span='24'>
							<el-col :span='12'>
								<h4 class="title_h4">A(云)配置</h4>
								<shared-cloun @sendClounbasic='getSharedCloun' @sendClounList='getClounList' ref='editForm'></shared-cloun>
							</el-col>
							<el-col :span='12'>
								<h4 class="title_h4"title="虚拟专线受控的起始端">Z(DC)配置<span class="cli_toTip" >?</span></h4>
								<dc-port @sendFormData='getDcPort' ref='dcPort'></dc-port>
							</el-col>
						</el-col>
					</el-row>
					<h3 class="title_h3">第三步:其他配置</h3>
					<billing @sendTime='getTimeVal' ref='billingForm'></billing>
				</el-col>
				<el-col :span='5'  class='pos_row'>
					<!--<el-row>
						<el-col :span='24'>-->
							<h3 class="tit_h3" >配置详情概览</h3>
							<el-form :model='creatFormDetails' ref='creatFormDetails' style='width: 100%;'label-width='120px'>
								<el-form-item label='公有云:' class='label_tit' prop='tenant_name'>
									<template >
										<span>{{creatFormDetails.sharedCloun}}</span>
									</template>
								</el-form-item>
								<el-form-item label='租户标识:' class='label_tit' prop='tenant_name'>
									<template >
										<span>{{creatFormDetails.tenant_name}}</span>
									</template>
								</el-form-item>
								<el-form-item label='计费时间:'  class='label_tit' prop='details_charge_time'>
									<template >
										<span>{{creatFormDetails.details_charge_time}}</span>
									</template>
								</el-form-item>
								<el-form-item label='过期时间:'  class='label_tit' prop='details_expiration_time'>
									<template >
										<span>{{creatFormDetails.details_expiration_time}}</span>
									</template>
								</el-form-item>
								<el-form-item label='带宽:'  class='label_tit' prop='bandwidth'>
									<template>
										<span>{{creatFormDetails.bandwidth}}</span>
										<span>Mbps</span>
									</template>
								</el-form-item>
								<el-form-item>
									<el-button size='small' @click.native="reset">重置</el-button>
					 				<el-button size='small' type='primary' @click='submitBtn'>提交</el-button>
								</el-form-item>
							</el-form>
						<!--</el-col>
					</el-row>-->
				</el-col>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	
	import sharedCloun from '@/views/business/multi/multFile/sharedCloun'
	import dcPort from'@/views/business/multi/multFile/dcPort'
	import {datedialogFormat} from '@/assets/js/index.js'
	
	import topForm from '@/views/business/pointTo/topForm'
	import billing from '@/views/business/pointTo/billing'
	export default{
		name:'dataToCloun',
		components:{topForm,billing ,sharedCloun,dcPort},
		data(){
			return{
				token:'',
				basic:{},//基本信息的配置
				clounList:{},//不同云的列表
				editForm:{
					sharedCloun:'',//公有云
					validate:'',//验证
					clounDoc:'',//云对接
					target:'',//对接
					nodeName:'',//节点的名称
					logic_z:'',
					endpoints_vlan:'trunk',
					vlan:'',
					charge_time:null,
					expiration_time:null
				},

				creatFormDetails:{
					//配置详情
					tenant_name:'',
					details_charge_time:'',
					details_expiration_time:'',
					bandwidth:'',
					sharedCloun:''
				},
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
		},
		methods:{
			getDcPort(msg){
				console.log(msg)
				this.editForm={
					name:'Z端',
					nodeName:msg.nodeName,
					logic_z:msg.logic,
					vlan:msg.vlan
				}
			},
			getClounList(msg){
				console.log(msg)
				this.clounList=Object.assign({},msg)
			},
			getSharedCloun(msg){
				console.log(msg);
				this.editForm={
					sharedCloun:msg.cloun,
					target:msg.targetRegion,
					clounDoc:msg.clounDock
				}
			},
			reset(){
				this.$refs['basicForm'].$refs['editForm'].resetFields();
				this.$refs['editForm'].$refs['editForm'].resetFields();
				this.$refs['dcPort'].$refs['editForm'].resetFields();
				this.$refs['billingForm'].$refs['editForm'].resetFields();
				this.$refs['creatFormDetails'].resetFields();
			},
			submitBtn(){
				var a_cloun_top={
					cloud_type:this.editForm.sharedCloun,
					region:this.editForm.target,
					cloud_config_id:this.editForm.clounDoc,
				}
				var a_cloun=Object.assign({},a_cloun_top,this.clounList);//clounList
				var endpoint={
					name:'z端',
					node_id:this.editForm.nodeName,
					logic_port_id:this.editForm.logic_z,
					vlan:this.editForm.vlan
				}
				var para={
					name:this.basic.name,
					tenant_id:this.basic.tenant_id,
					charge_mode:this.basic.charge_mode,
					bandwidth:this.basic.bandwidth,
					description:this.basic.description,
					charge_time:this.editForm.charge_time,
					expiration_time:this.editForm.expiration_time	,
					endpoint:endpoint,
					cloud_endpoint:a_cloun
				}
				console.log(para)
				//验证两个form表单同时验证通过的时候
				let str=[this.$refs.editForm.$refs.editForm,this.$refs.dcPort.$refs.editForm,this.$refs.basicForm.$refs.editForm];

				str.forEach(ele => {
					ele.validate((valid) => {
						if(valid){
							
							this.$confirm('确定要提交吗?','提示',{})
							.then(() => {
								
								this.$ajax.post('/vll/add_d2c_vll'+'?token='+this.token,para)
								.then(res =>{
									console.log(res);
									if(res.status==200){
										if(res.data.status==0){
											this.$confirm('业务提交成功,正在处理，请到消息列表中查看！','提示',{
												confirmButtonText: '继续开通',
										        cancelButtonText: '查看',
										        type: 'success'
											})
											.then(() => {
												//继续开通
												this.reset();//对所有的表单进行清空
											}).catch(() => {
												//消息列表的查看
												this.$router.replace('/resource/virtualLine/pointTo')
											})
										}
									}
								}).catch(e => {console.log(e)})
							}).catch(() => {})
						}
					})
				})
			},
			getVal(data){
				//获取基本的信息配置    topForm组件内的信息
				this.creatFormDetails.tenant_name=data.tenant_name;
				this.creatFormDetails.bandwidth=data.bandwidth;
				this.basic={
					name:data.specialName,
					tenant_id:data.tenant_id,
					charge_mode:data.billingType,
					bandwidth:data.bandwidth,
					description:data.describe,
				}
			},
			getTime(val){
				//获取子组件传过来的时间
				this.editForm.charge_time=val.billing_time/1000
				this.editForm.expiration_time=val.overdue_time/1000
			},
			getTimeVal(val){
				console.log(val)
				//获取子组件传过来的时间
				this.editForm.charge_time=val.billing_time/1000;
				this.editForm.expiration_time=val.overdue_time/1000;
				if( !val['billing_time'] && typeof (val['billing_time'] !='undefined' && val['billing_time'] !=0)){
					this.creatFormDetails.details_charge_time=''
				}else{
					this.creatFormDetails.details_charge_time=val.billing_time ===''?'':datedialogFormat(val.billing_time/1000)
				}
				
				if( !val['overdue_time'] && typeof (val['overdue_time'] !='undefined' && val['overdue_time'] !=0)){
					this.creatFormDetails.details_expiration_time=''
				}else{
					this.creatFormDetails.details_expiration_time=val.overdue_time ===''?'':datedialogFormat(val.overdue_time/1000)
				}
				
//				creatFormDetails:{
//					//配置详情
//					tenant_name:'',
//					details_charge_time:'',
//					details_expiration_time:'',
//					bandwidth:'',
//					sharedCloun:''
//				},
				
				
			},
		}
	}
</script>

<style>
	
</style>