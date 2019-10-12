<template>
	<div >
		<section>
		<el-row >
			<el-col :span='24'>
				<el-col :span='2'>
					<el-button @click="dis=!dis" class='btn' size='small'>
						<i :class="dis?'fa fa-chevron-right':'fa fa-chevron-left'" aria-hidden="true"></i>
					</el-button>
				</el-col>
				<el-col :span='22' v-show='dis'>
				    <ul style="overflow: hidden;">
				    	<li class='spanVal'>
				    		<el-checkbox-group v-model="filters.checkboxGroup1">
						        <el-checkbox-button v-for="(item,index) in cities" 
						        	:label="item.label" 
						        	:value='item.value' 
						        	:key="index" 
						        	>
						        	<i :class="item.cla"></i> <br />
						        	{{item.label}}</el-checkbox-button>
					      	</el-checkbox-group>
				    	</li>
				      	<li class="spanVal">
				      		<el-dropdown   trigger="click"  :hide-on-click="false">
				      			<el-button class='btn_val'>
				      				<span class="el-dropdown-link">
									    <i class="fa fa-sliders marB4" aria-hidden="true"></i><br />
									    带宽
									</span>
				      			</el-button>
							  <el-dropdown-menu slot="dropdown">
							  	<el-switch 
							  		active-text="显示带宽标签"
							  		v-model='filters.bandwidthLogo'>
								</el-switch>
								<template>
									
								
								<el-radio-group v-model='filters.bandwidth'>
								    <el-radio  v-for='(item,index) in bandwidthData' 
								  	 	:label="item" 
								  	 	:key="index"
								  	 	class='rad'></el-radio>
								</el-radio-group>
								</template>
							  </el-dropdown-menu>
							</el-dropdown>
				      	</li>
				    	<li class="spanVal">
				    		<el-dropdown  trigger="click"  :hide-on-click="false">
				    			<el-button class="el-dropdown-link">
				    				<span class="el-dropdown-link">
									    <i class="fa fa-paper-plane marB4" aria-hidden="true"></i><br />
									    显示网元
									</span>
				    			</el-button>
							  	<el-dropdown-menu slot="dropdown" >
								  	<el-checkbox  v-model='filters.network'
								  		v-for='item in networkData' 
								  	 	:label="item" 
								  	 	:key="item">{{item}}</el-checkbox>
							  	</el-dropdown-menu>
							</el-dropdown>
				    	</li>
				    	<li class="spanVal"  @click='example'  >
				    		<el-button class='btn_val'>
				    			<i  class="fa fa-columns marB4" aria-hidden="true"></i>
								<br /> 图例
				    		</el-button>
				    	</li>
				    </ul>
				</el-col>
			</el-col>
		</el-row>
		
		<!--图例的模板-->
		<el-dialog :title="textMap[dialogStatus]" :close-on-click-modal="false" :visible.sync="dialog"  class='dia'>
			<div class="sel">
				<h3>流量的颜色的含义</h3>
				<ul class="bor marT20" >
					<li class="sp">
						<div class="bac"></div>
						<span class="spn" >(0-50%)</span>
					</li>
					<li class="sp">
						<div class="bac"></div>
						<span class="spn">(50-75%)</span>
					</li>
					<li class="sp">
						<div class="bac"></div>
						<span class="spn">(75-100%)</span>
					</li>
				</ul>
			</div>
			<div class="sel">
				<h3>网元异常状态</h3>
				<ul class="bor marT20">
					<li class="sp">
						<div class="bacImg"><img src="../../../assets/images/newTopo/error.png" class="Img" /></div>
						<span class="spn">设备异常</span>
					</li>
					<li class="sp">
						<div class="bac"></div>
						<span class="spn">链路/VLL异常</span>
					</li>
					<li class="sp">
						<div class="bac"></div>
						<span class="spn">链路保护</span>
					</li>
				</ul>
			</div>
			<div class="sel">
				<h3>网元类型说明</h3>
				<div class="network marT20">
					<ul class="bor" >
						<li class="sp" v-for='item in imgData'>
							<div class="bacImg"> <img :src="item.img" class="Img"/></div>
							<span class="spn">{{item.name}}</span>
						</li>
					</ul>
				</div>
				
			</div>
		</el-dialog>
		</section>
	</div>
</template>

