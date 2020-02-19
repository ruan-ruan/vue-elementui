<template>
	
	<div>

		<section>
			<h3>路径节点排列表:</h3>
			<el-table :data='List' v-loading='listLoading' width='100%'>
				<el-table-column label='跳数'align='center' min-width='40'></el-table-column>
				<el-table-column label='节点名称'align='center'min-width='60'></el-table-column>
				<el-table-column label='入口'align='center'min-width='40'></el-table-column>
				<el-table-column label='出口'align='center'min-width='40'></el-table-column>
				<el-table-column label='类型'align='center'min-width='40'></el-table-column>
			</el-table>
			<span class="path_spa marT10">当前系统默认路径</span>
		</section>
	</div>
</template>

<script>
	
	export default{
		name:'pathList',
		data(){
			return {
				List:[],
				listLoading:false,
				
			};
		},
		created(){
			
		},
		methods:{
			
		}
	}
</script>

<style scoped>
	.path_spa{
		display: block;
		width: 100%;
		height: 30px;
		line-height: 30px;
		border-radius: 10px;
		background:#35CDFF;
		text-align: center;
	}
</style>