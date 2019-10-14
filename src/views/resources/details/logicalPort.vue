<template>
	<div>
		<!--创建的逻辑端口-->
		<section>
			<h3 class="title_h3" v-text="seePortDetails?seeTopTitle: editTopTitle" ></h3>
			
			<el-form :model='filters' ref='filters' :rules='filtersRules' label-width='140px'>
				<el-row>
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item label='创建时间' v-if='seePortDetails' prop='creation_time'>
								<el-input v-model='filters.creation_time' class='ipt':disabled='seePortDetails'></el-input>
							</el-form-item>
							<el-form-item label='逻辑口名称'prop='name'>
								<el-input v-model='filters.name'placeholder="请输入逻辑口名称" class='ipt':disabled='addPortStatus'></el-input>
							</el-form-item>
							<el-form-item label='租户标识' prop='tenant_id'>
								<el-select v-model='filters.tenant_id' class='ipt' :disabled='addPortStatus'>
									<el-option v-for='(item,index) in tenantLogo'
										:value='item.id'
										:label='item.name'
										:key ='index'
										></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label='用户连接方式' prop='access_type'>
								<el-select v-model='filters.access_type'class='ipt':disabled='seePortDetails'>
									<el-option v-for='(item,index) in usersType'
										:value='item.value'
										:label='item.label'
										:key='index'
										></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span='12'>
							<el-form-item label='逻辑端口状态'v-if='seePortDetails' prop='status'>
								<el-input v-model='filters.status' class='ipt':disabled='addPortStatus'></el-input>
							</el-form-item>
							<el-form-item label='合同的开始时间' prop='start_time'>
								<el-date-picker
					                v-model="filters.start_time"  
					                format="yyyy-MM-dd HH:mm:ss"
					                value-format="timestamp"
					                clearable 
					                style="width: 100%"
					                :picker-options="startDatePicker" 					                
					                type="datetime"					                
					                :disabled='seePortDetails' 
					                class='ipt' 
					                placeholder="请选择合同的开始日期时间">
					            </el-date-picker>
							</el-form-item>
							<el-form-item label='合同的结束时间' prop='end_time'>
								<el-date-picker
					                v-model="filters.end_time"  
					                format="yyyy-MM-dd HH:mm:ss"
					                value-format="timestamp"
					                clearable 
					                style="width: 100%"
					                :picker-options="endDatePicker" 					                
					                type="datetime"
					                class='ipt'
					                :disabled='seePortDetails' 
					                placeholder="请选择合同的截止日期时间">
					            </el-date-picker>
							</el-form-item>
							<el-form-item label='备注' prop='description'>
								<!--<input type="" placeholder="" name="" id="" value="" />-->
								<el-input v-model='filters.description'placeholder="请输入备注信息" type='textarea'class='ipt'cols='4' :disabled='seePortDetails'></el-input>
							</el-form-item>
						</el-col>
					</el-col>
				</el-row>
			</el-form>
			<h3 class="title_h3"v-text="seePortDetails?seeTitle: editTitle"></h3>
			<el-row>
				<el-col :span='24' class='right' v-if='!seePortDetails'>
					<el-button @click='addPort' type='success'>关联端口</el-button>
				</el-col>
			</el-row>
			<el-table :data='physicalData' style='width: 100%; ' v-loading='loading'>
				<el-table-column type='index' label='序号' width='60'></el-table-column>
				<el-table-column prop='node.name'label='节点名称' width='120' align='center'>					
				</el-table-column>
				<el-table-column prop='device.hostname'label='设备名称' width='120' align='center'>					
				</el-table-column>
				<el-table-column prop='port.name'label='设备端口' width='120' align='center'>					
				</el-table-column>
				<el-table-column prop='port.status'label='端口状态' width='120' align='center'>					
				</el-table-column>
				<el-table-column prop='dc_name'label='数据中心' width='120' align='center'>					
				</el-table-column>
				<el-table-column prop='rack'label='机柜编号' width='120' align='center' v-if='seePortDetails'>					
				</el-table-column>
				<el-table-column prop='position'label='机房位置' width='120' align='center'v-if='seePortDetails'>					
				</el-table-column>
				<el-table-column prop='device_type'label='用户设备类型' width='120' align='center'v-if='seePortDetails'>					
				</el-table-column>
				<el-table-column prop='port_type'label='端口类型' width='120' align='center'v-if='seePortDetails'>					
				</el-table-column>
				<el-table-column prop='description'label='备注' width='120' align='center'>					
				</el-table-column>
				<el-table-column label='操作' width='260' align='center'v-if='!seePortDetails'>	
					<template slot-scope='scope'>
						<el-button size='small'type='info'@click='handleSee(scope.$index,scope.row)'>详情</el-button>
						<el-button size='small'type='primary'@click='handleEdit(scope.$index,scope.row)' >编辑</el-button>
						<el-button size='small'type='danger'@click='handleDel(scope.$index,scope.row)' >删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot='footer' class='dailog-footer right' v-if='!seePortDetails'>
				<el-button @click.native='goback'>返回</el-button>
				<!--添加-->
				<el-button type='primary' @click='createData' v-if='createStatus'>保存</el-button>
				<!--编辑-->
				<el-button type="primary" @click="updateData" v-if='!createStatus'>保存</el-button>
			</div>
			
			<!--关联端口的日志部分-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync='dialogFormVisible' :close-on-click-modal="false" v-loading='editLoading'>
				<el-form :model='editForm' label-width='120px' ref='editForm':rules='editFormRules'>
					<el-form-item label='骨干节点'prop='node_id'>
						<el-select v-model='editForm.node_id' :disabled='disabeldSee'class='ipt' @change='selectNode(editForm.node_id)'>
							<el-option v-for='(item,index) in backNodes'
								:value='item.id'
								:label='item.name'
								:key='index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='网络设备' prop='device_id'>
						<el-select v-model='editForm.device_id' :disabled='disabeldSee'class='ipt' @change='selectDevice(editForm.device_id)'>
							<el-option v-for='(item,index) in equipmentData'
								:value='item.id'
								:label='item.hostname'
								:key='index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='网络设备端口'prop='port_id'>
						<el-select v-model='editForm.port_id' :disabled='disabeldSee'class='ipt' @change='selectPort(editForm.port_id)'>
							<el-option v-for='(item,index) in netwotkPortData'
								:value='item.id'
								:label='item.port_no'
								:key='index'>
								<template>
									<span>{{item.port_no}}</span>
									<span style="margin-left: 20px;">{{item.status}}</span>
								</template>
							</el-option>
						</el-select>
					</el-form-item>
					<h3 class="dialog_title">物理端口对接客户信息</h3>
					<el-form-item label='机柜编号' prop='rack'>
						<el-input v-model='editForm.rack' :disabled='disabeldSee'class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='机房位置' prop='position'>
						<el-input v-model='editForm.position':disabled='disabeldSee'class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='用户设备类型' prop='device_type'>
						<el-select v-model='editForm.device_type':disabled='disabeldSee'class='ipt'>
							<el-option v-for='(item,index) in deviceType'
								:key='index'
								:value='item.value'
								:label='item.label'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='端口类型' prop='port_type'>
						<el-select v-model='editForm.port_type':disabled='disabeldSee'class='ipt'>
							<el-option v-for='(item,index) in portType'
								:key='index'
								:value='item.value'
								:label='item.label'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='备注' prop='description'>
						<el-input type='textarea':disabled='disabeldSee' v-model='editForm.description'class='ipt' cols="4" placeholder=""></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='dialogFormVisible=false'>取消</el-button>
					<!--编辑-->
					<el-button  v-if="dialogStatus=='update'"type="primary" @click="contantUpdateData">保存</el-button>
					<!--添加-->
					<el-button  v-else-if="dialogStatus=='create'"type="primary" @click="contantCreatedData">保存</el-button>		
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>


	import {datedialogFormat} from '@/assets/js/index.js'
	export default{
		name:'logicalPort',
		props:['title'],

		data(){
			return{
				//详情的界面的部分表格数据的显示操作和里面的操作按钮
				seePortDetails:false,
				seeTitle:'关联物理端口列表',
				editTitle:'第二步:关联物理端口(至少关联一个物理端口)',
				seeTopTitle:'逻辑端口信息',
				editTopTitle:'第一步:配置逻辑端口',
				token:'',
				//添加
				addLogicalPort:this.$route.query.name,
				//编辑
				editLogicalPort:this.$route.query.id,
				//添加的时候，所有的都是可编辑的，但是在编辑的界面的时候部分是不可操作的
				addPortStatus:false,
				startDatePicker: this.beginDate(),
             	endDatePicker: this.processDate(),
				filters:{
					name:'',
					start_time:'',
					end_time:'',
					access_type:'',
					tenant_id:'',
					description:'',
					physical_ports:[],
					creation_time:'',
					status:'',
					description:''
				},
				physical_ports:[],
				physicalData:[],//数据
				
				filtersRules:{
					//校验
					name:[ { required: true, message: '请输入逻辑端口名称', trigger: 'blur' }],
					tenant_id:[{ required: true, message: '请选择租户标识', trigger: 'change' }],
					access_type:[{ required: true, message: '请选择用户接入方式', trigger: 'change' }],
//					time:[{ required: true, message: '请选择合同的起止时间', trigger: 'change' }],
					start_time:[{ required: true, message: '请选择合同的开始时间', trigger: 'change' }],
					end_time:[{ required: true, message: '请选择合同的结束时间', trigger: 'change' }],
				},
				//弹窗里面的数据
				editForm:{
					node_id:'',
					device_id:'',
					port_id:'',
					position:'',
					rack:'',
					device_type:'',
					description:'',
					node_name:'',
					device_name:'',
					port_name:'',
					device_status:'',
					dc_name:'',
					dc_id:'',
					port_no:'',
					port_status:'',
					port_type:'',
					index:''
				},
				basicForm:{},//编辑的数据的备份
				editFormRules:{
					node_id:[{ required: true, message: '请选择骨干节点', trigger: 'change' }],
					device_id:[{ required: true, message: '请选择设备', trigger: 'change' }],
					port_id:[{ required: true, message: '请选择端口', trigger: 'change' }],
				},    
				tenantLogo:[],//租户的数据
				backNodes:[],//骨干节点
				equipmentData:[],//网络设备	
				netwotkPortData:[],//网络设备端口
				usersType:[
					{
						label:'独享',
						value:'独享'
					},{
						label:'共享',
						value:'共享'
					}
				],
				loading:false,
				//将添加的时候的保存默认是显示，编辑的按钮隐藏
				createStatus:true,
				textMap:{
					create:'关联物理端口',
					update:'编辑物理端口',
					details:'关联物理端口详情'
				},
				dialogStatus:'',
				dialogFormVisible:false,
				editLoading:false,
				deviceType:[
					{
						label:'交换机',
						value:'交换机'
					},{
						label:'路由器',
						value:'路由器'
					},{
						label:'防火墙',
						value:'防火墙'
					}
				],
				portType:[
					{
						label:'万兆单模',
						value:'万兆单模'
					},{
						label:'万兆多模',
						value:'万兆多模'
					},
					{
						label:'千兆单模',
						value:'千兆单模'
					},{
						label:'千兆多模',
						value:'千兆多模'
					},{
						label:'千兆电口',
						value:'千兆电口'
					},{
						label:'万兆单模',
						value:'万兆单模'
					},{
						label:'百G单模',
						value:'百G单模'
					}
				],
				//默认情况下是可以编辑的
				disabeldSee:false,
			}
		},
		watch:{
//			editForm:{
//				handler(newVal,oldVal){
//				},
//				deep:true
//			},
			physical_ports:function(newVal,oldVal){
				this.physicalData=JSON.parse(JSON.stringify(newVal))
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getTenantData();

			if(this.addLogicalPort==='新建逻辑端口'&&(typeof this.editLogicalPort =='undefined' && typeof this.title=='undefined')){
				//新建逻辑端口界面

				this.addPortStatus=false;
				//控制标题的操作
				this.seePortDetails=false;
				this.createStatus=true;
			}else if (typeof this.editLogicalPort !='undefined'&&(this.addLogicalPort!='新建逻辑端口'&& typeof this.title=='undefined')){
				//逻辑端口的编辑界面

				this.addPortStatus=true;
				//控制标题的操作
				this.seePortDetails=false;
				this.createStatus=false;
				this.getUsers(this.editLogicalPort)
			}else if(typeof this.title!='undefined'&&(typeof this.editLogicalPort =='undefined'&&this.addLogicalPort!='新建逻辑端口' )){
				//进入详情的界面

				this.seePortDetails=true;
				this.addPortStatus=true;
				this.getUsers(this.title)
			}
			
			
		},
		updated(){
//			console.log(this.physicalData)
		},
		methods:{
			beginDate(){
	            const self = this
	            return {
	            disabledDate(time){
	                if (self.filters.end_time) {  //如果结束时间不为空，则小于结束时间
	                    return new Date(self.filters.end_time).getTime() < time.getTime()
	                } else {
	                    // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
	                }
	                }
	            }
	            },
	            processDate() {
	            const  self = this
	            return {
	                disabledDate(time) {
		                if (self.filters.start_time) {  //如果开始时间不为空，则结束时间大于开始时间
		                    return new Date(self.filters.start_time).getTime() > time.getTime()
		                } 
//		                else {
//		                    // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
//		                }
	                }
	            }
	        },
			getTenantData(){
				//获取租户标识的数据
				
				this.$ajax.get('/tenant/tenants'+'?token='+this.token+'&&search_usable='+'true',)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.tenantLogo=res.data.data.items;
							console.log(res)
						}
					}
				}).catch(e => {
					console.log(e)
				})
				
				//获取骨干节点的数据
				
				this.$ajax.get('/node/nodes'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.backNodes=res.data.data.items;
						}
					}
				})
			},
			selectNode(ids){
				//筛选  获取骨干节点的信息
				this.editForm.device_id='';
				this.editForm.port_id='';
				let items=ids;
				var findVal=this.backNodes.find(function(obj){
					return obj.id===items;
				})
				//将选择的骨干的id的名字保存下来
				this.editForm.node_name=findVal.name;
				console.log(findVal)
				
				
				if(!findVal.dc && typeof(findVal.dc)!='undefined' && findVal.dc!=0){//此时的数据类型为null
					console.log('hello')
				}else{
					this.editForm.dc_name=findVal.dc.name;
					this.editForm.dc_id=findVal.dc.id;
				}

//				console.log(findVal);
				//根据节点选取对应的设备
				
				this.$ajax.get('/node/node_info/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.equipmentData=res.data.data.devices;
						}
					}
				}).catch(e => {console.log(e)})
			},
			selectDevice(ids){
				this.editForm.port_id=''
				//筛选  选择对应的id的name
				let items=ids;
				var findVal=this.equipmentData.find(function(obj){
					return obj.id===items;
				})
				//将选择的设备的id的名字保存下来
				this.editForm.device_name=findVal.hostname;
				console.log(findVal.hostname);
				//获取设备的下的物理端口
				
				this.$ajax.get('/node/device_info/'+ids+'/ports'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.netwotkPortData=res.data.data.items;
						}
					}
				})
			},
			selectPort(ids){
				//获取设备的端口的下选择的id  并且获取对应的name
				//筛选  选择对应的id的name
				let items=ids;
				var findVal=this.netwotkPortData.find(function(obj){
					return obj.id===items;
				})
				//将选择的设备下的端口的id的名字保存下来
				this.editForm.port_name=findVal.port_no;
				this.editForm.device_status=findVal.status;
//				console.log(findVal.name);
			},
			//新建的逻辑端口
			createData(){
				let self=this;
				//添加保存按钮
				console.log('执行添加');
				console.log(this.filters);
				if(this.physical_ports.length===0){
					this.$message({
						message:'关联物理端口至少一个，不能为空，请关联物理端口',
						type:'warning'
					})
					return new Error('请添加关联物理端口')
				}else{
					console.log('关联的物理端口不是空的')	
					this.$refs.filters.validate(valid => {
						let str=[],obj={}
						this.filters.physical_ports.forEach(ele => {
							obj={
								node_id:ele.node_id,
								device_id:ele.device_id,
								port_id:ele.port_id,
								position:ele.position,
								rack:ele.rack,
								device_type:ele.device_type,
								port_type:ele.port_type,
								description:ele.description,
							}
							str.push(obj);
						})
						let para={
							name:this.filters.name,
							tenant_id:this.filters.tenant_id,
							description:this.filters.description,
							end_time:this.filters.end_time/1000,
							start_time:this.filters.start_time/1000,
							access_type:this.filters.access_type,
							physical_ports:str
						}
//						console.log(this.filters)
//						console.log(para);
						if(valid){
							this.$confirm('确定要创建逻辑端口吗?','提示',{})
							.then(() => {
								
								this.$ajax.post('/port/add_logic_port'+'?token='+this.token,para)
								.then(res => {
									console.log(res);
									if(res.status==200){
										if(res.data.status==0){
											this.$message({
												message:'添加成功!',
												type:'success'
											})
											this.$refs["filters"].resetFields();
											this.$router.push('/resource/port')
										}else{
											this.$message({
												message:res.data.message,
												type:'warning'
											})
										}
									}
								})
							}).catch(() => {})
						}else{
							return
						}
					})
				}
			},
			updateData(){
				//编辑保存按钮
				//编辑逻辑端口
				console.log('执行编辑');
				if(this.physical_ports.length===0){
					this.$message({
						message:'关联物理端口至少一个，不能为空，请关联物理端口',
						type:'warning'
					})
				}else if(this.physical_ports.length>0){
					this.$refs.filters.validate(valid => {
						if(valid){
							this.$confirm('确认要修改吗?','提示',{})
							.then(() => {
								console.log(this.filters)
								let obj={};
								let str=[]
								this.filters.physical_ports.forEach(ele => {
									obj.node_id=ele.node.id;
									obj.device_id=ele.device.id;
									obj.description=ele.description;
									obj.port_id=ele.port.id;
									obj.position=ele.position;
									obj.rack=ele.rack;
									obj.device_type=ele.device_type;
									obj.port_type=ele.port_type;
									str.push(obj)
								})
								console.log(str)
								let para={
									name:this.filters.name,
									tenant_id:this.filters.tenant.id,
									description:this.filters.description,
									end_time:this.filters.end_time/1000,
									start_time:this.filters.start_time/1000,
									access_type:this.filters.access_type,
									physical_ports:str
								}
								
								
								this.$ajax.put('/port/edit_logic_port/'+this.filters.id+'?token='+this.token,para)
								.then(res => {
									if(res.status==200){
										if(res.data.status==0){
											this.$message({
												message:'修改成功!',
												type:'success'
											})
											this.$refs["filters"].resetFields();
											this.$router.push('/resource/port')
										}else{
											this.$message({
												message:res.data.message,
												type:'warning'
											})
										}
									}
								})
							}).catch(() => {})
						}else{
							return
						}
					})
				}
			},
			getUsers(id){
				//编辑和详情的界面的数据
				//获取所有的列表和详情的时候的界面的数据
				
				this.$ajax.get('/port/logic_port_info/'+id+'?token='+this.token)
				.then(res =>{
					if(res.status==200){
						if(res.data.status==0){
							this.filters=Object.assign({},res.data.data);
							if(res.data.data.usable){
								this.filters.status='启用'
							}else if(!res.data.data.usable){
								this.filters.status='禁用'
							}
							this.filters.tenant_id=res.data.data.tenant.name;
							this.filters.creation_time=datedialogFormat(res.data.data.creation_time);
							//设置时间的转换
							this.filters.start_time=new Date(datedialogFormat(res.data.data.start_time));
							this.filters.end_time=new Date(datedialogFormat(res.data.data.end_time))
							this.physical_ports=res.data.data.physical_ports;
						}
					}
				}).catch(e => {
					console.log(e)
				})
				
			},
			addPort(){
				//关联-按钮
				this.dialogStatus='create';
				this.dialogFormVisible=true;
				//显示可以操作的界面
				this.disabeldSee=false;

				this.$nextTick(() => {
					console.log('执行')
					this.$refs["editForm"].clearValidate();
				})
			},
			contantCreatedData:function(){
				console.log('执行添加')
				console.log(this.editForm)
				//关联-添加保存按钮
				this.$refs.editForm.validate(valid => {
					if(valid){
						let para={}
							para={
								node_id:this.editForm.node_id,
								device_id:this.editForm.device_id,
								port_id:this.editForm.port_id,
								position:this.editForm.position,
								rack:this.editForm.rack,
								device_type:this.editForm.device_type,
								port_type:this.editForm.port_type,
								description:this.editForm.description,
								node_name:this.editForm.node_name,
								device_name:this.editForm.device_name,
								port_name:this.editForm.port_name,
								device_status:this.editForm.device_status,
								dc_name:this.editForm.dc_name,
								dc_id:this.editForm.dc_id
							}
							//表格的里面的数据
							let paraData={}
							paraData={
								description:this.editForm.description,
								device_status:this.editForm.device_status,								
								device:{//设备
									hostname:this.editForm.device_name,
									id:this.editForm.device_id,
									status:this.editForm.device_status,
								},
								device_type:this.editForm.device_type,
								node:{//节点
									id:this.editForm.node_id,
									name:this.editForm.node_name,
								},
								port:{//端口
									id:this.editForm.port_id,
									name:this.editForm.port_name,
									port_no:this.editForm.port_name,
									status:this.editForm.device_status,
								},
								port_type:this.editForm.port_type,
								position:this.editForm.position,
								rack:this.editForm.rack,
								dc_name:this.editForm.dc_name,
							}
							
							console.log(this.editForm)
							this.$refs["editForm"].resetFields();
							this.dialogFormVisible=false;
							
//							this.filters.physical_ports.push(para);

							var  str=[];
							str.push(paraData);
//							this.physical_ports=this.physical_ports.concat(str)
//							sessionStorage.setItem('dataTable', JSON.parse(JSON.stringify( str.push(paraData) ))   );
							this.physical_ports.push(paraData);
//							this.physical_ports=sessionStorage.getItem('dataTable')
							console.log(this.physical_ports)
//							sessionStorage.setItem('dataTable',JSON.stringify(this.physical_ports));
//							this.physicalData=JSON.parse(sessionStorage.getItem('dataTable') )
							
						// }).catch(() => {})
					}
				})
			},
			handleEdit(index,row){
				console.log(row)
				//关联-编辑
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.disabeldSee=false;
				this.basicForm=Object.assign({},row);
				this.editForm={
					node_id:row.node.name,
					device_id:row.device.hostname,
					port_id:row.port.port_no,
					position:row.position,
					rack:row.rack,
					device_type:row.device_type,
					description:row.description,
					port_type:row.port_type,
					node_name:row.node.name,
					device_name:row.device.hostname,
					port_name:row.port.name,
					device_status:row.port.status,
					dc_name:'',
					dc_id:row.device.id,
					port_no:row.port.port_no,
					port_status:row.port.status,
					index:index   //  在此时的添加的index 是用作删除和编辑的替换的
				}
			
			},
			contantUpdateData:function(){
				console.log('执行编辑保存')
				//关联-编辑保存按钮
				this.$refs.editForm.validate(valid => {
					if(valid){
							console.log(this.editForm)
							console.log(this.basicForm)
							this.filters.physical_ports[this.editForm.index]=Object.assign({},this.editForm);

							var obj={
								description:this.editForm.description,
								device:{
									id:this.editForm.device_id==this.basicForm.device.hostname?this.basicForm.device.id:this.editForm.device_id,
									hostname:this.editForm.device_name
								},
								device_type:this.editForm.device_type,
								node:{
									id:this.editForm.node_id==this.basicForm.node.name?this.basicForm.node.id:this.editForm.node_id,
									name:this.editForm.node_name
								},
								port:{
									id:this.editForm.port_id==this.basicForm.port.port_no?this.basicForm.port.id:this.editForm.port_id,
									name:this.editForm.port_no,
									port_no:this.editForm.port_no,
									status:this.editForm.port_status
								},
								port_type:this.editForm.port_type,
								position:this.editForm.position,
								rack:this.editForm.rack
							}
							
							this.$refs["editForm"].resetFields();
							this.dialogFormVisible = false;
//							this.$refs["basicForm"].resetFields();
							
							
							console.log(this.physical_ports)
//							this.physical_ports[this.editForm.index]=obj;
							this.physical_ports.splice(this.editForm.index,1,obj)

					}
				})
			},
			//关联端口里面的操作按钮
			handleSee(index,row){   //详情界面
				//查看详情
				this.dialogStatus='details';
				this.dialogFormVisible=true;
				this.disabeldSee=true;
				this.editForm={
					node_id:row.node.name,
					device_id:row.device.hostname,
					port_id:row.port.name,
					position:row.position,
					rack:row.rack,
					device_type:row.device_type,
					description:row.description,
					port_type:row.port_type,
					device_status:row.port.status,
					port_no:row.port.port_no,
					port_status:row.port.status,
				}
			},
			handleDel:function(index,row){
				let _this=this;
				//删除
				this.$confirm('确定要删除该物理端口吗?','提示',{type:'warning'})
				.then(() => {
					this.physical_ports.splice(index,1);
				}).catch(() => {})
			},
			goback(){
				//返回上一级
				this.$router.go(-1);
			},
		}
	}
</script>

<style scoped>
	.dialog_title{
		margin-top: 20px;
		margin-bottom: 20px;
	}
	
</style>