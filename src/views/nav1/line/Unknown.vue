<template>
	<div>
		<section>
			<!--顶部工具栏-->
			<el-col :span='24' class='toolbar ' style='width:100%;'>
				<el-form :inline='true' :model='filters' ref='filters'>
					<el-form-item label='名字' prop='search_name'>
						<el-input v-model='filters.search_name'></el-input>
					</el-form-item>
					<el-form-item label='状态' prop='search_status'>
						<el-select v-model='filters.search_status'plachodle='全部' class='sel'>
							<el-option v-for='(item,index) in status'
								:label='item.label'
								:key='index'
								:value='item.value'
								>								
							</el-option>
						</el-select>
					</el-form-item>
					  <!--type="daterange"-->
					<el-form-item label='创建时间'>
						<el-date-picker
					      v-model="filters.timeVal"					    
					      type="daterange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' v-on:click='getUsers()'>搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type='info' @click='reset(filters)'>重置</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			
			<!--列表的数据部分-->
			<!--列表的数据导出部分-->
			<el-col :span='24'>
				<!--<el-col :span='4'>
					<el-dropdown split-button type='success'>
						导出数据
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item> <el-button @click='downloadExcel'> 当前页</el-button></el-dropdown-item>
							<el-dropdown-item> <el-button @click='downloadExcelList'> 所有页</el-button></el-dropdown-item>
							
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>-->
				<el-col :span='24'>
					<template>
						<el-button type='success'@click='handleAdd'>+添加未知链路</el-button>
						<el-button type='primary' @click='handleFound'>发现链路</el-button>
					</template>
				</el-col>

			</el-col>
			<el-table :data='users' highlight-current-row @selection-change="selsChange" style='width: 100%;' v-loading='loading'>
				<el-table-column type='selection' width='60'></el-table-column>
				<el-table-column type='index' width='60' label='序号' align='center'></el-table-column>
				<el-table-column prop='creation_time' width='120' label='申请时间' :formatter='dateFormat' align='center'></el-table-column>				
				<el-table-column label='A端' width='100' align='center'>
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'style='cursor: pointer;'@click='handelSee_aNode(scope.$index,scope.row)'>{{scope.row.a_node.name}}</el-tag>
						-{{scope.row.a_ip}}-{{scope.row.a_vlan}}
					</template>
				</el-table-column>
				<el-table-column  label='Z端' align='center' width='100'>
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'style='cursor: pointer;' @click='handelSee_zNode(scope.$index, scope.row)'>{{scope.row.z_node.name}}</el-tag>
						-{{scope.row.z_ip}}-{{scope.row.z_vlan}}
					</template>
				</el-table-column>
				<el-table-column prop='bandwidth' label='总带宽(Mbps)' align='center' width='100'>
				</el-table-column>
				<el-table-column prop='physical_bandwidth' label='物理带宽(Mbps)' align='center' width='100'>
				</el-table-column>
				<el-table-column  label='剩余带宽(Mbps)' align='center' width='100'>
					<template slot-scope='scope'>{{scope.row.bandwidth-scope.row.physical_bandwidth}}</template>
				</el-table-column>
				<el-table-column prop='link_cost' label='链路开销' align='center' width='100'>
				</el-table-column>
				<el-table-column prop='monitoringText' label='链路检测' align='center' width='100'>
				</el-table-column>
				<el-table-column prop='description' label='备注' align='center' width='150'>
				</el-table-column>
				<el-table-column  label='操作' align='center' width='400'>
					<template slot-scope='scope'>
						<el-button size='small' type='primary' @click='handleStart(scope.$index, scope.row)'>运行</el-button>
						<el-button size='small' type='info' @click='handleSee(scope.$index, scope.row)'>详情</el-button>
						<el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>				
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)"  >删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--底部数据导航部分-->
			<el-col :span='24' class='toolbar'>
				<el-col :span='3'>
					<el-button type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0">批量删除</el-button>
				</el-col>
				<el-col :span='21'>
					<el-pagination
						:total="total"
				     	@size-change="handleSizeChange"
                   		@current-change="handleCurrentChange"
				     	layout="total, sizes, prev, pager, next, jumper"
				     	:page-sizes="[10, 20, 30,50]" 						     	 
				     	:current-page.sync="currentPage"  
				     	:page-count='pageNum'
				     	:pager-count="pagecount"
				     	:prev-text='prev'
				     	:next-text='next'></el-pagination>
				</el-col>
			</el-col>

			<!--添加部分/编辑部分/发现链路-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync='dialogFormVisible':close-on-click-modal="false" v-loading='editLoading'>
				<el-form  label-position='left' :model="editForm" label-width='130px' ref='editForm' :rules="editFormRules">
					<!--编辑和详情的时候才会显示的时间列表-->
					<el-form-item label='申请时间' v-show='editFormStatus'>
						<el-input v-model='editForm.creation_time' :disabled='seeStatusCreatime'  class='ipt'></el-input>
						<!--<template>{{editForm.creation_time}}</template>-->
					</el-form-item>
					<el-form-item label='A端节点' prop='a_node_id'>
						
						<el-select v-model='editForm.a_node_id' :disabled='seeStatus'  class='ipt'>
							<el-option
								v-for='(item,index) in nodeData'
								:key='index'
								:label='item.name'
								:value='item.id'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='A端接口IP(cidr)'prop='a_ip'>
						<el-input v-model='editForm.a_ip' :disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='A端接口VLAN:' prop='a_vlan'>
						<el-input v-model='editForm.a_vlan' :disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='A端描述' prop='a_desc'>
						<el-input v-model='editForm.a_desc' :disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='Z端节点' prop='z_node_id'>
						<el-select v-model='editForm.z_node_id':disabled='seeStatus'  class='ipt'>
							<el-option
								v-for='(item,index) in nodeData'
								:key='index'
								:label='item.name'
								:value='item.id'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='Z端接口IP(cidr)'prop='z_ip'>
						<el-input v-model='editForm.z_ip':disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='Z端接口VLAN'prop='z_vlan'>
						<el-input v-model='editForm.z_vlan':disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='Z端描述:'prop='z_desc'>
						<el-input v-model='editForm.z_desc':disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='总带宽(Mbps)' prop='bandwidth'>
						<el-input v-model.number='editForm.bandwidth' :disabled='seeStatus' placeholder="请输入正整数"  class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='物理带宽(Mbps)' prop='physical_bandwidth'>
						<el-input v-model.number='editForm.physical_bandwidth'placeholder="请输入正整数"   :disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='链路开销' prop='link_cost'>
						<el-input v-model.number='editForm.link_cost'  :disabled='seeStatus' placeholder="请输入正整数"  class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='链路检测' prop='monitoring'>
						
						<el-radio-group v-model='editForm.monitoring' :disabled='seeStatus'>
								<el-radio 
									v-for='(item,index) in detectionStatue'
									:key='index' 
									:value='item.label'
									:label='item.label' >{{item.name}}
								</el-radio>				
						</el-radio-group>
					</el-form-item>
					<el-form-item v-show='detectionStatus' label='检测类型'>
						<el-select v-model='editForm.monitoring_type' :disabled='seeStatus' placehold='请选择' class='ipt' >
							<el-option v-for='(item,index) in detectionType'
								:value='item.value'
								:label='item.label'
								:key='index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-show='detectionStatus' label='检测参数'>
						<el-input v-model='editForm.monitoring_param':disabled='seeStatus' class='ipt'></el-input>
					</el-form-item>
					<el-form-item  label='流量获取键入值'>
						<el-input v-model='editForm.monitoring_param' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='备注' >
						<el-input type='textarea'cols="7" v-model='editForm.description' :disabled='seeStatus' class='ipt' ></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='dialogFormVisible=false'>取消</el-button>
					<el-button  v-if="dialogStatus=='update'"type="primary" @click="updateData">保存</el-button>
					<el-button  v-else-if="dialogStatus=='creat'"type="primary" @click="creatData">保存</el-button>		
				</div>
			</el-dialog>
			
			<!--发现链路-->
			<el-dialog :title='TitleMap[dialogFormValue]' :visible.sync='foundFormVisible':close-on-click-modal="false">
				<el-form :model="foundForm" label-width='0px' ref='foundForm'>
					<el-form-item>
						<el-input v-model='foundForm.parameter'placeholder="请输入发现链路参数"></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='foundFormVisible=false'>取消</el-button>
					<el-button type='primary'v-if='dialogFormValue=="found"' @click='foundData'>提交</el-button>
				</div>
			</el-dialog>
		</section>
		
		
		
	</div>
