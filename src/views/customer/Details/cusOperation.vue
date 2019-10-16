<template>
	<div>

		<section >
			<el-row>
				<el-col :span='24'style='margin-left: 40px;'>
					<!--<el-col :span='12'>-->
						<el-form :model='customer' ref='customer' :rules='customerRules' v-loading='editLoading' label-width='95px'>
							<el-form-item label='创建时间'v-show='editOpera'>
								<el-input disabled v-model='customer.creation_time' class='ipt_sels'  ></el-input>
							</el-form-item>
							<el-form-item label='租户标识(公司名称)' prop='name'>
								<template>
									<el-input v-model='customer.name' class='ipt_sels' :disabled='!btnStatus'></el-input>
									<span class="cli_toTip" title="公司名称应该与客户签订合同的主题名称一致">?</span>	
								</template>
							</el-form-item>
							<el-form-item label='租户联系人'prop='contact'>
								<el-input v-model='customer.contact' class='ipt_sels'placeholder='请输入租户联系人':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item label='租户手机号'prop='mobile'>
								<el-input v-model='customer.mobile' class='ipt_sels'placeholder='请输入租户手机号':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item label='租户邮箱'prop='email'>
								<el-input v-model='customer.email' class='ipt_sels'placeholder='请输入租户邮箱':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item label='关联租户标识' v-show='false' prop='tenant_id'>
								<el-input v-model='customer.tenant_id' class='ipt_sels' disabled></el-input>
							</el-form-item>
							<!--<el-form-item label='租户标识' prop='name'>
								<el-select v-model='customer.name'class='ipt_sels' filterable  :disabled='!btnStatus'placeholder='请输入租户标识'>
									<el-option v-for='(item ,index) in tenantData'
										:value='item.value'
										:label='item.name'
										:key='index'></el-option>
								</el-select>
								
							</el-form-item>-->
							<el-form-item label='公司行业类型'>
								<template>
									<el-select v-model='customer.company_type':disabled='!btnStatus'class='ipt_sels'>
										<el-option v-for='(item,index) in industryType'
											:value='item.value'
											:label='item.label'
											:key='index'>									
										</el-option>
									</el-select>
									<span class="cli_toTip" title="按类型列表选择客户公司行业类型">?</span>
								</template>		
							</el-form-item>
							<el-form-item label='公司电话'>
								<el-input v-model='customer.phone' class='ipt_sels':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item label='公司地址'>
								<el-cascader
							      	size="large"
							      	:options="options"
							      	v-model="selectedOptions"
							      	@change="addressChange"class='ipt_sels':disabled='!btnStatus'>
							 	</el-cascader>	<br />
							 	<!--selectedOptions-->
								<el-input v-model='customer.extra' placeholder='请输入详细地址' class='ipt_sels':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item label='备注'>
								<el-input v-model='customer.description'placeholder='请输入客户标识'type="textarea" cols="4" class='ipt_sels':disabled='!btnStatus'></el-input>
							</el-form-item>
							<el-form-item v-show='btnStatus'>
								<!--添加-->
								<el-button type='primary' v-show='addOpera' @click='handleAdd'>保存</el-button>
								<!--编辑-->
								<el-button type='primary' v-show='!addOpera' @click='handleEdit'>保存</el-button>
								<el-button @click='goback'>返回</el-button>
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
					callback(new Error('请输入手机号'))
				}else if(!isvalidPhone(value)){
					callback(new Error('请输入正确的手机号'))
				}else{
					callback()
				}
			}
			var validEamil = (rule, value ,callback) => {
				if(!value){
					callback(new Error('请输入邮箱'))
				}else if(!isvalidEmail(value)){
					callback(new Error('请输入正确的邮箱'))
				}else{
					callback();
				}
			}
			return {
				//获对应的token
				token:'',
				//租户添加的按钮默认是显示的
				addOpera:true,
				editOpera:true,
				cusEditID:this.$route.query.id,
				addCustome:this.$route.query.name,
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
					name:[{ required: true, message: '请输入租户标识', trigger: 'blur' },
            			{ min: 2, max: 10, message: '长度在2到 10 个字符', trigger: 'blur' }],
            		contact:[{ required: true, message: '请输入租户联系人', trigger: 'blur' }],
            		email:[{ required: true, trigger: 'blur', validator: validEamil }],
     				mobile:[{ required: true, trigger: 'blur', validator: validPhone }],
     				company_name:[{ required: true, message: '请输入公司名称', trigger: 'blur' }]
//          		validEamil
				},
				editLoading:false,
				industryType:[
					{
						value:'云服务商',
						label:'云服务商'
					},{
						value:'IDC运用商',
						label:'IDC运用商'
					},{
						value:'政府客户',
						label:'政府客户'
					},{
						value:'行业客户',
						label:'行业客户'
					},{
						value:'网络提供商',
						label:'网络提供商'
					},{
						value:'其他',
						label:'其他'
					},
					
				],
				//三级联动
				options: regionData,		
				//城市的数据
				selectedOptions: [],
				//按钮部分的默认的时候，编辑和添加是显示的，详情的时候隐藏
				btnStatus:true,
				//时间默认的时候是隐藏的额
