<template>
	<div>
		<h3 class="title_h3 colorRed">注意：绑定的邮箱号码将用来接收重要的消息提示，请务必实时更新。</h3>
暂无接口数据  待开发.......
		<section>
			<el-row>
				<el-col :span='24'>
					<el-form label-width='200px' :model='personalForm' ref='personalForm':rules='personalFormRules'>
						<el-form-item label='创建时间:'>
							<el-input v-model='personalForm.time' class='ipt' disabled></el-input>
						</el-form-item>
						<el-form-item label='账户角色:'>
							<el-input  v-model='personalForm.time'class='ipt'disabled></el-input>
						</el-form-item>
						<el-form-item label='账户名称:'>
							<el-input  v-model='personalForm.time'class='ipt'disabled></el-input>
						</el-form-item>
						<el-form-item label='姓名:'>
							<el-input  v-model='personalForm.time'class='ipt'disabled></el-input>
						</el-form-item>
						<el-form-item label='手机号:'>
							<div>
								<span v-model="personalForm.iphone">138****2356</span>
								<span class="cur_span spn_color marL20 " @click="editIphone(personalForm.iphone)">修改</span>
							</div>
						</el-form-item>
						<el-form-item label='邮箱:'>
							<span v-model="personalForm.email">86***123@163.com</span>
							<span class="cur_span spn_color marL20 " @click="editEmail(personalForm.email)">修改</span>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			
			<!--iphone email  edit dialog-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync="dialogFormVisible":close-on-click-modal="false"  v-loading='editLoading'>
				
				<el-steps :active="active" finish-status="success">
				  	<el-step v-for='(item ,index) in stepData' :key='index' 
				  		:title="item.value" :label='item.label'></el-step>
				</el-steps>
				<h3 v-if='this.active===1' style="text-align: center; margin-bottom: 20px;">请发送验证码到<span>{{spaStatus}} {{diaForm.oldValue}}</span></h3>
				<el-form :model='newForm' ref='newForm' label-width='160px' :rules='diaFormRules' v-if='this.active===2'>
					<el-form-item label='新手机号' prop='newIphone'  v-if=' spaStatus === "手机"'>
						<el-input class='ipt' v-model='newForm.newIphone'></el-input>
					</el-form-item>
					<el-form-item label='新邮箱' prop='newEmail' v-else>
						<el-input class='ipt' v-model='newForm.newEmail'></el-input>
					</el-form-item>
				</el-form>
				
				<el-form :model='diaForm' ref='diaForm' label-width='160px' >
					<el-form-item :label='spaStatus+"验证码:"'>
						<el-input v-model='diaForm.code' class='sel_chart'></el-input>
						<el-button size='small'type='primary' :disabled='btnStatus' @click='getTime'>{{timeVal}}</el-button>
					</el-form-item>
					<el-form-item >
						<el-button v-if='this.active===1' style="margin-top: 12px;margin-left: 40px;" @click="next">下一步</el-button>
						<el-button v-else >提交</el-button>
					</el-form-item>
				</el-form>
				
				
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
					callback(new Error('请输入手机号'))
				}else if(!isvalidPhone(value)){
					callback(new Error('请输入正确的手机号'))
				}else if( this.diaForm.oldValue === value  ){
					callback(new Error('新旧手机号不能一致，请重新输入!'))
				}
				else{
					callback()
				}
			};
			var validEmail = (rule,value,callback) => {
				if(!value){
					callback(new Error('请输入邮箱'))
				}else if(!isvalidEmail(value)){
					callback(new Error('请输入正确的邮箱'))
				}
				else if( this.diaForm.oldValue === value  ){
					callback(new Error('新旧邮箱不能一致，请重新输入!'))
				}
				else{
					callback()
				}
			};
			return {
				personalForm:{},
				personalFormRules:{},
				textMap:{
					iphone:'手机号修改',
					email:'邮箱修改'
				},
				dialogStatus:'',
				spaStatus:'',
				dialogFormVisible:false,
				
				editLoading:false,
				active:1,
				iph:[
					{value:'验证身份',label:'验证身份'},
					{value:'更改手机',label:'更改手机'},
				],
				ema:[
					{value:'验证身份',label:'验证身份'},
					{value:'更改邮箱',label:'更改邮箱'},
				],
				status:true,//当为true的时候这个时候默认显示的是电话的数据信息，否则是邮箱的
				diaForm:{
					oldValue:'',
					code:'',
				},
				newForm:{
					newIphone:'',
					newEmail:''
				},
				diaFormRules:{
					newIphone:[{ required: true, validator: validPhone ,trigger: 'blur' }],
					newEmail:[{ required: true, trigger: 'blur', validator: validEmail }],
				},
				time:60,
				timeVal:'免费获取验证码',
				
			};
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
			next(){
				if (this.active++ > 2) this.active = 2;
			},
			editIphone(iphone){
				//修改手机
				this.dialogFormVisible=true;
				this.dialogStatus='iphone';
				this.status=true;
				this.spaStatus='手机';
				this.active=1;
			},
			editEmail(email){
				//修改邮箱
				this.dialogFormVisible=true;
				this.dialogStatus='email';
				this.status=false;
				this.spaStatus='邮箱';
				this.active=1;
			},
			getTime:function(event){
				let that=this;
				if(that.time > 0){
					that.time--;
					that.timeVal='重新发送('+that.time+')';
					setTimeout(that.getTime,1000)
				}else{
					that.time = 60;
					that.timeVal='免费获取验证码'
				}
			}
		}
	}
</script>

<style>
</style>