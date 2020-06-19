<template>
	<div v-loading='load'>
		<span class="title_h3"style="font-size: 12px;">{{$t('business.c2ctoDCTitle1')}}</span>
		<el-row>
			<el-col :span='24'>
				<el-col :span='18'>
					<h3 class="title_h3">{{$t('business.c2cStep1')}}</h3>
					<topForm @formVal='getVal' ref='newForm'></topForm>
					<h3 class="title_h3">{{$t('business.step2')}}</h3>
					<el-row>
						<el-col :span='24'>
							<el-col :span='12'>
								<h4 class="title_h4">{{$t('business.c2cAcloud')}}</h4>	
								<shared-cloun @sendClounbasic_a='getsharedCloun_a' @sendClounList='sendClounList_a' ref='editForm_a'></shared-cloun>
							</el-col>
							<el-col :span='12'>
								<h4 class="title_h4">{{$t('business.c2cZcloud')}}<span class="cli_toTip" >?</span></h4>
								<shared-cloun  @sendClounbasic_z='getsharedCloun_z' @sendClounList='sendClounList_z' ref='editForm_z'></shared-cloun>
							</el-col>
						</el-col>
					</el-row>

					<h3 class="title_h3">{{$t('business.step3')}}</h3>
					<billing  @sendTime='getTimeVal' ref='billingForm'></billing>
				</el-col>
				<el-col :span='5'  class='pos_row'>
					<!--<el-row>
						<el-col :span='24'>-->
							<!--<span class="tit_h3">配置详情概览 </span>-->
							<h3 class="tit_h3" >{{$t('business.conDetails')}}</h3>
							<el-form :model='creatFormDetails' ref='creatFormDetails' style='width: 100%;'label-width='125px'>
								<el-form-item :label='$t("business.c2cAshared")+"："' class='label_tit' prop='tenant_name'>
									<template >
										<span>{{creatFormDetails.sharedCloun_a}}</span>
									</template>
								</el-form-item>
								<el-form-item :label='$t("business.c2cZshared")+"："' class='label_tit' prop='tenant_name'>
									<template >
										<span>{{creatFormDetails.sharedCloun_z}}</span>
									</template>
								</el-form-item>
								<el-form-item :label='$t("Public.tenant")+"："' class='label_tit' prop='tenant_name'>
									<template >
										<span>{{creatFormDetails.tenant_name}}</span>
									</template>
								</el-form-item>
								<el-form-item :label='$t("Public.billTime")+"："'  class='label_tit' prop='details_charge_time'>
									<template >
										<span>{{creatFormDetails.details_charge_time}}</span>
									</template>
								</el-form-item>
								<el-form-item :label='$t("Public.expTime")+"："'  class='label_tit' prop='details_expiration_time'>
									<template >
										<span>{{creatFormDetails.details_expiration_time}}</span>
									</template>
								</el-form-item>
								<el-form-item :label='$t("Public.bandW")+"："'  class='label_tit' prop='bandwidth'>
									<template>
										<span>{{creatFormDetails.bandwidth}}</span>
										<span>Mbps</span>
									</template>
								</el-form-item>
								<el-form-item>
									<el-button size='small' @click.native="reset">{{$t('topFilters.reset')}}</el-button>
					 				<el-button size='small' type='primary' @click='submitBtn'>{{$t('tabOperation.Submit')}}</el-button>
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
	import {datedialogFormat} from '@/assets/js/index.js'
	import sharedCloun from '@/views/business/multi/multFile/sharedCloun'
	
	import topForm from '@/views/business/pointTo/topForm'
	import billing from '@/views/business/pointTo/billing'

	export default{
		name:'clounInterconnection',
		components:{topForm,billing,sharedCloun},
		data(){
			return{
				token:'',
				basic:{},//基本信息的配置
				editForm:{
					sharedCloun_a:'',
					clounDoc_a:'',
					target_a:'',
					
					sharedCloun_z:'',
					clounDoc_z:'',
					target_z:'',
					
					charge_time:null,
					expiration_time:null
				},
				
				selectFormA:{},//A云对接获取后转换后的form表单

				selectFormZ:{},//Z云对接获取后转换后的form表单

				creatFormDetails:{
					//配置详情
					tenant_name:'',
					details_charge_time:'',
					details_expiration_time:'',
					bandwidth:'',
					sharedCloun_a:'',
					sharedCloun_z:'',
					
				},
				
				nodeData:[],
				logicData:[],
				load:false
			}
		},
		
		created(){
			this.token=sessionStorage.getItem('token');
//			this.getFormData();
//			this.getSelectData()
		},
		methods:{
			getsharedCloun_a(msg){
				this.editForm.sharedCloun_a=msg.cloun
				this.editForm.clounDoc_a=msg.clounDock
				this.editForm.target_a=msg.targetRegion
				this.creatFormDetails.sharedCloun_a=msg.cloun
			},
			sendClounList_a(list){
				this.selectFormA=Object.assign({},list)
			},
			
			getsharedCloun_z(msg){
				this.editForm.sharedCloun_z=msg.cloun
				this.editForm.clounDoc_z=msg.clounDock
				this.editForm.target_z=msg.targetRegion;
				this.creatFormDetails.sharedCloun_z=msg.cloun
			},
			sendClounList_z(list){
				this.selectFormZ=Object.assign({},list)
			},
			reset(){
				this.$refs['editForm_a'].$refs['editForm'].resetFields();
				this.$refs['editForm_z'].$refs['editForm'].resetFields();
				
				this.$refs['creatFormDetails'].resetFields();
				this.$refs['newForm'].$refs['editForm'].resetFields()
				this.$refs['billingForm'].$refs['editForm'].resetFields();
			},
			submitBtn(){
				var obj_a={},obj_z={};
				obj_z={
					name:'Z端',
					cloud_type:this.editForm.sharedCloun_z,
					region:this.editForm.target_z,
					cloud_config_id:this.editForm.clounDoc_z
				}
				obj_a={
					name:'A端',
					cloud_type:this.editForm.sharedCloun_a,
					region:this.editForm.target_a,
					cloud_config_id:this.editForm.clounDoc_a
				}
				let cloun_a=Object.assign({},obj_a,this.selectFormA)
				let cloun_z=Object.assign({},obj_z,this.selectFormZ)
				
				
				var cloud_endpoint=[];
				cloud_endpoint.push(cloun_a,cloun_z);

				var para={
					name:this.basic.name,
					tenant_id:this.basic.tenant_id,
					charge_mode:this.basic.charge_mode,
					bandwidth:this.basic.bandwidth,
					description:this.basic.description,
					charge_time:this.editForm.charge_time,
					expiration_time:this.editForm.expiration_time,
					cloud_endpoints:cloud_endpoint	
				}
				let str=[this.$refs.editForm_a.$refs.editForm,this.$refs.editForm_z.$refs.editForm,this.$refs.newForm.$refs.editForm]
				
				str.forEach(ele => {
					ele.validate(valid => {
						if(valid){
							this.$confirm(this.$t('confirm.conAdd'),this.$t('confirm.tooltip'),{})
							.then(() => {
								this.loading=true;
								this.$ajax.post('/vll/add_c2c_vll'+'?token='+this.token,para)
								.then(res => {
									this.loading=false;
									if(res.status==200){
										if(res.data.status==0){
											this.$confirm(this.$t('business.busiSubmitS'),this.$t('confirm.tooltip'),{
												confirmButtonText: this.$t('business.continueOpen'),
										        cancelButtonText: this.$t('business.goToSee'),
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
								}).catch(e => {
									this.loading=false;
									
									console.log(e)})
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

			getTimeVal(val){
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
		}
	}
</script>

<style>
	
</style>