//				cusTimeStatus:false,
//				tenantData:[]
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			if(typeof this.tit !='undefined'&&(this.addCustome !=='添加' && typeof this.cusEditID =='undefined')){
				console.log('执行详情的界面');
				//设置成不可以编辑
				this.btnStatus=false;
				//传入对应的实参
				this.editOpera=true;
				this.getCusDetails(this.tit)
			}else if((typeof this.tit =='undefined'&& typeof this.cusEditID =='undefined')&&this.addCustome ==='添加'){
				console.log('进入可以添加的界面');
				this.btnStatus=true;
				this.addOpera=true;
				this.editOpera=false;
//				this.getTenant()
			}else if(typeof this.cusEditID !='undefined'&&(typeof this.tit =='undefined'&&this.addCustome !=='添加')){
				console.log('进入编辑的界面');
				this.btnStatus=true;
				this.addOpera=false;
				this.editOpera=true;
				//传入对应的实参
				this.getCusDetails(this.cusEditID)
			}
//			this.getTenant()
		},
		methods:{
			addressChange(arr) {
		        console.log(arr);
		        //获取城市区号
//		        console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
		        console.log(this.selectedOptions)
		    },
			goback(){
				this.$router.go(-1);
			},
//			getTenant(){
//				this.$ajax.get('/tenant/tenants'+'?token='+this.token)
//				.then(res => {
//					console.log(res)
//					if(res.status==200){
//						if(res.data.status==0){
//							this.tenantData=res.data.data.items
//						}
//					}
//				}).catch(e => {console.log(e)})
//			},
			handleAdd(){
				//添加租户的时候保存按钮
				console.log('执行添加保存的按钮');
				this.$confirm('确定要添加吗？','提示',{})
				.then(() => {
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
						console.log(res);
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'添加成功!',
									type:'success'
								})
								this.$refs["customer"].resetFields();
								this.$router.push('/customer/cus');
							}else{
								this.$message({
									message:res.data.message,
									type:'warning'
								})
							}
						}
					})
				}).catch(() => {})
			},
			handleEdit(){
				//租户编辑的时候保存按钮
				console.log('执行编辑保存按钮');
				this.$refs.customer.validate(valid => {
					if(valid){
						this.$confirm('确定要 修改吗?','提示',{})
						.then(() => {
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
								console.log(res);
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功!',
											type:'success'
										})
										this.$refs["customer"].resetFields();
										this.$router.replace('/customer/cus')
									}else{
										this.$message({
											message:res.data.messae,
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
			},
			//获取租户的详细的界面的信息
			getCusDetails(row){
				var _this=this;

				this.$ajax.get('/tenant/tenant_info/'+row+'?token='+this.token)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							this.editLoading=false;
							console.log(res)
							//datedialogFormat
							res.data.data.creation_time=datedialogFormat(res.data.data.creation_time);
							this.customer=res.data.data;
//							creation_time
							
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

<style>
</style>