<template>
	<div>
		
		<div class="back" id='back_chart'>
			<!--路径里面的需要使用的拓扑图   可根据  id的传值  显示  既可   coincide_line-->
		<div class="line_tooltip">
			<div>指定路径示意图：  <span class="assign_line"></span> </div>
			<div>真实路径示意图：  <span class="real_line"></span> </div>
			<div>重合路径示意图：  <span class="coincide_line"></span>
				<span style='cursor: pointer;' title="重合路径指当前指定路径与真实路径走向一致">?</span> 
			</div>
		</div>
			<svg width="100%" height="100%" v-loading='Loading' ref='chart'></svg>
		</div>
	</div> 	
</template>

<script>
	import * as d3 from'd3';
	import { cloneTopo } from '@/assets/js/index.js'
	
	export default{
		name:'charts',
		props:['id','currentData','detail'],//从调用的组件传过来的id  detail是用来判断是否进入详情路径的界面，用来控制绘图的时候里面的节点是否可以点击   currentData是所有历史列表的第一条数据，用来作为该数据图的显示  
		data(){
			return {
				token:'',
				nodesData:[],//节点的数据
				linksData:[],//链路的数据
				Loading:false,
				select:[],//选择的节点的数据
				selectNode:[],
//				defsNodes:[],//根据获取当前的节点的数据的长度  来判断节点额的线是否是两个点，起点和终点
				assigns:[],//指定路径的集合
				reals:[],//真实路径的集合
				coincides:[],//指定路径和真实路径的集合
			};
		},
	
		created(){
			this.token=sessionStorage.getItem('token');
		
		},
		mounted(){
			this.nodes();
		},
		watch:{
			'selectNode':{
				handler:function(newVal,oldVal){
					this.$emit('sendNode',newVal);//将数据发送到父组件
				},
				deep:true
			},
			'currentData':{
				handler:function(newVal,oldVal){
					this.nodes()
				},
				deep:true
			}
		},
		methods:{
			//拓扑图的默认的节点数据和链路数据
			nodes(){
				//获取节点的数据
				let that=this;
				that.linksData=[];
				that.nodesData=[];
				that.Loading=true;
				that.$ajax.get('/topology/node_location_list'+'?token='+that.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							that.nodesData=res.data.data;
							// that.links(res.data.data);//传参到链路的数据里面
							return that.$ajax.get('/topology/links'+'?token='+that.token)
						}
					}
				})
				.then(res => {
					if(res.status == 200){
						if(res.data.status ==0){
							that.def(that.nodesData , res.data.data )
						}
					}
				})
				.catch(err => console.log(err))
			},
			def( nodes , links ){
				//获取默认的时候的节点的信息   起点  ，终点  在拓扑上显示出来
				//因为  一个画布内只能存在一个svg矢量图   所以需要在获取起点和终点的信息，并进一步处理数据，然后在渲染
					//接收历史路径里面的第一条的数据 即当前的要展示的数据  分为以下几种情况： this.Nodes=res.data.data.nodes;
					/**action:         status:
					 * 	create			success  => path_info
					 * 	create			failure  => 默认路径   A -> Z
					 * 	delete			success  => 默认路径   A -> Z
					 * 	delete			failure  => path_info
					 * */
				var type='';
				// 这里获取的是指定路径里面的信息数据
				var msg=this.currentData;
				if(JSON.stringify(msg) !=='{}' && typeof msg != 'undefined'){//存在指定路径的信息的时候
					type='assign'
					this.path_details(type,msg.path.id,nodes,links);	
				}else{//指定路径的信息为空
					type='real';
					this.path_details(type,this.id,nodes,links);
				}
			},
			path_details(type,ids,nodes,links){
				//根据历史路径里面获取的信息       type是要获取的数据的接口数据  地址
				/**1.当指定路径存在的时候  。根据当前path的id  获取当前指定路径的列表然后在获取真实路径
				 * 
				 * 2.当指定路径不存在的时候，直接显示   真实路径
				 * 
				 * */
				if(type === 'assign'){
					//对应的接口路径   '/vll/path_info/'  
					this.$ajax.get('/vll/path_info/'+ids+'?token='+this.token)
					.then(res => { 
						if(res.status === 200){
							if(res.data.status === 0){
								console.log(res)
								var str=res.data.data;
								var data=[];
								res.data.data.nodes.map( (item,j) => {
//									item.node=item
									if(j === 0){
										item.assign_val='起点';
										item.def_val='起点';
									}else if(j === res.data.data.nodes.length-1){
										item.assign_val='终点';
										item.def_val='终点';
									}else{
										item.def_val='途径';
										item.assign_val='途径';
									}
									item.color='assign';
									let obj={
										name:item.name,
										node:item,
										def_val:item.def_val,
									};
									data.push(obj);
								})
								this.selectNode=data;//获取指定路径的数据  传输到父组件  展示
//								this.defsNodes=str.nodes;
								this.$emit('basic',str.nodes)
								this.assigns=res.data.data.nodes;
								return this.$ajax.get('/vll/true_path/'+this.id+'?token='+this.token)
							}
						}
					}).then(res => {// 获取当前的真实的路径数据
						if(res.status ==200){
							if(res.data.status == 0){
								res.data.data.nodes.some( (item,i) => {
									if(i === 0){
										item.assign_val=''
										item.def_val='起点';
									}else if(i === res.data.data.nodes.length-1){
										item.def_val ='终点';
										item.assign_val='';
									}else {
										item.def_val='途径';
										item.assign_val='';
									}
									item.color='real';
									this.assigns.some((assign,j) => {
										if(item.id === assign.id){
											item.color='coincide';
											assign.color='coincide'
										}
									})
								})
								this.$emit('sendReal',res.data.data.nodes);//向父组件发送真实路径数据
								//获取真实的路径
								this.reals=res.data.data.nodes;
								var assigns=JSON.parse(JSON.stringify(this.assigns));
								
								var reals=JSON.parse(JSON.stringify( res.data.data.nodes ));
								var coincides=[]
								var json=assigns.concat(reals);
								for( var item1 of json){
									let flag=true;
									for(var item2 of coincides){
										if( item1.id === item2.id ){
											flag=false;
										}
									}
									if(flag){
										coincides.push(item1)
									}
								}
								//获取重合后的数据
								this.coincides=JSON.parse(JSON.stringify(coincides));
								//获取所有的数据后  对拓扑图进行修饰显示
//								this.coincides
								
								nodes.some(function(w,j){
									w.def_val='途径';
									w.def_type='other';//不是默认的点的时候
									w.assign_val=''
									coincides.some(function(v,i){
										var obj={}
										obj.name=v.name;
										v.node=obj;
										
										if(w.node.id === v.id){ //在nodes里面  标记起点和终点；
											w.def_type='default';  // 
											w.def_val=v.def_val;
											w.color=v.color;
											w.assign_val=v.assign_val;
										}
									})
								});
								links.some(function(v, i) {
							        nodes.some(function(w, j) {
							            if (v.source_node === w.node.id) {
							                v.source_val= w;
							            }
							            if (v.target_node === w.node.id) {
							                v.target_val= w;
							            }
							        });
							        v.index = ++i;
								});
								this.Charts(nodes,links);
							}
						}
					})
					.catch(err => {console.log(err)})
				}
				if(type === 'real'){  //当时真实路径的时候，指定路径为空  这个时候  在下面点击选择点的时候，设置起点为A端终点为Z端
					var Data=[];
					this.$ajax.get('/vll/p2p_vll_info/'+this.id+'?token='+this.token)
					.then(res => {
						if(res.status ==200){
							if(res.data.status == 0){
								//通过业务里面的路径的调整进入的界面  筛选出来A端(起点)和Z端(终点)里面的节点
								/**分为三种情况
								 * 1.点到点  (d2d)
								 * 2.点到云  (d2c)
								 * 3.云到云  (c2c)
								 * */
								var str=res.data.data;
								if(str.endpoints && str.endpoints.length === 2 ){
									//d2d  
									str.endpoints.map(item => {
										if(item.name ==='A端'){
											Data[0]=item;
										}
										if(item.name === 'Z端'){
											Data[1] =item ;
										}
									})
//									Data=JSON.parse(JSON.stringify(str.endpoints))
								}
								if(str.endpoints && str.cloud_endpoints){
									//d2c
									var obj=str.cloud_endpoints[0].ports[0].node;
									str.cloud_endpoints[0].node=obj;
									if(str.cloud_endpoints[0].name === 'A端' ){
										Data[0]=str.cloud_endpoints[0]
									}
									if(str.endpoints[0].name==='Z端'){
										Data[1]=str.endpoints[0]
									}
								}
								if(str.cloud_endpoints && str.cloud_endpoints.length ===2 ){
									//c2c
									str.cloud_endpoints.map(item => {
										var obj={};
										obj=item.ports[0].node;
										item.node=obj;
										if(item.name === 'A端'){
											Data[0] =item ;
										}
										if(item.name === 'Z端'){
											Data[1] =item;
										}
									})
								}
								//当不存在指定路径的时候   直接获取A端，Z端作为起点和终点  assign_val
								return this.$ajax.get('/vll/true_path/'+this.id+'?token='+this.token)
							}
						}
					}).then(res => {
						if(res.status == 200){
							if(res.data.status ==0){
								nodes.some((w,j ) => {
									w.assign_val='';
									w.def_val='途径';
									w.def_type='other';
									w.color='';
									Data.some( (v,i) => {
										if(v.name == 'A端'){
											if(w.node.id == v.node.id){
												w.assign_val='起点';
												w.def_val='起点';
											}
										}
										if(v.name == 'Z端'){
											if(w.node.id == v.node.id){
												w.assign_val='终点';
												w.def_val='终点';
											}
										}
									} )
								})
								console.log(nodes)
								nodes.some(( w,j ) => {
//									w.def_type='other';
//									w.color='';
//									w.def_val='途径';
									res.data.data.nodes.some( (v,i) => {
										let obj={};
										obj.name=v.name;
										v.node=obj;
										if(i === 0){
											v.def_val='起点';
										}else if(i === res.data.data.nodes.length-1){
											v.def_val ='终点'
										}else {
											v.def_val='途径'
										}
										v.color='real';
										if(w.node.id === v.id){
											w.def_type='default';  // 
//											w.def_val=v.def_val;
											w.color=v.color;
										}
									} )
								})
								this.reals=res.data.data.nodes;
								this.$emit('sendReal',res.data.data.nodes);//向父组件发送真实路径数据
//								this.selectNode=res.data.data.nodes;
//								this.defsNodes=res.data.data.nodes;
								links.some(function(v, i) {
							        nodes.some(function(w, j) {
							            if (v.source_node === w.node.id) {
							                v.source_val= w;
							            }
							            if (v.target_node === w.node.id) {
							                v.target_val= w;
							            }
							        });
							        v.index = ++i;
								});
								this.Charts(nodes,links);
							}
						}
					})

				}
				
			},
			Charts( nodesData , linksData ){
				//根据父节点的传值的来绘图
				//初始化  画布
				
				d3.select('svg').select('g').remove();
				
				var width=700 ;var height=400;
				var text_dx=-20,text_dy=20,img_w=16,img_h=16,radius=8;
				//this指向转换
				
				let that=this;
				//生成力导向图的所需要的参数
				var linkForce=d3.forceLink(linksData).id(function(d){ });
				var simulation = d3.forceSimulation(nodesData);
				var chargeForce = d3.forceManyBody();
				var centerForce = d3.forceCenter(width / 2, height / 2);
				

				//定义力导向的中心点   节点数据及数据的更新
				simulation
				.force('chargeForce', chargeForce)
				.force('link',linkForce)
				.force("center", centerForce)
				.on('tick', tickActions)

				//选择画布  大小
				var  svg = d3.select('svg')
		            .attr('width',width)
		            .attr('height',height) 
	            //创建一个 画布内的点  可根据数据进行更新
	            var g = svg.append('g');

	            //定义节点的  文本信息  以及位置
	            var nodes_text = g.selectAll('.node_text')
		            .data(nodesData)
		            .enter()
		            .append('text')
		            .attr('class','font')
		            .text(function(d){
		            	return d.node.name
		            })
		            
	            //定义  线的文本信息
	            var links_text=g.selectAll('.link_text')
		            .data(linksData)
		            .enter()
		            .append('text')
		            .attr('class','links_text')

	            //定义点与点之间的连线
	            var link = g
				    .selectAll('line')
				    .data(linksData)
				    .enter()
				    .append('line')
				    .attr('class','link_vals')
				    .attr('class',linkVals)
				    .attr('id',function(d){ return d.id; })
		            //线的宽度  调整
		            function linkVals(d){
		            	
		            	if( d.status ==='DOWN' ){//当该条线为down的情况下   直接返回对应的颜色值
		            		return 'defs_down';
		            	}else { //进入up状态  
		            		if( d.source_val.def_type === 'default' && d.target_val.def_type === 'default' ){//显示为当前指定或者真实的路径部分
		            			if(d.source_val.color === 'real' && d.target_val.color==='real'){
		            				//这个是真实的路径  
		            				return 'real';
		            			}else if( d.source_val.color==='assign' && d.target_val.color==='assign' ){
		            				//这个是指定的路径
		            				return 'assign';
		            			}else{
		            				// 这个是重合的路径
		            				return 'coincide';
		            			}
		            		}else{//显示  原拓扑图
		            			return 'link_up';
		            		}
		            	}

		            }
		          
		           
	            //定义箭头走向
			    var marker=svg.append("marker")
		            .attr("id", "resolved")
		            .attr("markerUnits","userSpaceOnUse")
		            .attr("viewBox", "0 -5 10 10")//坐标系的区域
		            .attr("refX",34)//箭头坐标
		            .attr("refY", 0)
		            .attr("markerWidth", 12)//标识的大小
		            .attr("markerHeight", 12)
		            .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
		            .attr("stroke-width",2)//箭头宽度
		            .append("path")
		            .attr("d", "M0,-5L10,0L0,5")//箭头的路径
		            .attr('fill','#000000')//箭头颜色   
		            .attr('opacity',0.5);
		        	            
	            var isFirst=false;
	            var times=0;

	            var sel=[];//选取对的节点信息
		        //定义节点的信息：
		        let node = g
			      	.selectAll('circle')
			      	.data(nodesData)
			      	.enter()
			      	.append('image') 	
			      	.attr('class', 'nodes-path')
					.attr('xlink:href',that.nodeTypeImage)
					.attr('r', radius)
					.attr('height',img_h)
					.attr('width',img_w)
					.attr('x',function(d){ return d.x-img_w/2 })
					.attr('y',function(d){ return d.y-img_h/2 })
					.attr('id',function(d){return d.id;})
		        	.call( 
		        		d3.drag()
				      	.on('start', dragStart)
				      	.on('drag', dragDrag)
				      	.on('end', dragEnd)
		        	)
		        	.on('click',function(d,i){
		            	var cls=document.getElementById(d.id);
		            	if(!that.detail){ //  当详情的参数不存在的时候  进入的路径调整的组件    是可以操控的
		            		if(isFirst){
								times++;
								//始终获取数据的里面最后一个值，用来和点前的单击的值  进行对比  
								var str=unique(sel)[unique(sel).length-1];
								linksData.some(function (v,j){
									if( str.node.id === v.target_val.node.id  || str.node.id === v.source_val.node.id  ){
										if( v.status !== 'DOWN' ) {
											if(d.node.id === v.source_val.node.id || d.node.id === v.target_val.node.id  ){
												cls.style.width=40;
												cls.style.height=40;
												sel.push(d);
												
											}
										}else{
												this.$message({
													message:'状态为dowm不能选择',
													type:'warning'
												})
											}
									}
								})
		            		}else {//这个是起点  所以不需要  点击的时候  进行遍历
			            		if(d.assign_val === '起点'){//判断第一次点击的时候是否为起点   是的时候选中   否则  将不选择
			            			isFirst=true;
			            			cls.style.width=40;
									cls.style.height=40;
									sel.push(d);
			            		}
		            		}
			            	//发送数据到父组件
			            	that.selectNode=unique(sel)
			            	that.$emit('sendNode',that.selectNode);
			            	that.$emit('sendStatus',false);//控制右侧的部分的 下表兰的显示与隐藏
		            	}
		            })
				//  上面  根据选择的节点的信息的数据 进行去重
	            function unique(arr1) {
				  	const res = new Map();
				  	return arr1.filter((a) => !res.has(a.node.id) && res.set(a.node.id, 1))
				}
	            
	            
		        //画布内节点的缩放
		        
				function zoomActions () {
			      g.attr('transform', d3.event.transform)
			    }
				let zoomHandler = d3.zoom()
			      	.on('zoom', zoomActions)
			
			    zoomHandler(svg)
			    //画布的更新函数
			    function tickActions () {
			    	//更新节点
					node.attr("x", function(d) { return d.x-img_w/2; })
				        .attr("y", function(d) { return d.y-img_h/2; });
				    //更新线
				    link
				    .attr("x1", function(d) { if(d.source_val){ return d.source_val.x; } })
	                .attr("y1", function(d) { if(d.source_val){ return d.source_val.y; } })
	                .attr("x2", function(d) { if(d.target_val){ return d.target_val.x; } })
	                .attr("y2", function(d) { if(d.target_val){ return d.target_val.y; } })
//	                .attr("marker-end", "url(#resolved)");//在线上添加箭头
				    //更新节点文本信息
				    nodes_text
				    .attr('x', function(d) { d.fx=d.x;return d.x-12 })
				    .attr("y", function(d) { d.fy=d.y;return d.y-12 });
				    //更新线的文本信息
		           	links_text
		           	.attr("x", function(d) { if(d.source_val && d.target_val){ return (d.source_val.x+d.target_val.x)/2; } })
		            .attr("y", function(d) { if(d.source_val && d.target_val){ return (d.source_val.y+d.target_val.y)/2; } })
				}
			    //节点的拖拽的开始 -》 运动-》 停止
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
			      	if (!d3.event.active)simulation.alphaTarget(0)
			      	d.fx = null
			      	d.fy = null
			    }
			},
			nodeTypeImage(nodes){  //节点里面的点的信息  根据不同的数据类型显示不同的图片
				if(nodes.type==='node'){
					return require('@/assets/images/newTopo/node.png')
				}else if(nodes.type==='阿里云'){
					return require('@/assets/images/newTopo/ali.png')					
				}else if(nodes.type==='腾讯云'){
					return require('@/assets/images/newTopo/tencent.png')
					
				}else if(nodes.type==='华为云'){
					return require('@/assets/images/newTopo/huawei.png')
								
				}else if(nodes.type==='UCloud'){
					return require('@/assets/images/newTopo/ucloud.png')
							
				}else{
					return require('@/assets/images/newTopo/error.png')
				}
			},

		}
	}
