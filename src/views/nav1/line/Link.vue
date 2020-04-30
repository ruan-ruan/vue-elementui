<template>
	<div>
		<!--这个是数据中心-->
		<section>
			<!--工具条-->
			<el-col :span='24' class='toolbar' style='width: 100%;'>
				<el-form :inline='true' :model='filters' ref='filters'>
					<el-form-item :label='$t("Public.name")' prop='search_name'>
						<el-input v-model='filters.search_name' class='ipt_sta'></el-input>
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
					      type="datetimerange"
					      :range-separator="$t('Public.to')"
						  @change="timeValSearchBtn"
					      :start-placeholder="$t('Public.start')"
					      :end-placeholder="$t('Public.end')" 
					      class='port_sel'>
					    </el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button size='small' type='primary'v-on:click='getUsers()'>{{$t('topFilters.search')}}</el-button>
						<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
					</el-form-item>
				</el-form>				
			</el-col>
			
			<!--列表数据部分-->
			<div class="table-top">
				<el-button size='small' type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0" v-if='buttonVal.del'>
					{{$t('tabOperation.batchDel')}}</el-button>
				
				<el-dropdown size='small' split-button type='success'@command="handleExport">
					<!--导出数据-->{{$t('tabOperation.derived.tit')}}
					<el-dropdown-menu slot='dropdown'>
						<el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>									
						<el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>																				
					</el-dropdown-menu>
				</el-dropdown>
			</div>
			
			
			<el-table :data='users'highlight-current-row @selection-change="selsChange" style='width: 100%;'
				 v-loading='loading'>
				<el-table-column type='selection' min-width='30'></el-table-column>				
				<el-table-column type='index' min-width='40' align='center' :label='$t("Public.index")'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column width='80' :label='$t("Public.creation")'align='center' >
					<template slot-scope='scope'>
						{{scope.row.creation_time | timeFormat}}
					</template>
				</el-table-column>
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
				<el-table-column prop='a_desc' :label='$t("Public.aportDescribe")' align='center' min-width='70'>
				</el-table-column>
				<el-table-column prop='z_desc' :label='$t("Public.zportDescribe")' align='center' min-width='70'>
				</el-table-column>
				<el-table-column :label='$t("Public.description")' align='center' min-width='70'>
					<template slot-scope='scope'>
						{{scope.row.description | descriptionValue}}
					</template>
				</el-table-column>
				<el-table-column  :label='$t("Public.operation")' align='center'  width='190'>
					<template slot-scope='scope'>
						<el-button size='mini' type='primary' @click='handleStatus(scope.$index, scope.row)'
							v-if='buttonVal.open? scope.row.maintenance_value=== $t("Public.fau") ? false : true : buttonVal.open' class='maintenance'> <!--当状态为故障的时候   这个时候的该按钮 -->
							{{scope.row.maintenanceBtn}}
						</el-button>
						<el-button size='mini' type='info' @click='handleSee(scope.$index, scope.row)'v-if='buttonVal.see'>
							<!--详情-->{{$t('tabOperation.info')}}
						</el-button>	

						<el-button size='mini' v-if='buttonVal.del?  scope.row.status==="DOWN"?true:false: buttonVal.del' type='danger' @click='handleDel(scope.$index, scope.row)'>
							<!--删除-->{{$t('tabOperation.delete')}}
						</el-button>
						<el-button size='mini' type='success' @click='handleEdit(scope.$index, scope.row)'v-if='buttonVal.edit'>
							<!--编辑-->{{$t('tabOperation.edit')}}
						</el-button>				
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
				     	:page-size='pagesize'
				     	></el-pagination>
				</el-col>

			
			<!--编辑界面操作和详情的操作的界面-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync='dialogFormVisible':close-on-click-modal="false" v-loading='editLoading'>
				<el-form :model="editForm" label-width='210px'ref='editForm':rules='ruleEditform'  >
					<!--:rules='editFormRules'-->
					<el-form-item :label='$t("Public.linkID")+"："'>
						<template>
							<span v-text="editForm.id"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.creation")+"："'>
						<template>
							{{ editForm.creation_time | timeFormat }}
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.linkState")+"："'>
						<template >
								<span>{{editForm.status}}</span>
								<!-- -<span>{{editForm.maintenance_value}}</span> -->
							</template>
					</el-form-item>
					<el-form-item :label='$t("Public.aPort")+"："'>
							<template >
								<span>{{editForm.a_node.name}}</span>-
								<span v-for='(item,index) in a_device_ports' :key="index">
									<span>{{item.name}}</span>-
									<span>{{item.port_no}}</span>
								</span>
								<span>{{editForm.a_ip}}</span>-
								<span>{{editForm.a_vlan}}</span>
								
							</template>
					</el-form-item>
					<el-form-item :label='$t("Public.aportDescribe")+"："'>
						<template>
							<span v-text="editForm.a_desc"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.zPort")+"："'>
						<template slot-scope='scope'>
							<span v-text="editForm.z_node.name"></span>-
									<span v-for='(item,index) in z_device_ports' :key="index">
									<span>{{item.name}}</span>-
									<span>{{item.port_no}}</span>
								</span>
							<span v-text="editForm.z_ip"></span>-
							<span v-text="editForm.z_vlan"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.zportDescribe")+"："'>
						<template>
							<span v-text="editForm.z_desc"></span>
						</template>
					</el-form-item>
					
					
					<el-form-item :label='$t("Public.sysBandwidth")+"："' prop='bandwidth'>
						<el-input v-model='editForm.bandwidth' :disabled='editFormStatue'  class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.phyBandwidth")+"："' prop='physical_bandwidth'>
						<el-input v-model='editForm.physical_bandwidth' :disabled='editFormStatue' class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.surBandwidth")+"："'>
						<template>
							<span v-text="editForm.bandwidth-editForm.physical_bandwidth"></span>
						</template>
					</el-form-item>
					<el-form-item :label='$t("Public.linkExpen")+"："' prop='link_cost'>
						<el-input v-model='editForm.link_cost':disabled='editFormStatue'  class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.linkCheck")+"："' prop='monitoring'>
						<el-radio-group v-model='editForm.monitoring' :disabled='editFormStatue' @change="mointradio">
							<template v-for='item in needDown'>
								<el-radio :value='item.label' :label='item.val'>{{item.name}}</el-radio>
							</template>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if='detectionStatus' :label='$t("Public.checkType")+"："' prop='monitoring_type'>
						<el-select v-model='editForm.monitoring_type' :disabled='editFormStatue' class='ipt'>
							<el-option v-for='(item,index) in detectionType'
								:value='item.value'
								:label='item.label'
								:key='index'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-show='detectionStatus' :label='$t("Public.checkParams")+"："'>
						<el-input v-model='editForm.monitoring_param' :disabled='editFormStatue' class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.description")+"："'>
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

	import {getTime , isValidNumber} from '@/assets/js/index.js'


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
				token:sessionStorage.getItem('token'),
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
				a_device_ports:[],
				z_device_ports:[],
				editForm:{
					id:'',
					a_node:{
						id:'',
						name:''
					},
				
					// a_device:{
					// 	hostname:'',
					// 	id:''
					// },
					// a_port:{
					// 	port_no:'',
					// 	id:''
					// },
					a_ip:'',
					a_vlan:'',
					a_desc:'',
					
					z_node:{
						id:'',
						name:'',
					},
					// z_device:{
					// 	hostname:'',
					// 	id:''
					// },
					// z_port:{
					// 	port_no:'',
					// 	id:''
					// },
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
				//当链路 检测是开启的时候，会显示对应的数据
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
					update:this.$t('tabOperation.edit'),
					details:this.$t('tabOperation.info')
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
//				buttonData:this.recursion( this.$store.state.aside ,"Public.backLink"),//获取节点内
			  	buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏
			  		del:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backLink").list, "link@del_link").show,//单个删除和批量的删除是绑定在一起的  
			  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backLink").list,"link@edit_link").show,//编辑的值
			  		see:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backLink").list, "link@link_info" ).show,//查看详情
			  		open:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backLink").list,"link@open_maintenance_link" ).show,//开启
			  		close:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backLink").list, "link@close_maintenance_link" ).show,//关闭
	  				nodeSee:this.codeVal(this.recursion( this.$store.state.aside ,"Public.backboneNode").list, "node@node_info" ).show,//节点查看详情
			  		
			  	}
			}
		},
		created(){
			this.getUsers()			
		},
		methods:{
			handleSizeChange(val){

				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){

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
					search_activated:true
				}
				this.$ajax.get('/link/links'+'?token='+this.token,para)
				.then( res => {
					if(res.status==200){
						if(res.data.status==0){
						this.loading=false;

						_this.users=res.data.data.items;
						_this.total=res.data.data.page.total;	
						//控制删除按钮的显示与隐藏
						
						if(res.data.data.items){
							res.data.data.items.map(ele => {
								//添加新的属性，作为是否维护和故障的字段
								if(!ele.monitoring){
									ele.monitorHTML=this.$t('Public.close');									
//									ele.monitorHTML='关闭'
								}else if(ele.monitoring){
									ele.monitorHTML=this.$t('Public.open')
//									ele.monitorHTML='开启';
								}
								if(ele.status=='UP'){
									ele.color='backRun';
									if(ele.maintain_type){
										ele.maintenance_value=='';
										ele.maintenanceBtn=this.$t('Public.openMain');										
//										ele.maintenanceBtn='开启维护';
									}else{
										ele.maintenance_value=='';
										ele.maintenanceBtn=this.$t('Public.openMain');										
										
//										ele.maintenanceBtn='开启维护';
									}
								}else if(ele.status=='DOWN'){
									ele.color='backWarn'
									if(!ele.maintain_type){
										ele.maintenanceBtn=this.$t('Public.maintain');										
										ele.maintenanceBtn=this.$t('Public.closeMain');	
//										ele.maintenance_value='维护'
//										ele.maintenanceBtn='关闭维护'
									}else{
										ele.maintenanceBtn=this.$t('Public.fau');	

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

		    this.$confirm(this.$t('confirm.titles'), this.$t('confirm.tooltip'), {
		        type: "warning"
		    })
		    .then(() => {
		        this.listLoading = true;
		        let para = { 
		          	ids: ids,
		        };
				
				this.$ajax.del('/link/del_links'+'?token='+this.token,para)
		        .then(res => {

		          	if( res.status==200){
						if(res.data.status==0){
							this.listLoading = false;
							this.$message({
								message:this.$t('tooltipMes.delSuccess'),
								type:'success'
							})

						}
						this.getUsers();
		          	}

		          }).catch(e => {console.log(e)})
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

				if(row.maintenanceBtn ===  this.$t('Public.openMain') ){
					this.$confirm(this.$t('confirm.linkOpen'),this.$t('confirm.tooltip'),{
						type:'success'
					})
					.then(() => {
						
						this.$ajax.put('/link/open_maintenance_link/'+row.id+'?token='+this.token)
						.then(res => {

							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.openSuc'),
										type:'success'
									})
									this.getUsers();
								}
							}
						})
					}).catch(() => {})
				}else if(row.maintenanceBtn=== this.$t('Public.closeMain')){
					this.$confirm(this.$t('confirm.linkClose'),this.$t('confirm.tooltip'),{
						type:'success'
					})
					.then( () => {
						this.$ajax.put('/link/close_maintenance_link/'+row.id+'?token='+this.token)
						.then(res => {

							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$tc('tooltipMes.closeSuc'),
										type:'success'
									})

									this.getUsers();
								}
							}
						})
					})
				}

			},
			//节点a的点击详情
			handleNode_a(index,row){
				if(this.buttonVal.nodeSee){
					this.$router.push({
						path:'/location/index/unknown/nodedetails',
						query:{
							detailsID:row.a_node.id
						}
					});
				}else{
					this.$message({
						message:'暂无查看详情',
						type:'warning'
					})
				}
				
			},
			//节点z的详情
			handleNode_z(index,row){
				
				if(this.buttonVal.nodeSee){
					this.$router.push({
						path:'/location/index/unknown/nodedetails',
						query:{
							detailsID:row.z_node.id
						}
					});
				}else{
					this.$message({
						message:'暂无查看详情',
						type:'warning'
					})
				}
				
			},
			//详情
			handleSee(index,row){
				console.log(row)
				this.editLoading=true;
				this.dialogStatus='details';
				this.dialogFormVisible=true;
				this.editFormStatue=true;
				var _this=this;

				this.$ajax.get('/link/link_info/'+row.id+'?token='+this.token)
				.then(res => {	

					if(res.status==200){
						if(res.data.status==0){
							this.editLoading=false;
							this.editForm=Object.assign({},res.data.data)
							console.log(this.editForm)
							this.a_device_ports=[];
							this.editForm.a_device_ports.map(it=>{
								this.a_device_ports.push({
									name:it.device.name,
									port:it.port.port_no
								})
							})
							console.log(this.a_device_ports)
							this.z_device_ports=[];
								this.editForm.z_device_ports.map(it=>{
								this.z_device_ports.push({
									name:it.device.name,
									port:it.port.port_no
								})
							})
							console.log(this.z_device_ports)
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
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.editFormStatue=false;
				this.editForm=Object.assign({} ,row)
				if(this.editForm.monitoring==true){
					this.detectionStatus=true;
				}else{
					this.detectionStatus=false
				}
				
			},
			updateData(){
				this.editLoading=true;
				this.$refs.editForm.validate(valid => {
					if(valid){
							let para={
//								id:this.edtiForm.id,
								a_node_id:this.editForm.a_node.id,
								a_ip:this.editForm.a_ip,
								a_vlan:this.editForm.a_vlan,
								a_desc:this.editForm.a_desc,
								a_device:this.editForm.a_device.id,
								a_port:this.editForm.a_port.id,
								z_node_id:this.editForm.z_node.id,
								z_ip:this.editForm.z_ip,
								z_vlan:this.editForm.z_vlan,
								z_desc:this.editForm.z_desc,
								z_device:this.editForm.z_device.id,
								z_port:this.editForm.z_port.id,
								physical_bandwidth:	this.editForm.physical_bandwidth,
								bandwidth:this.editForm.bandwidth,
								monitoring:this.editForm.monitoring.toString(),
								monitoring_type:this.editForm.monitoring_type,
								monitoring_param:this.editForm.monitoring_param,
								link_cost:this.editForm.link_cost,
								description:this.editForm.description,
								//	get_speed_key:this.editForm.get_speed_key,
							};
							this.$ajax.put('/link/edit_link/'+this.editForm.id+'?token='+this.token,para)
							.then( res => {
								
								if(res.status==200){
									
									this.editLoading=false;
									if(res.data.status==0){
										this.$message({
											message: this.$t('tooltipMes.editSuccess'),
											type:'success'
										})
									}
									this.$refs["editForm"].resetFields();
									this.dialogFormVisible = false;
									this.getUsers();
								}else {
									this.editLoading=false;
									
								}
									
							})
					}
					
				})
			},
			//删除
			handleDel(index,row){
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{
					type:'warning'
				})
				.then( ( ) => {
					this.$ajax.del('/link/del_link/'+row.id+'?token='+this.token,)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
								this.getUsers()
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
		    		this.$confirm(this.$t('tooltipMes.exportDataAll'),this.$t('confirm.tooltip'),{
					//		    			confirmButtonText:'确定',
					//		    			cancelButtonText:'取消',
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
		    		this.$confirm(this.$t('tooltipMes.exportDataCurr'),this.$t('confirm.tooltip'),{
							//		    			confirmButtonText:'确定',
							//		    			cancelButtonText:'取消',
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
					const tHeader=[ this.$t('Public.creation'),this.$t('Public.dataCen'),this.$t('Public.deviceID'),this.$t('Public.manageIP'),this.$t('Public.description')];
					const filterVal=['creation_time','dc_name','id','ip','description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,this.$t('tooltipMes.download')+'excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			
		}
	}
</script>

<style scoped>
	.sel{
		width: 100px;
	}
</style>