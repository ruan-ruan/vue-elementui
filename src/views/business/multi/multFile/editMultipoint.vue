<template>
	<div v-if='componentStatus'>
		<section>
			<h3 class="tit_h3" v-if=" typeof id !=='undefined'" v-text="title.nav"></h3>
			<el-row>
				<el-col :span='24'>
					<el-form :model='editForm' ref='editForm'label-width='200px' v-loading='basicLoading' :rules='editFormRules'>
						<el-form-item :label='$t("Public.creation")' prop='creation_time'>
							<el-input v-model='editForm.creation_time' class='ipt' disabled></el-input>
						</el-form-item>
						<el-form-item :label='$t("multi.multiName")' prop='name'>
							<el-input v-model='editForm.name' class='ipt' :disabled=" !(typeof id !=='undefined')"></el-input>
						</el-form-item>
						<el-form-item :label='$t("multi.multiStatus")' prop='status'>
							<el-input v-model='editForm.status' class='ipt' disabled></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.tenant")' prop='tenant'>
							<el-input disabled v-model='editForm.tenant_name' class='ipt'></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.description")' prop='dec'>
							<el-input type='textarea' cols='6' v-model='editForm.dec' class='ipt':disabled=" !(typeof id !=='undefined')"></el-input>
						</el-form-item>
						<el-form-item v-if=" typeof id !=='undefined'" class='tc_L'>
							<el-button size='small'  @click='goback'>{{$t('Public.goback')}}</el-button>
							<el-button size='small'  type='primary' @click='editSubmit' v-if=" typeof id !=='undefined'">{{$t('tabOperation.Submit')}}</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<h3 class="tit_h3" v-text="title.hea" v-if=" typeof id !=='undefined'"></h3>
			<el-row v-if=" typeof id !=='undefined'">
				<el-col :span='24'>
					<el-button type='primary' size='small' @click='addLogic' >{{$t('multi.addLogicPort')}}</el-button>
				</el-col>
			</el-row>
			<el-table :data='users' highlight-current-row style="width: 100%;" v-loading='loading'>
				<el-table-column type="index" :label='$t("Public.index")'  align='center'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(index-1)*size+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="creation" :label='$t("Public.creatime")' align='center'></el-table-column>
				<el-table-column prop="node.name" :label='$t("Public.nodeName")' align='center'></el-table-column>
				<el-table-column prop="statusName" :label='$t("Public.status")'  align='center'>
					<template slot-scope='scope'>
						<span :class='scope.row.statusColor'>{{scope.row.statusName}}</span>
					</template>
				</el-table-column>		
				<el-table-column prop="logic_port.name" :label='$t("Public.logic")' align='center'>
					<template slot-scope='scope'> 
						<span>{{scope.row.logic_port.name}}</span> <br />
						<span>{{scope.row.vlanName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="logicStatus" :label='$t("Public.logicStatus")'  align='center'>
					<template slot-scope='scope'>
						<span :class="scope.row.LogicColor">{{scope.row.logicStatus}}</span> 
					</template>
				</el-table-column>
				<el-table-column prop="bandwidth" :label='$t("Public.bandwidth")'  align='center'></el-table-column>
				<el-table-column prop="typeName" :label='$t("business.logicType")'  align='center'></el-table-column>
				<el-table-column prop="charge_mode" :label='$t("Public.chargModel")'  align='center'></el-table-column>
				
				<el-table-column prop="charge":label='$t("Public.billTime")' width="95" align='center'>					
				</el-table-column>
				<el-table-column prop="expiration":label='$t("Public.expTime")'width="95" align='center'>			
				</el-table-column>
				
				<el-table-column prop="description":label='$t("Public.description")' align='center'></el-table-column>
				<el-table-column :label='$t("Public.operation")' width="160" align='center' v-if=" typeof id !=='undefined'">
					<template slot-scope='scope'v-if='scope.row.status == "creating"? false : true '>
						<el-button size='mini' v-if='scope.row.status == "success" ' @click='handleTabStatus(scope.$index,scope.row)'>{{scope.row.changeBtn}}</el-button>
						<el-button size='mini'type='primary'v-if='scope.row.status == "success" ' @click='handleEdit(scope.$index,scope.row)'>{{$t('tabOperation.edit')}}</el-button>
						<el-button size='mini' type='info' @click='handleDetails(scope.$index,scope.row)'>{{$t('tabOperation.info')}}</el-button>
						<el-button size='mini' type='danger' @click='handleDel(scope.$index,scope.row)'>{{$t('tabOperation.delete')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination 
				@size-change="handleSizeChange" 
				@current-change="handleCurrentChange" 
				:current-page="index" 
				:page-sizes="[5,10,15,20]" 
				:page-size="size" 
				:pager-count="pagecount"
				layout="total, sizes, prev, pager, next, jumper" 
				:total="tableCopyTableList.length">
    		</el-pagination>
		</section>
		
		<el-dialog :title='textMap[dialogStatus]':visible.sync="dialogFormVisible" :close-on-click-modal="false" v-loading='editLoading'>
			<div v-if='dialogStatus=="creat"'>
				<h3>{{$t('multi.SelectType')}}:</h3>		
				<el-tabs v-model='activeName'type="border-card" class='marT5'>
					<el-tab-pane :label='$t("multi.dataCentPort")'name='first'>
						<dc-port @sendFormData='getFormData' ref='editForm' v-if=' activeName ==="first"'  ></dc-port> <!-- @sendNdoe='getNodeObj' @sendLogic='getLogicObj'-->                                                                                 
						<basic-details @sendBasic='getBasic' ref='basicForm' v-if=' activeName ==="first"'></basic-details>
						<div style='text-align: center;'>
							<el-button  size='small' @click='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
							<el-button type='primary' size='small' @click='dcSubmit'>{{$t('tabOperation.Submit')}}</el-button>
						</div>
						
					</el-tab-pane>
					<el-tab-pane :label='$t("multi.sharedCloud")'name="second" >
						<sharedCloun @sendClounbasic='getClounBasic'@sendClounList='getClounList' v-if=' activeName ==="second"'  ref='clounForm'></sharedCloun>  
						<basic-details @sendBasic='getBasic' ref='basicForm' v-if=' activeName ==="second"'></basic-details>
						<div style='text-align: center;'>
							<el-button  size='small' @click='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
							<el-button type='primary' size='small' @click='clounSubmit'>{{$t('tabOperation.Submit')}}</el-button>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div v-if='dialogStatus=="see"'>
				<virDetails :basicObj='childForm'></virDetails>  <!--根据不同的内容云和dc显示不同的文本     详情文本-->
				<basic-details ref='basicForm' :basicObj='childForm' :type='dialogStatus'></basic-details>
				<div class="toolbar"style="text-align: center;">
					<el-button size='small' @click='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
				</div>
			</div>
			<div v-if='dialogStatus=="edit"'>
				<virDetails :basicObj='childForm' ref='virForm' :type='dialogStatus '></virDetails>  <!--根据不同的内容云和dc显示不同的文本     //编辑文本-->
				<basic-details ref='basicForm' :basicObj='childForm' @sendBasic='getBasic'></basic-details>
				<div class="toolbar"style="text-align: center;">
					<el-button  size='small' @click='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
					<el-button type='primary' size='small' @click='editDataType' >{{$t('tabOperation.Submit')}}</el-button>
				</div>
			</div>
			
		</el-dialog>
	</div>
</template>

<script>
	

	
	import virDetails from '@/views/business/multi/multFile/virDetails'
	
	
	import sharedCloun from '@/views/business/multi/multFile/sharedCloun'
	
	import {datedialogFormat,getPortStatus} from '@/assets/js/index.js'
	import basicDetails from '@/views/business/multi/multFile/basicDetails'
	import dcPort from '@/views/business/multi/multFile/dcPort'
	import goback from '@/components/goback'
	export default{
		name:'editMultipoint',
		components:{goback,dcPort,basicDetails,sharedCloun,virDetails},
		props:['detailsID'],
		data(){
			return{
				activeName:'first',
				title:{
					nav:this.$t('multi.multiInformation'),
					hea:this.$t('multi.multiPort')
				},
				id:this.$route.query.id,  //虚拟组网的列表传过来的id   存在id的时候是编辑，否则是新增界面
				token:'',
				editLoading:false,
				loading:false,
				basicLoading:false,
				editForm:{
					id:'',
					name:'',
					tenant_name:'',
					tenant_id:'',
					dec:'',
					creation_time:'',
					status:'',
				},
				tenantData:[],//租户标识数据
				editFormRules:{
					name:[ { required: true, message: this.$t('Public.plaName'), trigger: 'blur' },]
				},
				users:[],
				dcPortData:[],
				textMap:{
					edit:this.$t('tabOperation.edit'),
					creat:this.$t('tabOperation.add'),
					see:this.$t('tabOperation.info')
				},
				dialogStatus:'',
				dialogFormVisible:false,
				nodeObj:{},//节点改变的时候获取的对象
				logicObj:{},//逻辑口改变的时候获取的对象
				
				dcObj:{},//获取dc里面的基本数据信息
				basicObj:{},//获取基本的form表单信息
				clounBasic:{},//云选择公共部分
				clounList:{},
				componentStatus:true,
				childForm:{},//获取数据 传送给子组件
				buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 "link@add_unknown_link"
			  		addLogic:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list, "vll@add_endpoint").show,//添加逻辑口
			  		addCloud:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list, "vll@add_cloud_endpoint").show,//添加云逻辑口	
			  		del:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list,"vll@del_endpoint").show,//单个删除和批量的删除是绑定在一起的  
			  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list,"vll@edit_endpoint").show,//编辑的值
			  		see:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list, "port@logic_port_info").show,//查看详情
			  		run:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list,"vll@enable_endpoint+vll@del_endpoint" ).show,//运行
			  		stop:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list,"vll@disable_endpoint").show,//停止
			  	},
				index: 1,
      			size: 5,
      			tableCopyTableList: [],//数据copy
      			pagecount:5,
			}
		},

		created(){
			this.token=sessionStorage.getItem('token');
			if(typeof this.id !=='undefined'){
				this.getDetails(this.id);
			}

			if(typeof this.detailsID !=='undefined'){
				this.getDetails(this.detailsID);
			}

		},
		methods:{
			// 页数改变事件
		    handleSizeChange(size) {
		      	this.size = size;
		      	this.users = this.paging(size, this.index);
		    },
		    // 页码改变事件
		    handleCurrentChange(current) {
		      	this.index = current;
		      	this.users = this.paging(this.size, current);
		    },
			// 本地分页的方法
		    paging(size, current) {
		      	const tableList = JSON.parse(JSON.stringify(this.tableCopyTableList));
		      	const tablePush = [];
		      	tableList.forEach((item, index) => {
		        	if (size * (current - 1) <= index && index <= size * current - 1) {
		          		tablePush.push(item);
		        	}
		      	});
		      	return tablePush;
		    },
			editDataType(){//虚拟机点修改保存
				var str='';//虚拟机点的类型
				if(this.childForm.dataType == "endpoints"){
					str='node';
				}else if(this.childForm.dataType == "cloud_endpoints"){
					str='cloud'
				}
//				var para={
//					charge_mode:this.basicObj.charge_mode
//				}
				var para=Object.assign({},this.basicObj);
				this.$ajax.put('/vll/edit_endpoint/'+str+'/'+this.editForm.id+'/'+this.childForm.id+'?token='+this.token,para)
				.then(res => {
					if(res.status == 200){
						if(res.data.status ==0 ){
							this.$message({
								message:this.$t('tooltipMes.editSuccess'),
								type:"success"
							})
							this.dialogFormVisible=false;
							this.$refs['virForm'].$refs['detailsForm'].resetFields();
							this.$refs['basicForm'].$refs['basicForm'].resetFields();
//							this.getDetails(this.editForm.id);
							this.getDetails(this.id);
						}
					}
				}).catch(e => {console.log(e)})
				
			},
			goback(){
				this.$router.go(-1)
			},
			getClounBasic(msg){
				this.clounBasic=Object.assign({},msg);
			},
			getClounList(msg){
				this.clounList=Object.assign({},msg);
			},
			clounSubmit(){//云列表的提交
				
				let that=this;
				var str=[that.$refs['clounForm'].$refs['editForm'],that.$refs['basicForm'].$refs['basicForm']];
				//				,this.$refs.clounForm.$refs.dockListObj
				let obj={};
				str.forEach(ele => {
					
					ele.validate(valid => {
						if(valid) {
							that.$confirm('确认要添加吗?',{})
							.then(() => {
								that.editLoading=true;
								var colun={
									cloud_type:that.clounBasic.cloun,
									region:that.clounBasic.targetRegion,
									cloud_config_id:that.clounBasic.clounDock
								}
								obj=Object.assign({},that.clounList,colun,that.basicObj);
								that.$ajax.post('/vll/add_cloud_endpoint/'+that.id+'?token='+that.token,obj)
								.then(res => {
									this.editLoading=false;
									if(res.status==200){
										if(res.data.status==0){
											that.$message({
												message:that.$t('tooltipMes.addSuccess'),
												type:'success'
											})
											that.dialogFormVisible=false;
											that.$refs['clounForm'].$refs['editForm'].$refs['clounForm'].resetFields();
											that.$refs['basicForm'].$refs['basicForm'].resetFields();
											
											that.getDetails(that.id)
										}
									}
								})
								.catch(e => {
									console.log(e)
								})
							}).catch(() => {})
						}
					})
				})
				
			},
			
			dcSubmit(){//数据中心的部分的提交 弹窗的提交
				
				let that=this;
				var str=[this.$refs['editForm'].$refs['editForm']  , this.$refs['basicForm'].$refs['basicForm']]

				let obj={};
				str.map(ele => {
					ele.validate(valid => {
						if(valid){
							this.$confirm('确认要添加吗?','提示',{type:'success'})
							.then(() => {
								this.editLoading=true;
	
								obj={
									node_id:that.dcObj.nodeName,
									logic_port_id:that.dcObj.logic,
									vlan:this.dcObj.vlan,
									bandwidth:that.basicObj.bandwidth,								
									charge_mode:that.basicObj.charge_mode,
									charge_time:that.basicObj.charge_time ,
									expiration_time:that.basicObj.expiration_time,
									description:that.basicObj.description,
								}
								
								this.$ajax.post('/vll/add_endpoint/'+this.id+'?token='+this.token,obj)
								.then(res => {
									this.editLoading=false;
									if(res.status==200){
										if(res.data.status==0){
											console.log(res)
											this.$message({
												message:res.data.message,
												type:'success'
											})
											
											that.dialogFormVisible=false;
											this.$refs['editForm'].$refs['editForm'].$refs['dcForm'].resetFields();  
											this.$refs['basicForm'].$refs['basicForm'].resetFields();
											that.componentStatus=false;
											that.$nextTick(() => {
												that.componentStatus=true;
											})
											
											this.getDetails(this.id)
	
										}
									}
								}).catch(e => {console.log(e)})
							})
							.catch(() => {})
							
							
						}
					})
				})	
			},

			getFormData(msg){
				this.dcObj=msg;
			},
			getBasic(msg){//获取基本信息数据
				let obj={
					overdue_time:'',
					billing_time:''
				}
				if(msg.billing_time==''||(!msg.billing_time && typeof(msg.billing_time) && msg.billing_time !=0) ){
					obj.billing_time=null
				}else{
					obj.billing_time=msg.billing_time/1000
				}
				 
				if(msg.overdue_time==''||  (!msg.overdue_time && typeof(msg.overdue_time) && msg.overdue_time !=0)){
					obj.overdue_time=null
				}else{
					obj.overdue_time= msg.overdue_time/1000
				}
				this.basicObj={
					expiration_time:obj.overdue_time,
					charge_time:obj.billing_time,
					charge_mode:msg.changeModel,
					description:msg.des,
					bandwidth:msg.bandwidth
				}
			},
			getDetails(ids){//获取数据
				this.basicLoading=true;
				this.loading=true;
				this.users=[];
				this.$ajax.get('/vll/multi_vll_info/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.basicLoading=false;
							this.loading=false;
							var str=res.data.data;
							let sta='';
							if(str.status == "servicing"){
								sta=this.$t('Public.servicing');
							}else if(str.status ==' stopping'){
								sta=this.$t('Public.stopping');
							}else if(str.status == 'creating'){
								sta=this.$t('Public.creating');
							}else if(str.status == 'failure'){
								sta=this.$t('Public.failure');
							}
							//基本信息
							this.editForm={
								id:str.id,
								name:str.name,
								tenant_name:str.tenant.name,
								tenant_id:str.tenant.id,
								status:sta,
								dec:str.description,
								creation_time:datedialogFormat(str.creation_time)
							}
							
							//数组  数据分为endpoints和cloud_endpoints
							
							if(str.endpoints){
								var point=JSON.parse(JSON.stringify(str.endpoints))
								point.map(ele => {
									if(ele.vlan < 0){
										ele.vlanName=this.$t('Public.passthrough');
									}else if(ele.vlan == 0){
										ele.vlanName='UNTAG'
									}else if(ele.vlan > 0){
										ele.vlanName=ele.vlan
									}
									if(getPortStatus(ele.ports) =='UP'){
										ele.logicStatus='UP'
										ele.LogicColor='colorGreen'
									}
									if(getPortStatus(ele.ports) =='DOWN'){
										ele.logicStatus='DOWN'
										ele.LogicColor='colorRed'
									}
									if(getPortStatus(ele.ports) =='故障'){
										ele.logicStatus='DOWN'
										ele.LogicColor='colorWarning'
									}

									if( (!ele.charge_time && typeof(ele.charge_time)!='undefined' && ele.charge_time!=0) || ele.charge_time=='' ){
										ele.charge_time=''
										ele.charge=''
									}else{
										ele.charge=datedialogFormat(ele.charge_time)
									}
									if((!ele.expiration_time && typeof(ele.expiration_time)!='undefined' && ele.expiration_time!=0)|| ele.expiration_time=='' ){
										ele.expiration_time=''
										ele.expiration=''
									}else{
										ele.expiration=datedialogFormat(ele.expiration_time)
									}
									ele.creation=datedialogFormat(ele.creation_time)
									if(ele.status == 'success'){
										if(ele.usable){
											ele.statusName=this.$t('tooltipMes.creaSuccess')
											ele.changeBtn=this.$t('Public.Prohibit');
											ele.statusColor='suc';
										}else if(!ele.usable){
											ele.statusName=this.$t('Public.Prohibit');
											ele.changeBtn=this.$t('Public.enable');
											ele.statusColor='dan'	
										}
										
									}else if(ele.status == 'creating'){
										ele.statusName=this.$t('Public.creating');
										ele.statusColor='pri'
										
									}else if(ele.status == 'failure'){
										ele.statusName=this.$t('Public.failure')
										ele.statusColor='dan'	
									}
									ele.dataType='endpoints';//添加新的字段判断  改数据是dc还是云  该数据是dc的
									ele.typeName='数据中心'
									this.users.push(ele);
								})
							}
							if(str.cloud_endpoints){
								var cloud=JSON.parse(JSON.stringify(str.cloud_endpoints))
								cloud.map(ele => {
									ele.changeBtn=this.$t('Public.Prohibit');
									ele.dataType='cloud_endpoints';//数据为云的数据
									ele.typeName='公有云'
									ele.logic_port=ele.cloud_config.logic_port;
									ele.node=ele.ports[0].node;//默认显示ports的第一个节点
									if(ele.vlan < 0){
										ele.vlanName=this.$t('Public.passthrough');
									}else if(ele.vlan == 0){
										ele.vlanName='UNTAG'
									}else if(ele.vlan > 0){
										ele.vlanName=ele.vlan
									}
									if(getPortStatus(ele.ports) =='UP'){
										ele.logicStatus='UP'
										ele.LogicColor='colorGreen'
									}
									if(getPortStatus(ele.ports) =='DOWN'){
										ele.logicStatus='DOWN'
										ele.LogicColor='colorRed'
									}
									if(getPortStatus(ele.ports) =='故障'){
										ele.logicStatus='DOWN'
										ele.LogicColor='colorWarning'
									}
									if( (!ele.charge_time && typeof(ele.charge_time)!='undefined' && ele.charge_time!=0) || ele.charge_time=='' ){
										ele.charge_time=''
										ele.charge=''
									}else{
										ele.charge=datedialogFormat(ele.charge_time)
									}
									if((!ele.expiration_time && typeof(ele.expiration_time)!='undefined' && ele.expiration_time!=0)|| ele.expiration_time=='' ){
										ele.expiration_time=''
										ele.expiration=''
									}else{
										ele.expiration=datedialogFormat(ele.expiration_time)
									}
									ele.creation=datedialogFormat(ele.creation_time)
									if(ele.status == 'success'){
										if(ele.usable){
											ele.statusName=this.$t('tooltipMes.creaSuccess')
											ele.changeBtn=this.$t('Public.Prohibit');
											ele.statusColor='suc';
										}else if(!ele.usable){
											ele.statusName=this.$t('Public.Prohibit');
											ele.changeBtn=this.$t('Public.enable');
											ele.statusColor='dan'	
										}
										
									}else if(ele.status == 'creating'){
										ele.statusName=this.$t('Public.creating');
										ele.statusColor='pri'
										
									}else if(ele.status == 'failure'){
										ele.statusName=this.$t('Public.failure')
										ele.statusColor='dan'	
									}
									this.users.push(ele);
								})
							}
							console.log(this.users)
							// 初始化数据
						    this.tableCopyTableList = JSON.parse(JSON.stringify(this.users));
						    this.users = this.paging(this.size, this.index);
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
			},
			editSubmit(){//虚拟网络的编辑部分
				
				this.$refs.editForm.validate(valid => {
					if(valid) {
						this.basicLoading=true;
						var para={
							name:this.editForm.name,
							tenant_id:this.editForm.tenant_id,
							description:this.editForm.dec
						}
						this.$ajax.put('/vll/edit_virtual_host/'+this.editForm.id+'?token='+this.token,para)
						.then(res => {
							this.basicLoading=false;
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'修改成功!',
										type:'success'
									})
									this.$refs['editForm'].resetFields();
									this.$router.push('/business/multipoint')
								}
							}
						})
						.catch(e => {console.log(e)})
					}
				})
			},
			addLogic(){//添加逻辑口
				this.dialogStatus='creat';
				this.dialogFormVisible=true;
				
			},
			handleTabStatus(index,row){//禁用和启用的装填的切换
				var str='';
				if(row.dataType == "endpoints"){
					str='node'
				}else if(row.dataType == 'cloud_endpoints'){
					str='cloud'
				}

				if(row.usable){//禁用
					const newDatas=[];
					const confirmText = [this.$t('confirm.plaSureStop'), this.$t('Public.logic')+':'+row.logic_port.name] ;
					const h=this.$createElement;
					for(const i in confirmText){
						newDatas.push( h ( 'p' , null ,confirmText[i]) );
					}
					this.$confirm(this.$t('confirm.tooltip'),{
						title:this.$t('confirm.tooltip'),
						message:h ( 'div',null,newDatas),
						showCancelButton: true,
			            type: 'warning'
					})
					.then(() => {
						this.$ajax.put('/vll/disable_endpoint/'+str+'/'+this.editForm.id+'/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.diSuccess'),
										type:'success'
									})
									this.getDetails(this.editForm.id);
									
								}
							}
						}).catch(e => {console.log(e)})
					}).catch( () => {})
				}else if(!row.usable){
					const newDatas=[];
					const confirmText = [this.$t('confirm.plaSureRun'), this.$t('Public.logic')+':'+row.logic_port.name] ;
					const h=this.$createElement;
					for(const i in confirmText){
						newDatas.push( h ( 'p' , null ,confirmText[i]) );
					}
					this.$confirm(this.$t('confirm.tooltip'),{
						title:this.$t('confirm.tooltip'),
						message:h ( 'div',null,newDatas),
						showCancelButton: true,
			            type: 'warning'
					})
					.then(() => {
						this.$ajax.put('/vll/enable_endpoint/'+str+'/'+this.editForm.id+'/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.enSuccess'),
										type:'success'
									})
									this.getDetails(this.editForm.id);
									
								}
							}
						}).catch(e => {console.log(e)})
						
					}).catch(() => {})
				}

			},
			handleEdit(index,row){//编辑
				this.dialogStatus='edit';
				this.dialogFormVisible=true;
				this.childForm=Object.assign({},row);

			},
			handleDetails(index,row){//详情
				console.log(row);
				this.childForm={};
				this.dialogStatus='see';
				this.dialogFormVisible=true;
				this.childForm=Object.assign({},row);

			},
			handleDel(index,row){//删除
				var strType=''
				if(row.dataType =="endpoints"){
					strType='node'
				}else if(row.dataType =="cloud_endpoints"){
					strType='cloud'
				}
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{type:'warning'})
				.then(() => {
					this.loading=true;
					this.$ajax.del('/vll/del_endpoint/'+strType+'/'+this.id+'/'+row.id+'?token='+this.token)
					.then(res => {
						this.loading=false;
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
								this.getDetails(this.id);
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
				}).catch(() => {})
			},

		}
	}
</script>

<style >
	
	
	
	.suc{
		color: #67C23A;
	}
	.pri{
		color: #409EFF;
	}
	.dan{
		color: #F56C6C;
	}
</style>