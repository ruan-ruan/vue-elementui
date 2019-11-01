<template>
	<div>
		<!--这个是数据中心-->
		<section>
			<!--工具条-->
			<el-col :span='24' class='toolbar' style='width: 100%;'>
				<el-form :inline='true' :model='filters' ref='filters'>
					<el-form-item :label='$t("Public.name")' prop='search_name'>
						<el-input v-model='filters.search_name' class='sel'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.status")' prop='search_status'>
						<el-select v-model='filters.search_status' :plachodle='$t("topFilters.placeholder")' class='sel'>
							<el-option
								v-for='(item,index) in status'
								:label='item.label'
								:key='index'
								:value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("Public.creation")'  prop='timeVal'>	
						<el-date-picker
					      v-model="filters.timeVal"
					      type="daterange"
					      :range-separator="$t('Public.to')"
						  @change="timeValSearchBtn"
					      :start-placeholder="$t('Public.start')"
					      :end-placeholder="$t('Public.end')" class='ipt'>
					    </el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type='primary'v-on:click='getUsers()'>{{$t('topFilters.search')}}</el-button>
						<el-button type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
					</el-form-item>
				</el-form>				
			</el-col>
			
			<!--列表数据部分-->
			<div class="table-top">
				<el-button type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0">
					{{$t('tabOperation.batchDel')}}</el-button>
				
				<el-dropdown split-button type='success'@command="handleExport">
					<!--导出数据-->{{$t('tabOperation.derived.tit')}}
					<el-dropdown-menu slot='dropdown'>
						<el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>									
						<el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>																				
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			
			
			<el-table :data='users'highlight-current-row @selection-change="selsChange" style='width: 100%;'
				:default-sort = "{prop: 'creation_time', order: 'descending'}" v-loading='loading'>
				<el-table-column type='selection' min-width='30'></el-table-column>				
				<el-table-column type='index' min-width='40' align='center' :label='$t("Public.index")'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='creation_time'width='101' sortable :label='$t("Public.creation")'align='center' ></el-table-column>
				<el-table-column  :label='$t("Public.aPort")' align='center' min-width='60' >
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'style='cursor: pointer;' @click='handleNode_a(scope.$index, scope.row)'>{{scope.row.a_node.name}}</el-tag>
						{{scope.row.a_ip}}-{{scope.row.a_vlan}}
					</template>
				</el-table-column>
				<el-table-column  :label='$t("Public.zPort")' align='center' min-width='60'>
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'style='cursor: pointer;' @click='handleNode_z(scope.$index, scope.row)'>{{scope.row.z_node.name}}</el-tag>
						{{scope.row.z_ip}}-{{scope.row.z_vlan}}
					</template>
				</el-table-column>
				<el-table-column prop='status' :label='$t("Public.linkState")' align='center' min-width='50'>
					<template slot-scope='scope'>
						<span v-text="scope.row.status" :class='scope.row.color'></span>
					</template>
				</el-table-column>
				<el-table-column prop='maintenance_value' :label='$t("Public.fault")' align='center' min-width='60'>
					<!--这里的数据是在下面的进行判断的是-->
				</el-table-column>
				<el-table-column prop='bandwidth' :label='$t("Public.sysBandwidth")' align='center' min-width='60'>
				</el-table-column>
				<el-table-column prop='physical_bandwidth' :label='$t("Public.phyBandwidth")' align='center' min-width='60'>
				</el-table-column>
				<el-table-column prop='idle_bandwidth' :label='$t("Public.surBandwidth")' align='center' min-width='60'>
					<template slot-scope='scope'>
						{{scope.row.bandwidth-scope.row.physical_bandwidth}}						
					</template>
				</el-table-column>
				<el-table-column prop='link_cost' :label='$t("Public.linkExpen")' align='center' min-width='60'>
				</el-table-column>
				<el-table-column prop='monitorHTML' :label='$t("Public.linkCheck")' align='center' min-width='60'>
				</el-table-column>
				<el-table-column prop='a_desc' :label='$t("Public.aportDescribe")' align='center' min-width='60'>
				</el-table-column>
				<el-table-column prop='z_desc' :label='$t("Public.zportDescribe")' align='center' min-width='60'>
				</el-table-column>
				<el-table-column prop='descriptionVal' :label='$t("Public.description")' align='center' min-width='60'>
				</el-table-column>
				<el-table-column  :label='$t("Public.operation")' align='right'  width='175'>
					<template slot-scope='scope'>
						<div>
							<el-button size='mini' type='primary' @click='handleStatus(scope.$index, scope.row)'
								v-if='scope.row.maintenance_value=== $t("Public.fau") ? false : true ' class='maintenance'> <!--当状态为故障的时候   这个时候的该按钮银行 -->
								{{scope.row.maintenanceBtn}}
							</el-button>
							<el-button size='mini' type='info' @click='handleSee(scope.$index, scope.row)'>
								<!--详情-->{{$t('tabOperation.info')}}
							</el-button>	
						</div>
						<div style="margin-top: 5px;">
							<el-button size='mini' v-if='scope.row.status==="DOWN"?true:false' type='danger' @click='handleDel(scope.$index, scope.row)'>
								<!--删除-->{{$t('tabOperation.delete')}}
							</el-button>
							<el-button size='mini' type='success' @click='handleEdit(scope.$index, scope.row)'>
								<!--编辑-->{{$t('tabOperation.edit')}}
							</el-button>				
							
						</div>
							

					</template>
				</el-table-column>

			</el-table>

				<el-col :span='24' class='toolbar'>
					<el-pagination
						:total="total"
				     	@size-change="handleSizeChange"
                   		@current-change="handleCurrentChange"
				     	layout="total, sizes, prev, pager, next, jumper"
				     	:page-sizes="[10, 20, 30,50]" 						     	 
				     	:current-page.sync="currentPage"  
				     	:page-count='pageNum'
				     	:pager-count="pagecount"
				     	></el-pagination>
				</el-col>

			
			<!--编辑界面操作和详情的操作的界面-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync='dialogFormVisible':close-on-click-modal="false" v-loading='editLoading'>
				<el-form :model="editForm" label-width='80px'ref='editForm':rules='ruleEditform' label-position='left' >
					<!--:rules='editFormRules'-->
					<el-form-item :label='$t("Public.linkID")'>
						<template>
							<span v-text="editForm.id"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.creation")'>
						<template>
							<span v-text="editForm.creation_time"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.linkState")'>
						<template >
								<span>{{editForm.status}}</span>-
								<span>{{editForm.maintenance_value}}</span>
							</template>
					</el-form-item>
					<el-form-item :label='$t("Public.aPort")'>
							<template >
								<span>{{editForm.a_node.name}}</span>-
								<span>{{editForm.a_ip}}</span>-
								<span>{{editForm.a_vlan}}</span>
							</template>
					</el-form-item>
					<el-form-item :label='$t("Public.aportDescribe")'>
						<template>
							<span v-text="editForm.a_desc"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.zPort")'>
						<template slot-scope='scope'>
							<span v-text="editForm.z_node.name"></span>-
							<span v-text="editForm.z_ip"></span>-
							<span v-text="editForm.z_vlan"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.zportDescribe")'>
						<template>
							<span v-text="editForm.z_desc"></span>
						</template>
					</el-form-item>
					
					<el-form-item :label='$t("Public.sysBandwidth")' prop='bandwidth'>
						<el-input v-model='editForm.bandwidth' :disabled='editFormStatue'  class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.phyBandwidth")' prop='physical_bandwidth'>
						<el-input v-model='editForm.physical_bandwidth' :disabled='editFormStatue' class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.surBandwidth")'>
						<template>
							<span v-text="editForm.bandwidth-editForm.physical_bandwidth"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.linkExpen")' prop='link_cost'>
						<el-input v-model='editForm.link_cost':disabled='editFormStatue'  class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.linkCheck")' prop='monitoring'>
						<el-radio-group v-model='editForm.monitoring' :disabled='editFormStatue' @change="mointradio">
							<template v-for='item in needDown'>
								<el-radio :value='item.label' :label='item.val'>{{item.name}}</el-radio>
							</template>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if='detectionStatus' :label='$t("Public.checkType")' prop='monitoring_type'>
						<el-select v-model='editForm.monitoring_type' :disabled='editFormStatue' class='ipt'>
							<el-option v-for='(item,index) in detectionType'
								:value='item.value'
								:label='item.label'
								:key='index'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-show='detectionStatus' :label='$t("Public.checkParams")'>
						<el-input v-model='editForm.monitoring_param' :disabled='editFormStatue' class='ipt'></el-input>
					</el-form-item>
					<el-form-item  :label='$t("Public.get_flow")' prop='get_speed_key'>
						<el-input v-model='editForm.get_speed_key' :disabled="editFormStatue" class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.description")'>
						<!--<textarea name="" rows="" cols="7"></textarea>-->
						<el-input type='textarea'cols="7" v-model='editForm.description' :disabled='editFormStatue' class='ipt'></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
					<el-button  v-if="dialogStatus=='update'"type="primary" @click="updateData">{{$t('tabOperation.save')}}</el-button>
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>

	import {datedialogFormat ,descriptionValue,getTime , isValidNumber} from '@/assets/js/index.js'


	export default{
		name:'Data',
		data(){
			var isNumber= (rule,value,callback) => {
				if(!value){
					callback(new Error(this.$t('Public.notEmity')))
				}else if(! isValidNumber(value)){
					 callback(new Error(this.$t('Public.placeRight')))
				}else{
					callback()
				}
			};
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
					get_speed_key:'',
//					maintenance_value:'',
//					token:''
				},
				ruleEditform:{
					monitoring_type:[  { required: true, message: this.$t('validateMes.placeCh')+this.$t('Public.checkType'), trigger: 'change' }],
					bandwidth:[  { required: true,  validator:isNumber, trigger: 'blur' }],
					physical_bandwidth:[  { required: true,  validator:isNumber, trigger: 'blur' }],
					link_cost:[  { required: true,  validator:isNumber, trigger: 'blur' }],
					monitoring:[  { required: true, message: this.$t('validateMes.place')+this.$t('Public.checkType'), trigger: 'change' }],
				},
				//链路是否开启部分
				needDown:[
					{
						val:true,
						label:true,
						name:this.$t('Public.open')
					},{
						val:false,
						label:false,
						name:this.$t('Public.close')
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
			mointradio(){
				if(this.editForm.monitoring==true){
					this.detectionStatus=true;
				}else{
					this.detectionStatus=false
				}
			},
			getUsers(){
				var _this=this;
				
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
					search_start_time:getTime(this.filters.start_time),
					search_end_time:getTime(this.filters.end_time),
				}
				console.log(para)
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
							res.data.data.items.map(ele => {
								//datedialogFormat
								ele.creation_time=datedialogFormat(ele.creation_time)
								//添加新的属性，作为是否维护和故障的字段
								if(!ele.monitoring){
									ele.monitorHTML='关闭'
								}else if(ele.monitoring){
									ele.monitorHTML='开启';
								}
								if(ele.status=='UP'){
									ele.color='colorGreen';
									if(ele.maintain_type){
//										console.log(33333)
										ele.maintenance_value=='';
										ele.maintenanceBtn='开启维护';
									}else{
										ele.maintenance_value=='';
										ele.maintenanceBtn='开启维护';
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
			reset(){
				this.$refs['filters'].resetFields()
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
							this.getUsers()	
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
				console.log(row)
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
							if(this.editForm.monitoring==true){
								this.detectionStatus=true;
							}else{
								this.detectionStatus=false
							}	
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
					if(this.editForm.monitoring==true){
					this.detectionStatus=true;
				}else{
					this.detectionStatus=false
				}
				
			},
			updateData(){
				this.$refs.editForm.validate(valid => {
					if(valid){
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
								get_speed_key:this.editForm.get_speed_key,
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
//			dateFormat(row,column){
//	    		//将时间戳转换为前端的时间
//	    		let date=new Date(parseInt(row.creation_time)*1000);
//	    		let Y=date.getFullYear()+'-';
//	    		let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
//	    		let D=date.getDate() <10? '0' +date.getDate() +'  ':date.getDate()+'  ';
//	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
//	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
//	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
//	    		return Y + M + D + h + m + s	    		
//	    	}
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