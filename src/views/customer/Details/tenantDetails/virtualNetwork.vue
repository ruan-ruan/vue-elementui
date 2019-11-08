<template>
	<div>
		虚拟组网
		<multipoint :tenantID='clounID'></multipoint>
	</div>
</template>

<script>
	import multipoint  from '@/views/business/multi/multipoint'
	export default{
		name:'virtualNetwork',
		props:['customerID'],
		components:{
			multipoint
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