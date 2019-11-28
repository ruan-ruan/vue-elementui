<template>
	<!--dc配置详情-->
	<div>
		<section>
			<el-form :model='dcForm'ref='dcForm'label-width='160px'style='width: 100%;' >
				<el-form-item :label='$t("Public.nodeName") + "："'>
					<span>{{dcForm.node_name}}</span>
				</el-form-item>
				<el-form-item :label='$t("Public.logName") + "："'>
					<span>{{dcForm.logic_name}}</span>-
					<span>{{dcForm.vlan}}</span>
				</el-form-item>
				<el-form-item :label='$t("Public.logicStatus") + "："'>
					<span>{{dcForm.port_status}}</span>
				</el-form-item>
			</el-form>
		</section>
	</div>
</template>

<script>
	import {datedialogFormat , isNull ,isPort ,getPortStatus} from '@/assets/js/index.js'
	
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
		watch:{
			dcData:{
				handler:function(newVal,oldVal){
					var zvlan='';
					if(newVal.vlan < 0){
						zvlan=this.$t('Public.passthrough');
					}else if(newVal.vlan == 0){
						zvlan='UNTAG'
					}else if(newVal.vlan){
						zvlan=newVal.vlan;
					}
					this.dcForm={
						node_name:newVal.node.name,
						name:newVal.name,
						logic_name:newVal.logic_port.name,
						port_status:isPort(newVal.ports),
						vlan:zvlan
					}
				}
			}
		},
		created(){
			var zvlan='';
			if(this.dcData.vlan < 0){
				zvlan=this.$t('Public.passthrough');
			}else if(this.dcData.vlan == 0){
				zvlan='UNTAG'
			}else if(this.dcData.vlan){
				zvlan=this.dcData.vlan;
			}
			this.dcForm={
				node_name:this.dcData.node.name,
				name:this.dcData.name,
				logic_name:this.dcData.logic_port.name,
				port_status:isPort(this.dcData.ports),
				vlan:zvlan
			}
		}
	}
</script>

<style>
</style>