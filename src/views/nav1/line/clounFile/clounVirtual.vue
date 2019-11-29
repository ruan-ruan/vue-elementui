<template>
	<div>
<!--		虚拟组网专线-->
		<multiPoint :clounID='clounID'></multiPoint>
	</div>
</template>

<script>
	
	import multiPoint  from '@/views/business/multi/multiPoint'
	export default{
		name:'clounVirtual',
		props:['clounId'],
		components:{
			multiPoint
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