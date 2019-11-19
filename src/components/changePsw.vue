<template>
	<div>
		<goback></goback>
		<!--修改密码的界面-->
		<section class="container">
			<el-form class='el_form' label-position='left' ref='editForm' :model='editForm':rules='formRules' label-width='120px'>
				<!--<el-form-item label='角色类型'>
					<span v-html='editForm'></span>
				</el-form-item>-->
				<el-form-item label='账号:'>
					<span v-html='userName'></span>
				</el-form-item>
				<el-form-item label='请输入旧密码:' prop='oldPassword'>
					<el-input v-model='editForm.oldPassword' type='password'></el-input>
				</el-form-item>
				<el-form-item label='请输入新密码:' prop='newPassword'>
					<el-input v-model='editForm.newPassword'type='password'></el-input>
				</el-form-item>
				<el-form-item label='请确认新密码:' prop='conPassword'>
					<el-input v-model='editForm.conPassword'type='password'></el-input>
				</el-form-item>
				<!--<el-form-item >
					<el-button >确认</el-button>
					<el-button>取消</el-button>
				</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size='small' type='primary' @click='editFormCon'>确认</el-button>
				<el-button size='small' @click='reset'>清空</el-button>
			</div>
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
					callback(new Error('请输入旧密码'))
				}else if(value!==this.oldPsd){
					callback(new Error('请输入正确的旧密码'))
				}else{
					callback()
				}
			};
			var validateNewPsd=(rule,value,callback) => {
				if(value===''){
					callback(new Error('请输入新密码'))
				}else if(!regex.test(this.editForm.newPassword)){
					callback(new Error('新密码必须包含数字，小写、大写字母'))
				}else{
					callback()
				}
			};
			var validateConPsd = (rule,value,callback) => {
				if(value ===''){
					callback(new Error('请再次输入密码'))
				}else if(value !==this.editForm.newPassword){
					callback(new Error('两次输入密码不一致'))
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
						this.$confirm('确认要修改吗?','提示',{})
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
											message:'密码修改成功!',
											type:'success'
										})
										this.$router.push({path:'/login'})
									}
								}
							})
							.catch(e =>{
								console.log(e)
							})
						}).catch((e) => {})
					}
				})
			},
			reset(){
				this.$refs['editForm'].resetFields()
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.container{
		width: 100%;
		text-align: center;
		
		.el_form{
			/*margin-top: 100px;*/
			margin-left: 30%;
			width: 40%;
		}
	}
	
</style>