<template>

	<div>
			<vir-network :clounID='clounID'></vir-network>
	</div>
</template>

<script>
	import virNetwork  from '@/views/business/multi/multipoint'
	export default{
		name:'virtualNetwork',
		props:['clounId'],
		components:{
			virNetwork
		},
		data(){
			return{
				clounID:this.clounId
			}
		}
	}
</script>

<style>
</style>