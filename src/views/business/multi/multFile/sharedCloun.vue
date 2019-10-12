<template>
	<div>
		<!--公有云部分-->
		<el-form :model='editForm':rules='editFormRules' ref='editForm'label-width='100px' v-loading='editLoading'>
			<el-form-item label='公有云'prop='cloun'>
				<el-select v-model='editForm.cloun' filterable  class='ipt' >
					<el-option v-for='(item ,index) in clounData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<span class="cli_toTip" title="请选择本次链接云的类型">?</span>
			</el-form-item>
			<el-form-item label='目标Region' prop='targetRegion'>
				<el-select v-model='editForm.targetRegion' class='ipt' @change='selRegion(editForm.targetRegion)'>
					<el-option v-for='(item ,index) in targetRegionData'
						:label='item'
						:value='item'
						:key='index'></el-option>
				</el-select>
				<span class="cli_toTip" title="云便捷路由器(VBR)归属区域">?</span>
			</el-form-item>
			<el-form-item label='云对接链路' prop='clounDock'>
				<el-select v-model='editForm.clounDock'class='ipt'>
					<el-option v-for='(item ,index) in clounDockData'
						:label='item.name'
						:value='item.id'
						:key='index'>
					<span>{{item.name}}</span>
					<span style="margin-left: 20px;">{{item.logic_port.name}}</span>
					</el-option>
				</el-select>
				<span class="cli_toTip" title="对接云的物理线路">?</span>
			</el-form-item>
			<el-form-item v-for='(item,index) in dockLinks' :label='item.show_name':key='index' :prop='item.keyVal'
				:rules="{required:true,message:'不能为空',trigger:'blur'}">
				<el-input v-model='item.keyVal':placeholder="'请输入'+item.show_name"class='ipt'
					:disabled='editForm.cloun==="腾讯云"?true:false' ></el-input>
				<span v-if='editForm.cloun==="腾讯云"?(item.show_name==="专线通道ID"?true:false):false' 
					style="cursor: pointer; color: orangered;" @click="tenRules">?</span>
			</el-form-item>
		</el-form>
		
		<!--腾讯云配置   => rules-->
		<el-dialog :title='textMap[dialogStatus]' :visible.sync="dialogFormVisible" :close-on-click-modal="false" v-loading='seeLoading'>
			<el-form label-position='left' :model='seeForm' ref='seeForm'label-width='80px'>
				<h3>腾讯专用通道ID如何创建?</h3>
				<ul class="marT10">
					<li class="marT10">
						第一步：让客户登录腾讯云控制台，进入"专线接入"模块下"专用通道"列表中进行创建;点击列表中左上角"创建"按钮,
						腾讯云控制台登录网址: <a href="https://cloud.tencent.com/login?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2F"style="text-decoration: none;">
							(点击进入腾讯云控制台)
						</a>
					</li>
					<li class="marT10">
						<img :src="tc1"  class="tc_img"/>
					</li>
					<li class="marT10">
						第二步:点击"新建"按钮进入基本配置页面，此页面用户需注意一下四个字段的填写方式，如下图所示: 
						<div class="marT5">
							<span class="span_left_tit span_tit_one">1</span>
							专线类型:一定要选择"共享专线"类型，否则创建的专线通道ID不能使用	
						</div>
						 <!--<br />-->
						<div class="marT5">
							<span class="span_left_tit span_tit_two ">2</span>
							专线提供方: <span class="span_toTip">{{copy.Dedicated}}</span>请将此数据填写值基本配置页面中"专线提供方"
							<span class="cur_span"  v-clipboard:copy="copy.Dedicated"  
								v-clipboard:success="onCopy"  v-clipboard:error="onError">复制</span> 
						</div>
						<!--<br />-->
						<div class="marT5">
							<span class="span_left_tit span_tit_three ">3</span>
							共享专线ID: <span class="span_toTip">{{copy.shardID}}</span>请将此数据填写至基本配置页面中"共享专线ID"字段中
							<span class="cur_span"	  v-clipboard:copy="copy.shardID"  
								v-clipboard:success="onCopy"  v-clipboard:error="onError">复制</span>	
						</div>
						 <!--<br />-->
						<div class="marT5">
							<span class="span_left_tit span_tit_four ">4</span>
							地域: <span class="span_toTip">{{copy.area}}</span>请根据此数据在基本配置页面中进行相应的地域选择，确保选择的一致性 
							<span class="cur_span"	  v-clipboard:copy="copy.area"  
								v-clipboard:success="onCopy"  v-clipboard:error="onError">复制</span>
						</div>	
						
					</li>
					<li class="marT10">
						<img :src="tc2" alt=""  class="tc_img"/> <br />
						<template class="marT7">
							"基本配置"页面值需要注意以上四个字段的填写方式，其余字段信息用户如实填写完成既可，填写完毕点击"下一步"。
						</template>
						
						
					</li>
					<li class="marT10">
						第三步:点击"下一步"进入"高级配置"页面，里面的字段信息用户如实填写既可，填写完毕点击"下一步"。
					</li>
					<li class="marT10">
						第四步:点击"下一步"进入"配置IDC设备"页面，里面的字段信息用户如实填写既可，填写完毕点击"提交"等待创建成功, <br />
						创建成功后，生成专用通道ID，即:列表中蓝色标识ID,如图所示: <br />
						将此专用通道ID填写到天驰网络系统"专线通道ID"字段中 <br />
						<img :src="tc3"  class="tc_img marT7"/>
					</li>
					<li style="text-align: center;" class="marT10">
						<el-button type='primary' size='small' @click='dialogFormVisible=false' >我已知晓</el-button>
						
					</li>
					
				</ul>
			</el-form>
		</el-dialog>
		<!--<button @click='tenRules'>click</button>-->
	</div>
