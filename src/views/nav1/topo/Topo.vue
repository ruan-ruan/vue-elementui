<template>
	<div class='main'>
		<el-row>
			<el-col :span='24'>
					<el-form>
						<el-form-item>
							<template>
								<el-button @click='Save' id='save'>保存布局</el-button>
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
//var width = 890,
//height = 470;
//var text_dx = -20;
//var text_dy = 20;
//var img_w=16,img_h=16;
//var radius=16;
// let svg = d3.select('svg')
//.attr('width',width)
//.attr('height',height)
//
//let g = svg.append('g');     	
	export default{
		name:'Topo',
		data(){
			return{
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
				selectForm:{},
				networkStatus:false,//流量默认的时候是隐藏的
				logoStatus:true,//标签默认是显示的
				tagStatus:true,//默认的是显示的
				defaultObj:{
					checkboxGroup1: ['显示标签'],
					bandwidthLogo:true,//是否显示宽带标签
					bandwidth:['显示1G带宽链路','显示10G带宽链路','显示40G带宽链路','显示100G带宽链路','显示其他带宽链路'],
					network:['显示骨干节点','显示公有云节点','显示骨干链接'],
				},
				backupNode:[],
				backupLink:[],
			}
		},
//		watch:{
//			selectForm:{
//				handler(newVal,oldVal){
//					console.log(newVal)
//					this.reset()
//					this.dealForm(newVal)
//				},
//				deep:true
//			}
//		},
		created(){
			this.token=sessionStorage.getItem('token');
//			this.selectForm=this.$store.state.filters;
//			var sels=this.$store.state.filters;
			let that=this;
			this.bus.$on('sendType',(msg) => {
				console.log(msg);
				that.selectForm=msg;
				that.reset()
				that.dealForm(msg)
			})
			this.getLinksData();
			this.getNodesData();
		},
		updated(){
			this.dealForm(this.defaultObj)
			
//			console.log(this.selectForm)
//			this.setTopo();
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
			dealForm(obj){//处理  传值过来的对象
				console.log(obj);
				let nodes=this.nodesData;
				let links=this.linksData;
//				let setObj={
//					nodeData:this.nodesData,
//					linkData:this.linksData
//				}
				console.log(nodes);
				console.log(links);
				console.log(obj['checkboxGroup1'])
				
				let str=obj['checkboxGroup1']
				if(str.length !==0){
					//进入判断模式
					if(str.indexOf('显示标签') === -1){
						this.nodesData.forEach(ele => {
							ele.node.name=''
						})
					}else{
						this.nodesData=this.backupNode;
					}
					if(str.indexOf('显示流量') === -1){
						this.linksData.forEach(ele => {
							ele.bandwidth=''
						})
					}else{
						this.linksData=this.backupLink;
					}
				}
				else{
					this.linksData.forEach(ele => {
						ele.bandwidth=''
					})
					this.nodesData.forEach(ele => {
						ele.node.name=''
					})
				}
//				for (let index in obj) {
//					if(index ==='checkboxGroup1'){
//
//						if(obj['checkboxGroup1'].length !==0){//里面存在   标签或者流量
//						let str=obj['checkboxGroup1']
//							if(str.indexOf('显示标签') !== -1){
//								console.log('cunzau ')
//								setObj.nodeData=nodes;
//								console.log(setObj.nodeData)
//							}else{
//								nodes.forEach(ele => {
//									ele.node.name=''
//								})
//								setObj.nodeData=nodes;
////								links.forEach(ele =>{
////									ele.bandwidth=''
////								})
////								setObj.linkData=links
//							}
//							if(str.indexOf("显示流量") !== -1){
//								setObj.linkData=links;
//								console.log(setObj.linkData)
//							}else{
//								console.log('hhhh')
//								links.forEach(ele =>{
//									ele.bandwidth=''
//								})
//								setObj.linkData=links
//							}
//						}else{//传递来的都是隐藏的
//							nodes.forEach( item => {
//								item.node.name=''
//							})
//							links.forEach(val => {
//								val.bandwidth=''
//							})
//							setObj={
//								nodeData:nodes,
//								linkData:links
//							}
//						}
//						
//					}
//				}
				let setObj={
					nodeData:this.nodesData,
					linkData:this.linksData
				}
				console.log(setObj)
				this.setTopo(setObj.nodeData,setObj.linkData)
			},
			getNodesData:function(){//获取topo的节点的数据集合
				this.topoLoading=true;
				this.$ajax.get('/topology/node_location_list'+'?token='+this.token)
				.then(res => {
					this.topoLoading=false;
					if(res.status==200){
						if(res.data.status==0){
							this.nodesData=res.data.data;
							this.backupNode=res.data.data;
							
//							backupNode:[],
//				backupLink:[],
//							this.getLinksData(this.nodesData);
						}
					}
				}).catch(e => {console.log(e)})			
			},
			getLinksData:function( ){   //获取链路的信息数据集合nodesData
				this.$ajax.get('/topology/links'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.linksData=res.data.data;	
							this.backupLink=res.data.data;
//							this.setTopo(nodesData,this.linksData)
						}
					}
				}).catch(e => {console.log(e)})
			},
			
			setNode(nodesData,g){
				var nodes_text = g.selectAll('.node_text')
	            .data(nodesData)
	            .enter()
	            .append('text')
	            .attr('class','font')
	            .text(function(d){
	            	return d.node.name
	            })
	            return nodes_text;
			},
			setLink(linksData,g){
				var links_text=g.selectAll('.link_text')
	            .data(linksData)
	            .enter()
	            .append('text')
	            .attr('class','links_text')
				.text(function(d){
					return d.bandwidth
	           })
				return links_text;
			},
			setTopo:function(nodesData,linksData){//设置拓扑图的展示
				
				var width = 890,
				  height = 470;
				var text_dx = -20;
				var text_dy = 20;
				var img_w=16,img_h=16;
				var radius=16;
				
//				let nodesData=this.nodesData;
//				let linksData=this.linksData;
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
				let svg = d3.select('svg')
	            .attr('width',width)
	            .attr('height',height)
//	            
	            let g = svg.append('g');

//				var  nodes_text=that.setNode(nodesData,g);
//				var links_text=that.setLink(linksData,g)
//	            
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
				//节点的拖拽	
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
//				let newData=[];//用来保存拖拽后的所有的节点
				let newObj={};//保存拖拽后的每个节点数据
				
//				d3.select('#save').on('click',function(d){
//					console.log('执行保存布局');
//					console.log(newData);
//				})

				function tickActions () {
		            node.attr("x", function(d) { return d.x-img_w/2; })
				        .attr("y", function(d) { return d.y-img_h/2; });
					nodesData.forEach((d,i) => {
						d.x= d.x - img_w/2 < 0 ? img_w/2 : d.x;
						d.y=d.y - img_h/2 < 0? img_h/2 : d.y;
					});
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
			filters:function(arr,target_id){
				var obj=arr.find(function(x){
					return x.id===target_id
				})
				return obj;
			}
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