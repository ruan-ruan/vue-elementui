<template>
	<div >
		<multiPoint :virTit='virTit':search_device='search_device':search_port='search_port'></multiPoint>
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
				virTit:'虚拟组网专线',
				search_device:this.$route.query.search_device,
    			search_port:this.$route.query.search_port,
			}
		}
	}
</script>

<style>
</style>