<template>
	<div>
		<!--cloun的配置详情-->
		<section>
			<el-form :model='clounForm'ref='clounForm'style='width:100%'label-width='200px' >
				<el-form-item :label='$t("Public.shardCloud")+ "："'>
					<span>{{clounForm.cloud_type}}</span>
				</el-form-item>
				<el-form-item :label='$t("Public.tarRegion")+ "："'>
					<span>{{clounForm.region}}</span>
				</el-form-item>
				<el-form-item :label='$t("Public.cloudLine")+ "："'>
					<span>{{clounForm.name}}</span>
					<span>{{clounForm.logic_name}}{{clounForm.vlan}}  </span>
				</el-form-item>
				<el-form-item :label='$t("Public.logicStatus")+ "："'>
					<span>{{clounForm.logic_status}}</span>
				</el-form-item>
			</el-form>
		</section>
	</div>
</template>

<script>
	
	export default{
		name:'cloun',
		props:['clounData'],
		data(){
			return {
				clounForm:{
					cloud_type:'',
					region:'',
					name:'',
					logic_name:'',
					vlan:'',
					logic_status:'',
				}
			}
		},
		created(){
			if(this.clounData ){
				this.clounForm=Object.assign({},this.clounData)
			}
		}
	}
</script>

<style>
</style>