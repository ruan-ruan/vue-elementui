<template>
	<div>
		<el-form :model='basicForm' ref='basicForm' :rules='basicFormRules' label-position='left' v-loading='basicLoading' label-width='120px' >
			<el-form-item label='带宽(Mbps)' prop='bandwidth'>
				<el-input v-model='basicForm.bandwidth'class='ipt' :disabeld='DataStatus'></el-input>
			</el-form-item>
			<el-form-item label='计费模式' prop='changeModel'>
				
				 <el-radio-group v-model="basicForm.changeModel" >
				 	<el-radio-button border v-for='(item,index) in modelData'
				 	:key='index'
				 	:value='item.value' 
				 	:label="item.label" 
				 	border></el-radio-button>
				 </el-radio-group>
			</el-form-item>
			<el-form-item label='计费时间'prop='billing_time'>
				<el-date-picker
	                v-model="basicForm.billing_time"  
	                format="yyyy-MM-dd HH:mm:ss"
	                value-format="timestamp"
	                clearable 
	                style="width: 100%"
	                :picker-options="startDatePicker" 					                
	                type="datetime"					                
	                class='ipt' 
	                placeholder="请选择计费开始日期时间"
	                :disabeld='DataStatus'>
	            </el-date-picker>
			</el-form-item>
			<el-form-item label='过期时间' prop='overdue_time'>
				<el-date-picker
	                v-model="basicForm.overdue_time"  
	                format="yyyy-MM-dd HH:mm:ss"
	                value-format="timestamp"
	                clearable 
	                style="width: 100%"
	                :picker-options="endDatePicker" 					                
	                type="datetime"
	                class='ipt'
	                placeholder="请选择计费截止日期时间"
	                :disabeld='DataStatus'>
	            </el-date-picker>
			</el-form-item>
			<el-form-item label='备注' prop='des'>
				<el-input type='textarea'cols='4' v-model='basicForm.des' class='ipt':disabeld='DataStatus'></el-input>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {getPortStatus,isValidinteger,datedialogFormat} from '@/assets/js/index'  //逻辑口的状态的判断	
	export default{
		name:'basicDetails',
		props:['basicObj'],//获取基本的信息
		data(){
			let isValidNumber= (rule ,value, callback) => {
				if(!value){
					callback(new Error('请输入带宽'))
				}else if(!isValidinteger(value)){
					callback(new Error('请输入正确的带宽'))
				}if(value>1000000){
					callback(new Error('带宽最大不超过1000000Mbps'))
				}else{
					callback()
				}
			}
			return{
				basicForm:{
					bandwidth:'',
					changeModel:'包年包月',
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
				DataStatus:false,//默认的 时候是可以编辑的
				basicFormRules:{
					bandwidth:[ { required: true,  validator: isValidNumber, trigger: 'blur' }],
					changeModel:[{ required: true, message:'请选择计费模式', trigger: 'change' }]
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
			}
		},
		created(){
			console.log(this.basicObj)
			if(typeof this.basicObj!=='undefined'){  //详情的时候展示
				this.basicForm={ 
					bandwidth:this.basicObj.bandwidth,
					changeModel:this.basicObj.changeModel,
					billing_time:new Date(datedialogFormat(this.basicObj.billing_time)),
					overdue_time:new Date(datedialogFormat(this.basicObj.overdue_time)),
					des:this.basicObj.description
				}
				this.DataStatus=true;//不可编辑
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