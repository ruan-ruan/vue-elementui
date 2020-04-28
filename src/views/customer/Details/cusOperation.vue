<template>
	<div>
		<section >
			<el-row>
				<el-col :span='24'style='margin-left: 40px;'>
						<el-form :model='customer' ref='customer' :rules='customerRules' v-loading='editLoading' label-width='210px'>
							<el-form-item :label='$t("Public.creation")+"："'v-if='!addCustome'>
								<template>
									{{ customer.creation_time | timeFormat }}
								</template>
							</el-form-item>
							<el-form-item :label='$t("customer.tenantName")+"："' prop='name'>
								<template>
									<el-input v-model='customer.name' class='ipt_sels' :disabled='!btnStatus'></el-input>
									<span class="cli_toTip" :title="$t('customer.tooltip1')">?</span>	
								</template>
							</el-form-item>
							<el-form-item :label='$t("customer.tenantUser")+"："'prop='contact'>
								<el-input v-model='customer.contact' class='ipt_sels':placeholder='$t("customer.plaTenantUser")':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item :label='$t("customer.tenantPho")+"："'prop='mobile'>
								<el-input v-model='customer.mobile' class='ipt_sels':placeholder='$t("customer.plaTenantPho")':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item :label='$t("customer.email")+"："'prop='email'>
								<el-input v-model='customer.email' class='ipt_sels':placeholder='$t("customer.plaTenantEma")':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item :label='$t("customer.assTenant")+"："' v-show='false' prop='tenant_id'>
								<el-input v-model='customer.tenant_id' class='ipt_sels' disabled></el-input>
							</el-form-item>
							<el-form-item :label='$t("customer.comporateType")+"："'>
								<template>
									<el-select v-model='customer.company_type':disabled='!btnStatus'class='ipt_sels'>
										<el-option v-for='(item,index) in industryType'
											:value='item.value'
											:label='item.label'
											:key='index'>									
										</el-option>
									</el-select>
									<span class="cli_toTip" :title="$t('customer.plaComporate')">?</span>
								</template>		
							</el-form-item>
							<el-form-item :label='$t("customer.comporatePho")+"："'>
								<el-input v-model='customer.phone' class='ipt_sels':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item :label='$t("customer.comporateAddress")+"："'>
								<el-cascader
							      	size="large"
							      	:options="options"
							      	v-model="selectedOptions"
							      	@change="addressChange"class='ipt_sels':disabled='!btnStatus'>
							 	</el-cascader>	<br />

								<el-input type='textarea' v-model='customer.extra' :placeholder='$t("customer.plAddress")' class='ipt_sels':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item :label='$t("Public.description")+"："'>
								<el-input v-model='customer.description':placeholder='$t("customer.plaMax")'type="textarea"
									maxlength="200"cols="4" class='ipt_sels':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item v-show='btnStatus'class='tc_L'>
								<el-button size='small' @click='goback'>{{$t('Public.goback')}}</el-button>
								<!--添加-->
								<el-button size='small' type='primary' v-if='addCustome' @click='handleAdd'>{{$t('tabOperation.save')}}</el-button>
								<!--编辑-->
								<el-button size='small' type='primary' v-if='cusEditID' @click='handleEdit'>{{$t('tabOperation.save')}}</el-button>

							</el-form-item>
						</el-form>
					<!--</el-col>-->
				</el-col>
			</el-row>
		</section>
		
	</div>
</template>

