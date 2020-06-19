<template>
	<div v-loading='load'>
		<span class="title_h3"style="font-size: 12px;">{{$t('business.d2ctitle')}}</span>
		<el-row>
			<el-col :span='24'>
				<el-col :span='18'>
					<h3 class="title_h3">{{$t('business.d2cStep1')}} </h3>
					<topForm @formVal='getVal' ref='basicForm'></topForm>
					<h3 class="title_h3">{{$t('business.step2')}}</h3>
					<el-row>
						<el-col :span='24'>
							<el-col :span='12'>
								<h4 class="title_h4">{{$t('business.c2cAshared')}}</h4>
								<shared-cloun @sendClounbasic='getSharedCloun'  @sendClounList='getClounList' ref='editForm'></shared-cloun>
							</el-col>
							<el-col :span='12'>
								<h4 class="title_h4":title="$t('business.ztooltip')">{{$t('business.zDc')}}<span class="cli_toTip" >?</span></h4>
								<dc-port @sendFormData='getDcPort' ref='dcPort'></dc-port>
							</el-col>
						</el-col>
					</el-row>
					<h3 class="title_h3">{{$t('business.step3')}}</h3>
					<billing @sendTime='getTimeVal' ref='billingForm'></billing>
				</el-col>
				<el-col :span='5'  class='pos_row'>
					<!--<el-row>
						<el-col :span='24'>-->
							<h3 class="tit_h3" >{{$t('business.conDetails')}}</h3>
							<el-form :model='creatFormDetails' ref='creatFormDetails' style='width: 100%;'label-width='125px'>
								<el-form-item :label='$t("Public.shardCloud")+"："' class='label_tit' prop='tenant_name'>
									<template >
										<span>{{creatFormDetails.sharedCloun}}</span>
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
					validate:'',//验证
					charge_time:null,
					expiration_time:null
				},
				dcForm:{},
				clounForm:{},
				creatFormDetails:{
					//配置详情
					tenant_name:'',
					details_charge_time:'',
					details_expiration_time:'',
					bandwidth:'',
					sharedCloun:''
				},
				load:false
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			console.log(123456)
		},
		methods:{
			getDcPort(msg){

				this.dcForm={
					name:'Z端',
					nodeName:msg.nodeName,
					logic_z:msg.logic,
					vlan:msg.vlan
				}
			},
			getClounList(msg){
				this.clounList=Object.assign({},msg)
			},
			getSharedCloun(msg){
				console.log(msg)
				this.clounForm={
					sharedCloun:msg.cloun,
					target:msg.targetRegion,
					clounDoc:msg.clounDock
				}
				this.creatFormDetails.sharedCloun=msg.cloun
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
					name:'A端',
					cloud_type:this.clounForm.sharedCloun,
					region:this.clounForm.target,
					cloud_config_id:this.clounForm.clounDoc,
				}
				var a_cloun=Object.assign({},a_cloun_top,this.clounList);//clounList
				var endpoint={
					name:'Z端',
					node_id:this.dcForm.nodeName,
					logic_port_id:this.dcForm.logic_z,
					vlan:this.dcForm.vlan
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
				//验证两个form表单同时验证通过的时候
				let str=[this.$refs.editForm.$refs.editForm,this.$refs.dcPort.$refs.editForm,this.$refs.basicForm.$refs.editForm];

				str.forEach(ele => {
					ele.validate((valid) => {
						if(valid){
							this.$confirm(this.$t('confirm.conAdd'),this.$t('confirm.tooltip'),{})
							.then(() => {
								this.load=true;
								this.$ajax.post('/vll/add_d2c_vll'+'?token='+this.token,para)
								.then(res =>{
									this.load=false;
//									console.log(res);
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
									this.load=false;
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
			getTime(val){
				//获取子组件传过来的时间
				this.editForm.charge_time=val.billing_time/1000
				this.editForm.expiration_time=val.overdue_time/1000
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