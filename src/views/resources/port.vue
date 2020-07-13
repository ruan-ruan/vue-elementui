<template>
  <div>
   	 <!--逻辑端口管理-->
   	 <section>
   	 	<el-row class='toolbar' style='width: 100%;'>
   	 		<el-col :span='24'>
   	 			<el-form :inline='true' :model='filters' ref='filters'>
   	 				<el-form-item :label='$t("Public.name")' prop='name'>
   	 					<el-input v-model='filters.name' :placeholder="$t('Public.plaName')" class='ipt_sta'></el-input>
   	 				</el-form-item>
   	 				<el-form-item :label='$t("Public.tenant")' prop='nameLogo'>
   	 					<el-select v-model='filters.nameLogo' class='sel'filterable :placeholder="$t('Public.plaTenant')">
   	 						<el-option v-for='(item,index ) in tenantData'
   	 							:value='item.id'
   	 							:label='item.name'
   	 							:key='index'></el-option>
   	 					</el-select>
   	 				</el-form-item>
   	 				<el-form-item :label='$t("Public.status")' prop='status'>
   	 					<el-select v-model='filters.status'filterable :placeholder="$t('Public.plaLogicSt')" class='sel'>
   	 						<el-option v-for=' (item,index) in PortStatus'
   	 							:value='item.value'
   	 							:key='index'
   	 							:label='item.label'></el-option>
   	 					</el-select>
   	 				</el-form-item>
   	 				<el-form-item>
   	 					<el-button size='small' type='primary' @click='getUsers'>{{$t('topFilters.search')}}</el-button>
   	 					<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
   	 				</el-form-item>
   	 			</el-form>
   	 		</el-col>
   	 	</el-row>
   	 	
   	 	<el-row v-if='filProps'>
   	 		<el-col :span='24'>
   	 			<el-col :span='4'>																																<!--v-show='buttonVal.add' 此处使用class属性    是为保持占位-->		
   	 				<el-button size='small' type='primary' @click='addUsers'   :class='buttonVal.add ?  "":"visHidden" '>+{{$t('Public.creatLogic')}}</el-button>
   	 			</el-col>
   	 			<el-col :span='20' class='table-top'>
   	 				<el-dropdown size='small' split-button type='success'@command="handleExport">
							<!--导出数据-->{{$t('tabOperation.derived.tit')}}
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>									
								<el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>																				
							</el-dropdown-menu>
						</el-dropdown>
   	 			</el-col>
   	 		</el-col>
   	 	</el-row>

   	 	
   	 	<!--表格数据部分-->
   	 	<el-table :data='users' highlight-current-row style='width: 100%;' v-loading='loading' 
   	 		>
   	 		<el-table-column type='index' width='60':label='$t("Public.index")' align='center'>
   	 			<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
   	 		</el-table-column>
   	 		<el-table-column  :label='$t("Public.creation")' width='80'align='center'>
   	 			<template slot-scope='scope'>
   	 				{{ scope.row.creation_time | timeFormat }}
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column prop='name' :label='$t("Public.logName")' min-width='100'align='center'>
   	 			<template slot-scope='scope'>
   	 				<span class='cli_spn' @click="handleSee(scope.$index,scope.row)">{{scope.row.name}}</span>
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column prop='tenant.name' :label='$t("Public.tenant")' min-width='100'align='center'></el-table-column>
   	 		<el-table-column  :label='$t("Public.logicStatus")' width='80'align='center'>
   	 			<template slot-scope='scope'>
   	 				<span :class='scope.row.usableTextColor'>{{scope.row.usableText}}</span>
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column prop='physical_ports_len' :label='$t("Public.portNumber")' min-width='100'align='center'></el-table-column>
   	 		<el-table-column prop='access_type' :label='$t("Public.linkType")' min-width='100'align='center'></el-table-column>
   	 		<el-table-column  :label='$t("Public.conStart")'  width='80'align='center'>
   	 			<template slot-scope='scope'>
   	 				{{scope.row.start_time | timeFormat}}
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column  :label='$t("Public.conEnd")'  width='80'align='center'>
   	 			<template slot-scope='scope'>
   	 				{{scope.row.end_time | timeFormat}}
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column  :label='$t("Public.description")' min-width='100'align='center'>
   	 			<template slot-scope='scope'>
   	 				 {{ scope.row.description | descriptionValue }}
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column  :label='$t("Public.operation")' width='120'  align='center'v-if='filProps'>
   	 			<template slot-scope='scope' >
   	 				<el-button size='mini' type='info' @click='handleStatus(scope.$index, scope.row)'v-if='buttonVal.stop'>{{scope.row.btnStatus}}</el-button>
	   	 			<el-button size='mini' type='success' @click='handleEdit(scope.$index,scope.row)' v-if='buttonVal.edit'>{{$t('tabOperation.edit')}}</el-button>
	   	 			<el-button size='mini' type='danger' @click='handleDel(scope.$index,scope.row)' v-if="buttonVal.del? scope.row.btnStatus== '启用' : buttonVal.del">{{$t('tabOperation.delete')}}</el-button>
   	 			</template>
   	 		</el-table-column>
   	 		
   	 	</el-table>
   	 	<el-row>
   	 		<el-col :span='24'>
   	 			<el-pagination
							:total="total"
				     	@size-change="handleSizeChange"
              @current-change="handleCurrentChange"
				     	layout="total, sizes, prev, pager, next, jumper"
				     	:page-sizes="[10, 20, 30,50]" 
				     	:page-size='pagesize'
				     	:current-page.sync="currentPage"  
				     	:page-count='pageNum'
				     	:pager-count="pagecount"
				     	></el-pagination>
   	 		</el-col>
   	 	</el-row>
   	 </section>
  </div>
