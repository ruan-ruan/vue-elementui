<template>
	<div>
		<goback></goback>
		<section class="container">
			<el-form  ref='editForm' :model='editForm':rules='formRules' label-width='200px'>
				<el-form-item :label='$t("nav.accountNumber")+"："'>
					<span >{{userName}}</span>
				</el-form-item>
				<el-form-item :label='$t("nav.oldPwd")+"："' prop='oldPassword'>
					<el-input v-model='editForm.oldPassword' type='password' class='ipt'></el-input>
				</el-form-item>
				<el-form-item :label='$t("nav.newPwd")+"："' prop='newPassword'>
					<el-input v-model='editForm.newPassword'type='password' class='ipt'></el-input>
				</el-form-item>
				<el-form-item :label='$t("nav.conNewPwd")+"："' prop='conPassword'>
					<el-input v-model='editForm.conPassword'type='password' class='ipt'></el-input>
				</el-form-item>
				<el-form-item style='margin-left: 50px;'>
					<el-button size='small' type='primary' @click='editFormCon'>{{$t('tabOperation.Submit')}}</el-button>
					<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
				</el-form-item>
			</el-form>
		</section>
	</div>
</template>

<script>
	
	import goback from '@/components/goback'
	export default{
		name:'changePsw',
		components:{
			goback
		},
		data(){
			var regex=new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/)
			var validatePass=(rule,value,callback)=> {
				if(value===''){
					callback(new Error(this.$t('nav.plaOldPwd')))
				}else if(value!==this.oldPsd){
					callback(new Error(this.$t('nav.plaRightOldPwd')))
				}else{
					callback()
				}
			};
			var validateNewPsd=(rule,value,callback) => {
				if(value===''){
					callback(new Error(this.$t('nav.plaNewPwd')))
				}else if(!regex.test(this.editForm.newPassword)){
					callback(new Error(this.$t('nav.plaNewPwdRules')))
				}else{
					callback()
				}
			};
			var validateConPsd = (rule,value,callback) => {
				if(value ===''){
					callback(new Error(this.$t('nav.againPwd')))
				}else if(value !==this.editForm.newPassword){
					callback(new Error(this.$t('nav.aginPwdNot')))
				}else{
					callback()
				}
			}
			return{
				token:'',
				userName:'',
				ps:'',
				oldPsd:'',
				editForm:{
					oldPassword:'',
					newPassword:'',
					conPassword:''
				},
				editLoading:false,
				formRules:{
					oldPassword:[{required: true, validator: validatePass, trigger: 'blur' }],
					newPassword:[{required: true, validator: validateNewPsd, trigger: 'blur' }],
					conPassword:[{required: true, validator: validateConPsd, trigger: 'blur' }],
				}
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.userName=sessionStorage.getItem('user');
			this.oldPsd=sessionStorage.getItem('psd');
		},
		methods:{
			editFormCon(){
				this.$refs.editForm.validate(valid => {
					if(valid){
						this.$confirm(this.$t('nav.conEditPwd'),this.$t('confirm.tooltip'),{type:'warning'})
						.then(() => {
							let para={
								old_pass:this.editForm.oldPassword,
								new_pass:this.editForm.newPassword
							}
							this.$ajax.put('/public/edit_my_password'+'?token='+this.token,para)
							.then(res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('nav.pwdSuccess'),
											type:'success'
										})
										this.$store.commit(types.LOGOUT);
										this.$router.push({path:'/login'})
									}
								}
							})
							.catch(e =>{
								console.log(e)
							})
						}).catch(() => {})
					}
				})
			},
			reset(){
				this.$refs['editForm'].resetFields()
			}
		}
	}
</script>

<style  scoped="scoped">
	.container{
		width: 100%;
		margin-left: 25%;
	}
	
</style>