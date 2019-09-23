<template>
	
	<el-menu class='navbar' mode='horizontal'>
		<!--右边部分-->
		<div class="right-menu">
			<!--语言设置部分-->
			<nx-lang-select class="international right-menu-item"></nx-lang-select>
		</div>
	</el-menu>
</template>

<script>
	import nxLangSelect from '@/components/tc-lang-select/index'
	
	export default{
		name:'navBar',
		components:{
			nxLangSelect
		}
	}
</script>

<style>
</style>