<template>
	<div class='main'>
		<el-row>
			<el-col :span='24'>
					<el-form>
						<el-form-item>
							<template>
								<el-button @click='Save' v-if='buttonVal.save' >
									<!--保存布局-->
									{{$t('topology.topBtn.save')}}
								</el-button>
								<el-button @click='reset' id='reset'>
									<!--还原布局-->
									{{$t('topology.topBtn.reduction')}}
									
								</el-button>
							</template>
						</el-form-item>
					</el-form>
			</el-col>
			<el-col :span='24'>
				<el-col :span='24'class='back'>
					<ul>
						<li>
							<button  class='btn' id='big'>+</button>
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
					checkboxGroup1: [this.$t('topology.footerBtn.showLabel')],
					bandwidthLogo:true,//是否显示宽带标签
					bandwidth:this.$t('topology.footerBtn.bandW.showAllbandwidth'),
					network:[this.$t('topology.footerBtn.shwoNet.showBackboneNode'),this.$t('topology.footerBtn.shwoNet.showShardCloud'),this.$t('topology.footerBtn.shwoNet.showBackboneLink')],
				},
				networkStatus:false,//流量默认的时候是隐藏的
				logoStatus:true,//标签默认是显示的
				tagStatus:true,//默认的是显示的
				buttonData:this.recursion( this.$store.state.aside , 'aside.topoView'),//获取区域内的所有的按钮的权限
				buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏
		      		save:this.codeVal(this.recursion( this.$store.state.aside , 'aside.topoView').list,"topology@edit_node_location").show,//保存布局
		      	}
			}
		},
		created(){
			//aside.topoView

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
				let para={
					locations:this.saveData
				}
				this.$ajax.put('/topology/edit_node_location'+'?token='+this.token,para)
				.then(res => {

					if(res.status==200){
						if(res.data.status==0){
							this.$message({
								message:'修改成功!',
								type:'success'
							})
							this.getNodesData(this.selectForm)
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

					if(item ==='checkboxGroup1'){//进入隐藏标签和隐藏流量的控制部分   
						let str=obj['checkboxGroup1'];//用来查找对应的值
						
						if(str.length !=0){
							
							if(str.indexOf( this.$t('topology.footerBtn.showFlow') ) == -1){//隐藏流量
								linkVal=newLink;
							}else if(str.indexOf( this.$t('topology.footerBtn.showFlow') ) !=-1){//显示流量
								linksData.forEach(ele => {
									
									if(!ele.instant_speed && typeof(ele.instant_speed)!='undefined' && ele.instant_speed!=0){
										ele.instant_speed=0
									}
									
									var speedVal=ele.instant_speed/ele.bandwidth;
									if(speedVal>=0 && speedVal <=0.5){
										ele.speedColor='spedGreen'
									}else if(speedVal>0.5 && speedVal <=0.75){
										ele.speedColor='spedYellow'
									}else if(speedVal>0.75 && speedVal<=1 ){
										ele.speedColor='spedRed'
									}
									
								})
								linkVal=linksData
							}
							
							if(str.indexOf( this.$t('topology.footerBtn.showLabel') ) ===-1){//未找标签
								nodesData.forEach(ele => {
									ele.node.name=''
								})
								nodeVal=nodesData;
							}else if(str.indexOf( this.$t('topology.footerBtn.showLabel') ) !== -1){
								nodeVal=newNode;
							}

						}else{
							nodesData.forEach(ele => {
								ele.node.name=''
							})
//							linksData.forEach(ele => {
//								ele.bandwidth=''
//							})
							nodeVal=nodesData;
//							linkVal=linksData;

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
						if(str === this.$t('topology.footerBtn.bandW.showAllbandwidth') ){
							linkVal=linksData;
						}
						else{
							if(str === this.$t('topology.footerBtn.bandW.showbandwidth1')   ){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',1);
							}
								
							if(str === this.$t('topology.footerBtn.bandW.showbandwidth2') ){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',10);
							}
							
							if(str === this.$t('topology.footerBtn.bandW.showbandwidth3')  ){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',40);
							}
							
							if(str  === this.$t('topology.footerBtn.bandW.showbandwidth4')  ){
								linkVal=isTopo.isBandWidth(linksData,'bandwidth',100);
							}
							if(str  === this.$t('topology.footerBtn.bandW.showbandwidth5')   ){
								linkVal=isTopo.isBandVal(linksData);
							}	
						}			
					}
					if(item ==='network'){
						let arr=obj['network'];
						if(arr.length !==0){
							if(arr.indexOf(  this.$t('topology.footerBtn.shwoNet.showBackboneNode')    ) ===-1){
								nodeVal=nodesData.filter(item => {
									return item.type!=='node';
								})
							}else if(arr.indexOf(  this.$t('topology.footerBtn.shwoNet.showShardCloud')   ) === -1){
								nodeVal=nodesData.filter(item => {
									return item.type!=='cloun';
								})
							}else if(arr.indexOf(this.$t('topology.footerBtn.shwoNet.showBackboneLink')  ) === -1){

								linkVal=linksData.filter(item => {
									return item.type !=='link';
								})
							}
							else {
								nodeVal=nodesData;
//								linkVal=linksData;
							}
						}else {
							nodeVal=[];
							linkVal=[]
						}
					}
					
				}
				let setObj={
					nodeData:nodeVal,
					linkData:linkVal
				}

				this.setTopo(nodeVal,linkVal)
			},
			getNodesData:function(obj){//获取topo的节点的数据集合
				this.topoLoading=true;
				//先获取  节点的数据信息  在获取 链路的数据
				this.$ajax.get('/topology/node_location_list'+'?token='+this.token)
				.then(res => {
					this.topoLoading=false;
					if(res.status==200){
						if(res.data.status==0){
							this.nodesData=res.data.data;
//							this.getLinksData(this.nodesData,obj);
							return this.$ajax.get('/topology/links'+'?token='+this.token)
						}
					}
				})
				.then( response => {
					//获取链路的数据
					if(response.status == 200){
						if(response.data.status ==0){
							this.dealForm(obj,this.nodesData,response.data.data)
						}
					}
				})
				.catch(err => console.log(err))
			},
//			getLinksData:function(nodesData,obj ){   //获取链路的信息数据集合
//				this.linksData=[];
//				let that=this;
//				this.$ajax.get('/topology/links'+'?token='+this.token)
//				.then(res => {
//					if(res.status==200 && res.data.status==0){
//							that.linksData=res.data.data;	
//
//						this.dealForm(obj,nodesData,that.linksData)
//					}
//				}).catch(e => {console.log(e)})
//			},
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
				d3.select('svg').select('g').remove()
				var width = 890,
				  height = 470;
				var text_dx = -20;
				var text_dy = 20;
				var img_w=16,img_h=16;
				var radius=16;
				
				
				let that=this
				
				var linkForce=d3.forceLink(linksData).id(function(d){})
				
				let simulation = d3.forceSimulation()
				.nodes(nodesData)
				
				let centerForce = d3.forceCenter(width / 2, height / 2);
				
				let chargeForce = d3.forceManyBody()
				
				simulation
				.force('chargeForce', chargeForce)
//		      	.force('centerForce', centerForce)
		      	.force('links', linkForce)

				simulation.on('tick', tickActions)

				
				var  svg = d3.select('svg')
	            .attr('width',width)
	            .attr('height',height)
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
			    .attr('class',function(d){//对数据进行处理
			    	if(typeof d.speedColor =='undefined'){   //流量的显示不存在的时候   这个时候关闭   返回默认的颜色
			    		return linkColour;
			    	}else {  //当存在  流量的时候    显示流量
			    		return d.speedColor;
			    	}
			    })
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
				let newObj={};//保存拖拽后的每个节点数据
				function tickActions () {
		            node.attr("x", function(d) { return d.x-img_w/2; })
				        .attr("y", function(d) { return d.y-img_h/2; });
//					nodesData.forEach((d,i) => {   //设置边界
//						d.x= d.x - img_w/2 < 0 ? img_w/2 : d.x;
//						d.y=d.y - img_h/2 < 0? img_h/2 : d.y;
//					});
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
						return require('../../../assets/images/newTopo/node.png')
					}else if(nodes.type==='阿里云'){
						return require('../../../assets/images/newTopo/ali.png')					
					}else if(nodes.type==='腾讯云'){
						return require('../../../assets/images/newTopo/tencent.png')
						
					}else if(nodes.type==='华为云'){
						return require('../../../assets/images/newTopo/huawei.png')
									
					}else if(nodes.type==='UCloud'){
						return require('../../../assets/images/newTopo/ucloud.png')
								
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
	  	/*stroke: #6BC7E2;
	  	stroke-width: 1.5px;*/
	}
	.linkUP{
		/*cursor: pointer;
		stroke-width: 1.5px;*/
		stroke: #6BC7E2 ;
	}
	.linkDOWN{
		/*cursor: pointer;
		stroke-width: 1.5px;*/
		stroke: #444242;
	}
	.linkRun{
		/*cursor: pointer;
		stroke-width: 1.5px;*/
		stroke: #9254DE;
	}
	
	.spedGreen{
		/*cursor: pointer;*/
		stroke: #74CE9B !important;
	}
	.spedYellow{
		/*cursor: pointer;*/
		stroke: #EFB751 !important;
	}
	.spedRed{
		/*cursor: pointer;*/
		stroke: #E76D6C !important ;
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