</template>

<script>


	export default{
		name:'sharedCloun',
		data(){
			return{
				tc1:require('../../../../assets/images/tc1.png'),
				tc2:require('../../../../assets/images/tc2.png'),
				tc3:require('../../../../assets/images/tc3.png'),
				copy:{//拷贝的数据
					Dedicated:'打开后需要获取的数据',
					shardID:'打开后需要获取的数据',
					area:'打开后需要获取的数据'
				},
				token:'',
				editForm:{
					cloun:'',
					targetRegion:'',
					clounDock:'',
				},
				clounidsList:'',//根据id找到对应的 interface_driver
//				clounDockObj:{},//保存云对接的对象数据
				dockListObj:{},//选择不同的云对接的时候，将数据发送到父组件
				editFormRules:{
					cloun:[{ required: true, message: '请选择公有云', trigger: 'change' }],
					targetRegion:[{ required: true, message: '请选择目标region', trigger: 'change' }],
					clounDock:[{ required: true, message: '请选择云对接', trigger: 'change' }],
				},
				editLoading:false,
				clounData:[],//公有云的数据
				targetRegionData:[],//目标 region
				clounDockData:[],//云对接的数据
				dockLinks:[],//根据不同的云对接的获取不同的列表
				str:[],
				seeLoading:false,
				textMap: {
		        	see:'如何获取腾讯专线通道ID'
		      	},
		      	dialogFormVisible:false,
		      	dialogStatus:'',
		      	seeForm:{}
			}
		},
		watch:{
			editForm:{
				handler(newVal,oldVal){
						if(newVal.clounDock){
							if(newVal.clounDock==='Automatically'){
								this.selectCloun(this.selectDriver(this.clounDockData[1].id));//自动分配的时候获取数组里面的数据的第二个id
							}else{
								this.selectCloun(this.selectDriver(newVal.clounDock));//获取所选的列表
							}
						}
						
						if(newVal.cloun){
							
						}
						
					this.$emit('sendClounbasic',this.editForm)//发送基本的云选择的列表
					this.$emit('sendClounbasic_a',this.editForm)
					this.$emit('sendClounbasic_z',this.editForm)
					
				},
				deep:true,
			},
			dockLinks:{
				handler(newVal,oldVal){
					newVal.forEach(ele => {
						this.dockListObj[ele.name]=ele.keyVal;
					})
					this.$emit('sendClounList',this.dockListObj) //发送云列表到父组件
				},
				deep:true,
			}

		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getFormData()
			
		},
		mounted(){
			if(this.clounData.length!==2){
				this.clounData=localStorage.getItem("temp");
			}else{
				return this.clounData;
			}
		},
		methods:{
			tenRules(){
				this.dialogStatus='see'
				this.dialogFormVisible=true;
				
			},
			onCopy(e){
				this.$message({
					message:'复制成功!',
					type:'success'
				})
			},
			onError(e){
				this.$message({
					message:'复制失败！',
					type:"warning"
				})
			},
			handleSelect(item) {

				this.editForm.cloun=item;
				let para={
					search_cloud:item
				}
				//获取目标region
				this.$ajax.get('/vll/get_cloud_region'+"?token="+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.targetRegionData=res.data.data;
						}
					}
				}).catch(e => {console.log(e)})
				
		    },
		    selRegion(ids){
		    	this.editForm.clounDock='';
		    	let para={
		    		search_cloud:this.editForm.cloun,
		    		search_region:ids,
		    	}
		    	
		    	this.$ajax.get('/link/cloud_links'+'?token='+this.token,para)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.clounDockData=res.data.data.items;
							this.clounDockData.unshift({interface_driver:'自动分配',name:'自动分配',id:'Automatically',logic_port:{name:''}})
						}
					}
				}).catch(e => {
					console.log(e)
				})
		   },
			getFormData(){
				//获取公有云的列表
				this.$ajax.get('/vll/get_public_cloud'+'?token='+this.token)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							this.clounData=res.data.data;
						}
					}
				}).catch(e => {
					console.log(e)
				})

				//获取云对接的链路
