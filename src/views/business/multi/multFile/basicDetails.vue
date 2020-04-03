<template>
	<div>
		<el-form :model='basicForm' ref='basicForm' :rules='basicFormRules'  v-loading='basicLoading' label-width='160px' >
			<el-form-item :label='$t("Public.bandwidth")+"："' prop='bandwidth'>
				<el-input v-model='basicForm.bandwidth'class='ipt'  :disabled='typeof type != "undefined"'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.chargModel")+"："' prop='changeModel'>
				 <el-radio-group v-model="basicForm.changeModel" :disabled='typeof type != "undefined"'>
				 	<el-radio-button border v-for='(item,index) in modelData'
				 	:value='item.value'
				 	:key='index'
				 	:label="item.label" 
				 	></el-radio-button>
				 </el-radio-group>
			</el-form-item>
			<el-form-item :label='$t("Public.billTime")+"："'prop='billing_time'>
				<el-date-picker :disabled='typeof type != "undefined"'
	                v-model="basicForm.billing_time"  
	                format="yyyy-MM-dd HH:mm:ss"
	                value-format="timestamp"
	                clearable 
	                style="width: 100%"
	                :picker-options="startDatePicker" 					                
	                type="datetime"					                
	                class='ipt' 
	                :placeholder="$t('Public.plaStartBill')"
	                >
	            </el-date-picker>
			</el-form-item>
			<el-form-item :label='$t("Public.expTime")+"："' prop='overdue_time'>
				<el-date-picker :disabled='typeof type != "undefined"'
	                v-model="basicForm.overdue_time"  
	                format="yyyy-MM-dd HH:mm:ss"
	                value-format="timestamp"
	                clearable 
	                style="width: 100%"
	                :picker-options="endDatePicker" 					                
	                type="datetime"
	                class='ipt'
	                :placeholder="$t('Public.plaEndBill')"
	                >
	            </el-date-picker>
			</el-form-item>
			<el-form-item :label='$t("Public.description")+"："' prop='des'>
				<el-input type='textarea'cols='4' v-model='basicForm.des' class='ipt':disabled='typeof type != "undefined"'></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {getPortStatus,isValidinteger,datedialogFormat} from '@/assets/js/index'  //逻辑口的状态的判断	
	export default{
		name:'basicDetails',
		props:['basicObj','type'],//获取基本的信息
		data(){
			let isValidNumber= (rule ,value, callback) => {
				if(!value){
					callback(new Error(this.$t('Public.plaBandwidth')))
				}else if(!isValidinteger(value)){
					callback(new Error(this.$t('Public.plarightBand')))
				}if(value>1000000){
					callback(new Error(this.$t('Public.maxBand')))
				}else{
					callback()
				}
			}
			return{
				basicForm:{
					bandwidth:'',
					changeModel:"包年包月",
					billing_time:'',
					overdue_time:'',
					des:''
				},
				modelData:[
					{
						value:'包年包月',
						label:'包年包月'
					},
				],
//				DataStatus:false,//默认的 时候是可以编辑的
				basicFormRules:{
					bandwidth:[ { required: true,  validator: isValidNumber, trigger: 'blur' }],
					changeModel:[{ required: true, message:this.$t('Public.plaChangModel'), trigger: 'change' }]
				},
				startDatePicker: this.beginDate(),//计费时间 和 结束时间的判断
             	endDatePicker: this.processDate(),
             	basicLoading:false,
             	
			}
		},
		watch:{
			basicForm:{
				handler(newVal,oldVal){		
					this.$emit('sendBasic',newVal)
				},
				deep:true,
			},
			basicObj:{
				handler(newVal,oldVal){		
					this.basicForm={ 
						bandwidth:newVal.bandwidth,
						changeModel:newVal.charge_mode,
						billing_time:newVal.charge_time==''? '' : new Date(datedialogFormat(newVal.charge_time)),
						overdue_time:newVal.expiration_time ==''? '':   new Date(datedialogFormat(newVal.expiration_time)),
						des:newVal.description
					}
				},
				deep:true,
			}
		},
		created(){
			if(typeof this.basicObj!=='undefined'){  //详情的时候展示
				this.basicForm={ 
					bandwidth:this.basicObj.bandwidth,
					changeModel:this.basicObj.charge_mode,
					billing_time:this.basicObj.charge_time==''? '' : new Date(datedialogFormat(this.basicObj.charge_time)),
					overdue_time:this.basicObj.expiration_time ==''? '':   new Date(datedialogFormat(this.basicObj.expiration_time)),
					des:this.basicObj.description
				}
//				this.DataStatus=true;//不可编辑
			}
		},
		methods:{
			//计费时间和结束时间
			beginDate(){
	            const self = this
	            return {
		            disabledDate(time){
		                if (self.basicForm.overdue_time) {  //如果结束时间不为空，则小于结束时间
		                    return new Date(self.basicForm.overdue_time).getTime() < time.getTime()
		                } else {
		                    // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
		                }
	                }
	            }
	        },
	       	processDate() {
	            const  self = this
	            return {
	                disabledDate(time) {
		                if (self.basicForm.billing_time) {  //如果开始时间不为空，则结束时间大于开始时间
		                    return new Date(self.basicForm.billing_time).getTime() > time.getTime()
		                } else {
		                    // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
		                }
	                }
	            }
	        },
		}
	}
</script>

<style>
</style>