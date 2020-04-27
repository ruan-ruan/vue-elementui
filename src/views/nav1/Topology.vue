<template>
	<div>
		<!--<!--拓扑视图--> 
		<section>
			<el-row>
				<el-col :span='24'>
					<el-col :span='24'>
						<Topo :leftData='nodesData' @sendlink='setLink' @reset='getVal' v-if='topoVal' @parentDelta='setmon' @sendType='getLink'></Topo>
					</el-col>
					<el-col :span='6' class='vir'>
						<monitor v-if='monStatus'></monitor>
						<nodeTab v-if='nodeStatus' @goback='closeNode'></nodeTab>
						<linkTab v-if='linkStatus'@linkBack='closeNode'></linkTab>
					</el-col>
				</el-col>	
				<el-col :span='24' style='margin-top: 10px;position: absolute;bottom: 20px;'>
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
				token:'',
				topoVal:true,
				monStatus:true,
				linkStatus:false,
				nodeStatus:false,
				nodesData:[],
				linksData:[],
			}
		},
		mounted(){
			this.token=sessionStorage.getItem('token');
			this.getLinksData();
			this.getNodesData()

		},

		methods:{
			getLink(data){

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
			},
			getNodesData:function(){//获取topo的节点的数据集合
//				this.nodesData=[];
//				let sawedata=[];
				this.topoLoading=true;
				this.$ajax.get('/topology/node_location_list'+'?token='+this.token)
				.then(res => {
					this.topoLoading=false;
					if(res.status==200){
						if(res.data.status==0){

							this.nodesData=res.data.data;

						}
					}
				}).catch(e => {console.log(e)})			
			},
			getLinksData:function( ){   //获取链路的信息数据集合nodesData
				this.linksData=[];
				let that=this;
				this.$ajax.get('/topology/links'+'?token='+this.token)
				.then(res => {
					if(res.status==200 && res.data.status==0){

							that.linksData=res.data.data;	
//							that.backupLink=res.data.data;
//							this.dealForm(that.selectForm,nodesData,that.linksData)
							//添加数据的处理setObj={
//					nodeData:nodesData,
//					linkData:linksData
//				}

//						let node=this.dealForm(that.selectForm,nodesData,that.linksData).nodeData;
//						let link=this.dealForm(that.selectForm,nodesData,that.linksData).linkData
//						this.setTopo(node,link)

					}
				}).catch(e => {console.log(e)})
			},
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