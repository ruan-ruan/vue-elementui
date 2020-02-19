<template>
	<div class="login">
		
		<el-header class="header">
			<el-row >
				<el-col :span='24' class='size'>
					<el-col :span='15'>
						<img :src="sysImg" alt="tianchiLogo" />
					</el-col>
					<el-col :span='3'>
						<el-dropdown trigger="click" @command="Change">
							<span class="el-dropdown-link userinfo-inner cur_poin" :title="$t('nav.lanTooltip')">{{$t('nav.language')}}</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command='cn'>中文</el-dropdown-item>
								<el-dropdown-item command='en'>English</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
					<el-col :span='3'>
						<span class=" cur_poin" :title="$t('nav.guideDown')">{{$t('nav.guide')}}</span>
					</el-col>
					<el-col :span='3'>
						<el-dropdown trigger="click">
							<span class="el-dropdown-link userinfo-inner cur_poin" :title="$t('nav.contactNumber')">{{$t('nav.contactNumber')}}</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item >{{$t('nav.telephone')}}:010-5569850</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-col>
			</el-row>
		</el-header>
		<!--<section>
			
		</section>-->
	  <el-form :model="ruleForm2"  :rules="rules2"label-position='left' ref="ruleForm2"  label-width="80px" 
	  	class="demo-ruleForm login-container"v-loading="logining">
	    <h3 class="title">{{$t('nav.accountLogin')}}</h3>
	    <el-form-item prop="account" :label='$t("nav.accountNumber")' >
	      <el-input type="text" v-model="ruleForm2.account"  :placeholder='$t("nav.accountNumber")'></el-input>
	    </el-form-item>
	    <el-form-item prop="checkPass" :label='$t("nav.pwd")' >
	      <el-input type="password" v-model="ruleForm2.checkPass"  :placeholder='$t("nav.pwd")' @keydown.enter.native='handleSubmit2' show-password></el-input>
	      <el-checkbox v-model="checked" checked class="remember">{{$t('nav.rememberPwd')}}</el-checkbox>
	        <!--<el-button size='small' type="primary" @click.native.prevent="handleSubmit2" >{{$t('nav.entry')}}</el-button>
	      <el-button size='small' type="info" @click="handleReset2" style='margin-left: 40px;'>{{$t('topFilters.reset')}}</el-button>-->
	    </el-form-item>
	    <el-form-item style="width:100%;text-align: center;margin-left: -40px;">
	      <el-button  type="primary" @click.native.prevent="handleSubmit2"style='margin-right: 20px;'  >{{$t('nav.entry')}}</el-button>
	      <el-button  type="info" @click="handleReset2"style='margin-left: 20px;' >{{$t('topFilters.reset')}}</el-button>
	    </el-form-item>
	  </el-form>
	  <div>
	  	
	  </div>
  </div>
</template>

<script>
//	import md5 from 'js-md5';
	import { fil} from'@/assets/js/index'
	import *as types from '@/api/types'
	var routers = []
  	export default {
	    data() {
	      	return {
		      	sysImg:require('../assets/images/tc-logo3-1.png'),
		        logining: false,
		        ruleForm2: {
		          account: '',
		          checkPass: '',
		        },
		        rules2: {
		          account: [{ required: true, message: this.$t('nav.plAccount'), trigger: 'blur' }],
		          checkPass: [{ required: true, message: this.$t('nav.plPwd'), trigger: 'blur' }]
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
	    	Change(e , type) {
		      	window.location.reload(); //实现项目的刷新
		      	localStorage.setItem("language", e);
		      	this.$i18n.locale = e;
		    },
	      	handleReset2() {
	      		this.ruleForm2={
	    			account:localStorage.removeItem('user'),
	    			checkPass:localStorage.removeItem('psd')
	    		}
	        	this.$refs['ruleForm2'].resetFields();
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
							this.logining=false;
							
							if(res.status==200){
								if(res.data.status==0){
									if(this.checked){
										localStorage.setItem('user',loginParams.name)
										localStorage.setItem('psd',loginParams.password)
									}else{
										localStorage.setItem('user','')
										localStorage.setItem('psd','')
									}
									this.$message({
										message:this.$t('nav.entrySuccess'),
										type:'success'
									});
									this.$store.commit(types.LOGIN, res.data.data.token)
									sessionStorage.setItem('user',loginParams.name);
									sessionStorage.setItem('psd', loginParams.password)
									sessionStorage.setItem('token',res.data.data.token);
									
									this.$ajax.get('/public/get_menu'+'?token='+res.data.data.token)
									.then(res => {
										if(res.status == 200){
											if(res.data.status ==0){
												this.$store.commit('setAside',res.data.data);
												sessionStorage.setItem('asideList',JSON.stringify(res.data.data));
//												routerEach(routers,res.data.data);
												fil(this.$router.options.routes ,res.data.data);
//												let redirect = decodeURIComponent('/message/unreadMessage' || this.$route.query.redirect);
//										        this.$router.push({
//										            path: redirect,
//										        })
											}
										}
									}).catch(e => {console.log(e)})
									
									this.$router.push({
							            path: '/message/unreadMessage',
							        })
								}
							}
						}) .catch(e => { console.log(e) })
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