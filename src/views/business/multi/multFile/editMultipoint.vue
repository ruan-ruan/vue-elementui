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
				<el-table-column type="index" :label='$t("Public.index")'  align='center'></el-table-column>
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
				<el-table-column prop="bandwidth" :label='$t("Public.bandWidth")'  align='center'></el-table-column>
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
						<el-button size='mini'v-if='scope.row.status == "success" ' type='primary' @click='handleEdit(scope.$index,scope.row)'>{{$t('tabOperation.edit')}}</el-button>
						<el-button size='mini' type='info' @click='handleDetails(scope.$index,scope.row)'>{{$t('tabOperation.info')}}</el-button>
						<el-button size='mini' type='danger' @click='handleDel(scope.$index,scope.row)'>{{$t('tabOperation.info')}}</el-button>
					</template>
				</el-table-column>
			</el-table>

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
					<el-button @click='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
				</div>
			</div>
			<div v-if='dialogStatus=="edit"'>
				<virDetails :basicObj='childForm' ref='virForm'></virDetails>  <!--根据不同的内容云和dc显示不同的文本     //编辑文本-->
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
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
//			console.log(this.id);
			console.log(this.detailsID)
			if(typeof this.id !=='undefined'){
				this.getDetails(this.id);
//				console.log(1111)
			}

			if(typeof this.detailsID !=='undefined'){
//				console.log(this.detailsID)
				this.getDetails(this.detailsID);
			}

		},
		methods:{
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
//					console.log(res);
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
						}else {
							this.$message({
								message:res.data.message,
								type:'warning'
							})
						}
						
					}
				}).catch(e => {console.log(e)})
				
			},
			goback(){
				this.$router.go(-1)
			},
			getClounBasic(msg){
//				console.log(msg);
				this.clounBasic=Object.assign({},msg);
			},
			getClounList(msg){
//				console.log(msg);
				this.clounList=Object.assign({},msg);
			},
			clounSubmit(){//云列表的提交
				
				let that=this;
				var str=[this.$refs['clounForm'].$refs['editForm'],this.$refs['basicForm'].$refs['basicForm']];
				//				,this.$refs.clounForm.$refs.dockListObj
				let obj={};
				str.forEach(ele => {
					
					ele.validate(valid => {
						if(valid) {
							this.editLoading=true;
							var colun={
								cloud_type:this.clounBasic.cloun,
								region:this.clounBasic.targetRegion,
								cloud_config_id:this.clounBasic.clounDock
							}
							
							obj=Object.assign({},this.clounList,colun,this.basicObj);
							
							this.$ajax.post('/vll/add_cloud_endpoint/'+this.id+'?token='+this.token)
							.then(res => {
								this.editLoading=false;
//								console.log(res)
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('tooltipMes.addSuccess'),
											type:'success'
										})
										this.resetFields();
										that.dialogFormVisible=false;
										this.$router.push({
											path:'/business/editMultipoint',
											query:{
												id:this.id,
											}
										})
									}else{
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
//							console.log('kkkk')
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

//							console.log(obj);
//							Debug
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
										ele.resetFields();
										that.dialogFormVisible=false;
										that.componentStatus=false;
										that.$nextTick(() => {
											that.componentStatus=true;
										})
										
										this.getDetails(this.id)

									}else{
									this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							})
							.catch(e => {console.log(e)})
							
						}
					})
				})	
			},

			getFormData(msg){
//				console.log(msg)
				this.dcObj=msg;
			},
			getBasic(msg){//获取基本信息数据
//				console.log(msg)
				let obj={
					overdue_time:'',
					billing_time:''
				}
				if(msg.billing_time==''){
					obj.billing_time=null
				}else{
//					obj.billing_time=datedialogFormat(msg.billing_time/1000)
					obj.billing_time=msg.billing_time/1000
				}
				 
				if(msg.overdue_time==''){
					obj.overdue_time=null
				}else{
					obj.overdue_time= msg.overdue_time/1000
					
//					obj.overdue_time= datedialogFormat(msg.overdue_time/1000)
				}
				this.basicObj={
					expiration_time:obj.overdue_time,
					charge_time:obj.billing_time,
					charge_mode:msg.changeModel,
					description:msg.des,
					bandwidth:msg.bandwidth
				}
//				console.log(this.basicObj)
			},
			getDetails(ids){//获取数据
				this.basicLoading=true;
				this.loading=true;
				this.users=[];
				this.$ajax.get('/vll/multi_vll_info/'+ids+'?token='+this.token)
				.then(res => {
//					console.log(res);
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
							
							this.editForm={
								id:str.id,
								name:str.name,
								tenant_name:str.tenant.name,
								tenant_id:str.tenant.id,
								status:sta,
								dec:str.description,
								creation_time:datedialogFormat(str.creation_time)
							}
							//将dc的数据和云的数据整合后在一个新的数组里面        是两个数组   
							//需要将数据中心和公有云的部分整合到一个新的数组   然后展示出来
							if(str.endpoints){
								str.endpoints.forEach(ele => {
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
								str.cloud_endpoints.forEach(ele => {
									ele.changeBtn=this.$t('Public.Prohibit');
									ele.dataType='cloud_endpoints';//数据为云的数据
									ele.typeName='公有云'
									this.users.push(ele);
								})
							}

						}else{
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
									this.$router.replace('/business/multipoint')
								}else{
									this.$message({
										message:res.data.message,
										type:'warning'
									})
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
				console.log(row);
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
//			            confirmButtonText: '确定',
//			            cancelButtonText: '取消',
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
									
								}else {
									this.$message({
										message:res.data.message,
										type:'warning'
									})
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
//			            confirmButtonText: '确定',
//			            cancelButtonText: '取消',
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
									
								}else {
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}
								
							}
						}).catch(e => {console.log(e)})
						
					}).catch(() => {})
				}

			},
			handleEdit(index,row){//编辑
				this.dialogStatus='edit';
				this.dialogFormVisible=true;
//				console.log(row);
				this.childForm=Object.assign({},row);

			},
			handleDetails(index,row){//详情
//				console.log(row)
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
							}else{
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
				}).catch(() => {})
			},
			//表格数据时间转换
//			dateFormat(row, column) {
//		      	let date = new Date(parseInt(row.charge_time) * 1000);
//		      	let Y = date.getFullYear() + "-";
//		      	let M =date.getMonth() + 1 < 10  ? "0" + (date.getMonth() + 1) + "-" : date.getMonth() + 1 + "-";
//		      	let D =  date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
//		      	let h = date.getHours() < 10  ? "0" + date.getHours() + ":"  : date.getHours() + ":";
//		        let m = date.getMinutes() < 10  ? "0" + date.getMinutes() + ":"  : date.getMinutes() + ":";
//		        let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
//		      return Y + M + D + h + m + s;
//		    },
//		    dateFormatExpiration(row, column) {
//		      	let date = new Date(parseInt(row.expiration_time) * 1000);
//		      	let Y = date.getFullYear() + "-";
//		      	let M =date.getMonth() + 1 < 10  ? "0" + (date.getMonth() + 1) + "-" : date.getMonth() + 1 + "-";
//		      	let D =  date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
//		      	let h = date.getHours() < 10  ? "0" + date.getHours() + ":"  : date.getHours() + ":";
//		        let m = date.getMinutes() < 10  ? "0" + date.getMinutes() + ":"  : date.getMinutes() + ":";
//		        let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
//		      return Y + M + D + h + m + s;
//		    },
		}
	}
</script>

<style scoped>
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