</template>

<script>
	import {datedialogFormat} from '@/assets/js/index.js'
	
	export default{
		name:'Unknown',
		data(){
			return{
				radio: '1',
				//获取用户的权限token
				token:'',
				//顶部分工具栏的搜索部分
				filters:{
					search_name:'',
					search_status:'',
					start_time:'',
					end_time:'',
					//总的接收时间
					timeVal:'',
				},
				//顶部搜索栏部分的状态部分
				status:[
					{
						value:'UP',
						label:'UP'
					},{
						value:'DOWN',
						label:'DOWN'
					}
				],
				//用来接收的数据
				users:[],
				sels:[],
				//用来判断是否开启的部分的按钮的显示与隐藏
				start:true,
				loading:false,
				//分页所需要的参数
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,
				next:'下一页',
				prev:'上一页',
				//编辑的时候界面的显示
				editForm:{
					id:'',
					a_node_id:'',
					a_node_name:'',
					a_ip:'',
					a_vlan:'',
					a_desc:'',
					z_node_id:'',
					z_node_name:'',
					z_ip:'',
					z_vlan:'',
					z_desc:'',
					bandwidth:'',
					physical_bandwidth:'',
					link_cost:'',
					monitoring:'',
					monitoring_type:'',
					monitoring_param:'',
					maintenance_type:'',
					status:'',
					creation_time:'',
					description:'',
				},
				//添加的时候校验规则
				editFormRules:{
					a_node_id:[{ required: true, message: '请选择A端节点', trigger: 'change' }],
					a_ip:[{ required: true, message: '请输入A端端口ip', trigger: 'blur' }],
					a_vlan:[{ required: true, message: '请输入A端端口vlan', trigger: 'blur' }],
					a_desc:[{required:true, message:'请输入A端端口描述',trigger:'blur'}],
					z_node_id:[{ required:true, message:'请选择Z端节点',trigger:'change'}],
					z_ip:[{required:true , message:'请输入Z端端口IP', trigger:'blur'}],
					z_vlan:[{ required:true , message:'请输入Z端端口vlan',trigger:'blur'}],
					z_desc:[{ required:true , message:'请输入Z端端口描述',trigger:'blur'}],
					physical_bandwidth:[{ required:true ,message:'请输入物理带宽',trigger:'blur'}],
					bandwidth:[{ required:true , message:'请输入总带宽',trigger:'blur'}],
					
					monitoring:[{required:true ,message:'请选择链路检测类型', trigger:'change'}],
					
					link_cost:[{ required:true ,message:'请输入链路开销',trigger:'blur'}]	
				},
				//链路检测是否开启部分
				detectionStatue:[
					{

						label:true,
						name:'开启'
					},{

						label:false,
						name:'关闭'
					}
				],
				detectionType:[
					{
						label:'BFD',
						value:'BFD'
					}
				],
				textMap:{
					creat:'添加',
					update:'编辑',
					see:'详情',
					
				},
				//发现未知节点的数据
				foundForm:{
					parameter:''
				},
				TitleMap:{
					found:'发现链路参数配置'	
				},
				dialogFormValue:'',
				foundFormVisible:false,

				dialogStatus: "",
				
				dialogFormVisible:false,
//				dialogForm:false,
				editLoading:false,

//				disup:false,
				//在日志里面的添加和编辑的部分默认的是显示的
				editFormDialogStatus:true,
				//申请时间在默认的时候是隐藏的,添加的时候控制为隐藏，编辑的时候显示
				editFormStatus:false,
				//保存的导出的时候数据
				excelData:[],
				//添加的时候节点部分的获取的数据
				nodeData:[],
				nodeZ:[],
				//控制检测类型和检测参数的显示隐藏，默认的时候是隐藏的
				detectionStatus:false,
				seeStatus:false,	
				seeStatusCreatime:true,
				 
			}
		},
		watch:{
			//检测editForm里面的额monitoring的变化
			'editForm.monitoring':function(newVal,oldVal){
				console.log(typeof oldVal);
				console.log(newVal)
				if(newVal){
					console.log('开启')
					this.detectionStatus=true;
				}else if(!newVal){
					console.log('关闭');
					this.detectionStatus=false;
				}
			},

		},
		created(){
			//获取用户的权限
			this.token=sessionStorage.getItem('token');
			console.log(this.token);
			this.getUsers();
			this.getNodeData();
			
		},
		methods:{
			handleSizeChange(val){
//				console.log(`每页${val}条`);
				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
//				console.log(`当前页数是:${val}`)
				this.currentPage=val;
				this.getUsers()
			},
			reset(sels){
//				console.log(sels)
				for(let key in sels){
					sels[key]='';
				}
			},
			getUsers(){
//				var this=this;
				
				//获取数据和搜索
				this.laoding=true;
				//对时间的选择的处理，当不选择的时候作为一个空
				if(this.filters.start_time==''&& this.filters.start_time!=''){
					this.filters.start_time='';
					this.filters.start_time=Number(this.filters.timeVal[0]);
				}else if(this.filters.start_time=='' && this.filters.start_time!=''){
					this.filters.start_time='';
					this.filters.end_time=Number(this.filters.timeVal[1]);
				}else if(this.filters.start_time ==''&& this.filters.start_time==''){
					this.filters.start_time='';
					this.filters.start_time='';
				}else{
					this.filters.start_time=Number(this.filters.timeVal[0]);
					this.filters.end_time=Number(this.filters.timeVal[1]);
				}
				
				var para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.search_name,
					search_status:this.filters.search_status,
					start_time:this.filters.start_time,
					end_time:this.filters.end_time,
				}
				this.$ajax.get('/link/unknown_links'+'?token='+this.token,para)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							this.users=res.data.data.items;
//							this.total=res.data.data.page.total;
							this.users.forEach(ele => {
								if(ele.monitoring){
									ele.monitoringText='开启'
								}else if(!ele.monitoring){
									ele.monitoringText='关闭'
								}
							})
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
			},
			getNodeData(){
				//获取节点的数据
				this.$ajax.get('/node/nodes'+'?token='+this.token)
				.then(res => {
					console.log(res);					
					if(res.status==200){
						if(res.data.status==0){
							this.nodeData=res.data.data.items;
						}
					}
					
				}).catch( e => {
					console.log(e)
				})
			},
			handleAdd(){
				
				//添加
				this.dialogStatus='creat';
				this.editFormStatus=false;
				this.seeStatus=false;
				//添加位置链路
				this.dialogFormVisible=true;
				this.editForm={
					a_node_id:'',
					a_ip:'',
					a_vlan:'',
					a_desc:'',
					z_node_id:'',
					z_ip:'',
					z_vlan:'',
					z_desc:'',
					physical_bandwidth:'',
					bandwidth:'',
					
					monitoring:'false',
					
					monitoring_type:'',
					monitoring_param:'',
					link_cost:'',
					description:'',
//					token:this.token
				};
			},
			creatData:function(){
//				var this=this;
//				console.log(this.editForm)
				this.$refs.editForm.validate(valid => {
					if(valid){
						this.$confirm('确认提交吗?','提示',{})
						.then( () => {
							let para=Object.assign({},this.editForm);
							this.$ajax.post('/link/add_unknown_link'+'?token='+this.token,para)
							.then( res => {
								console.log(res);
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'添加成功',
											type:'success'
										})
//										this.$refs['editForm'].resetFields();
										this.$refs.editForm.resetFields();
										
										this.dialogFormVisible=false;
										this.getUsers()
									}else if(res.data.status){
//										this.$refs.editForm.resetFields();
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							}).catch(e => {
								console.log(e)
							})
						}).catch(() => {})
					}
				})
			},
			handleSee(index,row){
				//详情
//				var this=this;
				this.dialogStatus='see';
				this.dialogFormVisible=true;
//				this.disup=true;
				this.seeStatus=true;
				this.$ajax.get('/link/unknown_link_info/'+row.id+'?token='+this.token)
				.then( res => {
					if(res.status==200){
						if(res.data.status==0){
							this.editForm=res.data.data;
							this.editForm.a_node_id=res.data.data.a_node.id;
							this.editForm.a_node_name=res.data.data.a_node.name;
							this.editForm.z_node_id=res.data.data.z_node.id;
							this.editForm.z_node_name=res.data.data.z_node.name;
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			handleEdit(index,row){
				console.log(row);
				//编辑
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.seeStatus=false;
				//显示时间
				this.editFormStatus=true;
//				console.log(typeof row.monitoring)
				this.editForm={
					id:row.id,
					a_node_id:row.a_node.id,
					a_node_name:row.a_node.name,
					a_ip:row.a_ip,
					a_vlan:row.a_vlan,
					a_desc:row.a_desc,
					z_node_id:row.z_node.id,
					z_node_name:row.z_node.name,
					z_ip:row.z_ip,
					z_vlan:row.z_vlan,
					z_desc:row.z_desc,
					bandwidth:row.bandwidth,
					physical_bandwidth:row.physical_bandwidth,
					link_cost:row.link_cost,
					monitoring:row.monitoring,
					monitoring_type:row.monitoring_type,
					monitoring_param:row.monitoring_param,
					maintenance_type:row.maintenance_type,
					status:row.status,
					creation_time:'',
					description:row.description,
				}

				this.editForm.creation_time=datedialogFormat(row.creation_time)
			},
			updateData(){
				//编辑操作
//				var this=this;
				this.$refs.editForm.validate(valid => {
					if(valid){
						this.$confirm('确认要提交吗?','提示',{})
						.then( () => {
							let para={
								a_node_id:this.editForm.a_node_id,
								a_ip:this.editForm.a_ip,
								a_vlan:this.editForm.a_vlan,
								a_desc:this.editForm.a_desc,
								z_node_id:this.editForm.z_node_id,
								z_ip:this.editForm.z_ip,
								z_vlan:this.editForm.z_vlan,
								z_desc:this.editForm.z_desc,
								physical_bandwidth:this.editForm.physical_bandwidth,
								bandwidth:this.editForm.bandwidth,
								monitoring:this.editForm.monitoring,
								monitoring_type:this.editForm.monitoring_type,
								monitoring_param:this.editForm.monitoring_param,
								link_cost:this.editForm.link_cost,
								description:this.editForm.description,	
							}
							this.$ajax.put('/link/edit_unknown_link/'+this.editForm.id+'?token='+this.token,para)
							.then( res => {
								console.log(res);
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功',
											type:'success'
										})
										this.dialogFormVisible=false;
										this.getUsers();
									}else if(res.data.status){
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
									
								}
							})
							.catch(e => {
								console.log(e)
							})
						})
						.catch((e) =>{
							console.log(e)
						})
					}
				})
			},
			handleStart(index,row){
				//运行
				this.$confirm('确认将次链路开通运行吗?','提示',{
					type:'primary'
				})
				.then (() => {
					this.$ajax.put('/link/run_link/'+row.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'运行成功，请到数据中心查看!',
									type:'success'
								})
								this.getUsers()
							}else if(res.data.status){
								this.$message({
									message:res.data.message,
									type:'danger'
								})
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
				})
				.catch(( ) => {})
			},
			handelSee_aNode(index,row){
				console.log(row);
				//查看a的节点的详细的信息
				this.$router.push({path:'/location/index/details/'+row.a_node.id});	
			},
			handelSee_zNode(index,row){
				//查看z节点额详细信息
				this.$router.push({path:'/location/index/details/'+row.z_node.id});
				
			},
			handleDel(index,row){
				//删除
//				var this=this;
				this.$confirm('确认删除吗?','提示',{
					type:'danger'
				})
				.then( () => {
					this.$ajax.del('/link/del_unknown_link/'+row.id+'?token='+this.token)
					.then( res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'删除成功',
									type:'success'
								})
								this.getUsers()
							}else if( res.data.status){
								this.$message({
									message:res.data.message,
									type:'danger'
								})
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
				})
				.catch(() => {})
			},

			handleFound(){
				//发现链路的参数的配置
				this.dialogFormValue='found';
				this.foundFormVisible=true;
			},
			foundData(){
//				var this=this;
				//保存的时候提交请求
				this.$refs.foundForm.validate(valid => {
					if(valid){
						// this.$confirm('确定要提交吗?','提示',{})
						// .then(() => {
							var para={
								
							};
							this.foundFormVisible=false;
						// }).catch(() => {})
//						this.foundFormVisible=false;
					}else{
						this.foundFormVisible=false;
						this.$message({
							message:'参数不能为空!',
							type:'warning'
						})
					}
				})
			},
			selsChange(sels){
				//用来保存多选的时候的数据
				this.sels=sels;
			},
			batchRemove(rows){
				//批量删除
//				var this=this;
				var ids=[];
				rows.forEach(ele => {
					ids.push(ele.id)
				})
				this.$confirm('确认删除选中的记录吗?','提示',{
					type:'danger'
				})
				.then( () => {
					let para={
						ids :ids,
					};
					this.$ajax.del('/link/del_unknown_links'+'?token='+this.token,para)
					.then( res => {

						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'删除成功',
									type:'success'
								})
								this.getUsers()							
							}else{
								this.$message({
									message:res.data.message,
									type:'danger'
								})
							}
						}
					})
					.catch( e => {
						console.log(e)
					})
				})
				.catch( () => {})
			},
			downloadExcelList(){
				//导出所有页
			},
			downloadExcel(){
//				导出当前页
			},
			//表格里面的 数据导出
			dateFormat(row,column){
	    		//将时间戳转换为前端的时间
	    		let date=new Date(parseInt(row.creation_time)*1000);
	    		let Y=date.getFullYear()+'-';
	    		let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
	    		let D=date.getDate() <10? '0' +date.getDate() +'':date.getDate()+'';
	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	    		return Y + M + D + h + m + s	    		
	    }
		},
	}
</script>

<style>
	.sel{
		width: 100px;
	}
</style>