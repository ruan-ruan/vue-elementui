<template>
	<div>
		<!--逻辑端口1-2-->
		<logic-port :tit='data' ></logic-port>
		<span>{{titleOne}}</span>
	</div>
</template>

<script>
	
	import logicPort from '@/views/resources/port.vue'
	export default{
		name:'logicalPort',
		components:{logicPort},
		props:['titleOne','titleTwo'],
		data(){
			return{
				data:''
			}
		},
		mounted(){
//			var str=
		}

	}
</script>

<style>
</style>