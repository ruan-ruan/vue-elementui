<template>
	<div>
		<!--数据中心互联-->
		<span class="title_h3"style="font-size: 12px;">通过此配置的界面，可以用专线连接两个不同的数据中心，并可以自定义专线的计费时间，结束时间和带宽！</span>
		<el-row>
			<el-col :span='24'>
				<el-col :span='18'>					
					<h3 class="title_h3">第一步：创建数据中心互联的虚拟专线 <span class="cli_toTip" title='创建任意两个数据中心之间的二层虚拟专线'>?</span></h3>
					<topForm @formVal='getVal'  ref='newForm'></topForm>
					<h3 class="title_h3">第二步</h3>
					
					<el-row>
						<el-col :span='24'>
							<el-col :span='12'>
								<h4 class="title_h4"title="虚拟专线受控的起始端">A端配置<span class="cli_toTip" >?</span></h4>
								<dc-port @sendFormData_a='getFormData_a':tit='vlanSel.label1' ref='dc_a'></dc-port>
							</el-col>
							<el-col :span='12'>
								<h4 class="title_h4"title='虚拟专线受控的终止端'>Z端配置<span class="cli_toTip">?</span></h4>
								<dcPortz @sendFormData_z='getFormData_z' :tit='vlanSel.label2'  ref='dc_z' ></dcPortz>
							</el-col>
							
						</el-col>
					</el-row>
					<h3 class="title_h3">第三步:其他配置</h3>
					<billing @sendTime='getTimeVal' ref='billingForm'></billing>
				</el-col>
				<el-col :span='5' class='pos_row'>
					<h3 class="tit_h3" >配置详情概览</h3>
					<el-form :model='creatFormDetails' ref='creatFormDetails' style='width: 100%;'label-width='120px'>
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
				</el-col>
			</el-col>
		</el-row>
	</div>
</template>
<script >
	
	import dcPort from'@/views/business/multi/multFile/dcPort'
	import dcPortz from'@/views/business/multi/multFile/dcPortz'
	
//	dcPortz
	
	import {datedialogFormat,getPortStatus} from '@/assets/js/index.js'
	
	import topForm from '@/views/business/pointTo/topForm'  //基本信息的配置
	import billing from '@/views/business/pointTo/billing'   //其他信息配置
//	import selVlan from '@/views/business/pointTo/selVlan'	//vlan的弹窗的选择
	export default{
		name:'dataInterconnection',
		components:{topForm,billing,dcPort,dcPortz},
		data(){
			return{
				token:'',
				vlanSel:{
					label2:'Z端VLAN',
					label1:'A端VLAN'
				},
				basic:{},
				editForm:{
					nodeName_a:'',
					endpoints_logic_port_id_a:'',
					vlan_a:'',

					nodeName_z:'',
					endpoints_logic_port_id_z:'',
					vlan_z:'',
					
					charge_time:'',//计费时间
					expiration_time:'',//过期时间
				},
				creatFormDetails:{
					//配置详情
					tenant_name:'',
					details_charge_time:'',
					details_expiration_time:'',
					bandwidth:'',
				},

			}
		},
		watch:{
			editForm:{
				handler(newVal,oldVal){
					console.log(newVal)
				},
				deep:true
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			
		},
		methods:{

			getFormData_a(msg){
				console.log(msg)
					
				this.editForm.nodeName_a=msg.nodeName
				this.editForm.endpoints_logic_port_id_a=msg.logic
				this.editForm.vlan_a=msg.vlan

			},
			getFormData_z(msg){
				console.log(msg)
				
				
				this.editForm.nodeName_z=msg.nodeName
				this.editForm.endpoints_logic_port_id_z=msg.logic
				this.editForm.vlan_z=msg.vlan
				
//				this.editForm={
//					nodeName_z:msg.nodeName,
//					endpoints_logic_port_id_z:msg.logic,
//					vlan_z:msg.vlan,
//				}
			},
			getVal(data){
				//获取基本的信息配置    topForm组件内的信息
				console.log(data);
				this.creatFormDetails.tenant_name=data.tenant_name;
				this.creatFormDetails.bandwidth=data.bandwidth;
				
				this.basic={
					name:data.specialName,
					tenant_id:data.tenant_id,
					charge_mode:data.billingType,
					bandwidth:data.bandwidth,
					description:data.describe,
				};
				console.log(this.basic)
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
			},
			reset(){
				this.$refs['creatFormDetails'].resetFields();
				this.$refs['newForm'].$refs['editForm'].resetFields()
				this.$refs['billingForm'].$refs['editForm'].resetFields();
				this.$refs['dc_a'].$refs['editForm'].resetFields();
				this.$refs['dc_z'].$refs['editForm'].resetFields();

			},
			submitBtn(){
				// newForm     基础的信息  dc_a   a端   dc_z   editForm
				let str=[this.$refs.dc_a.$refs.editForm,this.$refs.dc_z.$refs.editForm,this.$refs.newForm.$refs.editForm]
				
				
				str.forEach(ele => {
					ele.validate(valid => {
						if(valid){
							this.$confirm('确定要提交吗?','提示',{})
							.then(() => {
								console.log(this.editForm);
								console.log(this.basic)
								let para={
									name:this.basic.name,
									tenant_id:this.basic.tenant_id,
									charge_mode:this.basic.charge_mode,
									bandwidth:this.basic.bandwidth,
									charge_time:this.editForm.charge_time,
									expiration_time:this.editForm.expiration_time,
									description:this.basic.description,
									endpoints:[
										{
											name:'A端',
											node_id:this.editForm.nodeName_a,
											logic_port_id:this.editForm.endpoints_logic_port_id_a,
											vlan:this.editForm.vlan_a
										},{
											name:'Z端',
											node_id:this.editForm.nodeName_z,
											logic_port_id:this.editForm.endpoints_logic_port_id_z,
											vlan:this.editForm.vlan_z
										}
									]
								}
								console.log(para)
								this.$ajax.post('/vll/add_d2d_vll'+'?token='+this.token,para)
								.then(res => {
									if(res.status==200){
										if(res.data.status==0){
											this.$message({
												message:'开通成功!',
												type:'success'
											})
											this.reset();
										}else{
											this.$message({
												message:res.data.message,
												type:'warning'
											})
										}
									}
								}).catch(e => {
									console.log(e)
								})
							}).catch(() => {})
						}
					})
				})
				
			},
		}
	}
	
	
	
</script>
<style>
	
	
	
</style>