<template>
	<div>
<!--		虚拟组网专线-->
		<multipoint :clounID='clounID'></multipoint>
	</div>
</template>

<script>
	
	import multipoint  from '@/views/business/multi/multipoint'
	export default{
		name:'clounVirtual',
		props:['clounId'],
		components:{
			multipoint
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