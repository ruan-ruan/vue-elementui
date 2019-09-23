<template>
	<div>
		<!--租户详情-->
		<section>
			<el-form :model='filters' ref='filters' label-width='120px'> 
				<el-form-item label='创建时间'>
					<el-input v-model='filters.creat_time'></el-input>
				</el-form-item>
				<el-form-item label='租户标识'>
					<el-input v-model='filters.creat_time'></el-input>
				</el-form-item>
				<el-form-item label='租户联系人'>
					<el-input v-model='filters.creat_time'></el-input>
				</el-form-item>
				<el-form-item label='租户手机号'>
					<el-input v-model='filters.creat_time'></el-input>
				</el-form-item>
				<el-form-item label='租户邮箱'>
					<el-input v-model='filters.creat_time'></el-input>
				</el-form-item>
				<el-form-item label='公司'>
					<el-input v-model='filters.creat_time'></el-input>
				</el-form-item>
				<el-form-item label='公司类型'>
					<el-input v-model='filters.creat_time'></el-input>
				</el-form-item>
			</el-form>
		</section>
	</div>
</template>

<script>
	export default{
		name:'cusDetails',
		data(){
			return{
				filters:{}
			}
		}
	}
</script>

<style>
</style>