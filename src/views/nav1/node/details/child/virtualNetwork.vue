<template>

	<div>
		<vir-network :nodeDetail='clounID'></vir-network>
	</div>
</template>

<script>
	import virNetwork  from '@/views/business/multi/multiPoint'
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