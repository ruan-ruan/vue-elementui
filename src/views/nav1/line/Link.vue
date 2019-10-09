<template>
	<div>
		<!--这个是数据中心-->
		<section>
			<!--工具条-->
			<el-col :span='24' class='toolbar' style='width: 100%;'>
				<el-form :inline='true' :model='filters'>
					<el-form-item label='名称'>
						<el-input v-model='filters.search_name' class='sel'></el-input>
					</el-form-item>
					<el-form-item label='状态'>
						<el-select v-model='filters.search_status' plachodle='全部' class='sel'>
							<el-option
								v-for='(item,index) in status'
								:label='item.label'
								:key='index'
								:value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='创建时间' >	
						<el-date-picker
					      v-model="filters.timeVal"
					      type="daterange"
					      range-separator="至"
						  @change="timeValSearchBtn"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期" class='ipt'>
					    </el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type='primary'v-on:click='getUsers()'>搜索</el-button>
						<el-button type='info' @click='reset(filters)'>重置</el-button>
					</el-form-item>
				</el-form>				
			</el-col>
			
			<!--列表数据部分-->
			<div class="table-top">
				<el-dropdown split-button type='success'@command="handleExport">
					导出数据
					<el-dropdown-menu slot='dropdown'>
						<el-dropdown-item command="current">当前页 </el-dropdown-item>									
						<el-dropdown-item command="all">所有页</el-dropdown-item>																				
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			
			
			<!--<el-row  :gutter="24">
				<el-col :sm="24" :md="24" :lg="24">-->
			<el-table :data='users'highlight-current-row @selection-change="selsChange" style='width: 100%;' v-loading='loading'>
				<el-table-column type='selection' width='40'></el-table-column>				
				<el-table-column type='index' min-width='40' align='center' label='序号'>	</el-table-column>
				<el-table-column prop='creation_time'width='95'label='创建时间'align='center' :formatter='dateFormat'></el-table-column>
				<el-table-column  label='A端' align='center' min-width='60' >
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'style='cursor: pointer;' @click='handleNode_a(scope.$index, scope.row)'>{{scope.row.a_node.name}}</el-tag>
						{{scope.row.a_ip}}-{{scope.row.a_vlan}}
					</template>
				</el-table-column>
				<el-table-column  label='Z端' align='center' min-width='60'>
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'style='cursor: pointer;' @click='handleNode_z(scope.$index, scope.row)'>{{scope.row.z_node.name}}</el-tag>
						{{scope.row.z_ip}}-{{scope.row.z_vlan}}
					</template>
				</el-table-column>
				<el-table-column prop='status' label='链路状态' align='center' min-width='60'>
					<template slot-scope='scope'>
						<span v-text="scope.row.status" :class='scope.row.color'></span>
					</template>
				</el-table-column>
				<el-table-column  prop='maintenance_value' label='故障/维护' align='center' min-width='40'max-width='50'>
					<!--这里的数据是在下面的进行判断的是-->
				</el-table-column>
				<el-table-column prop='bandwidth' label='总带宽(Mbps)' align='center' min-width='50'>
				</el-table-column>
				<el-table-column prop='physical_bandwidth' label='物理带宽(Mbps)' align='center' min-width='50'>
				</el-table-column>
				<el-table-column prop='idle_bandwidth' label='剩余带宽(Mbps)' align='center' min-width='50'>
					<template slot-scope='scope'>
						{{scope.row.bandwidth-scope.row.physical_bandwidth}}						
					</template>
				</el-table-column>
				<el-table-column prop='link_cost' label='链路开销' align='center' min-width='40'>
				</el-table-column>
				<el-table-column prop='monitorHTML' label='链路检测' align='center' min-width='40'>
				</el-table-column>
				<el-table-column prop='a_desc' label='A端描述' align='center' width='60'>
				</el-table-column>
				<el-table-column prop='z_desc' label='Z端描述' align='center' width='60'>
				</el-table-column>
				<el-table-column prop='descriptionVal' label='备注' align='center' width='60'>
				</el-table-column>
				<el-table-column  label='操作' align='center' min-width='300'>
					<template slot-scope='scope'>
						<el-button size='small' type='primary' @click='handleStatus(scope.$index, scope.row)'
							v-if='scope.row.maintenance_value==="故障" ? false : true ' class='maintenance'> <!--当状态为故障的时候   这个时候的该按钮银行 -->
							{{scope.row.maintenanceBtn}}
						</el-button>
						<el-button size='small' type='info' @click='handleSee(scope.$index, scope.row)'>详情</el-button>
						<el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>				
						<el-button size='small' v-if='scope.row.status==="DOWN"?true:false' type='danger' @click='handleDel(scope.$index, scope.row)'>删除</el-button>
						
					</template>
				</el-table-column>

			</el-table>
			<!--</el-col>
		</el-row>-->
			<!--底部导航的数据-->
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
			
			<!--编辑界面操作和详情的操作的界面-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync='dialogFormVisible':close-on-click-modal="false" v-loading='editLoading'>
				<el-form :model="editForm" label-width='80px'ref='editForm' label-position='left' >
					<!--:rules='editFormRules'-->
					<el-form-item label='链路ID'>
						<template>
							<span v-text="editForm.id"></span>
						</template>
					</el-form-item>
					<el-form-item label='创建时间'>
						<template>
							<span v-text="editForm.creation_time"></span>
						</template>
					</el-form-item>
					<el-form-item label='链路状态'>
						<template >
								<span>{{editForm.status}}</span>-
								<span>{{editForm.maintenance_value}}</span>
							</template>
					</el-form-item>
					<el-form-item label='A端'>
							<template >
								<span>{{editForm.a_node.name}}</span>-
								<span>{{editForm.a_ip}}</span>-
								<span>{{editForm.a_vlan}}</span>
							</template>
					</el-form-item>
					<el-form-item label='A端描述'>
						<template>
							<span v-text="editForm.a_desc"></span>
						</template>
					</el-form-item>
					<el-form-item label='Z端'>
						<!--<el-input  :disabled='disb' class='ipt_sels'>-->
							<template slot-scope='scope'>
								<span v-text="editForm.z_node.name"></span>-
								<span v-text="editForm.z_ip"></span>-
								<span v-text="editForm.z_vlan"></span>
							</template>
							
						<!--</el-input>-->
					</el-form-item>
					<el-form-item label='Z端描述'>
						<template>
							<span v-text="editForm.z_desc"></span>
						</template>
					</el-form-item>
					<el-form-item label='总带宽'>
						<el-input v-model='editForm.bandwidth' :disabled='editFormStatue'  class='ipt_sels'></el-input>
					</el-form-item>
					<el-form-item label='物理带宽'>
						<el-input v-model='editForm.physical_bandwidth' :disabled='editFormStatue' class='ipt_sels'></el-input>
					</el-form-item>
					<el-form-item label='剩余带宽'>
						<template>
							<span v-text="editForm.bandwidth-editForm.physical_bandwidth"></span>
						</template>
					</el-form-item>
					<el-form-item label='链路开销'>
						<el-input v-model='editForm.link_cost':disabled='editFormStatue'  class='ipt_sels'></el-input>
					</el-form-item>
					<el-form-item label='链路检测'>
						<el-radio-group v-model='editForm.monitoring' :disabled='editFormStatue'>
							<template v-for='item in needDown'>
								<el-radio :value='item.label' :label='item.val'>{{item.name}}</el-radio>
							</template>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-show='detectionStatus' label='检测类型'>
						<el-select v-model='editForm.monitoring_type' :disabled='editFormStatue'>
							<el-option v-for='(item,index) in detectionType'
								:value='item.value'
								:label='item.label'
								:key='index'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-show='detectionStatus' label='检测参数'>
						<el-input v-model='editForm.monitoring_param':disabled='editFormStatue'></el-input>
					</el-form-item>
					<el-form-item  label='流量获取键入值'>
						<el-input v-model='editForm.monitoring_param' :disabled='editFormStatue' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='备注'>
						<!--<textarea name="" rows="" cols="7"></textarea>-->
						<el-input type='textarea'cols="7" v-model='editForm.description' :disabled='editFormStatue' class='ipt_sels'></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='dialogFormVisible=false'>取消</el-button>
					<el-button  v-if="dialogStatus=='update'"type="primary" @click="updateData">保存</el-button>
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>
	import {datedialogFormat ,descriptionValue,getTime} from '@/assets/js/index.js'
	export default{
		name:'Data',
		data(){
			return{
				
				//获取用户的权限
				token:'',
				status:[
					{
						name:'UP',
						value:'UP',
						label:'UP'
					},{
						name:'DOWN',
						value:'DOWN',
						label:'DOWN'
					}
				],
				filters:{
					search_name:'',
					search_status:'',
//					line:'',
					start_time:'',
					end_time:'',
					//接收总的时间
					timeVal:[],
				},
				
				//接收数据
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
				//设置维护
//				maintenanceStatus:true,
				//当链路的状态的为down的时候，显示删除按钮
//				LinkStatus:false,
				//编辑界面的数据
				editForm:{
					id:'',
					a_node:{
						id:'',
						name:''
					},
					a_ip:'',
					a_vlan:'',
					a_desc:'',
					
					z_node:{
						id:'',
						name:'',
					},
					z_ip:'',
					z_vlan:'',
					z_desc:'',
					bandwidth:'',
					physical_bandwidth:'',
//					idle_bandwidth:'',
					link_cost:'',
					monitoring:'',
					monitoring_type:'',
					monitoring_param:'',
//					maintenance_type:'',
					status:'',
					creation_time:'',
					description:'',
//					maintenance_value:'',
//					token:''
				},
				//链路是否开启部分
				needDown:[
					{
						val:true,
						label:true,
						name:'开启'
					},{
						val:false,
						label:false,
						name:'关闭'
					}
				],
				//当链路 检测是开启的时候u，会显示对应的数据
				detectionType:[
					{
						label:'BFD',
						value:'BFD'
					}
				],	
				//校验
				editFormRules:{
					
				},
				textMap:{
					update:'编辑',
					details:'详情'
				},
				dialogStatus: "",
				dialogFormVisible:false,
				editLoading:false,
				//默认的时候，在上面的日志部分表格是不可以编辑的
				disb:true,
				// 这个是编辑的时候，里面的 日志部分的部分是可以编辑的 
				editFormStatue:false,
				main:true,
				//导出的时候保存数据
				excelData:[],
				//控制检测类型和检测参数的显示隐藏，默认的时候是隐藏的
				detectionStatus:false,
			}
		},
		created(){
			//获取用户的权限
			this.token =sessionStorage.getItem('token');
			if(this.editForm.need_down=='true'){
				this.detectionStatus=true;
			}else{
				this.detectionStatus=false
			}
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
			getUsers(){
				var _this=this;
				var maintenance=document.getElementsByClassName('maintenance');
				this.loading=true
				this.filters.start_time = this.filters.timeVal[0]
					? this.filters.timeVal[0]
					: "";
				this.filters.end_time = this.filters.timeVal[1]
					? this.filters.timeVal[1]
					: "";
				
				var para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.search_name,
					search_status:this.filters.search_status,
					start_time:getTime(this.filters.start_time),
					end_time:getTime(this.filters.end_time),
				}
				this.$ajax.get('/link/links'+'?token='+this.token,para)
				.then( res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
						this.loading=false;
						descriptionValue(res.data.data.items)
						_this.users=res.data.data.items;
						_this.total=res.data.data.page.total;	
						//控制删除按钮的显示与隐藏
						
						if(res.data.data.items){
							res.data.data.items.forEach(ele => {
								//添加新的属性，作为是否维护和故障的字段
								if(!ele.monitoring){
									ele.monitorHTML='关闭'
								}else if(ele.monitoring){
									ele.monitorHTML='开启'
								}
								if(ele.status=='UP'){
									ele.color='colorGreen'
									if(ele.maintain_type){
										ele.maintenance_value=''
										ele.maintenanceBtn='开启维护'
									}else{
										ele.maintenance_value='维护'
										ele.maintenanceBtn='关闭维护'
									}
								}else if(ele.status=='DOWN'){
									ele.color='colorRed'
									if(!ele.maintain_type){
										ele.maintenance_value='维护'
										ele.maintenanceBtn='关闭维护'
									}else{
										ele.maintenance_value='故障'
									}
								}	
							})
						}
						
						}
					}
				})
				.catch( e => {
					console.log(e)
				})
			},
			reset(sels){
				for(let key in sels){
					sels[key]='';
				}
			},
			selsChange:function(sels){
				//用来报错多选的是数据
				this.sels=sels
			},
			//批量删除
			batchRemove:function(rows){
			var ids=[];
			rows.forEach(ele => {
				ids.push(ele.id)
			})

		    this.$confirm("确认删除选中记录吗？", "提示", {
		        type: "warning"
		    })
		    .then(() => {
		        this.listLoading = true;
		        let para = { 
		          	ids: ids,
		        };
				
				this.$ajax.del('/link/del_links'+'?token='+this.token,para)
		        .then(res => {
		          	console.log(res);
		          	if( res.status==200){
						if(res.data.status==0){
							this.listLoading = false;
							this.$message({
								message:'删除成功!',
								type:'success'
							})
							this.getUsers();
						}else if(res.data.status){
							this.$message({
								message:res.data.message,
								type:'warning'
							})
						}
		          	}

		          });
		        })
		        .catch(() => {});
			},
			timeValSearchBtn(value) {
				this.filters.start_time = this.filters.timeVal[0];
				this.filters.end_time = this.filters.timeVal[1];
			},
			//开启维护
			handleStatus(index,row){
				var _this=this;
				console.log(row)
				if(row.maintenanceBtn==="开启维护"){
					console.log('进入开发')
					this.$confirm('确认将此链路开启，开启维护状态!','提示',{
						confirmButtonText:'确定',
						cancelButtonText:'取消',
						type:'success'
					})
					.then(() => {
						
						this.$ajax.put('/link/open_maintenance_link/'+row.id+'?token='+this.token)
						.then(res => {
							console.log(res);
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'开启成功!',
										type:'success'
									})
//									this.editForm.maintenance_type=true;
//									mainVal[index].textContent='关闭维护';
									row.maintenanceBtn="关闭维护"
									this.getUsers();
								}else{
									this.$message({
										message:res.data.msg,
										type:'warning'
									})
								}
							}
						})
					})
				}else if(row.maintenanceBtn==="关闭维护"){
					this.$confirm('确认将此链路关闭，关闭维护状态!','提示',{
						confirmButtonText:'确定',
						cancelButtonText:'取消',
						type:'success'
					})
					.then( () => {
						this.$ajax.put('/link/close_maintenance_link/'+row.id+'?token='+this.token)
						.then(res => {
							console.log(res)
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'关闭成功!',
										type:'success'
									})
									row.maintenanceBtn="开启维护"
//									this.editForm.maintenance_type=false;
//									mainVal[index].textContent='开启维护';
									this.getUsers();
								}else{
									this.$message({
										message:res.data.msg,
										type:'warning'
									})
								}
							}
						})
					})
				}

			},
			//节点a的点击详情
			handleNode_a(index,row){
				
				this.$router.push({path:'/location/index/unknown/nodedetails/'+row.a_node.id});
			},
			//节点z的详情
			handleNode_z(index,row){
				this.$router.push({path:'/location/index/unknown/nodedetails/'+row.z_node.id});
			},
			//详情
			handleSee(index,row){
				this.editLoading=true;
				this.dialogStatus='details';
				this.dialogFormVisible=true;
				this.dialogStatus=true;
				this.editFormStatue=true;
				var _this=this;

				this.$ajax.get('/link/link_info/'+row.id+'?token='+this.token)
				.then(res => {	
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							this.editLoading=false;
							this.editForm=Object.assign({},res.data.data)
							this.editForm.creation_time=datedialogFormat(row.creation_time);	
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			//编辑
			handleEdit(index,row){
				console.log(row)
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.editFormStatue=false;
				this.editForm=Object.assign({} ,row)
				this.editForm.creation_time=datedialogFormat(row.creation_time)
				
			},
			updateData(){
				this.$refs.editForm.validate(valid => {
					if(valid){
						this.$confirm('确认要提交吗？ ' ,'提示',{})
						.then(() => {

							let para={
//								id:this.edtiForm.id,
								a_node_id:this.editForm.a_node.id,
								a_ip:this.editForm.a_ip,
								a_vlan:this.editForm.a_vlan,
								a_desc:this.editForm.a_desc,
								z_node_id:this.editForm.z_node.id,
								z_ip:this.editForm.z_ip,
								z_vlan:this.editForm.z_vlan,
								z_desc:this.editForm.z_desc,
								physical_bandwidth:	this.editForm.physical_bandwidth,
								bandwidth:this.editForm.bandwidth,
								monitoring:this.editForm.monitoring.toString(),
								monitoring_type:this.editForm.monitoring_type,
								monitoring_param:this.editForm.monitoring_param,
								link_cost:this.editForm.link_cost,
								description:this.editForm.description,
							};
							this.$ajax.put('/link/edit_link/'+this.editForm.id+'?token='+this.token,para)
							.then( res => {
								console.log(res)
								if(res.status==200){
									
									this.editLoading=false;
									if(res.data.status==0){
										this.$message({
											message:'修改成功！',
											type:'success'
										})
									}
									this.$refs["editForm"].resetFields();
	                this.dialogFormVisible = false;
	                this.getUsers();
								}else {
									this.editLoading=false;
									this.$message({
										message:res.data.msg,
										type:'warning'
									})
								}
									
							})
						}).catch(() => {})
					}
					
				})
			},
			//删除
			handleDel(index,row){
				this.$confirm('确认要删除该数据吗？','提示',{
					type:'warning'
				})
				.then( ( ) => {
					this.$ajax.del('/link/del_link/'+row.id+'?token='+this.token,)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'删除成功',
									type:'success'
								})
								this.getUsers()
							}else if(res.data.status){
								this.$message({
									message:res.data.msg,
									type:'warning'
								})
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
				})
				.catch( e => {
					console.log(e)
				})
			},
			
			 handleExport(command){
		    	if(command=='all'){
		    		//导出所有的数据
		    		this.$confirm('确定要导出所有的数据吗?','提示',{
		    			confirmButtonText:'确定',
		    			cancelButtonText:'取消',
		    			type:'warning'
		    		}).then(() => {
		    			var para={
		    				page:this.currentPage,
		    				per_page:this.pagesize,
		    			}
		    			this.exportData(para)
		    		}).catch(() => {
		    			
		    		})
		    	}else if(command=='current'){
		    		//导出当前
		    		this.$confirm('确定要导出当前页数据吗?','提示',{
		    			confirmButtonText:'确定',
		    			cancelButtonText:'取消',
		    			type:'warning'
		    		}).then(() => {
		    			this.exportData()
		    		}).catch(() => {
		    			
		    		})
		    	}
		    },
		    exportData:function(params){
		    	this.$ajax.get('/link/links'+'?token='+this.token,params)
		    	.then(res => {
		    		this.excelData=res.data.data.items;
					this.export2Excel();
		    	}).catch(e => {
		    		console.log(e)
		    	})
		    },
	
			export2Excel(){
				let that=this;
				require.ensure([] ,() => {
					const {export_json_to_excel} = require('@/excel/export2Excel')
					const tHeader=['创建时间','数据中心','设备ID','管理Ip','备注'];
					const filterVal=['creation_time','dc_name','id','ip','description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,'下载数据excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			//表格数据时间转换
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
		mounted(){
			this.getUsers()
		}
	}
</script>

<style scoped>
	.sel{
		width: 100px;
	}
</style>