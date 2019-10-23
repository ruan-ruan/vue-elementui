<template>
	<!--点到点详情的基本信息-->
	<div>
		<section>
			<el-form :model='editForm' ref='editForm' label-width='120px'style='width: 100%;'>
				<el-row>
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item label='专线名称 :'>
								<span>{{editForm.name}}</span>
							</el-form-item>
							<el-form-item label='带宽(Mbps) :'>
								<span>{{editForm.bandwidth}}</span>
							</el-form-item>
							<el-form-item label='专线状态 :'>
								<span>{{editForm.status}}</span>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='租户标识 :'>
								<span>{{editForm.tenant_name}}</span>
							</el-form-item>
							<el-form-item label='专线类型 :'>
								<span>{{editForm.type}}</span>
							</el-form-item>
						</el-col>
						
					</el-col>
				</el-row>		
			</el-form>
			
		</section>
	</div>
</template>

<script>
	
	export default{
		name:'basic',
		data(){
			return{
				editForm:{
					name:'',
					bandWidth:'',
					status:'',
					tenant_name:'',
					type:''
				}
			}
		},
	}
</script>

<style>
</style>