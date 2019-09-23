<template>
	<div>
		<el-button type='info' size='small' @click='goback'>
			<i class="fa fa-angle-double-left" aria-hidden="true"></i>返回</el-button>
	</div>
</template>

<script>
	export default{
		name:'goback',
		data(){
			return{}
		},
		methods:{
			goback(){
				this.$router.go(-1)
			}
		}
	}
</script>

<style>
</style>