<template>
	<div>
		<el-button type='info' size='small' @click='goback'>
			<i class="el-icon-d-arrow-left" aria-hidden="true"></i>{{$t('Public.goback')}}</el-button>
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