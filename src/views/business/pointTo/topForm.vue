<template>
	<div>
		<el-row>
			<el-col :span='24'>
				<el-form :model='editForm'label-width='125px ' ref='editForm' :rules='editFormRules'>
					<el-form-item :label='$t("business.payModel") +"： " '>
						<el-radio-group v-model="editForm.billingType">
							<el-radio-button border size='small'
								v-for='(item,index) in billingData'
								:label='item.label'
								:key='index'></el-radio-button>
					    </el-radio-group>
					</el-form-item>
					<el-form-item :label='$t("Public.specialName") +"： "' prop='specialName'>
						<el-input v-model='editForm.specialName'class='ipt'></el-input>									
					</el-form-item>
					<el-form-item :label='$t("Public.tenant") +"： "'prop='tenant_id'>
						<template>
							<el-select v-model='editForm.tenant_id' filterable class='ipt'>
								<el-option v-for='(item,index) in tenantData'
									:label='item.name'
									:value='item.id'
									:key='index'></el-option>
							</el-select>
							<span class="cli_toTip" :title="$t('business.virtualUser')">?</span>
						</template>			
					</el-form-item>
					<el-form-item :label='$t("Public.bandW" ) +"： "'prop='bandwidth'>
						<el-input v-model='editForm.bandwidth'class='ipt'></el-input> <span>&nbsp;&nbsp;Mbps</span>
					</el-form-item>
					<el-form-item :label='$t("Public.description") +"： "'prop='describe'>
						<el-input type='textarea' v-model='editForm.describe'class='ipt'></el-input>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		
	</div>
</template>

<script>

	
	import {getPortStatus,isValidinteger} from '@/assets/js/index'  //逻辑口的状态的判断	
	export default{
		name:'topForm',
		data(){
			let isValidNumber= (rule ,value, callback) => {
				if(!value){
					callback(new Error(this.$t('Public.plaBandwidth')))
				}else if(!isValidinteger(value)){
					callback(new Error(this.$t('Public.plarightBand')))
				}else if(value>1000000){
					callback(new Error(this.$t('Public.maxBand')))
				}else{
					callback()
				}
			}
			return{
				token:'',
				editForm:{
					billingType:'包年包月',
					specialName:'',
					tenant_id:'',
					bandwidth:'',
					describe:'',
					tenant_name:''
				},
				editFormRules:{
					billingType:[ { required: true, message: this.$t('business.plaPayModel'), trigger: 'change' }],
					specialName:[ { required: true, message: this.$t('Public.plaName'), trigger: 'blur' }],
					tenant_id:[ { required: true, message: this.$t('Public.plaTenant'), trigger: 'change' }],
					bandwidth:[ { required: true,  validator: isValidNumber, trigger: 'blur' }],
				},
				billingData:[
					{
						label:'包年包月',
						value:'包年包月'
					}
				],
				tenantData:[],//租户的数据
			}
		},
		watch:{
			editForm:{
				handler:function(newVal,oldVal){
					if(newVal.tenant_id!=''){
						this.selectTenant(newVal.tenant_id);
					}
					this.$emit('formVal',this.editForm);
				},
				deep:true,//对象内部的属性监听，也叫深度监听
				immediate:true//immediate标识在 watch中首次当顶的视乎，是否执行执行handler，值为true标识在watch中声明的时候，就立即执行handler方法，值为false，则和使用一般的watch是一样的
			},
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getFormData()
		},
		methods:{
			getFormData(){
				//获取租户标识的数据
				var para={
					search_usable:true
				}
				this.$ajax.get('/tenant/tenants'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							let obj={};
							res.data.data.items.forEach(ele => {
								obj={
									id:ele.id,
									name:ele.name
								}
								this.tenantData.push(obj);
							})
						}
					}
				}).catch(e => {console.log(e)})
			},
			selectTenant(ids){
				//根据租户的选择的id获取对应的name
				let items=ids;
				var findVal=this.tenantData.find(function(obj){
					return obj.id===items;
				})
				this.editForm.tenant_name=findVal.name;
//				this.creatFormDetails.tenant_name=findVal.name;
			},
		}
	}
</script>

<style>
</style>