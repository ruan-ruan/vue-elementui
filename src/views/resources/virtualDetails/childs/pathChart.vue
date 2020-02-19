<template>
	<div>
		路径图
		<div ref='path'></div>
	</div>
</template>

<script>
	export default{
		name:'pathChart',
		data(){
			return {
				token:'',
			};
		},
		created(){
			this.token=sessionStorage.getItem('token');
		},
		methods:{
			
		}
	}
</script>

<style>
</style>