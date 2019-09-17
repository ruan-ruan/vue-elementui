<template>
	<div>
		<!--<!--拓扑视图--> 
		<section>
			<el-row>
				<el-col :span='24'>
					<el-col :span='24'>
						<Topo @sendlink='setLink' @reset='getVal' v-if='topoVal' @parentDelta='setmon' @sendType='getLink'></Topo>
					</el-col>
					<el-col :span='6' class='vir'>
						<monitor v-if='monStatus'></monitor>
						<nodeTab v-if='nodeStatus' @goback='closeNode'></nodeTab>
						<linkTab v-if='linkStatus'@linkBack='closeNode'></linkTab>
					</el-col>
				</el-col>	
				<el-col :span='24' style='margin-top: 10px;'>
					<btnLeft></btnLeft>
				</el-col>
			</el-row>
		</section>
	</div>
</template>

<script>
//	局部引入d3插件
	import * as d3 from 'd3'
	import Topo from '@/views/nav1/topo/Topo'
	import btnLeft from '@/views/nav1/topo/btnLeft'
	import monitor from '@/views/nav1/topo/monitor'
	import nodeTab from '@/views/nav1/topo/nodeTab'
	import linkTab from '@/views/nav1/topo/linkTab'
	
	
	
	export default {
		name:'Topology',
		components:{
			Topo,
			btnLeft,
			monitor,
			nodeTab,
			linkTab,
		},
		data(){
			return{
				topoVal:true,
				monStatus:true,
				linkStatus:false,
				nodeStatus:false
			}
		},
		methods:{
			getLink(data){
				console.log(data);
				this.linkData={
					id:data.id,
					type:data.type
				}
			},
			setmon(data){ //显示节点的详情
				this.monStatus=!data;//关闭监听数据
				this.linkStatus=!data;//关闭链路的详情
				this.nodeStatus=data;
			},
			setLink(data){
				console.log(data)
				this.monStatus=!data;//关闭监听数据
				this.nodeStatus=!data;//关闭节点的详情
				this.linkStatus=data;
				
			},
			closeNode(data){//关闭节点的详情的界面 false  和关闭链路详情
				this.linkStatus=data
				this.nodeStatus=data;
				this.monStatus=!data;
			},
			getVal(data){
				this.topoVal = false
			    this.$nextTick(function(){
			        this.topoVal = true
			    })
			}
		}
	}
</script>

<style scoped>
	.back{
		background: #F7F5FA;
	}
	.vir{
		position: absolute;
		right: 0px;
		top: 9%;
		height: 500px;
		overflow-y: auto;
		background: #f2f2f2;
	}
</style>