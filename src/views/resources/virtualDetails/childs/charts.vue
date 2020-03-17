<template>
	<div>
		<!--路径里面的需要使用的拓扑图   可根据  id的传值  显示  既可-->
		<div class="back" id='back_chart'>
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
				defsNodes:[],//根据获取当前的节点的数据的长度  来判断节点额的线是否是两个点，起点和终点
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
				that.Loading=true;
				that.$ajax.get('/topology/node_location_list'+'?token='+that.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							that.nodesData=res.data.data;
							that.links(res.data.data);//传参到链路的数据里面
						}
					}
				}).catch(e => {console.log(e)})		
			},
			links( nodes ){
				let that=this;
				that.linksData=[];
				that.$ajax.get('/topology/links'+'?token='+that.token)
				.then(res => {
					if(res.status==200 && res.data.status==0){
						that.linksData=res.data.data;	
						that.def(nodes , res.data.data );//下面的调用直接传参
					}
				}).catch(e => {console.log(e)})
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

				if(JSON.stringify(this.currentData) !== "{}" && typeof this.currentData !='undefined'){
					//存在当前的路径信息
					var msg=this.currentData;
					if(msg.action === 'create'){
						if(msg.status === 'success'){
							//path_info
							type='path_info';
	
						}else if(msg.status === 'failure'){
							//默认路径
							type='default';
						}
					}else if(msg.action === 'delete'){
						if(msg.status === 'success'){
							//default

							type='default';
						}else if(msg.status === 'failure'){
							//path_info
							type='path_info';
						}
					}

					this.path_details(type,msg.path.id,nodes,links);	
				}else{//不存在当前的路径信息  也是默认的A到Z端
					type='default';
					this.path_details(type,this.id,nodes,links);
				}
			},
			path_details(type,ids,nodes,links){
				//根据历史路径里面获取的信息       type是要获取的数据的接口数据  地址
				
				if(type === 'path_info'){
					
					//对应的接口路径   '/vll/path_info/'
					this.$ajax.get('/vll/path_info/'+ids+'?token='+this.token)
					.then(res => { 
						if(res.status === 200){
							if(res.data.status === 0){
								var str=res.data.data;
								nodes.some(function(w,j){
									w.def_val='途径';
									w.def_type='other';//不是默认的点的时候
									str.nodes.some(function(v,i){
										var obj={}
										obj.name=v.name;
										v.node=obj;
//										v.def_val='途径';
										if(w.node.id === v.id){ //在nodes里面  标记起点和终点；
											w.def_type='default';
											if(i === 0){
												v.def_val='起点';
												w.def_val='起点';
											}else if(i === str.nodes.length-1){
												v.def_val='终点';
												w.def_val='终点';
											}else{
												v.def_val='途径';
												w.def_val='途径';
											}
										}
									})
								});

								this.selectNode=str.nodes;//展示当前的默认的点的数据
								this.defsNodes=str.nodes;
								this.$emit('basic',str.nodes)
//								//根据链路里面的起点和终点  找到对应的节点信息
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
				if(type === 'default'){  //当路径调整的时候  也是可以进入的 

					this.$ajax.get('/vll/p2p_vll_info/'+this.id+'?token='+this.token)
					.then(res => {
						if(res.status===200){
							if(res.data.status===0){
								//通过业务里面的路径的调整进入的界面  筛选出来A端(起点)和Z端(终点)里面的节点
								/**分为三种情况
								 * 1.点到点  (d2d)
								 * 2.点到云  (d2c)
								 * 3.云到云  (c2c)
								 * */
								var str=res.data.data;
								var Data=[];
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
//									console.log(Data)
//									Data.push(str.endpoints[0]);
//									Data.push(str.cloud_endpoints[0]);
//									console.log(Data)
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
//									Data=JSON.parse(JSON.Stringify(str.cloud_endpoints));
								}

								nodes.some(function(w,j){
									w.def_val='途径';
									w.def_type='other';//不是默认的点的时候
									Data.some(function(v,i){
										if(w.node.id === v.node.id){ //在nodes里面  标记起点和终点
											w.def_type='default';//不是默认的点的时候
											if(v.name ==='A端'){
												w.def_val='起点';
												v.def_val='起点';
											}
											if(v.name === 'Z端'){
												w.def_val='终点';
												v.def_val='终点';
												
											}
										}
									})
								});
								this.$emit('basic',Data)
								this.selectNode=Data;
								this.defsNodes=Data;
								//根据链路里面的起点和终点  找到对应的节点信息
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
					}).catch(err => {console.log(err)})
				}
				
			},
			Charts( nodesData , linksData ){
				//根据父节点的传值的来绘图
				//初始化  画布
//				d3.select('#back_chart').append('svg');
				
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
		            	// && d.target_val.def_val ===' 起点' 
		            	if(that.defsNodes.length == 2){
		            		//当只有两条数据的时候  这个时候  直接判断当前的数据类型就可以
		            		if(d.source_val.def_type === 'default' && d.target_val.def_type === 'default'){
			            		if(d.status=='UP'){
									return 'defs';
								}else if(d.status=='DOWN'){
									return 'defs_down';
								}else if(d.status=='running'){
									return 'defs_run';
								}
			            	}else{
			            		if(d.status=='UP'){
									return 'link_up';
								}else if(d.status=='DOWN'){
									return 'link_down';
								}else if(d.status=='running'){
									return 'link_run';
								}
			            	}
		            	}else{
		            		//当不是两条数据的时候  需要对  起点和终点之间的连线进行排除
		            		if((d.source_val.def_val === '终点' && d.target_val.def_val ==='起点') || (d.source_val.def_val === '起点' && d.target_val.def_val ==='终点')  ){
			            		if(d.status=='UP'){
									return 'link_up';
								}else if(d.status=='DOWN'){
									return 'link_down';
								}else if(d.status=='running'){
									return 'link_run';
								}
			            	}else{
			            		if(d.source_val.def_type === 'default' && d.target_val.def_type === 'default'){
				            		if(d.status=='UP'){
										return 'defs';
									}else if(d.status=='DOWN'){
										return 'defs_down';
									}else if(d.status=='running'){
										return 'defs_run';
									}
				            	}else{
				            		if(d.status=='UP'){
										return 'link_up';
									}else if(d.status=='DOWN'){
										return 'link_down';
									}else if(d.status=='running'){
										return 'link_run';
									}
				            	}
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
	            var times=1;
	            var startData=[];//选取起点相关的数据
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
		            	
		            	if(!that.detail){ //  当详情的参数不存在的时候  进入的路径调整的组件    是可以操控的
							var cls=document.getElementById(d.id);
			            	if(isFirst){
			            		times++;
			            		cls.style.width=40;
								cls.style.height=40;
								sel.push(d);
								
//			            		set(startData , d , cls , linksData )
//			            		var result=getNames(unique(startData),[],d,cls,linksData);
//			            		console.log(result)
//			            		var vals=set(startData , d , cls , linksData );
//			            		console.log(vals)
			            	}else {
			            		isFirst =true;
			            		if(d.def_val === '起点'){//判断第一次点击的时候是否为起点   是的时候选中   否则  将不选择
			            			cls.style.width=40;
									cls.style.height=40;
									linksData.some(function (v,j){
										if(d.node.id === v.source_val.node.id || d.node.id === v.target_val.node.id  ){
											//第一次点击的点  是起点   只要有连线  就可以添加到数组里面
											sel.push(d);
											startData.push(v.target_val);
											startData.push(v.source_val);
										}
									})
			            		}
			            	}
			            	//发送数据到父组件
			            	that.selectNode=unique(sel)
			            	that.$emit('sendNode',that.selectNode);
			            	that.$emit('sendStatus',false);//控制右侧的部分的 下表兰的显示与隐藏
		            	}
		            })
		        
		        function getNames(array,childs,obj,val,linksData){
				    for(var i=0;i<array.length;i++){
//				        var item=array[i];

				        if( array[i].node.id === obj.node.id ){

				        	if( array[i].def_val ==='终点' ){
				        		val.style.width=40;
					        	val.style.height=40;
					        	childs.push(obj);
				        		return childs;
				        	}else if(array[i].def_val !=='终点' && array[i].def_val !=='起点'){
				        		array=[];
				        		val.style.width=40;
					        	val.style.height=40;
					        	childs.push(obj);
					        	linksData.some(function(v,j){
            						if(v.target_val.node.id === obj.node.id || v.source_val.node.id === obj.node.id){
            							array.push( v.source_val );
            							array.push( v.target_val );
            						}
            					})
					        	var rs=getNames(array,childs,obj,val,linksData);
					        	if(rs){
					        		console.log('3')
					        		return rs;
					        	}else {
					        		console.log('4')
					        		childs.remove(obj);
					        	}
				        	}
				        }else{
				        	console.log('执行出来')
				        	return childs;
				        }
				    }
				    return false;
				}
		        
		        //递归函数  处理点击两次以上的数据
		        function set(data,obj,val,linksData){
//		        	console.log(data)
	            	/**
	            	 * data 数组 链路的集合  点击起点以后保存下来的数据   里面会包含途径与终点，点击的不是终点的时候才会调用该函数，否则返回
	            	 * obj  需要进行校验的数据(判断点击的点是否是  相关联的)
	            	 * val  文本集合
	            	 * */
	            	var selectData=[];//所选择的数组的集合
	            	if(data.length !==0){//如何data存在的时候   这个时候再求遍历数据   data是拿到所有跟起点相关的数据
	            		data.map(item => {
	            			if(obj.node.id === item.node.id){
	            				//当前点击的点  是这个集合里面的部分
		            			val.style.width=40;
								val.style.height=40;

	            				if( item.def_val !== '终点' ){
	            					//点击的不是终点的时候  还可以继续筛选
	            					data=[];
	            					linksData.some(function(v,j){
	            						if(v.target_val.node.id === obj.node.id || v.source_val.node.id === obj.node.id){
	            							data.push( v.source_val );
	            							data.push( v.target_val );
	            						}
	            					})
	            					
	            				}
	            				selectData.push(obj);
	            				
	            			}
	            			return 
	            		})
	            		
	            	}
	            	
	            }
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
		/*stroke:#8AD4F8 ;*/
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