<template>
	<div class='topoDialog' >
		
		
	</div>
</template>

<script>

	import * as d3 from 'd3' 	
	export default{
		name:'Topo',
		props:{
			datas:{
				type:Object,
				default:function () {
					return {}
				}
			}
		},
		watch:{
			datas:{
				handler:function(newVal,oldVal){
					this.setTopo(newVal.nodes,newVal.links)
				},
				deep:true
			}
		},
		created(){
			this.setTopo(this.datas.nodes,this.datas.links)
		},
		methods:{
			setTopo:function(nodesData,linksData){//设置拓扑图的展示
				//对数据的里面的匹配进行处理
				linksData.some(function(v, i) {
			        nodesData.some(function(w, j) {
			            if (v.source_node === w.node.id) {
			                v.source_val= w;
			            }
			            if (v.target_node === w.node.id) {
			                v.target_val= w;
			            }
			        });
			        v.index = ++i;
			   });

				d3.select('.topoDialog').select('svg').remove()
				var text_dx = -20;
				var text_dy = 20;
				var img_w=16,img_h=16;
				var radius=16;

				let that=this
				
				var linkForce=d3.forceLink(linksData).id(function(d){})
				
				let simulation = d3.forceSimulation()
				.nodes(nodesData)
				
//				let centerForce = d3.forceCenter(width / 2, height / 2);
				
				let chargeForce = d3.forceManyBody()
				
				simulation
				.force('chargeForce', chargeForce)
//		      	.force('centerForce', centerForce)
		      	.force('links', linkForce)

				simulation.on('tick', tickActions)

				var svg = d3.select(".topoDialog")
		            .append("svg")
		            .attr("preserveAspectRatio", "xMidYMid meet")
		            .attr("viewBox", "0 0 500 239")
	            
	            
	            var g = svg.append('g');

	            var nodes_text = g.selectAll('.node_text')
	            .data(nodesData)
	            .enter()
	            .append('text')
	            .attr('class','font')
	            .text(function(d){
	            	return d.node.name
	            });
	            
	            var links_text=g.selectAll('.link_text')
	            .data(linksData)
	            .enter()
	            .append('text')
	            .attr('class','links_text')	            
				.text(function(d){
					var d_val=d.instant_speed;
					for(var item in d_val){
						for(var i in d_val[item]){
							if(i == 'bytes'){
								if(d_val[item][i]>=1000 && d_val[item][i]< 1000*1024){
									d_val[item]['bps']=( d_val[item][i] / 1000  ).toFixed(2)  + "KB";
								}else if(d_val[item][i]>=1000*1024 && d_val[item][i]<1000*1024*1024){
									d_val[item]['bps']=( d_val[item][i] / (1000*1024)  ).toFixed(2) + "MB";
								}else if(d_val[item][i]>=1000*1024*1024  && d_val[item][i]<1000*1024*1024*1024){
									d_val[item]['bps']=( d_val[item][i] / (1000*1024*1024)  ).toFixed(2)  + "GB";
								}else if(d_val[item][i]>=1000*1024*1024*1024 ){
									d_val[item]['bps']=( d_val[item][i] / (1000*1024*1024*1024)  ).toFixed(2)  + "TB";
								}else{
									d_val[item]['bps']=d_val[item][i]
								}
							}else{
								d_val[item]['pps']=Math.round( d_val[item][i] ) 
							}
						}
					}
					if(d.bandwidth<1024){
						d.bandwidthVal=d.bandwidth+'MB'
					}else if(d.bandwidth>=1024 && d.bandwidth< 1024*1024){
						d.bandwidthVal= (d.bandwidth/1024).toFixed(2) +'GB'
					}else if(d.bandwidth>=1024*1024 && d.bandwidth< 1024*1024*1024){
						d.bandwidthVal= (d.bandwidth/(1024*1024)).toFixed(2) +'TB'
					}
					return d.instant_speed.input.bps+'(入)'+'-'+d.instant_speed.output.bps+'(出)'+'-'+d.bandwidthVal+'(物理带宽)'
	        })
				
	        let link = g.append('g') 
	        	.attr('class', 'link')
			    .selectAll('line')
			    .data(linksData)
			    .enter()
			    .append('line')
			    .style('stroke-width', linkWidth)
			    .style('stroke', linkColour)
			    .attr('class',function(d){//对数据进行处理
			    	return linkColour;
//			    	if(typeof d.speedColor =='undefined'){   //流量的显示不存在的时候   这个时候关闭   返回默认的颜色
//			    		return linkColour;
//			    	}else {  //当存在  流量的时候    显示流量
//			    		return d.speedColor;
//			    	}
			    })
			   
			    .on('mouseover',function(d,i){
			    	//显示连接线上的文字
			    	links_text.style('fill-opacity',function(edge){
			    		if(d.id === edge.id){
			    			return 1.0;
			    		}
			    	})
			    })
			    .on("mouseout",function(d,i){
                    //隐去连接线上的文字
                    links_text.style("fill-opacity",function(edge){
                        if( d.id === edge.id){
                            return 0.0;
                        }
                    });
                });

	            function linkWidth(d){
	            	return 1.5;
	            }
	            function linkColour(d){//链路     链路和云对接链路
	            	
	            	if(d.maintain_type){//开启维护
	            		return '#9254DE';
	            	}else{
	            		if(d.status=='UP'){
							return '#6BC7E2'
						}else if(d.status=='DOWN'){
							return '#444242'
						}else if(d.status=='running'){
							return '#1296DB';
						}
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

				//节点的缩放
			    function zoomActions () {
			      g.attr('transform', d3.event.transform)
			    }
				let zoomHandler = d3.zoom()
			      	.on('zoom', zoomActions)
			
			    zoomHandler(svg)
				
				

				function tickActions () {
		            node.attr("x", function(d) { return d.x-img_w/2; })
				        .attr("y", function(d) { return d.y-img_h/2; });

					link.attr("x1", function(d) {
							if(d.source_val){
								return d.source_val.x;
							}
						})
		                .attr("y1", function(d) {
		                	if(d.source_val){
		                		return d.source_val.y;
		                	}
		                })
		                .attr("x2", function(d) {
		                	if(d.target_val){
		                		return d.target_val.x;
		                	}
		                })
		                .attr("y2", function(d) {
		                	if(d.target_val){
		                		return d.target_val.y;
		                	}
		                })
				   	nodes_text.attr('x',function(d){d.fx=d.x;return d.x-12})
				            .attr("y", function(d) { d.fy=d.y;return d.y-12 });
		           	links_text.attr("x", function(d) {
				           	if(d.source_val && d.target_val){
				           		return (d.source_val.x+d.target_val.x)/2;
				           	}
			           	})
		                .attr("y", function(d) {
		                	if(d.source_val && d.target_val){
		                		return (d.source_val.y+d.target_val.y)/2;
		                	}
		                })
			   }
				function nodeTypeImage(nodes){
					if(nodes.type==='node'){
						return require('@/assets/images/newTopo/node.png')
//						if(nodes.devices.length <2){
//							//一个设备的时候
//							return nodes['devices'][0]['status']==="DOWN"?require('@/assets/images/newTopo/error.png'):
//							require('@/assets/images/newTopo/node.png');
//						}else{
//							//当时两个设备的时候  需要判断两个设别设备是否都是up或者down
//							if( nodes['devices'][0]['status']==="DOWN" && nodes['devices'][1]['status']==="DOWN" ){
//								//两个都是down的情况
//								return require('@/assets/images/newTopo/error.png');
//							}else if( nodes['devices'][0]['status']==="UP" && nodes['devices'][1]['status']==="UP"  ){
//								return require('@/assets/images/newTopo/node.png')
//							}else{
//								return require('@/assets/images/newTopo/one.png');
//							}
//						}
					}else if(nodes.type==='阿里云'){
						return require('@/assets/images/newTopo/ali.png')					
					}else if(nodes.type==='腾讯云'){
						return require('@/assets/images/newTopo/tencent.png')
					}else if(nodes.type==='华为云'){
						return require('@/assets/images/newTopo/huawei.png')	
					}else if(nodes.type==='UCloud'){
						return require('@/assets/images/newTopo/ucloud.png')	
					}else{
						return require('@/assets/images/newTopo/other.png')
					}
				}
				
		        function dragStart (d) {
			      if (!d3.event.active) simulation.alphaTarget(0.3).restart()
			      d.fx = d.x
			      d.fy = d.y
			    }
			    function dragDrag (d) {
			      d.fx = d3.event.x
			      d.fy = d3.event.y
			    }
			
			    function dragEnd (d) {
			      if (!d3.event.active) simulation.alphaTarget(0)
			      d.fx = null
			      d.fy = null
			     
			    }
			},
		},
	}
</script>

<style scoped>
	.topoDialog{
		width: 100%;
		height: 100%;
	}
	svg{
		width: 100%;
		height: 100%;
	}

	.font{
		font-size: 6px;
		color: #000000;
	}
	.links_text{
		font-size: 6px;
		color: #484948;
		fill-opacity:0.0 ;
	}
	.link {
		cursor: pointer;
	  	/*stroke: #6BC7E2;
	  	stroke-width: 1.5px;*/
	}
	

	.nodes{
		border-radius: 16px;
	  	cursor: pointer;
	 	fill: #ccc;
	  	stroke: #000;
	  	stroke-width: 1px;
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