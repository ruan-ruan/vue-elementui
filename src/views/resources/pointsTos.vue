<template>
	<div >
		<multiPoint :virTit='virTit'></multiPoint>
	</div>
</template>

<script>
	import multiPoint from '@/views/business/multi/multiPoint'
	export default{
		name:'pointsTos',
		components:{
			multiPoint
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