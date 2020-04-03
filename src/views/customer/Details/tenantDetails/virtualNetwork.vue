<template>
	<div>
		<!--虚拟组网-->
		<multiPoint :tenantID='clounID' v-if='clounID'></multiPoint>
	</div>
</template>

<script>
	import multiPoint  from '@/views/business/multi/multiPoint'
	export default{
		name:'virtualNetwork',
		props:['customerID'],
		components:{
			multiPoint
		},
		data(){
			return{
				clounID:this.customerID
			}
		},
		mounted(){
			console.log(this.clounID)
		}
	}
</script>

<style>
</style>