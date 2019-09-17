<template>
	<div>
<!--		虚拟组网专线-->
		<virtual-network :clounID='clounID'></virtual-network>
	</div>
</template>

<script>
	
	import virtualNetwork  from '@/views/business/multi/multipoint'
	export default{
		name:'clounVirtual',
		props:['clounId'],
		components:{
			virtualNetwork
		},
		data(){
			return{
				clounID:this.clounId
			}
		},
		created(){
			
		}
	}
</script>

<style>
</style>