</template>

<script>
	import {getPortStatus,isPortStatus,dealNull,datedialogFormat} from '@/assets/js/index'
	export default{
		name:'port',
		/**titleOne ， titleTwo  节点里面设备的的详情的id的数据
		 * nodeID   节点信息里面的id
		 * tenantID   租户信息的id
		 * */
		props:['titleOne','titleTwo','LogicTitle','tenantID'],//来判断进入的界面的，控制添加和操作按钮显示
		data(){
			return{			
				token:sessionStorage.getItem('token'),
				filters:{
					nameLogo:'',
					name:'',
					status:''
				},
				PortStatus:[
					{
						label:'UP',
						value:'UP'
					},{
						label:'DOWN',
						value:'DOWN'
					},{
						label:this.$t('Public.abnormal'),
						value:'异常'
					},{
						label:this.$t('Public.Prohibit'),
						value:'禁用'
					}
				],
				
				users:[],
//				sels:[],
				loading:false,
				//分页所需要的参数
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,

				excelData:[],
				//用来控制删除按钮的显示和隐藏
				statusDel:null,
				tenantData:[],//租户数据
				tit:null,
				buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 "link@add_unknown_link"
		  		add:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list, "port@add_logic_port").show,//添加	
		  		del:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list, "port@del_logic_port").show,//单个删除和批量的删除是绑定在一起的  
		  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list,"port@edit_logic_port").show,//编辑的值
		  		see:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list, "port@logic_port_info" ).show,//查看详情
		  		stop:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list, "port@to_disable_logic_port").show,//查看逻辑口的详情
		  		run:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list, "port@to_enable_logic_port").show,//查看逻辑口的详情
		  		
		  	},
		  	
			}
		},

		created(){

			this.getUsers();
			this.getTenantData();			
		},
		computed:{
			filNode(){
				if(this.titleOne){
					return this.titleOne
				}
				if(this.titleTwo){
					return this.titleTwo
				}
			},
			filProps(){
				if(this.titleOne || this.titleTwo || this.tenantID || this.nodeID){
					return false;
				}else{
					return true;
				}
			}
		},
		methods:{
			getTenantData(){
				//tenantData
				this.$ajax.get('/tenant/tenants'+'?token='+this.token)
				.then(res => {
					if(res.status==200&& res.data.status==0){
						this.tenantData=res.data.data.items;
					}
				}).catch(e => {
					console.log(e)
				})
			},
			handleSizeChange(val){

				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
				this.currentPage=val;
				this.getUsers();

			},
			getUsers(){
				this.loading=true;
				let para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.name,
					search_tenant:typeof this.tenantID !='undefined'? this.tenantID:  this.filters.nameLogo,
					search_device: typeof this.filNode !=='undefined' ?this.filNode:'',
					search_node:typeof this.nodeID !=='undefined'?this.nodeID:''
				}
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,para)
				.then(res => {
					this.loading=false;
					if(res.status==200){
						if(res.data.status==0){
							this.total=res.data.data.page.total;
							var str=res.data.data.items;
							for(let item = 0 ;item <str.length;item++){
								
								str[item].physical_ports_len=str[item].physical_ports.length;

								if(str[item].usable){
									//根据物理端口下的port的status拼接出来的这个参数，并在不同的状态的时候显示不同的字体格式
//									ele.usableText=this.getPortStatus(ele.physical_ports);
									str[item].usableText=isPortStatus(str[item].physical_ports);
									//根据不同的value设置不同的css
										if(str[item].usableText==='UP'){
											str[item].usableTextColor='backRun'
										}else if(str[item].usableText==='DOWN'){
											str[item].usableTextColor='backWarn'
										}else if(str[item].usableText=== '异常'){
											str[item].usableText==='DOWN'
											str[item].usableTextColor='backWarn'
										}	
									str[item].btnStatus=this.$t('Public.Prohibit')
								}else{
									str[item].usableText='禁用';
									str[item].btnStatus=this.$t('Public.enable');
									str[item].usableTextColor='backStop'
								}
							}

								//对数据状态的遍历  
							if(this.filters.status !=''){
									this.users=res.data.data.items.filter(item => {
										return item.usableText==this.filters.status;
									})
							}else{
								this.users=res.data.data.items;
							}

						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			reset(){
				this.$refs['filters'].resetFields();

			},
			addUsers(){
				//添加  逻辑端口
				this.$router.push({
					path:'/resource/add/logicalPort',
					query:{
						name:'addLogicPort'
					}
				})
			},
			handleEdit(index,row){
				//编辑逻辑端口部分
				this.$router.push({
					path:'/resource/edit/logicalPort',
					query:{
						id:row.id
					}
				})
			},
			handleSee(index,row){
				//查看信息详情
				if(this.buttonVal.see){
					this.$router.push({
						path:'/resource/see/logicalPort',
						query:{
							detailsID:row.id
						}
					})
				}else{
					this.$message({
						message:'暂无查看详情的权限！',
						type:'warning'
					})
				}
				
			},
			handleStatus(index,row){
				//设置端口的启用和禁用

				if(row.btnStatus ==this.$t('Public.Prohibit')){

					this.$confirm(this.$t('confirm.disPort'),this.$t('confirm.tooltip'),{})
					.then(() => {
						this.$ajax.put('/port/to_disable_logic_port/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if (res.data.status==0) {
									this.$message({
										message:this.$t('tooltipMes.diSuccess'),
										type:'success'
									});
									this.getUsers()
								}
							}
						})
					}).catch(() => {})
				}else if(row.btnStatus==this.$t('Public.enable')){

					this.$confirm(this.$t('Public.enPort'),this.$t('confirm.tooltip'),{})
					.then(() => {
						
						this.$ajax.put('/port/to_enable_logic_port/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.enSuccess'),
										type:'success'
									})
									this.getUsers()
								}
							}
						})
					}).catch(() => {})
				}
			},
			handleDel(index,row){
				//删除
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{type:'warning'})
				.then(() =>{
					
					this.$ajax.del('/port/del_logic_port/'+row.id+"?token="+this.token)
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
				}).catch(() => {
					
				})
			},
			//导出数据部分
			handleExport(command){
				if(command=='all'){
					this.$confirm(this.$t('tooltipMes.exportDataAll'),this.$t('confirm.tooltip'),{})
					.then(() => {
						this.exportData()
					}).catch(() => {})
				}else if(command=='current'){
					this.$confirm(this.$t('tooltipMes.exportDataCurr'),this.$t('confirm.tooltip'),{})
					.then(() => {
						var para={
		    				page:this.currentPage,
		    				per_page:this.pagesize,
						}
						this.exportData(para)
					}).catch(() => {})
				}
			},
			exportData:function(params){
				
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,params)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							var arr=res.data.data.items;
							for(let item =0;item<arr.length;item++){
								
								var device=[],device_type=[],node=[],port=[],port_type=[],position=[],rack=[];
								for(let w =0 ;w<arr[item]['physical_ports'].length;w++){
									device.push( arr[item]['physical_ports'][w]['device']['hostname'] );
									node.push( arr[item]['physical_ports'][w]['node']['name'] );
									port.push( arr[item]['physical_ports'][w]['port']['port_no'] );
									port_type.push( arr[item]['physical_ports'][w]['port_type']);
									device_type.push( arr[item]['physical_ports'][w]['device_type'] );
									position.push( arr[item]['physical_ports'][w]['position'] );
									rack.push( arr[item]['physical_ports'][w]['rack'] );
								}
								arr[item]['device']=device;
								arr[item]['device_type']=device_type;
								arr[item]['node']=node;
								arr[item]['port']=port;
								arr[item]['port_type']=port_type;
								arr[item]['position']=position;
								arr[item]['rack']=rack;
								arr[item]['creation_time']=datedialogFormat(arr[item]['creation_time']);
								arr[item]['tenant_name']=arr[item]['tenant']['name'];
								arr[item]['start_time']=datedialogFormat(arr[item]['start_time']);
								arr[item]['end_time']=datedialogFormat(arr[item]['end_time']);
								
							}
							this.excelData=res.data.data.items;
							this.export2Excel();
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			export2Excel(){
				let that=this;
				require.ensure([] ,() => {
					const {export_json_to_excel} = require('@/excel/export2Excel')
					const tHeader=[
						this.$t('Public.creation'),
						'id',
						this.$t('Public.logName'),
						this.$t('Public.tenantName'),
						this.$t('Public.start'),
						this.$t('Public.end'),
						this.$t('Public.userPointer'),
						this.$t('Public.devicePorts'),
						this.$t('Public.devices'),
						this.$t('Public.deviceNodes'),
						this.$t('Public.devicePortType'),
						this.$t('Public.deviceTypes'),
						this.$t('Public.devicePosition'),
						this.$t('Public.deviceRack'),
						this.$t('Public.description')];
					const filterVal=[
					'creation_time',
					'id',
					'name',
					'tenant_name',
					'start_time',
					'end_time',
					'access_type',
					'port',
					'device',
					'node',
					'port_type',
					'device_type',
					'position',
					'rack',
					'description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,this.$t('addNode.download')+ 'excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			
		}
	}

</script>

<style  scoped>
	.visHidden{
		visibility: hidden;
	}
</style>
