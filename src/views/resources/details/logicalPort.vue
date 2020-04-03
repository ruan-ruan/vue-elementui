<template>
	<div>
		<!--创建的逻辑端口-->
		<section>
			<h3 class="title_h3" v-text="seePortDetails?seeTopTitle: editTopTitle" ></h3>
			<el-form :model='filters' ref='filters' :rules='filtersRules' label-width='200px'>
				<el-row>
					<el-col :span='24'>
						<el-col :span='12'>
							<el-form-item :label='$t("Public.creation")+"：" ' v-if='seePortDetails' prop='creation_time'>
								<el-input v-model='filters.creation_time' class='ipt':disabled='seePortDetails'></el-input>
							</el-form-item>
							<el-form-item :label='$t("Public.logName") +"：" 'prop='name'>
								<el-input v-model='filters.name'placeholder="请输入逻辑口名称" class='ipt':disabled='addPortStatus'></el-input>
							</el-form-item>
							<el-form-item :label='$t("Public.tenant") +"：" ' prop='tenant_id'>
								<el-select v-model='filters.tenant_id' class='ipt' :disabled='addPortStatus' filterable>
									<el-option v-for='(item,index) in tenantLogo'
										:value='item.id'
										:label='item.name'
										:key ='index'
										></el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label='$t("Public.linkType")+"：" ' prop='access_type'>
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
							<el-form-item :label='$t("Public.plaLogicSt")+"：" 'v-if='seePortDetails' prop='status'>
								<el-input v-model='filters.status' class='ipt':disabled='addPortStatus'></el-input>
							</el-form-item>
							<el-form-item :label='$t("Public.conStart")+"：" ' prop='start_time'>
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
					                :placeholder="$t('Public.plaConSta')">
					            </el-date-picker>
							</el-form-item>
							<el-form-item :label='$t("Public.conEnd") +"：" ' prop='end_time'>
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
					                :placeholder="$t('Public.plaConEnd')">
					            </el-date-picker>
							</el-form-item>
							<el-form-item :label='$t("Public.description") +"：" ' prop='description'>
								<el-input v-model='filters.description' type='textarea'class='ipt'cols='4' :disabled='seePortDetails'></el-input>
							</el-form-item>
						</el-col>
					</el-col>
				</el-row>
			</el-form>
			<h3 class="title_h3"v-text="seePortDetails?seeTitle: editTitle"></h3>
			<el-row>
				<el-col :span='24' class='right' v-if='!seePortDetails'>
					<el-button size='small' @click='addPort' type='success'>{{$t("Public.accPort")}}</el-button>
				</el-col>
			</el-row>
			<el-table :data='physicalData' style='width: 100%; ' v-loading='loading'>
				<el-table-column type='index' :label='$t("Public.index")'></el-table-column>
				<el-table-column prop='node.name' :label='$t("Public.nodeName")'  align='center'>					
				</el-table-column>
				<el-table-column prop='device.hostname':label='$t("Public.deviceName")'  align='center'>					
				</el-table-column>
				<el-table-column prop='port.port_no' :label='$t("Public.devPort")'  align='center'>					
				</el-table-column>
				<el-table-column :label='$t("Public.portStatus")' align='center'width='80'>					
					<template slot-scope='scope'>
						<span :class="scope.row.port.status == 'UP'?'backRun':'backWarn'">{{scope.row.port.status}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='dc_name':label='$t("Public.dataCen")'  align='center'>					
				</el-table-column>
				<el-table-column prop='rack':label='$t("Public.cabNnumber")'  align='center' v-if='seePortDetails'>					
				</el-table-column>
				<el-table-column prop='position':label='$t("Public.roomLoacation")' align='center'v-if='seePortDetails'>				
				</el-table-column>
				<el-table-column prop='device_type':label='$t("Public.userDevType")'  align='center'v-if='seePortDetails'>					
				</el-table-column>
				<el-table-column prop='port_type':label='$t("Public.portType")'  align='center'v-if='seePortDetails'>					
				</el-table-column>
				<el-table-column prop='description':label='$t("Public.description")'  align='center'>					
				</el-table-column>
				<el-table-column :label='$t("Public.operation")'  align='center'v-if='!seePortDetails'>	
					<template slot-scope='scope'>
						<el-button size='mini'type='info'@click='handleSee(scope.$index,scope.row)'>{{$t('tabOperation.info')}}</el-button>
						<el-button size='mini'type='primary'@click='handleEdit(scope.$index,scope.row)' >{{$t('tabOperation.edit')}}</el-button>
						<el-button size='mini'type='danger'@click='handleDel(scope.$index,scope.row)' >{{$t('tabOperation.delete')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot='footer' class='dailog-footer right tc_L' v-if='!seePortDetails'>
				<el-button size='small' @click.native='goback'>{{$t('Public.goback')}}</el-button>
				<!--添加-->
				<el-button size='small' type='primary' @click='createData' v-if='createStatus'>{{$t('tabOperation.save')}}</el-button>
				<!--编辑-->
				<el-button size='small' type="primary" @click="updateData" v-if='!createStatus'>{{$t('tabOperation.save')}}</el-button>
			</div>
			<!--关联端口的日志部分-->
			<el-dialog :title='textMap[dialogStatus]':visible.sync='dialogFormVisible' :close-on-click-modal="false" v-loading='editLoading'>
				<el-form :model='editForm' label-width='230px' ref='editForm':rules='editFormRules'>
					<el-form-item :label='$t("Public.backboneNode")'prop='node_id'>
						<el-select v-model='editForm.node_id' :disabled='disabeldSee'class='ipt' @change='selectNode(editForm.node_id)'>
							<el-option v-for='(item,index) in backNodes'
								:value='item.id'
								:label='item.name'
								:key='index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("Public.networkEqu")' prop='device_id'>
						<el-select v-model='editForm.device_id' :disabled='disabeldSee'class='ipt' @change='selectDevice(editForm.device_id)'>
							<el-option v-for='(item,index) in equipmentData'
								:value='item.id'
								:label='item.hostname'
								:key='index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("Public.NnetworkPort")'prop='port_id'>
						<el-select v-model='editForm.port_id' :disabled='disabeldSee' class='ipt' @change='selectPort(editForm.port_id)'>
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
					<h3 class="dialog_title">{{$t('Public.phyIntformation')}}</h3>
					<el-form-item :label='$t("Public.cabNnumber")' prop='rack'>
						<el-input v-model='editForm.rack' :disabled='disabeldSee'class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.roomLoacation")' prop='position'>
						<el-input v-model='editForm.position':disabled='disabeldSee'class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.userDevType")' prop='device_type'>
						<el-select v-model='editForm.device_type':disabled='disabeldSee'class='ipt'>
							<el-option v-for='(item,index) in deviceType'
								:key='index'
								:value='item.value'
								:label='item.label'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("Public.portType")' prop='port_type'>
						<el-select v-model='editForm.port_type':disabled='disabeldSee'class='ipt'>
							<el-option v-for='(item,index) in portType'
								:key='index'
								:value='item.value'
								:label='item.label'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("Public.description")' prop='description'>
						<el-input type='textarea':disabled='disabeldSee' v-model='editForm.description'class='ipt' cols="4" placeholder=""></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
					<!--编辑-->
					<el-button  v-if="dialogStatus=='update'"type="primary" @click="contantUpdateData">{{$t('tabOperation.save')}}</el-button>
					<!--添加-->
					<el-button  v-else-if="dialogStatus=='create'"type="primary" @click="contantCreatedData">{{$t('tabOperation.save')}}</el-button>		
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
				seeTitle:this.$t('Public.phyList'),
				editTitle:this.$t('Public.second'),
				seeTopTitle:this.$t('Public.logicInformation'),
				editTopTitle:this.$t('Public.first'),
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
//					physical:[],
					creation_time:'',
					status:'',
					description:''
				},
				physical_ports:[],
				physicalData:[],//表格数据
				
				filtersRules:{
					//校验
					name:[ { required: true, message: this.$t('Public.plaLogicName'), trigger: 'blur' }],
					tenant_id:[{ required: true, message:this.$t('Public.plaChaTenant'), trigger: 'change' }],
					access_type:[{ required: true, message: this.$t('Public.plaUserDock'), trigger: 'change' }],
//					time:[{ required: true, message: '请选择合同的起止时间', trigger: 'change' }],
					start_time:[{ required: true, message: this.$t('Public.plaConSta'), trigger: 'change' }],
					end_time:[{ required: true, message: this.$t('Public.plaConEnd'), trigger: 'change' }],
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
					index:null,
				},
				basicForm:{},//编辑的数据的备份
				editFormRules:{
					node_id:[{ required: true, message: this.$t('Public.plaChaBacknode'), trigger: 'change' }],
					device_id:[{ required: true, message: this.$t('Public.plaDev'), trigger: 'change' }],
					port_id:[{ required: true, message: this.$t('Public.plaPort'), trigger: 'change' }],
				},    
				tenantLogo:[],//租户的数据
				backNodes:[],//骨干节点
				equipmentData:[],//网络设备	
				netwotkPortData:[],//网络设备端口
				usersType:[
					{
						label:this.$t('Public.exclusive'),
						value:'独享'
					},{
						label:this.$t('Public.share'),
						value:'共享'
					}
				],
				loading:false,
				//将添加的时候的保存默认是显示，编辑的按钮隐藏
				createStatus:true,
				textMap:{
					create:this.$t('Public.assphy'),
					update:this.$t('Public.editphy'),
					details:this.$t('Public.assphyInfo')
				},
				dialogStatus:'',
				dialogFormVisible:false,
				editLoading:false,
				deviceType:[
					{
						label:this.$t('Public.swith'),
						value:'交换机'
					},{
						label:this.$t('Public.router'),
						value:'路由器'
					},{
						label:this.$t('Public.firewall'),
						value:'防火墙'
					}
				],
				portType:[
					{
						label:this.$t('Public.mwSing'),
						value:'万兆单模'
					},{
						label:this.$t('Public.megaMult'),
						value:'万兆多模'
					},
					{
						label:this.$t('Public.gigabit'),
						value:'千兆单模'
					},{
						label:this.$t('Public.gigabitMult'),
						value:'千兆多模'
					},{
						label:this.$t('Public.gigabitJun'),
						value:'千兆电口'
					},{
						label:this.$t('Public.signModel'),
						value:'百G单模'
					}
				],
				//默认情况下是可以编辑的
				disabeldSee:false,
				newtworkBasePortP:[],//当关联多个端口的时候保存数据用来去重
			}
		},
		watch:{

			physical_ports:{
				handler(newVal,oldVal){
					this.physicalData=[];
					this.physicalData=JSON.parse(JSON.stringify(newVal));
				},
				deep:true,
			},


		},
		created(){
			this.token=sessionStorage.getItem('token');
			
			
			if(this.addLogicalPort==='addLogicPort'){
				//新建逻辑端口界面
				this.getTenantData();
				this.addPortStatus=false;
				//控制标题的操作
				this.seePortDetails=false;
				this.createStatus=true;
			}
			if (typeof this.editLogicalPort !='undefined'){
				//逻辑端口的编辑界面
				this.getTenantData();
				this.addPortStatus=true;
				//控制标题的操作
				this.seePortDetails=false;
				this.createStatus=false;
				this.getUsers(this.editLogicalPort)
			}
			if(typeof this.title!='undefined'){
				//进入详情的界面

				this.seePortDetails=true;
				this.addPortStatus=true;
				this.getUsers(this.title)
			}
			
			
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
				this.backNodes=[];
				this.tenantLogo=[];
				this.newtworkBasePortP=[];
				//获取租户标识的数据
				
				this.$ajax.get('/tenant/tenants'+'?token='+this.token+'&&search_usable='+'true',)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.tenantLogo=res.data.data.items;
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
						
							this.backNodes=res.data.data.items;
						}
					}
				}).catch(e => {console.log(e)})
				
				//对列表内所有的端口已经使用过的  不能再使用的排除  newtworkBasePortP
				this.$ajax.get('/port/logic_ports'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							var str=res.data.data.items;
							str.forEach(ele => {

								ele.physical_ports.map(item => {
									this.newtworkBasePortP.push(item.port)
								})
							})
						}
					}
				})
				.catch(e => {console.log(e)})
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
//				this.editForm.node_id=findVal.id;
				this.editForm.node_name=findVal.name;

				if(!findVal.dc && typeof(findVal.dc)!='undefined' && findVal.dc!=0){//此时的数据类型为null
					this.editForm.dc_name='';
					this.editForm.dc_id='';
				}else{
					this.editForm.dc_name=findVal.dc.name;
					this.editForm.dc_id=findVal.dc.id;
				}

				//根据节点选取对应的设备
				
				this.$ajax.get('/node/node_info/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
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
//				this.editForm.device_id=findVal.id;
				this.editForm.device_name=findVal.hostname;

				//获取设备的下的物理端口
				var para={
					search_available:true
				}
				this.$ajax.get('/node/device_info/'+ids+'/ports'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.netwotkPortData=res.data.data.items.filter(item => {
								
								if(this.newtworkBasePortP.length !==0){
									var num=this.newtworkBasePortP.map(v => v.id)	
									return !num.includes(item.id)
								}else {
									return item;
								}
								
							})
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
//				this.editForm.port_id=findVal.id;
				this.editForm.port_name=findVal.port_no;
				this.editForm.device_status=findVal.status;
				this.editForm.port_no=findVal.port_no;

			},
			//新建的逻辑端口
			createData(){
				let self=this;
				//添加保存按钮
				if(this.physical_ports.length===0){
					this.$message({
						message:this.$t('Public.basicPhy'),
						type:'warning'
					})
					return new Error(this.$t('Public.plaAccPhy'))
				}else{

					
					this.$refs.filters.validate(valid => {
						let str=[];
						this.physical_ports.map(ele => {
							var obj={}
							obj={
								node_id:ele.node.id,
								device_id:ele.device.id,
								port_id:ele.port.id,
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
//						debug
						if(valid){
							this.$ajax.post('/port/add_logic_port'+'?token='+this.token,para)
							.then(res => {
								console.log(res);
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('tooltipMes.addSuccess'),
											type:'success'
										})
										this.$refs["filters"].resetFields();
										this.$router.push('/resource/port')
									}
								}
							}).catch(e => {console.log(e)})
						}else{
							return
						}
					})
				}
			},
			updateData(){
				//编辑保存按钮
				//编辑逻辑端口
				if(this.physical_ports.length===0){
					this.$message({
						message:this.$t('Public.basicPhy'),
						type:'warning'
					})
				}else if(this.physical_ports.length>0){
					this.$refs.filters.validate(valid => {
						if(valid){
							let obj={};
							let str=[]
							this.physical_ports.map(ele => {

								ele.para={
									node_id:ele.node.id,
									device_id:ele.device.id,
									description:ele.description,
									port_id:ele.port.id,
									position:ele.position,
									rack:ele.rack,
									device_type:ele.device_type,
									port_type:ele.port_type
								}

								str.push(ele.para)
							})
							let para={
								name:this.filters.name,
								tenant_id:this.filters.tenant.id,
								description:this.filters.description,
								end_time:this.filters.end_time/1000,
								start_time:this.filters.start_time/1000,
								access_type:this.filters.access_type,
								physical_ports:str
							}
							
//								debug
							this.$ajax.put('/port/edit_logic_port/'+this.filters.id+'?token='+this.token,para)
							.then(res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('tooltipMes.editSuccess'),
											type:'success'
										})
										this.$refs["filters"].resetFields();
										this.$router.push('/resource/port')
									}
								}
							})
							.catch(e => {console.log(e)})
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
								this.filters.status=this.$t('Public.enable');//启用
							}else if(!res.data.data.usable){
								this.filters.status=this.$t('Public.Prohibit');//禁用
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
					this.$refs["editForm"].resetFields();
				})
			},
			contantCreatedData:function(){
				//关联-添加保存按钮
				this.$refs.editForm.validate(valid => {
					if(valid){
						let paraData={};
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
						};
						this.physical_ports.push(paraData);
						this.$refs["editForm"].resetFields();
						this.dialogFormVisible=false;
					}
				})
			},
			handleEdit(index,row){
				//关联-编辑
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.disabeldSee=false;
				this.basicForm=Object.assign({},row);
				this.editForm={
					node_id:row.node.id,
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
					dc_name:row.dc_name,
					dc_id:row.device.id,
					port_no:row.port.port_no,
					port_status:row.port.status,
					index:index   //  在此时的添加的index 是用作删除和编辑的替换的
				}
			
			},
			contantUpdateData:function(){
				//关联-编辑保存按钮
				this.$refs.editForm.validate(valid => {
					if(valid){
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
							rack:this.editForm.rack,
							dc_name:this.editForm.dc_name
						}
						this.$refs["editForm"].resetFields();
						this.dialogFormVisible = false;

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
					port_id:row.port.port_no,
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
				this.$confirm(this.$t('confirm.delPhy'),this.$t('confirm.tooltip'),{type:'warning'})
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