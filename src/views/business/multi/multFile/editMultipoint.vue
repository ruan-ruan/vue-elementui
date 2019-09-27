<template>
	<div>
		<goback v-if=" typeof id !=='undefined'"></goback>
		<section>
			<h3 class="tit_h3" v-if=" typeof id !=='undefined'" v-text="title.nav"></h3>
			<el-row>
				<el-col :span='24'>
					<el-col :span='12'>
					<el-form :model='editForm' ref='editForm'label-width='100px' v-loading='basicLoading' :rules='editFormRules'>
						<el-form-item label='组网名称' prop='name'>
							<el-input v-model='editForm.name' class='ipt' :disabled=" !(typeof id !=='undefined')"></el-input>
						</el-form-item>
						<el-form-item label='租户标识' prop='tenant'>
							<el-input disabled v-model='editForm.tenant_name' class='ipt'></el-input>
						</el-form-item>
						<el-form-item label='备注' prop='dec'>
							<el-input type='textarea' cols='6' v-model='editForm.dec' class='ipt':disabled=" !(typeof id !=='undefined')"></el-input>
						</el-form-item>
					</el-form>
					</el-col>
				</el-col>
			</el-row>
			<h3 class="tit_h3" v-text="title.hea" v-if=" typeof id !=='undefined'"></h3>
			<el-row v-if=" typeof id !=='undefined'">
				<el-col :span='24'>
					<el-button type='primary' size='small' @click='addLogic' >添加逻辑端口</el-button>
				</el-col>
			</el-row>
			<el-table :data='users' highlight-current-row style="width: 100%;" v-loading='loading'>
				<el-table-column type="index"label='序号' width="70" align='center'></el-table-column>
				<el-table-column prop="name"label='名称' width="120" align='center'></el-table-column>
				<el-table-column prop="logic_port.name"label='逻辑口' width="120" align='center'></el-table-column>
				<el-table-column prop="status"label='逻辑口状态' width="120" align='center'></el-table-column>
				<el-table-column prop="bandwidth"label='带宽(Mbps)' width="120" align='center'></el-table-column>
				<el-table-column prop="type"label='类型' width="120" align='center'></el-table-column>
				<el-table-column prop="charge_mode"label='计费模式' width="120" align='center'></el-table-column>
				<el-table-column prop="charge_time"label='计费时间':formatter='dateFormat' width="120" align='center'></el-table-column>
				<el-table-column prop="expiration_time"label='过期时间':formatter='dateFormat' width="120" align='center'></el-table-column>
				<el-table-column prop="description"label='备注' width="120" align='center'></el-table-column>
				<el-table-column label='操作' width="300" align='center' v-if=" typeof id !=='undefined'">
					<template slot-scope='scope'>
						<el-button size='small' @click='handleTabStatus(scope.$index,scope.row)'>{{}}</el-button>
						<el-button size='small' type='primary' @click='handleEdit(scope.$index,scope.row)'>编辑</el-button>
						<el-button size='small' type='info' @click='handleDetails(scope.$index,scope.row)'>详情</el-button>
						<el-button size='small' type='danger' @click='handleDel(scope.$index,scope.row)'>删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-button style='margin-left: 50%;'type='primary' @click='editSubmit' v-if=" typeof id !=='undefined'">提交</el-button>
		</section>
		
		<el-dialog :title='textMap[dialogStatus]':visible.sync="dialogFormVisible" :close-on-click-modal="false" v-loading='editLoading'>
			<!--<el-form label-width='100px'>
				<el-form-item label='选择类型' >
					<el-tabs v-model='activeName'type="border-card"  @tab-click="handleClick">
						<el-tab-pane label='数据中心端口'name='first'>
							<dc-port @sendFormData='getFormData' @sendNdoe='getNodeObj' @sendLogic='getLogicObj' ref='dcForm'></dc-port>
							<basic-details @sendBasic='getBasic' ref='basicForm'></basic-details>
							<el-button style='margin-left: 50%;' type='primary' size='small' @click='dcSubmit'>提交</el-button>
						</el-tab-pane>
						<el-tab-pane label='公有云端口'name="second">
							dsadad
						</el-tab-pane>
					</el-tabs>
				</el-form-item>
			</el-form>-->
			<div v-if='dialogStatus=="creat"'>
				类型选择
				<el-tabs v-model='activeName'type="border-card" >
					<el-tab-pane label='数据中心端口'name='first'>
						<dc-port @sendFormData='getFormData' ref='dcForm'></dc-port> <!-- @sendNdoe='getNodeObj' @sendLogic='getLogicObj'-->                                                                                 
						<basic-details @sendBasic='getBasic' ref='basicForm'></basic-details>
						<el-button style='margin-left: 50%;' type='primary' size='small' @click='dcSubmit'>提交</el-button>
					</el-tab-pane>
					<el-tab-pane label='公有云端口'name="second">
						<sharedCloun @sendClounbasic='getClounBasic'@sendClounList='getClounList'  ref='clounForm'></sharedCloun>  <!--@sendDockObj='getDockObj'-->
						<basic-details @sendBasic='getBasic' ref='basicForm'></basic-details>
						<el-button style='margin-left: 50%;'type='primary' size='small' @click='clounSubmit'>提交</el-button>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div v-if='dialogStatus=="see"'>
				<virDetails :basicObj='basicObj'></virDetails>  <!--根据不同的内容云和dc显示不同的文本     详情文本-->
				<basic-details ref='basicForm' :basicObj='basicObj'></basic-details>
			</div>
			<div v-if='dialogStatus=="edit"'>
				<virDetails :basicObj='basicObj'></virDetails>  <!--根据不同的内容云和dc显示不同的文本     //编辑文本-->
				<basic-details ref='basicForm' :basicObj='basicObj'></basic-details>
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
					nav:'组网基本信息配置',
					hea:'组网端点配置'
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
					dec:''
				},
				tenantData:[],//租户标识数据
				editFormRules:{
					name:[ { required: true, message: '请输入名称', trigger: 'blur' },]
				},
				users:[],
				textMap:{
					edit:'编辑',
					creat:'添加',
					see:'详情'
				},
				dialogStatus:'',
				dialogFormVisible:false,
				nodeObj:{},//节点改变的时候获取的对象
				logicObj:{},//逻辑口改变的时候获取的对象
				
				dcObj:{},//获取dc里面的基本数据信息
				basicObj:{},//获取基本的form表单信息
				clounBasic:{},//云选择公共部分
				clounList:{},
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			if(typeof this.id !=='undefined'){
				this.getDetails(this.id);
				console.log(1111)
			}else{
				this.getTenant()
				console.log(33333)
			}
			if(typeof this.detailsID !=='undefined'){
				this.getDetails(this.id);
			}
