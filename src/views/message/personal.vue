<template>
	<div>
		<h3 class="title_h3 colorRed">{{$t("Public.note")}}</h3>
		<section>
			<el-row>
				<el-col :span='24'>
					<el-form label-width='200px' :model='personalForm' ref='personalForm':rules='personalFormRules' loading='infoLoading'>
						<el-form-item :label='$t("Public.creatime")+"："'>
							<span >
								{{ personalForm.creation_time | timeFormat}}
							</span>
						</el-form-item>
						<el-form-item :label='$t("Public.accountRole")+"："'>
							<el-input  v-model='personalForm.role_name'class='ipt'disabled></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.accountName")+"："'>
							<el-input  v-model='personalForm.name'class='ipt'disabled></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.fullName")+"："'>
							<el-input  v-model='personalForm.real_name'class='ipt'disabled></el-input>
						</el-form-item>
						<el-form-item :label='$t("customer.phone")+"："'>
							<span >{{ personalForm.mobile | filIphone }}</span>
							<span class="cur_span spn_color marL20 " @click="editIphone(personalForm.mobile)">{{$t("Public.edit")}}</span>
						</el-form-item>
						<el-form-item :label='$t("customer.email")+"："'>
							<span >{{personalForm.email |filEmail }}</span>
							<span class="cur_span spn_color marL20 " @click="editEmail(personalForm.email)">{{$t("Public.edit")}}</span>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			
			<!--iphone email  edit dialog-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync="dialogFormVisible"
				:close-on-click-modal="false"  v-loading='editLoading'@close='close'>
				<el-steps :active="active" finish-status="success">
				  	<el-step v-for='(item ,index) in stepData' :key='index' 
				  		:title="item.value" :label='item.label'></el-step>
				</el-steps>
				<!--operation iphone-->
				<div v-if='dialogStatus === "iphone"'>
					<h3 v-if='active === 1' style="text-align: center;margin-bottom: 10px;">
						{{$t('Public.sendCodeIphone')}} {{ iphoneForm.oldIphone | filIphone }}
					</h3>
					<el-form :model='iphoneForm' ref='iphoneForm' :rules='formRules'label-width='200px'>
						<template v-if='active ===1'>
							<el-form-item :label='$t("Public.iphoneCode")+"："' prop='oldCode'>
								<el-input class='ipt' v-model='iphoneForm.oldCode'></el-input>
								<el-button  type='primary' size='small'  :disabled='btnStatus'@click='getIphoneCode({type:"old"})'>{{timeFirst}}</el-button>
							</el-form-item>
						</template>
						
						<template v-else>
							<el-form-item :label='$t("Public.newIphone")+"："' prop='newIphone'>
								<el-input class='ipt' v-model='iphoneForm.newIphone'></el-input>
								
							</el-form-item>
							<el-form-item :label='$t("Public.iphoneCode")' prop='newCode'>
								<el-input class='ipt' v-model='iphoneForm.newCode'></el-input>
								<el-button  type='primary' size='small'  :disabled='timeNew==60?false:true'@click='getIphoneCode({type:"new",mobile:iphoneForm.newIphone})'>{{timeSecond}}</el-button>
							</el-form-item>
						</template>
					</el-form>
					<div style="text-align: center;">
						<template>
							<el-button v-if='active == 1' type='primary' size='small' @click='nextIphone'>{{$t("Public.next")}}</el-button>
							<el-button v-else type='primary' size='small' @click='subIphone'>{{$t('tabOperation.Submit')}}</el-button>
						</template>
					</div>
				</div>
				<!--operation email-->
				<div v-else>
					<h3 v-if='active === 1' style="text-align: center;margin-bottom: 10px;">
						{{$t("Public.sendEmailCode")}}{{ emailForm.oldEmail | filEmail }}
					</h3>
					<el-form :model='emailForm' ref='emailForm' :rules='formRules'label-width='200px'>
						<template v-if='active ===1'>
							<el-form-item :label='$t("Public.emailCode")' prop='oldCode'>
								<el-input class='ipt' v-model='emailForm.oldCode'></el-input>
								<el-button  type='primary' size='small'  :disabled='btnStatus'@click='getEmailCode({type:"old"})'>{{timeFirst}}</el-button>
							</el-form-item>
						</template>
						
						<template v-else>
							<el-form-item :label='$t("Public.newEmail")' prop='newEmail'>
								<el-input class='ipt' v-model='emailForm.newEmail'></el-input>
								
							</el-form-item>
							<el-form-item :label='$t("Public.emailCode")' prop='newCode'>
								<el-input class='ipt' v-model='emailForm.newCode'></el-input>
								<el-button  type='primary' size='small'  :disabled='timeNew==60?false:true'@click='getEmailCode({type:"new",email:emailForm.newEmail})'>{{timeSecond}}</el-button>
							</el-form-item>
						</template>
					</el-form>
					<div style="text-align: center;">
						<template>
							<el-button v-if='active == 1' type='primary' size='small' @click='nextEmail'>{{$t("Public.next")}}</el-button>
							<el-button v-else type='primary' size='small' @click='subEmail'>{{$t('tabOperation.Submit')}}</el-button>
						</template>
					</div>
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>
	import { isvalidPhone ,isvalidEmail} from '@/assets/js/index.js'
 	export default{
		data(){
			var validPhone  = (rule,value,callback) => {
				console.log(this.spaStatus)
				if(!value){
					callback(new Error(this.$t('customer.plaPho')))
				}else if(!isvalidPhone(value)){
					callback(new Error(this.$t('customer.plaRightPho')))
				}else if( this.iphoneForm.oldIphone === value  ){
					callback(new Error(this.$t('Public.newIphoneReset')))
				}
				else{
					callback()
				}
			};
			var validEmail = (rule,value,callback) => {
				if(!value ){
					console.log(1)
					callback(new Error(this.$t('customer.plaEma')))
				}else if( !isvalidEmail(value) ){
					console.log(2)
					
					callback(new Error(this.$t('customer.plaRightEma')))
				}else if( this.emailForm.oldEmail === value  ){
					callback(new Error(this.$t('Public.newEmailReset')))
				}else{
					callback()
				}
			};
			return {
				token:sessionStorage.getItem('token'),
				personalForm:{},
				personalFormRules:{},
				textMap:{
					iphone:this.$t('Public.iphoneEdit'),
					email:this.$t('Public.emailEdit')
				},
				dialogStatus:'',
				spaStatus:'',
				dialogFormVisible:false,
				
				editLoading:false,
				active:1,
				iph:[
					{value:this.$t('Public.Authentication'),label:this.$t('Public.Authentication')},
					{value:this.$t('Public.changePhone'),label:this.$t('Public.changePhone')},
				],
				ema:[
					{value:this.$t('Public.Authentication'),label:this.$t('Public.Authentication')},
					{value:this.$t('Public.changeEmail'),label:this.$t('Public.changeEmail')},
				],
				status:true,//当为true的时候这个时候默认显示的是电话的数据信息，否则是邮箱的
				// iphone form
				iphoneForm:{
					oldIphone:'',
					oldCode:'',
					newIphone:'',
					newCode:''
				},
				// email form
				emailForm:{
					oldEmail:'',
					oldCode:'',
					newEmail:'',
					newCode:''
				},
				// iphoen email rules
				formRules:{
					oldCode:[{ required: true, message: this.$t('Public.plaCode') ,trigger: 'blur' }],
					newEmail:[{ required: true,  validator: validEmail,trigger: 'blur' }],
					newCode:[{ required: true, message: this.$t('Public.plaCode') ,trigger: 'blur' }],
					newIphone:[{ required: true, validator: validPhone ,trigger: 'blur' }],
				},
				time:60,
				timeNew:60,
				timeFirst:this.$t('Public.getCode'),
				timeSecond:this.$t('Public.getCode'),
				infoLoading:false
			};
		},
		filters:{
			//定义局部的过滤器
			filIphone(value){
				var result ='';
				if (value == undefined){
					result=''
				}else{
					var strLength=value.length;
					result = value.substring(0,3)+'***'+value.substring(strLength-4);
				}
				return result;
			},
			filEmail(value){
				var result ='';
				if (value == undefined){
					result=''
				}else{
					var sliceEnd=value.indexOf('@');
					result =value.substring(0,2)+'***'+value.substring( sliceEnd-3)
				}
				return result;
			}
		},
		created(){
			this.myself()
		},
		computed:{
			stepData(){
				if(this.status){
					return this.iph;
				}else{
					return this.ema
				}
			},
			btnStatus(){
				if(this.time == 60){
					return false
				}else{
					return true
				}
			},
		},
		methods:{
			close(){
				if(this.$refs['iphoneForm'] !==undefined){
					this.$nextTick(() => {
						this.$refs['iphoneForm'].resetFields();
					})
				}
				if(this.$refs['emailForm'] !==undefined){
					this.$nextTick(() => {
						this.$refs['emailForm'].resetFields();
					})
				}
				this.active = 1; 
			},
			myself(){
				this.infoLoading=true;
				this.$ajax.get('/public/get_me'+'?token='+this.token)
				.then(res => {
					this.infoLoading=false;
					if(res.status == 200 && res.data.status == 0){
						var str=res.data.data;
						str.role_name=str.role.name;
						this.personalForm =str;
					}
				})
				.catch(e => console.log(e))
			},
			getIphoneCode:function(para){
				/**
				 * 获取手机验证码：
				 * 		旧手机号
				 * 		新手机号
				 * {para}形参  
				 * */
				let that =this;
				that.$ajax.post('/public/send_mobile_code'+'?token='+that.token,para)
				.then(res => {
					if(res.status == 200){
						if(res.data.status == 0){
							if(that.active === 1){
								that.time=60;
								let timer=setInterval(() => {
									--that.time;
									that.timeFirst=this.$t("Public.againSend")+'('+that.time+')s';
									if(that.time == 0){
										that.timeFirst=this.$t('Public.getCode');
										clearInterval(timer);
										that.time=60
									}
								} ,1000)
							}else{
								that.timeNew=60;
								let timerNew=setInterval(() => {
									--that.timeNew;
									that.timeSecond=this.$t("Public.againSend")+'('+that.timeNew+')s';
									if(that.timeNew == 0){
										that.timeSecond=this.$t('Public.getCode');
										clearInterval(timerNew);
										that.timeNew=60
									}
								} ,1000)
							}
						}
					}
				})
				.catch(e => console.log(e))
			},
			nextIphone(){
				this.$refs.iphoneForm.validate(valid => {
					if(valid){
						var para={
							code:this.iphoneForm.oldCode
						};
						this.$ajax.post('/public/check_mobile_code'+'?token='+this.token,para)
						.then(res => {
							if(res.status == 200){
								if(res.data.status == 0){
									if (this.active++ > 2) this.active = 2;
								}
							}
						})
						.catch(e => console.log(e))
					}
				})
				
			},
			// iphone  submit
			subIphone(){
				
				this.$refs.iphoneForm.validate(valid => {
					if(valid){
						this.editLoading=true;
						var para={
							mobile:this.iphoneForm.newIphone,
							code:this.iphoneForm.newCode
						};
						this.$ajax.put('/public/edit_my_mobile'+'?token='+this.token,para)
						.then(res => {
							this.editLoading=false;
							if(res.status == 200){
								if(res.data.status == 0){
									this.$message({
										message:this.$t('tooltipMes.editSuccess'),
										type:'success'
									})
									this.dialogFormVisible=false;
									this.$refs['iphoneForm'].resetFields();
									this.myself();
								}
							}
						})
						.catch(e => console.log(e))
					}
				})				
			},
			editIphone(iphone){
				//修改手机
				this.dialogFormVisible=true;
				this.dialogStatus='iphone';
				this.status=true;
				this.active=1;
				this.iphoneForm.oldIphone=iphone;
				this.$nextTick(() => {
					this.$refs['iphoneForm'].resetFields();
				})
			},
			editEmail(email){
				//修改邮箱
				this.dialogFormVisible=true;
				this.dialogStatus='email';
				this.status=false;
				this.active=1;
				this.emailForm.oldEmail=email;
				this.$nextTick(() => {
					this.$refs['emailForm'].resetFields();
				})

			},
			nextEmail(){
				var para ={
					code:this.emailForm.oldCode
				}
				this.$refs.emailForm.validate(valid => {
					if(valid){
						this.$ajax.post('/public/check_email_code'+'?token='+this.token,para)
						.then(res => {
							if(res.status == 200 ){
								if(res.data.status == 0){
									if (this.active++ > 2) this.active = 2;
								}
							}
						}).catch(e => console.log(e))
					}
				})
			},
			subEmail(){
				
				var para={
					email:this.emailForm.newEmail,
					code:this.emailForm.newCode
				};
				this.$refs.emailForm.validate(valid => {
					if(valid){
						this.editLoading=true;
						this.$ajax.put('/public/edit_my_email'+'?token='+this.token,para)
						.then(res => {
							this.editLoading=false;
							if(res.status == 200){
								if(res.data.status == 0){
									this.$message({
										message:this.$t('tooltipMes.editSuccess'),
										type:'success'
									})
									this.dialogFormVisible=false;
									this.$refs['emailForm'].resetFields();
									this.myself();
								}
							}
						}).catch(e => console.log(e))
					}
				})
			
			},
			getEmailCode:function(para){

				let that=this;
				that.$ajax.post('/public/send_email_code'+'?token='+that.token,para)
				.then(res => {
					if(res.status == 200){
						if(res.data.status == 0){
							if(that.active === 1){
								that.time=60;
								let timer=setInterval(() => {
									--that.time;
									that.timeFirst=this.$t('Public.againSend')+'('+that.time+')s';
									if(that.time == 0){
										that.timeFirst=this.$t('Public.getCode');
										clearInterval(timer);
										that.time=60
									}
								} ,1000)
							}else{
								that.timeNew=60;
								let timerNew=setInterval(() => {
									--that.timeNew;
									that.timeSecond=this.$t('Public.againSend')+'('+that.timeNew+')s';
									if(that.timeNew == 0){
										that.timeSecond=this.$t('Public.getCode');
										clearInterval(timerNew);
										that.timeNew=60
									}
								} ,1000)
							}
							
						}
					}
				}).catch(e => console.log(e))
			}
		}
	}
</script>
