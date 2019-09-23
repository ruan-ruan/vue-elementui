<template>
	
	<div>
		<goback></goback>
		<el-tabs v-model='activeName'  >
			<el-tab-pane label='详情' name='first'>
				<add-cloun :clounId='clounId'></add-cloun>
			</el-tab-pane>
			<el-tab-pane label='点到点专线' name='second'>
				<cloun-points :id='clounId'></cloun-points>
			</el-tab-pane>
			<el-tab-pane label='虚拟组网专线' name='third'>
				<cloun-virtual :clounId='clounId'></cloun-virtual>
			</el-tab-pane>		
		</el-tabs>
	</div>
</template>

<script>
	
	import goback from '@/components/goback'
	import clounPoints from '@/views/nav1/line/clounFile/clounPoints'
	import clounVirtual from '@/views/nav1/line/clounFile/clounVirtual'
	import addCloun from '@/views/nav1/line/clounFile/addCloun'
	
	export default{
		name:'clounsTab',
		components:{
			addCloun,
			clounVirtual,
			clounPoints,goback},
		data(){
			return{
				activeName:'first',
				clounId:this.$route.query.id,
			}
		},
	}
	
</script>

<style>
</style>