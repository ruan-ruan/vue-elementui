<template>
	<div class="login">
		
		<el-header class="header">
			<el-row >
				<el-col :span='24' class='size'>
					<el-col :span='18'>
						<img :src="sysImg" alt="tianchiLogo" />
					</el-col>
					<el-col :span='2'>
						<el-dropdown trigger="click">
							<span class="el-dropdown-link userinfo-inner cur_poin" title="语言选择">语言</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item >中文</el-dropdown-item>
								<el-dropdown-item >English</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
					<el-col :span='2'>
						<span class=" cur_poin" title="操作指南下载">操作指南</span>
					</el-col>
					<el-col :span='2'>
						<el-dropdown trigger="click">
							<span class="el-dropdown-link userinfo-inner cur_poin" title="联系电话">联系电话</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item >电话:010-5569850</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-col>
			</el-row>
		</el-header>
		<!--<section>
			
		</section>-->
	  <el-form :model="ruleForm2"  :rules="rules2" ref="ruleForm2" label-position="left" label-width="55px" class="demo-ruleForm login-container"v-loading="logining">
	    <h3 class="title">账户登录</h3>
	    <el-form-item prop="account" label='账号:' >
	      <el-input type="text" v-model="ruleForm2.account"  placeholder="账号"></el-input>
	    </el-form-item>
	    <el-form-item prop="checkPass" label='密码:'>
	      <el-input type="password" v-model="ruleForm2.checkPass"  placeholder="密码" @keydown.enter.native='handleSubmit2' show-password></el-input>
	    </el-form-item>
	    <!--<el-form-item>-->
	    	<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
	    <!--</el-form-item>-->
	    <el-form-item style="width:100%;">
	      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" >登录</el-button>
	      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
	    </el-form-item>
	  </el-form>
  </div>
</template>

<script>
	import *as types from '@/api/types'
  	export default {
	    data() {
	      	return {
		      	sysImg:require('../assets/images/tc-logo3-1.png'),
		        logining: false,
		        ruleForm2: {
		          account: '',//admin
		          checkPass: '',//123456
		        },
		        rules2: {
		          account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
		          checkPass: [{ required: true, message: '请输入密码', trigger: 'blur' }]
		        },
		        checked: true
	      	};
	    },
	    created(){
	    	if(this.checked){
	    		this.ruleForm2={
	    			account:localStorage.getItem('user'),
	    			checkPass:localStorage.getItem('psd')
	    		}
	    	}else{
	    		this.ruleForm2={
	    			account:'',
	    			checkPass:''
	    		}
	    	}
	    },
	    methods: {
	      	handleReset2() {
	        	this.$refs.ruleForm2.resetFields();
	      	},
	      	handleSubmit2(ev) {
		        var _this = this;
		        this.$refs.ruleForm2.validate((valid) => {
		          	if (valid) {
			            this.logining = true;
			            var loginParams = { 
			            	name: this.ruleForm2.account,
			            	password: this.ruleForm2.checkPass 
			            };
			            this.$ajax.post('/login/admin_login',loginParams)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									if(this.checked){
										localStorage.setItem('user',loginParams.name)
										localStorage.setItem('psd',loginParams.password)
									}else{
										localStorage.setItem('user','')
										localStorage.setItem('psd','')
									}
									this.logining=false;
									this.$message({
										message:'登录成功!',
										type:'success'
									});
									this.$store.commit(types.LOGIN, res.data.data.token)
									sessionStorage.setItem('user',loginParams.name);
									sessionStorage.setItem('psd',loginParams.password)
									sessionStorage.setItem('token',res.data.data.token);
//									let redirect = decodeURIComponent( this.$route.query.redirect ||'/topology' );
									let redirect = decodeURIComponent('/topology' || this.$route.query.redirect);
									console.log(this.$route.query.redirect)
									console.log(redirect);
							        this.$router.push({
							            path: redirect,
							        })
								}else if(res.data.status){
									this.logining=false;
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}
							}
						})
						.catch(e => {
							console.log(e)
						})
		          	} else {
			            console.log('error submit!!');
			            return false;
		          	}
		        });
	      	}
	    }
  	}

</script>

<style lang="scss" scoped>

@import '~scss_vars';

	.login{
		position:fixed;
		top:0;
		bottom:0;
		background-image:url('../assets/background.jpg') ;
		background-repeat: no-repeat;
		height:100%;
		width:100%;
		background-size:cover;

		.login-container {			
	    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
	    -webkit-border-radius: 5px;
	    border-radius: 5px;
	    -moz-border-radius: 5px;
	    background-clip: padding-box;
	    margin: 180px auto;
	    width: 350px;
	    padding: 35px 35px 15px 35px;
	    background: #fff;
	    border: 1px solid #eaeaea;
	    box-shadow: 0 0 25px #cac6c6;
	    .title {
	      margin: 0px auto 40px auto;
	      text-align: center;
	      color: #505458;
	    }
	    .remember {
	      margin: 0px 0px 35px 0px;
	    }
	  }
	  .header{
	  	background: $color-primary;
	  	position: absolute;
	  	top: 0;
	  	bottom: 0;
	  	width: 100%;
	  	/*background-color: #B3C0D1;*/
	    color: #333;
	    text-align: center;
	    height: 60px;
	    line-height: 60px;	 
	    margin: 0 auto;   
	    img{
	    	/*background-image:url(../../build/logo.png) ;
	    	background-repeat: no-repeat;*/

	    
	    	height:60px ;
	    	padding-right: 300px;
	    }
	    .cur_poin{
	    	cursor: pointer;
	    	color: #fff;
	    }
	  }
	}

</style>