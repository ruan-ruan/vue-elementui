<template>	
	<div>
		<el-tabs v-model='activeName'>
			<el-tab-pane :label='$t("Public.backLink")' name='first' v-if='back'>
				<Link v-if='activeName=="first"'></Link>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.unLink")' name='second' v-if='unLink'>
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
				back:this.recursion( this.$store.state.aside , 'Public.backLink').show,
				unLink:this.recursion( this.$store.state.aside , 'Public.unLink').show,
			}
		},
	}
</script>
<style>
	
	
	
</style>