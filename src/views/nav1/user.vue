<template>	
	<div>
		<el-tabs v-model='activeName'>
			<el-tab-pane label='骨干链路' name='first'>
				<Link v-if='activeName=="first"'></Link>
			</el-tab-pane>
			<el-tab-pane label='未知链路' name='second'>
				<Unknown v-if='activeName=="second"'/>
			</el-tab-pane>
		</el-tabs>
	</div>
	
</template>


<script>
	import Unknown from '@/views/nav1/line/Unknown'
	import Link from '@/views/nav1/line/Link'
	export default{
		name:'user',
		components:{
			Link,
			Unknown
		},
		data(){
			return{
				activeName:'first',
			}
		}
	}
</script>
<style>
	
	
	
</style>