<script>


	import { regionData,CodeToText } from 'element-china-area-data'
	import {isvalidPhone,isvalidEmail,datedialogFormat} from '@/assets/js/index.js';
	export default{
		name:'cusOperation',
		//这个是接收的是详情的时候的id
		props:['tit'],
		data(){
			var validPhone = (rule,value,callback) => {
				if(!value){
					callback(new Error(this.$t('customer.plaPho')))
				}else if(!isvalidPhone(value)){
					callback(new Error(this.$t('customer.plaRightPho')))
				}else{
					callback()
				}
			}
			var validEamil = (rule, value ,callback) => {
				if(!value){
					callback(new Error(this.$t('customer.plaEma')))
				}else if(!isvalidEmail(value)){
					callback(new Error(this.$t('customer.plaRightEma')))
				}else{
					callback();
				}
			}
			return {
				//获对应的token
				token:'',

				cusEditID:this.$route.query.id, //编辑
				addCustome:this.$route.query.name,//添加
				//列表的主要的信息
				customer:{
					name:'',
					contact:'',
					email:'',
					mobile:'',
					company_name:'',
					company_type:'',
					phone:'',
					province:'',
					city:'',
					district:'',
					extra:'',
					description:'',
					creation_time:''
					
				},
				customerRules:{
					name:[{ required: true, message: this.$t('customer.plaTenant'), trigger: 'blur' }],
            		contact:[{ required: true, message: this.$t('customer.plaTenantUser'), trigger: 'blur' }],
            		email:[{ required: true, trigger: 'blur', validator: validEamil }],
     				mobile:[{ required: true, trigger: 'blur', validator: validPhone }],
     				company_name:[{ required: true, message: this.$t('customer.plaComporate'), trigger: 'blur' }]
//          		validEamil
				},
				editLoading:false,
				industryType:[
					{
						value:'云服务商',
						label:this.$t('customer.cloud')
					},{
						value:'IDC运用商',
						label:this.$t('customer.idc')
					},{
						value:'政府客户',
						label:this.$t('customer.government')
					},{
						value:'行业客户',
						label:this.$t('customer.industry')
					},{
						value:'网络提供商',
						label:this.$t('customer.network')
					},{
						value:'其他',
						label:this.$t('customer.other')
					},
					
				],
				//三级联动
				options: regionData,		
				//城市的数据
				selectedOptions: [],
				//按钮部分的默认的时候，编辑和添加是显示的，详情的时候隐藏
			}
		},
		computed:{
			btnStatus(){
				if(typeof this.tit =='string'){
					return false
				}else {
					return true;
				}
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			if(typeof this.tit ==='string'){
//				('执行详情的界面');
				this.getCusDetails(this.tit)
			}

			if(typeof this.cusEditID ==='string'){
//				('进入编辑的界面');
				this.getCusDetails(this.cusEditID)
			}
		},
		methods:{
			addressChange(arr) {
		        //获取城市区号
		    },
			goback(){
				this.$router.go(-1);
			},
			handleAdd(){
				//添加租户的时候保存按钮
				var para={
					name:this.customer.name,
					contact:this.customer.contact,
					email:this.customer.email,
					mobile:this.customer.mobile,
					company_name:this.customer.company_name,
					company_type:this.customer.company_type,
					phone:this.customer.phone,
					province:this.selectedOptions[0],
					city:this.selectedOptions[1],
					district:this.selectedOptions[2],
					extra:this.customer.extra,
					description:this.customer.description
				}
				
				this.$ajax.post('/tenant/add_tenant'+"?token="+this.token,para)
				.then(res => {

					if(res.status==200){
						if(res.data.status==0){
							this.$message({
								message:this.$t('tooltipMes.addSuccess'),
								type:'success'
							})
							this.$refs["customer"].resetFields();
							this.$router.push('/customer/cus');
						}
					}
				})
			},
			handleEdit(){
				//租户编辑的时候保存按钮

				this.$refs.customer.validate(valid => {
					if(valid){

						let  para={
							name:this.customer.name,
							contact:this.customer.contact,
							email:this.customer.email,
							mobile:this.customer.mobile,
							company_name:this.customer.company_name,
							company_type:this.customer.company_type,
							phone:this.customer.phone,
							province:this.selectedOptions[0],
							city:this.selectedOptions[1],
							district:this.selectedOptions[2],
							extra:this.customer.extra,
							description:this.customer.description
						}
						
						this.$ajax.put('/tenant/edit_tenant/'+this.customer.id+'?token='+this.token,para)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.editSuccess'),
										type:'success'
									})
									this.$refs["customer"].resetFields();
									this.$router.replace('/customer/cus')
								}
							}
						}).catch(e => {
							console.log(e)
						})
					}
				})
			},
			//获取租户的详细的界面的信息
			getCusDetails(row){
				var _this=this;
				this.editLoading=true;
				this.$ajax.get('/tenant/tenant_info/'+row+'?token='+this.token)
				.then(res => {

					if(res.status==200){
						if(res.data.status==0){
							this.editLoading=false;
							this.customer=res.data.data;

							this.selectedOptions.push(res.data.data.province,res.data.data.city,res.data.data.district);

						}
					}
				}).catch(e => {
					console.log(e)
				})
			}
		}
	}
</script>