//			else{
				this.getTenant()
//			}
			
		},
		methods:{
			getTenant(){//获取租户的数据
				this.$ajax.get('/tenant/add_tenant'+'?token='+this.token)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			getClounBasic(msg){
				console.log(msg);
				this.clounBasic=Object.assign({},msg);
			},
			getClounList(msg){
				console.log(msg);
				this.clounList=Object.assign({},msg);
			},
			clounSubmit(){//云列表的提交
				
				let that=this;
				var str=[this.$refs.clounForm.$refs.editForm,this.$refs.basicForm.$refs.basicForm];
				//				,this.$refs.clounForm.$refs.dockListObj
				let obj={};
				str.forEach(ele => {
					
					ele.validate(valid => {
						if(valid) {
							// this.$confirm('确定要提交吗?','提示',{})
							// .then(() => {
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
									console.log(res)
									if(res.status==200){
										if(res.data.status==0){
											this.$message({
												message:"添加成功!",
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
								
							// }).catch(() => {})
						}
					})
				})
				
			},
			dcSubmit(){//数据中心的部分的提交 弹窗的提交
				
				let that=this;
				var str=[this.$refs.dcForm.$refs.editForm,this.$refs.basicForm.$refs.basicForm]
				let obj={};
				str.forEach(ele => {
					console.log(ele)
					ele.validate(valid => {
						if(valid){
							// this.$confirm('确定要添加吗?','提示',{})
							// .then(() => {
								this.editLoading=true;
								obj={
									node_id:that.dcObj.nodeName,
									logic_port_id:that.dcObj.logic,
									vlan:this.dcObj.vlan,
									bandwidth:that.basicObj.bandwidth,
									charge_mode:that.basicObj.charge_mode,
									charge_time:that.basicObj.charge_time,
									expiration_time:that.basicObj.expiration_time,
									description:that.basicObj.description,
								}
								this.$ajax.post('/vll/add_endpoint/'+this.id+'?token='+this.token,obj)
								.then(res => {
									this.editLoading=false;
									if(res.status==200){
										if(res.data.status==0){
											this.$message({
												messsage:'添加成功!',
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
								.catch(e => {console.log(e)})
							// }).catch(() => {})
							
						}
					})
				})	
			},
//			getLogicObj(obj){//根据选择逻辑口传过来的对象
//				this.logicObj=Object.assign({},obj);
//			},
//			getNodeObj(obj){//获取子组件选择节点后传过来对应的对象
//				this.nodeObj=Object.assign({},obj);
//			},
			getFormData(msg){
				console.log(msg)
				this.dcObj=msg;
			},
			getBasic(msg){//获取基本信息数据
				console.log(msg)
				let obj={
					overdue_time:'',
					billing_time:''
				}
				if(msg.billing_time==''){
					obj.billing_time=''
				}else{
					obj.billing_time=datedialogFormat(msg.billing_time/1000)
				}
				
				if(msg.overdue_time==''){
					obj.overdue_time=''
				}else{
					obj.overdue_time=datedialogFormat(msg.overdue_time/1000)
				}
				this.basicObj={
					expiration_time:obj.overdue_time,
					charge_time:obj.billing_time,
					charge_mode:msg.changeModel,
					description:msg.des,
					bandwidth:msg.bandwidth
				}
				console.log(this.basicObj)
			},
			getDetails(ids){//获取数据
				this.$ajax.get('/vll/multi_vll_info/'+ids+'?token='+this.token)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							var str=res.data.data;
							this.editForm={
								id:str.id,
								name:str.name,
								tenant_name:str.tenant.name,
								tenant_id:str.tenant.id,
								dec:str.description,
							}
							console.log(this.editForm)
							this.users=str.endpoints;
							//将dc的数据和云的数据整合后在一个新的数组里面        是两个数组   
							if(str.endpoints){
								str.endpoints.forEach(ele => {
									ele.dataType='endpoints';//添加新的字段判断  改数据是dc还是云  该数据是dc的
									this.users.push(ele);
								})
							}
							if(str.cloud_endpoints){
								str.cloud_endpoints.forEach(ele => {
									ele.dataType='cloud_endpoints';//数据为云的数据
									this.users.push(ele);
								})
							}
						}else{
							this.$message({
								message:res.data.message,
								type:'warning'
							})
							this.$replace('/business/multipoint')
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
						this.$confirm('确定要提交吗?','提示',{})
						.then(() => {
							this.basicLoading=true;
							var para={
								name:this.editForm.name,
								tenant_id:this.editForm.tenant_id,
								description:this.editForm.dec
							}
							this.$ajax.put('/vll/edit_virtual_host/'+this.editForm.id+'?token='+this.token)
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
						}).catch(() => {})
					}
				})
			},
			addLogic(){//添加逻辑口
				this.dialogStatus='creat';
				this.dialogFormVisible=true;
				
			},
			handleTabStatus(index,row){//禁用和启用的装填的切换
				if(row.status==='禁用'){
					this.$confirm('确定要启用吗?','提示',{})
					.then(() => {
						this.loading=true;
						this.$ajax.put('/vll/enable_endpoint/'+row.type+'/'+this.id+'/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'启用成功!',
										type:'success'
									})
									this.loading=false;
//									row.status='启用'
//									row.statusHTML='禁用'
									this.getDetails(this.id);//从新获取数据
								}else{
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}
							}
						})
						.catch(e => {console.log(e)})
					})
					.catch( () => {})
				}else if(row.type==='启用'){
					this.$confirm('确定要禁用吗?','提示',{})
					.then(() => {
						this.loading=true;
						this.$ajax.put('/vll/disable_endpoint/'+row.type+'/'+this.id+'/'+row.id+'?token='+this.token)
						.then(res => {
							this.loading=false;
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'禁用成功!',
										type:'success'
									})
//									row.status='禁用'
//									row.statusHTML='启用'
									this.getDetails(this.id);//从新获取数据
								}else{
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}
							}
						})
						.catch(e => {console.log(e)})
					})
					.catch(() => {})
				}
			},
			handleEdit(index,row){//编辑
				this.dialogStatus='edit';
				this.dialogFormVisible=true;
			},
			handleDetails(index,row){//详情
				this.dialogStatus='see';
				this.dialogFormVisible=true;
				this.basicObj=Object.assign({},row);
			},
			handleDel(index,row){//删除
				this.$confirm('确定要删除吗?','提示',{})
				.then(() => {
					this.loading=true;
					this.$ajax.del('/vll/del_endpoint/'+row.type+'/'+this.id+'/'+row.id+'?token='+this.token)
					.then(res => {
						this.loading=false;
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'删除成功!',
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
		}
	}
</script>

<style>
</style>