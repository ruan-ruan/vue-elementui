<template>
	<div >
		<multipoint :virTit='virTit'></multipoint>
		
	</div>
</template>

<script>
	import multipoint from '@/views/business/multi/multipoint'
	export default{
		name:'虚拟组网专线',
		components:{
			multipoint
		},
		data(){
			return{
				virTit:'虚拟组网专线'
			}
		}
	}
</script>

<style>
</style>