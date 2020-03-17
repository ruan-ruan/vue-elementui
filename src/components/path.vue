<template>
	<!--点到点业务列表里面的路径-->
	<div>
		
		
	</div>
</template>

<script>
	export default{
		name:"path",
		data(){
			return {
				token:""
			}
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