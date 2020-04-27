<template>
	<div>
		<virNetwork  :logicID='clounID' v-if='clounID'></virNetwork>
	</div>
</template>

<script>
	import virNetwork  from '@/views/business/multi/multiPoint'
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
		},
		mounted(){
//			console.log(this.clounID)
		},
	}
</script>

<style>
</style>