//				this.$ajax.get('/link/cloud_links'+'?token='+this.token)
//				.then(res => {
//					console.log(res);
//					if(res.status==200){
//						if(res.data.status==0){
//							console.log(res)
//							this.clounDockData=res.data.data.items;
//							this.clounDockData.unshift({interface_driver:'自动分配',name:'自动分配',id:'Automatically',logic_port:{name:''}})
//						}
//					}
//				}).catch(e => {
//					console.log(e)
//				})
			},
			selectCloun(clounName){
				var para={
					name:clounName
				}
				this.$ajax.get('/vll/get_driver_frame/'+clounName+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
//							this.clounList=res.data.data;
							res.data.data.forEach(ele => {
								ele.keyVal=''
							})
							console.log(res.data.data);
							this.dockLinks=res.data.data;
//							res.data.data.forEach(ele => {
//								this.dockListObj[ele.name]=ele.keyVal;
//							})
						}
					}
				}).catch(e => {console.log(e)})
			},
			selectDriver(ids){//根据选择的interface_driver  从数组里面获取该对象数据
				let str=''
				var findDriver=this.clounDockData.find(function(obj){
					return obj.id===ids
				})
				str=findDriver.interface_driver;
				return str;
			}
		}
	}
</script>

<style>
	.tc_img{
		width: 570px;
	}
	.span_toTip{
		display: inline-block;
		color:#FD042B;
		margin: 0 5px;
	}
	.cur_span{
		font-size: 12px;
		display: inline-block;
		background-color: #67C23A;
		cursor: pointer;
		border-radius: 6px;
		width: 40px;
		height: 24px;
		line-height: 24px;
		text-align: center;
	}
	.span_left_tit{
		display: inline-block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		border: 1px solid ;
		border-radius:10px ;
		color: #000000;
		font-weight: 300;
	}
	.span_tit_one{
		background-color: #009DD9;
	}
	.span_tit_two{
		background-color: #FFFF00;
	}
	.span_tit_three{
		background-color: #66FF00;
	}
	.span_tit_four{
		background-color: #FF00FF;
	}
</style>