</script>

<style >
	.line_tooltip{
		position: relative;
		text-align: left;
		z-index: 1;
	}
	/*图线示意图*/
	.assign_line{
		display: inline-block;
		border: 2px solid #00FF00;
		border-radius: 20%;
		background-color: #00FF00;
		width: 80px;
		/*height: ;*/
	}
	.real_line{
		display: inline-block;
		border: 2px solid #3300FF;
		border-radius: 20%;
		background-color: #3300FF;
		width: 80px;
	}
	.coincide_line{
		display: inline-block;
		border: 2px solid #FF00FF;
		border-radius: 20%;
		background-color:#FF00FF;
		width: 80px;
	}
	.real{
		stroke:#3300FF;
		/*stroke-dasharray:5,5;
		border: solid #3300FF ;*/
	}
	.assign{
		stroke:#00FF00;
		/*stroke-dasharray:5,5;
		border: dashed #00FF00 ;*/
	}
	.coincide{
		stroke:#FF00FF;
		/*stroke-dasharray:5,5;
		border: dashed #FF00FF ;*/
	}
	.font{
		font-size: 6px;
		color: #000000;
	}
	.links_text{
		font-size: 6px;
		color: #484948;
	}
	.link_up{
		stroke: #6BC7E2;
	}
	.link_down{
		stroke: #444242;
	}
	.link_run{
		stroke: #1296DB;
	}
	.link_vals {
		stroke-width: 2;
	}
	.defs_run{
		stroke:#1296DB ;
		/*stroke-width: 1;*/
		stroke-dasharray:5,5;
		border: dashed #FB0A06 ;
	}
	.defs_down{
		stroke:#444242 ;
		/*stroke-width: 1;*/
		stroke-dasharray:5,5;
		border: dashed #FB0A06 ;
	}
	.defs{
		stroke:#FB0A06 ;
		/*stroke-width: 1;*/
		stroke-dasharray:5,5;
		border: dashed #FB0A06 ;
	}
	.cur{
		cursor: pointer;
	}
	.nodes-path{
		cursor: pointer !important;
	}
	.back{
		background: #F7F5FA;
	}
</style>