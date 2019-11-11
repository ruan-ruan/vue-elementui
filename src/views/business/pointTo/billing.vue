<template>
	<div>
		<!--计费时间的选择-->
		<el-row>
			<el-col :span='24'>
				<el-form :model='editForm' ref='editForm' label-width='145px'>
					<el-form-item :label='$t("Public.billTime")+"： "'prop='billing_time'>
						<el-date-picker
			                v-model="editForm.billing_time"  
			                format="yyyy-MM-dd HH:mm:ss"
			                value-format="timestamp"
			                clearable 
			                style="width: 100%"
			                :picker-options="startDatePicker" 					                
			                type="datetime"					                
			                class='ipt' 
			                :placeholder="$t('Public.plaStartBill')">
			            </el-date-picker>
					</el-form-item>
					<el-form-item :label='$t("Public.expTime")+"： "' prop='overdue_time'>
						<el-date-picker
			                v-model="editForm.overdue_time"  
			                format="yyyy-MM-dd HH:mm:ss"
			                value-format="timestamp"
			                clearable 
			                style="width: 100%"
			                :picker-options="endDatePicker" 					                
			                type="datetime"
			                class='ipt'
			                :placeholder="$t('Public.plaEndBill')">
			            </el-date-picker>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	
	export default{
		name:'billing',
		data(){
			return{
				editForm:{
					billing_time:'',
					overdue_time:''
				},
				startDatePicker: this.beginDate(),//计费时间 和 结束时间的判断
             	endDatePicker: this.processDate(),
			}
		},
		watch:{
			editForm:{
				handler(newVal,oldVal){
					console.log(newVal)
					this.$emit('sendTime',newVal)
				},
				deep:true,
			},
		},
		
		methods:{
			//计费时间和结束时间
			beginDate(){
	            const self = this
	            return {
		            disabledDate(time){
		                if (self.editForm.overdue_time) {  //如果结束时间不为空，则小于结束时间
		                    return new Date(self.editForm.overdue_time).getTime() < time.getTime()
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
		                if (self.editForm.billing_time) {  //如果开始时间不为空，则结束时间大于开始时间
		                    return new Date(self.editForm.billing_time).getTime() > time.getTime()
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