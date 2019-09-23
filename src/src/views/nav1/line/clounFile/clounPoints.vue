<template>
	<div>
		<!--点到点专线-->
		<pointTo :customer='ids'></pointTo>
	</div>
</template>

<script>
	import pointTo from '@/views/resources/pointTo'
	export default{
		name:'clounPoints',
		props:['id'],
		components:{pointTo},
		data(){
			return{
				ids:this.id
			}
		},
	}
</script>

<style>
</style>