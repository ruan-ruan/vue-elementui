<template>
	<div>
		<virNetwork :logicID='clounID'></virNetwork>
	</div>
</template>

<script>
	import virNetwork  from '@/views/business/multi/multipoint'
	export default{
		name:'virtualNetwork',
		components:{
			virNetwork
		},
		props:['clounId'],
		data(){
			return{
				clounID:this.clounId
			}
		}
	}
</script>

<style>
</style>