<script>
	
	const cityOptions = [
		{
			cla:'fa fa-paperclip marB4',
			label:'显示标签',
			value:'true'
		},{
			label:'显示流量',
			value:'true',
			cla:'fa fa-rss-square marB4'
		}
	];

	export default{
		name:'btnLeft',
		data(){
			return{
				filters:{
					checkboxGroup1: ['显示标签'],
					bandwidthLogo:true,//是否显示宽带标签
					bandwidth:'显示所有带宽链路',
					network:['显示骨干节点','显示公有云节点','显示骨干链接'],
				},
              	cities: cityOptions,             	
				dis:true,
				dialog:false,
				textMap:{
					example:'图例说明'
				},
				dialogStatus:'',
				imgData:[
					{
						img:require('../../../assets/images/newTopo/node.png'),
						name:'骨干节点'
					},
					{
						img:require('../../../assets/images/newTopo/ali.png'),						
						name:'阿里云'
					},
					{
						img:require('../../../assets/images/newTopo/aws.png'),		
						name:'AWS'
					},
					{
						img:require('../../../assets/images/newTopo/tencent.png'),	
						name:'腾讯云'
					},
					{
						img:require('../../../assets/images/newTopo/jinshan.png'),
						name:'金山云'
					},
					{
						img:require('../../../assets/images/newTopo/ucloud.png'),
						name:'UCloud'
					},
					{
						img:require('../../../assets/images/newTopo/baidu.png'),				
						name:'百度云'
					},
					{
						img:require('../../../assets/images/newTopo/huawei.png'),
						name:'华为云'
					},
					{
						img:require('../../../assets/images/newTopo/other.png'),
						name:'其他云'
					}
				],
				//网元的显示的控制
				networkData:['显示骨干节点','显示公有云节点','显示骨干链接'],
				bandwidthData:['显示所有带宽链路','显示1G带宽链路','显示10G带宽链路','显示40G带宽链路','显示100G带宽链路','显示其他带宽链路'],
//				bandwidthData:[
//				{
//					label:'显示所有带宽链路',
//					value:1000
//				},{
//					label:'显示1G带宽链路',
//					value:1
//				},{
//					label:'显示10G带宽链路',
//					value:10
//				},{
//					label:'显示40G带宽链路',
//					value:40
//				},{
//					label:'显示100G带宽链路',
//					value:100
//				},{
//					label:'显示其他带宽链路',
//					value:0
//				}],
			}
		},
		watch:{
			filters:{//对拓扑图下面的按钮的变化的时候金婷监听
				handler(newVal,oldVal){
					console.log(oldVal);
					console.log(newVal);
//					this.$store.commit('sendFilters',newVal)
					this.bus.$emit('sendType',newVal);
				},
				deep:true,
			}
		},
		mounted(){
//			this.$store.commit('sendFilters',this.filters);
			this.$store.state.filters=Object.assign({},this.filters)
		},
		methods:{
			example(){//图例的模板
				this.dialogStatus='example';
				this.dialog=true;
			},
		}
	}
</script>

<style scoped lang="scss">

	.btn{
		 /*width: 80px;*/
	    height: 50px;
	    line-height: 25px;
	    /*background-color:#D9D7DC;*/
	}
	.transition-box {
	    /*margin-bottom: 10px;*/
	    width: 80px;
	    height: 30px;
	    line-height: 30px;
	    border-radius: 4px;
	    background-color: #409EFF;
	    text-align: center;
	    color: #fff;
	    /*padding: 40px 20px;*/
	    /*box-sizing: border-box;*/
	    margin-right: 20px;
	    cursor: pointer;
	 }
	 .el-dialog{
	 	background: #B7BBB8;
	 }
	 .dia{
	 	.sel{
	 		margin-top: 10px;

	 		width: 100%;
	 		.bor{
	 			
	 			overflow: hidden;
	 			list-style: none;
		 		margin-bottom: 20px;
		 		background: rgb(253,255,254);
				width: 80%;
		 		.sp{
		 			float: left;
		 			width:33%;
		 			.bac{
		 				text-align: center;
		 				width: 60px;
		 				height: 8px;
		 				background: #7FFF00;
		 				border:1px solid azure;
		 				border-radius: 4px;
		 				margin-bottom: 20px;
		 			}
		 			.spn{
			 			display: inline-block;
			 			text-align: center;
			 			margin: auto;
			 		}
		 		}
		 		.sp:nth-child(2){
		 			.bac{
		 				background: #EFB751;
		 			}
		 		}
		 		.sp:nth-child(3){
		 			.bac{
		 				background: red;
		 			}
		 		}	
		 	}	
	 	}
	 	.sel:nth-child(2){
	 		.bor{	
	 			.sp:nth-child(1){ 
	 				.bacImg{
	 					
	 					.Img{	
	 						margin-left: 15px;
	 						width: 25px;
	 					}
	 				}
	 				.Img{
	 					width: 100%;
	 					text-align: center;
	 				}
	 			}
	 			.sp:nth-child(2){
	 				.bac{
	 					background: #444242;
	 				}
	 			}
	 			.sp:nth-child(3){
	 				.bac{
	 					background: #9254DE;
	 				}
	 			}
	 		}
	 	}
	 	.sel:nth-child(3){
	 		/*网元部分*/
	 		.network{
	 			.bor{
	 				
	 				list-style: none;
	 				overflow: hidden;
	 				margin-bottom: 20px;
	 				
	 				.sp{
	 					
	 					float: left;
	 					width: 20%;
	 					margin-bottom: 10px;
	 					
	 					.bacImg{
	 						
	 						text-align: center;
	 						
	 						.Img{
	 							
	 							width: 30px;
	 							height: 25px;
	 						}
	 					}
	 					.spn{
	 						width: 100%;
	 						display: inline-block;
	 						text-align: center;
	 					}
	 				}
	 			}
	 		}
	 	}
	 }
		/*按钮的各个选线的部分的样式*/
		.leftBtn{
			width: 100%;
			
			.btnSel{
				position: relative;
				bottom: 0px;
				width: 12%;
				text-align: left;
				
				.net{
					width: 130px;
					.sel{
						border: 1px solid  #8D8C8E;
						border-radius:3px ;
						position: relative;
						top: -260px;
						list-style: none;
						width: 100%;
						z-index:10;
						
						li{
							text-align: left;
							width: 100%;
							height: 30px;
							line-height: 30px;
							margin-left: -30px;
						}
					}
				}
			}
		}
		
.spanVal{
	float: left;

}
.btn_val{
	width: 100px;
}
.popper__arrow{
	left: 0px;
}
.el-checkbox{
	display: block;
	width: 100px;
	margin: 10px;
}
/*.el-checkbox-button__inner{
	width: 100px !important;
}*/
.el-checkbox-button__inner{
	width: 100px !important;
}
/*.el-checkbox-button__inner{
	display: inline-block;
	width: 100px;
}*/
.el-dropdown-menu{
	width: 180px !important;
	overflow: hidden;
}
.el-switch{
	margin-left: 10px;
}
.rad{
	margin-left: 15px;
	margin-top: 13px;
}
</style>