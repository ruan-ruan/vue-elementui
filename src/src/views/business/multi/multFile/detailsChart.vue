<template>
	<div>
		<!--详情的图表部分-->
		<!--<el-form :inline='true' :model='filters' ref='filters'  >
			<el-form-item label='请选择'>
				<el-select v-model='filters.type'class='sel_chart'>
					<el-option v-for='(item , index) in typeData' 
						:label='item.label'
						:value='item.value'
						:key='index'></el-option>
				</el-select>
				<el-select v-model='filters.logic' class='sel_chart'>
					<el-option v-for='(item , index) in logicData'
						:label='item.label'
						:value='item.value'
						:key='index'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button size='small'  type='primary' @click='getFilters'> 搜索</el-button>
			</el-form-item>
		</el-form>
		<span v-text="chartTit.traffic"></span>-->-
		<traf-chart :titData='networkID'></traf-chart>
	</div>
</template>

<script>
//	import chartData from '@/views/resources/virtualDetails/pointsDetails/chartData'
	import trafChart from '@/components/trafChart'

	export default{
		name:'detailsChart',
		props:['detailsID'],
		components:{
			trafChart,
		},
		data(){
			return{
				networkID:this.detailsID,
				chartTit:{
					traffic:'流量展示图',
				},
				
				filters:{
					type:'dc',
					logic:''
				},
				typeData:[
					{
						label:'数据中心',
						value:'dc'
					},{
						label:"公有云",
						value:'sharedCloun'
					}
				],
				logicData:[]
			}
		},
		methods:{
			getFilters(){
				
			}
		}
	}
</script>

<style>
</style>