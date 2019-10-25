<template>
	<!--dc配置详情-->
	<div>
		<section>
			<el-form :model='dcForm'ref='dcForm'label-width='120px'style='width: 100%;' label-position='left'>
				<el-form-item label='节点名称：'>
					<span>{{dcForm.node_name}}</span>
				</el-form-item>
				<el-form-item label='逻辑口名称：'>
					<span>{{dcForm.logic_name}}</span>-
					<span>{{dcForm.vlan}}</span>
				</el-form-item>
				<el-form-item label='逻辑口状态：'>
					<span>{{dcForm.port_status}}</span>
				</el-form-item>
			</el-form>
		</section>
	</div>
</template>

<script>
	
	export default{
		name:'dc',
		props:['dcData'],
		data(){
			return {
				dcForm:{
					node_name:'',
					name:'',
					logic_name:'',
					port_status:'',
				}
			}
		},
		created(){
			console.log(this.dcData)
			this.dcForm={
				node_name:this.dcData.node_name,
				name:this.dcData.name,
				logic_name:this.dcData.logic_name,
				port_status:this.dcData.port_status,
				vlan:this.dcData.vlan
			}
//			console.log(this.dcData)
		}
	}
</script>

<style>
</style>