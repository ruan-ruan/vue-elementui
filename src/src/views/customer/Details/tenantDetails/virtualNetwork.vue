<template>
	<div>
		虚拟组网
		<virNetwork :clounID='clounID'></virNetwork>
	</div>
</template>

<script>
	import virNetwork  from '@/views/business/multi/multipoint'
	export default{
		name:'virtualNetwork',
		props:['customerID'],
		components:{
			virNetwork
		},
		data(){
			return{
				clounID:this.customerID
			}
		}
	}
</script>

<style>
</style>