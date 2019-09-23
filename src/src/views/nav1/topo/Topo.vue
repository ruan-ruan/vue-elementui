<template>
	<div class='main'>
		<el-row>
			<el-col :span='24'>
					<el-form>
						<el-form-item>
							<template>
								<el-button @click='Save' >保存布局</el-button>
								<el-button @click='reset' id='reset'>还原布局</el-button>
							</template>
						</el-form-item>
					</el-form>
			</el-col>
			<el-col :span='24'>
				<el-col :span='24'class='back'>
					<ul>
						<li>
							<button class='btn' id='big'>+</button>
						</li>
						<li>
							<button class='btn' id='small'>-</button>
						</li>
					</ul>
					<svg width="100%" height="100%" v-loading='topoLoading'></svg>
				</el-col>
			</el-col>
		</el-row>
	</div>
</template>

<script>




	import * as d3 from 'd3' 	
	import {isTopo} from '@/assets/js/index'
	export default{
		name:'Topo',
		props:['leftData'],
		data(){
			return{
				svg:null,
				token:'',
				nodesData:[],
				linksData:[],
				//用来保存移动后的值
				saveData:[],
				reduceData:[],
				str:{
					node_id:'',
					x:'',
					y:''
				},
				dis:true,
				topoLoading:false,
				monStatus:true,//默认的时候 ，数据监听的是显示的
				nodeId:'',
				linkId:'',
				linkType:'',
				selectForm:{
					checkboxGroup1: ['显示标签'],
					bandwidthLogo:true,//是否显示宽带标签
					bandwidth:'显示所有带宽链路',
					network:['显示骨干节点','显示公有云节点','显示骨干链接'],
				},
				networkStatus:false,//流量默认的时候是隐藏的
				logoStatus:true,//标签默认是显示的
				tagStatus:true,//默认的是显示的

//				backupNode:[],
//				backupLink:[],
			}
		},
//		watch:{
//			selectForm:{
//				handler(newVal,oldVal){
//					this.dealForm(newVal,this.nodesData,this.linksData)
////					this.linksData=[];//在这里来   修改获取到的nodes的数据和links数据
//					this.setTopo(this.nodesData,this.linksData)
////					this.dealForm(newVal,this.nodesData,this.linksData)
//this.getNodesData(newVal);
//				},
//				deep:true,
//			}
//		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getNodesData(this.selectForm);

		},
		mounted(){
			
			let that=this;
			this.bus.$on('sendType',(msg) => {
				that.selectForm=msg;
				that.getNodesData(msg);
			})

		},
		methods:{

			Save(){//保存布局
				this.$ajax.put('/topology/edit_node_location'+'?token='+this.token,this.saveData)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.$message({
								message:'修改成功!',
								type:'warning'
							})
							this.getNodesData()
						}else{
							this.$message({
								message:res.data.message,
								type:'warning'
							})
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			reset(){//重新加载还原
				this.$emit('reset',this.dis)
			},
			dealForm(obj,nodeVals,linkVals){//处理  传值过来的对象 obj   对象   node节点的数据  link线路的数据
				let newNode=JSON.parse(JSON.stringify(nodeVals))
				let newLink=JSON.parse(JSON.stringify(linkVals))  //上面的这两 用来保存  
				let nodesData=JSON.parse(JSON.stringify(nodeVals))
				let linksData=JSON.parse(JSON.stringify(linkVals))

				var nodeVal=new Array();
				var linkVal=new Array();
				for(let item in obj){
//					console.log(item);
					if(item ==='checkboxGroup1'){//进入显示标签和显示流量的控制部分   
						let str=obj['checkboxGroup1'];//用来查找对应的值
						if(str.length !=0){
//							if(str.indexOf('显示流量') ===-1){//未找到流量
//								linksData.forEach(ele => {       // 暂时没有字段       后期添加后在更新流量的数据
//									ele.bandwidth=''
//								})
//								linkVal=linksData;
//							}else if(str.indexOf('显示流量') !==-1){
//								linkVal=newLink;
//							}
							
							if(str.indexOf('显示标签') ===-1){//未找标签
								nodesData.forEach(ele => {
									ele.node.name=''
								})
								nodeVal=nodesData;
							}else if(str.indexOf('显示标签') !== -1){
								nodeVal=newNode;
							}

						}else{
							nodesData.forEach(ele => {
								ele.node.name=''
							})
							linksData.forEach(ele => {
								ele.bandwidth=''
							})
							nodeVal=nodesData;
							linkVal=linksData;

						}
					}
					
					if(item ==='bandwidthLogo'){//控制流量的显示和隐藏
						let str=obj['bandwidthLogo'];
						if(str){  //显示流量
							linkVal=newLink;
						}else{//隐藏的流量
							linksData.forEach(ele => {
								ele.bandwidth=''
							})
							linkVal=linksData;
						}
					}
					
					if(item ==='bandwidth'){//筛选带宽的显示和隐藏
						let str=obj['bandwidth']
						if(str === '显示所有带宽链路'){
							linkVal=linksData;
						}
						else{
							if(str === '显示1G带宽链路'){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',1);
							}
								
							if(str === '显示10G带宽链路'){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',10);
							}
							
							if(str === '显示40G带宽链路'){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',40);
							}
							
							if(str  === '显示100G带宽链路'){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',100);
							}
							if(str  === '显示其他带宽链路'){
								linkVal=isTopo.dealBandWidth(linksData,'bandwidth','显示其他带宽链路');//的所有的数据
							}	
						}			
					}
					
					if(item ==='network'){
						let arr=obj['network'];
						if(arr.length !==0){
							if(arr.indexOf('显示骨干节点') ===-1){
								nodeVal=nodesData.filter(item => {
									return item.type!=='node';
								})
							}else if(arr.indexOf('显示公有云节点') === -1){
								nodeVal=nodesData.filter(item => {
									return item.type!=='cloun';
								})
							}else if(arr.indexOf('显示骨干链接') === -1){
								linkVal=linksData.filter(item => {
									return item.type !=='link';
								})
							}else {
								nodeVal=nodesData;
								linkVal=linksData;
							}
						}else {
							nodeVal=[];
							linkVal=linksData.filter(item => {
								return item.type !=='link';
							})
						}
					}
					
				}
				let setObj={
					nodeData:nodeVal,
					linkData:linkVal
				}
				console.log(setObj);
				this.setTopo(nodeVal,linkVal)
			},
			getNodesData:function(obj){//获取topo的节点的数据集合
				this.topoLoading=true;
				this.$ajax.get('/topology/node_location_list'+'?token='+this.token)
				.then(res => {
					this.topoLoading=false;
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.nodesData=res.data.data;
//							this.backupNode=res.data.data;
//							sawedata=res.data.data;
							this.getLinksData(this.nodesData,obj);
						}
					}
				}).catch(e => {console.log(e)})			
			},
			getLinksData:function(nodesData,obj ){   //获取链路的信息数据集合
				this.linksData=[];
				let that=this;
				this.$ajax.get('/topology/links'+'?token='+this.token)
				.then(res => {
					if(res.status==200 && res.data.status==0){
							console.log(res)
							
							that.linksData=res.data.data;	
//							that.backupLink=res.data.data;

						this.dealForm(obj,nodesData,that.linksData)
//						this.setTopo(nodesData,this.linksData)
					}
				}).catch(e => {console.log(e)})
			},
			setTopo:function(nodesData,linksData){//设置拓扑图的展示
				d3.select('svg').select('g').remove()
				var width = 890,
				  height = 470;
				var text_dx = -20;
				var text_dy = 20;
				var img_w=16,img_h=16;
				var radius=16;

				linksData.some(function(v, i) {
			        nodesData.some(function(w, j) {
			            if (v.source_node == w.node.id) {
			                v.source_val= w;
			            }
			            if (v.target_node == w.node.id) {
			                v.target_val= w;
			            }
			        });
			        v.index = ++i;
			   });
				
				let that=this
				var linkForce=d3.forceLink(linksData)
				.id(function(d){})
				
				let simulation = d3.forceSimulation()
				.nodes(nodesData)
				
				let centerForce = d3.forceCenter(width / 2, height / 2);
				
				let chargeForce = d3.forceManyBody()
				
				simulation
				.force('chargeForce', chargeForce)
		      	.force('centerForce', centerForce)
		      	.force('links', linkForce)

				simulation.on('tick', tickActions)
				
				var  svg = d3.select('svg')
	            .attr('width',width)
	            .attr('height',height)
//	            
	            var g = svg.append('g');

	            var nodes_text = g.selectAll('.node_text')
	            .data(nodesData)
	            .enter()
	            .append('text')
	            .attr('class','font')
	            .text(function(d){
	            	return d.node.name
	            })
	            var links_text=g.selectAll('.link_text')
	            .data(linksData)
	            .enter()
	            .append('text')
	            .attr('class','links_text')
				.text(function(d){
					return d.bandwidth
	           })
			
	        let link = g.append('g')
			    .attr('class', 'link')
			    .selectAll('line')
			    .data(linksData)
			    .enter()
			    .append('line')
			    .style('stroke-width', linkWidth)
			    .style('stroke', linkColour)
			    .on('click',function(d){
			    	var cls=document.getElementsByTagName('line');
			    	for (let index=0;index<cls.length;index++) {
							cls[index].style.strokeWidth='2';
						}
		            	this.style.strokeWidth='8';
		            	let obj={}
		            	if(d.type==='link'){
		            		obj={
		            			id:d.id,
		            			type:'link'
		            		}
		            	}else{
		            		obj={
		            			id:d.id,
		            			type:'cloun'
		            		}
		            	}
		            	that.$emit('sendlink',true)
		            	that.bus.$emit('sendlink',obj);
		            	that.$store.commit('sendLink',obj);
			    })

	            function linkWidth(d){
	            	return 2;
	            }
	            function linkColour(d){
					if(d.status=='UP'){
						return '#7FFF00'
					}else{
						return '#444242'
					}
				}
				
				
				let node = g.append('g')
			    	.attr('class', 'nodes')
			      	.selectAll('circle')
			      	.data(nodesData)
			      	.enter()
			      	.append('image')
			      	.attr('r', radius)
					.attr('xlink:href',nodeTypeImage)
					.attr('height',img_h)
					.attr('width',img_w)
					.attr('x',function(d){
						return d.x-img_w/2
					})
					.attr('y',function(d){
						return d.y-img_h/2
					})
//				节点的拖拽	
		       let dragHandler = d3.drag()
			      	.on('start', dragStart)
			      	.on('drag', dragDrag)
			      	.on('end', dragEnd)
			
			    dragHandler(node)  
			    
		        node.on('click',function(d){

					that.$store.commit('newAuthor',d.node.id)  //向数据仓库传值
//		        	//向父节点传值
		        	that.$emit('parentDelta',true)
		        	that.bus.$emit('sendNodeID',d.node.id);
		        	that.nodeId=d.node.id;
		        })
				//节点的缩放
			    function zoomActions () {
			      g.attr('transform', d3.event.transform)
			    }
				let zoomHandler = d3.zoom()
			      	.on('zoom', zoomActions)
			
			    zoomHandler(svg)
				
				

				d3.select('#big').on('click',function(d){
					zoomHandler.scaleBy(svg, 1.1); // 执行该方法后 会触发zoomHandler事件
            		let tran = d3.zoomTransform(svg.node());			
				})
				d3.select('#small').on('click',function(){
					zoomHandler.scaleBy(svg, 0.9); // 执行该方法后 会触发zoomHandler事件
            		let tran = d3.zoomTransform(svg.node());
				})
				let newData=[];//用来保存拖拽后的所有的节点
				let newObj={};//保存拖拽后的每个节点数据
				function tickActions () {
		            node.attr("x", function(d) { return d.x-img_w/2; })
				        .attr("y", function(d) { return d.y-img_h/2; });
//					nodesData.forEach((d,i) => {
//						d.x= d.x - img_w/2 < 0 ? img_w/2 : d.x;
//						d.y=d.y - img_h/2 < 0? img_h/2 : d.y;
//					});
					link.attr("x1", function(d) {return d.source_val.x;})
		                .attr("y1", function(d) {return d.source_val.y; })
		                .attr("x2", function(d) {return d.target_val.x; })
		                .attr("y2", function(d) {return d.target_val.y;})
				   nodes_text.attr('x',function(d){d.fx=d.x;return d.x-12})
				            .attr("y", function(d) { d.fy=d.y;return d.y-12 });
		           links_text.attr("x", function(d) { return (d.source_val.x+d.target_val.x)/2; })
		                .attr("y", function(d) { return (d.source_val.y+d.target_val.y)/2; })
			   	}
				function nodeTypeImage(nodes){
					if(nodes.type==='node'){
						return require('../../../assets/images/newTopo/node.png')
					}else if(nodes.type==='ali'){
						return require('../../../assets/images/newTopo/ali.png')					
					}else if(nodes.type==='tencent'){
						return require('../../../assets/images/newTopo/tencent.png')
						
					}else if(nodes.type==='huawei'){
						return require('../../../assets/images/newTopo/huawei.png')
									
					}else if(nodes.type==='UCloud'){
						return require('../../../assets/images/newTopo/ucloud.png')
								
					}else if(nodes.type==='huawei'){
						return require('../../../assets/images/newTopo/huawei.png')
					}else{
						return require('../../../assets/images/newTopo/error.png')
					}
				}
		        function dragStart (d) {
			      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
			      d.fx = d.x
			      d.fy = d.y
			    }
			
			    // make sure you can't drag the circle outside the box
			    function dragDrag (d) {
			      d.fx = d3.event.x
			      d.fy = d3.event.y
			    }
			
			    function dragEnd (d) {
			      if (!d3.event.active) simulation.alphaTarget(0)
			      d.fx = null
			      d.fy = null
			      
			      newObj={
			      	id:d.id,
			      	x:d.x,
			      	y:d.y
			      }
			      that.saveData.push(newObj);
			    }
			},
		},
	}
</script>

<style>

		.font{
			font-size: 6px;
			color: #000000;
		}
		.links_text{
			font-size: 6px;
			color: #484948;
		}
		.link {
			cursor: pointer;
		  stroke: #000;
		  stroke-width: 1.5px;
		}
		
		.nodes{
			border-radius: 16px;
		  	cursor: pointer;
		 	fill: #ccc;
		  	stroke: #000;
		  	stroke-width: 1.5px;
		}
		.btn{
			font-size: 14px;
			width: 40px;
			height: 40px;
			line-height: 20px;
			text-align: center;
			margin: 0 auto;
			margin: 2px;
			cursor: pointer;
		}
		.back{
		background: #F7F5FA;
	}
</style>