<template>
	<div>
		<section>
			<!--顶部工具栏-->
			<el-col :span='24' class='toolbar ' style='width:100%;'>
				<el-form :inline='true' :model='filters' ref='filters'>
					<el-form-item :label='$t("Public.name")' prop='search_name'>
						<el-input v-model='filters.search_name' class='ipt_sta'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.status")' prop='search_status'>
						<el-select v-model='filters.search_status' filterable :plachodle='$t("topFilters.placeholder")' class='sel'>
							<el-option v-for='(item,index) in status'
								:label='item.label'
								:key='index'
								:value='item.value'
								>								
							</el-option>
						</el-select>
					</el-form-item>
					  <!--type="daterange"-->
					<el-form-item :label='$t("Public.creation")' prop='timeVal'>
						<el-date-picker
					      v-model="filters.timeVal"					    
					      type="daterange"
					      :range-separator="$t('Public.to')"
					      :start-placeholder="$t('Public.start')"
						  @change="timeValSearchBtn"
					      :end-placeholder="$t('Public.end')"
					      class='port_sel'>
					    </el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button size='small' type='primary' v-on:click='getUsers()'>{{$t("topFilters.search")}}</el-button>
					</el-form-item>
					<el-form-item>
						<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<!--列表的数据部分-->
			<!--列表的数据导出部分-->
				<el-col :span='24'>
					<el-col :span='8'>
						<template>
							<el-button size='small' type='success'@click='handleAdd'v-if='buttonVal.add'>+{{$t('Public.addUnknownLink')}}</el-button>
							<el-button size='small' type='primary' @click='handleFound'>{{$t('Public.findLink')}}</el-button>
						</template>	
					</el-col>
					<el-col :span='16' class='table-top'>
						<el-button size='small' type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0" v-if='buttonVal.del'>{{$t('tabOperation.batchDel')}}</el-button>						
					</el-col>

				</el-col>

			<el-table :data='users' highlight-current-row @selection-change="selsChange" style='width: 100%;' 
				v-loading='loading'>
				<el-table-column type='selection' ></el-table-column>
				<el-table-column type='index'  :label='$t("Public.index")' align='center'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='creation_time' width='80'  :label='$t("Public.apply")'  align='center'>
					<template slot-scope='scope'>
						{{scope.row.creation_time | timeFormat }}
					</template>
				</el-table-column>				
				<el-table-column :label='$t("Public.aPort")' min-width='110' align='center'>
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'class='link_port'@click='handelSee_aNode(scope.$index,scope.row)'>{{scope.row.a_node.name}}</el-tag>
						-{{scope.row.a_ip}}-{{scope.row.a_vlan}}
					</template>
				</el-table-column>
				<el-table-column  :label='$t("Public.zPort")' align='center' min-width='110'>
					<template slot-scope='scope'>
						<el-tag size='small' type='primary'class='link_port' @click='handelSee_zNode(scope.$index, scope.row)'>{{scope.row.z_node.name}}</el-tag>
						-{{scope.row.z_ip}}-{{scope.row.z_vlan}}
					</template>
				</el-table-column>
				<el-table-column prop='bandwidth' :label='$t("Public.sysBandwidth")' align='center' min-width='90'>
				</el-table-column>
				<el-table-column prop='physical_bandwidth' :label='$t("Public.phyBandwidth")' align='center' min-width='105'>
				</el-table-column>
				<el-table-column label='入/出(Mbps)' align='center' min-width='105'>
					<template slot-scope='scope'>
						{{ scope.row.instant_speed | bbs }}
					</template>
				</el-table-column>
				<el-table-column prop='link_cost' :label='$t("Public.linkExpen")' align='center' min-width='80'>
				</el-table-column>
				<el-table-column prop='monitoringText' :label='$t("Public.linkCheck")' align='center' min-width='80'>
				</el-table-column>
				<el-table-column  :label='$t("Public.operation")' align='center' width='180'>
					<template slot-scope='scope'>
						<el-button size='mini' type='primary' @click='handleStart(scope.$index, scope.row)' v-if='buttonVal.run'>{{$t('tabOperation.run')}}</el-button>
						<el-button size='mini' type='info' @click='handleSee(scope.$index, scope.row)' v-if='buttonVal.see'>{{$t('tabOperation.info')}}</el-button>
						<el-button size='mini' type='success' @click='handleEdit(scope.$index, scope.row)'v-if='buttonVal.edit'>{{$t('tabOperation.edit')}}</el-button>				
						<el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)"  v-if='buttonVal.del'>{{$t("tabOperation.delete")}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--底部数据导航部分-->
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

			
			<!--发现链路-->
			<el-dialog :title='TitleMap[dialogFormValue]' :visible.sync='foundFormVisible':close-on-click-modal="false">
				<el-form :model="foundForm"  ref='foundForm'>
					<el-form-item>
						<el-input v-model='foundForm.parameter':placeholder="$t('Public.placeFind')"></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='foundFormVisible=false'>{{$t("tabOperation.cancel")}}</el-button>
					<el-button type='primary'v-if='dialogFormValue=="found"' @click='foundData'>{{$t("tabOperation.Submit")}}</el-button>
				</div>
			</el-dialog>
		</section>
		<!--添加部分/编辑部分/发现链路-->
		<el-dialog :title='textMap[dialogStatus]' :visible.sync='dialogFormVisible' :close-on-click-modal="false" v-loading='editLoading' @close='close'>
			<el-form :model="editForm" label-width='210px' ref='editForm' :rules="editFormRules">
			<!--编辑和详情的时候才会显示的时间列表-->
			<el-form-item :label='$t("Public.apply")+"：" ' v-show='editFormStatus'>
				<span>
					{{ editForm.creation_time | timeFormat }}
				</span>
			</el-form-item>
			<el-form-item :label='$t("Public.aPortNode")+"："' prop='a_node_id'>
				<el-select v-model='editForm.a_node_id' filterable :disabled='seeStatus'  class='ipt' @change='selectNodeA(editForm.a_node_id)'>
					<el-option
						v-for='(item,index) in nodeData'
						:key='index'
						:label='item.name'
						:value='item.id'>
					</el-option>
				</el-select>
			</el-form-item>
			<!-- A端 --> 
			<span v-for="(domain,index) in editForm.devicelist" :key="domain.index">
				<el-row>
					<el-col :span="12">
						<el-form-item :label='$t("Public.aDevice")+":"' :prop="'devicelist.'+index+'.a_device'" :rules="{required:true,message:$t('Public.selDeviceA'),trigger:'change'}">
							<template>
								<el-select v-model='domain.a_device' style='width: 180px;' :disabled='seeStatus' filterable  @change='selectDeviceA(domain)'>
									<el-option v-for='item in aDevice'
										:value='item.id'
										:label='item.hostname'
										:key='item.id'></el-option>
								</el-select>		
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label='$t("Public.devicePort")+":"' style="margin-left:-60px;" :prop="'devicelist.'+index+'.a_device_port'" :rules="{required:true,message:$t('Public.selPort'),trigger:'change'}">
							<el-select v-model='domain.a_device_port' :disabled='seeStatus' filterable style='width: 150px;' @change='selectDevicePort(domain.a_device_port)'>
								<el-option v-for='(item,it) in aDevicePort'
									:value='item.id'
									:label='item.port_no'
									:key='item.id'
									>
									<template>
										<span>{{item.port_no}}</span>
										<span :class='[item.color ,"marL60"]'>{{item.status}}</span>
									</template>
								</el-option>
							</el-select>
						</el-form-item>	
					</el-col>
				</el-row>
			</span>
			<!--<device-port :label='a' @sendObj='deviceA'></device-port>-->
			
			<el-form-item v-show="!seeStatus">
				<el-button @click='device_port_add' type='primary'>+</el-button>
				<el-button  @click='device_port_down(index)'type='danger'>-</el-button>
			</el-form-item>
			<el-form-item :label='$t("Public.a_ip")+"(cidr):"' prop='a_ip'>
				<el-input v-model='editForm.a_ip' :disabled='seeStatus' class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.a_vlan")+"："' prop='a_vlan'>
				<el-input v-model='editForm.a_vlan' :disabled='seeStatus' class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.a_des")+"："' prop='a_desc'>
				<el-input v-model='editForm.a_desc' :disabled='seeStatus' class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.z_PortNode")+"："' prop='z_node_id'>
				<el-select v-model='editForm.z_node_id'filterable :disabled='seeStatus'@change='selectNodeZ(editForm.z_node_id)'  class='ipt'>
					<el-option
						v-for='(item,index) in nodeData'
						:key='index'
						:label='item.name'
						:value='item.id'>
					</el-option>
				</el-select>
			</el-form-item>
			<!-- Z端 -->
			<div v-for="(item,index) in editForm.device_zlist" :key="index">
				<el-row>
				<el-col :span='12'>
				<el-form-item :label='$t("Public.zDevice")+":"'  :prop="'device_zlist.'+index+'.z_device'" :rules="{required:true,message:$t('Public.selDeviceZ'),trigger:'change'}">
					<el-select v-model='item.z_device' style="width:180px;"  filterable:disabled='seeStatus'  @change='selectDeviceZ(item)'>
					<el-option 
						v-for='(item ,de) in zDevice'
						:key ='item.id'
						:label='item.hostname'
						:value='item.id'
						></el-option>
					</el-select>
				</el-form-item>
				</el-col>
				<el-col :span="10">
				<el-form-item :label='$t("Public.devicePort")+":"' :prop="'device_zlist.'+index+'.z_device_port'" :rules="{required:true,message:$t('Public.selPort'),trigger:'change'}" style="margin-left:-60px;">
				<el-select v-model='item.z_device_port' style="width:150px;" filterable :disabled='seeStatus'  @change='selectDevicePortZ(item.z_device_port)'>
					<el-option v-for='(item , ir) in zDevicePort' :key='item.id'
						:label='item.port_no'
						:value='item.id'
						class='ipt'>
					<template>
						<span>{{item.port_no}}</span>
						<span :class='[item.color ,"marL60"]'>{{item.status}}</span>
					</template>
					</el-option>
				</el-select>
				</el-form-item>
				</el-col>
				</el-row>
			</div>
			<el-form-item v-show="!seeStatus">
				<el-button @click='device_port_add_Z' type='primary'>+</el-button>
				<el-button  @click='device_port_down_Z(index)'type='danger'>-</el-button>
			</el-form-item>
			<el-form-item :label='$t("Public.z_ip")+"(cidr)："'prop='z_ip'>
				<el-input v-model='editForm.z_ip':disabled='seeStatus' class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.z_vlan")+"："'prop='z_vlan'>
				<el-input v-model='editForm.z_vlan':disabled='seeStatus'   class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.z_des")+"："'prop='z_desc'>
				<el-input v-model='editForm.z_desc':disabled='seeStatus' class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.sysBandwidth")+"："' prop='bandwidth'>
				<el-input v-model.number='editForm.bandwidth' :disabled='seeStatus' :placeholder="$t('Public.placeNumber')"  class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.phyBandwidth")+"："' prop='physical_bandwidth'>
				<el-input v-model.number='editForm.physical_bandwidth':placeholder="$t('Public.placeNumber')"   :disabled='seeStatus' class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.linkExpen")+"："' prop='link_cost'>
				<el-input v-model.number='editForm.link_cost'  :disabled='seeStatus' :placeholder="$t('Public.placeNumber')"  class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.linkCheck")+"："' prop='monitoring'>
				<el-radio-group v-model='editForm.monitoring' :disabled='seeStatus'>
						<el-radio 
							v-for='(item,index) in detectionStatue'
							:key='index' 
							:value='item.label'
							:label='item.label' >{{item.name}}
						</el-radio>				
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if='detectionStatus' :label='$t("Public.checkType")+"："' prop='monitoring_type'>
				<el-select v-model='editForm.monitoring_type' :disabled='seeStatus' :placehold='$t("validateMes.placeCh")' class='ipt' >
					<el-option v-for='(item,index) in detectionType'
						:value='item.value'
						:label='item.label'
						:key='index'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if='detectionStatus' :label='$t("Public.checkParams")+"："' prop='monitoring_param'>
				<el-input v-model='editForm.monitoring_param':disabled='seeStatus' class='ipt'></el-input>
			</el-form-item>
			<el-form-item :label='$t("Public.description")+"："' >
				<el-input type='textarea'cols="7" v-model='editForm.description' :disabled='seeStatus' class='ipt' ></el-input>
			</el-form-item>
			</el-form>
			<div slot='footer' class='dailog-footer'>
				<el-button @click.native='dialogFormVisible=false'>{{$t("tabOperation.cancel")}}</el-button>
				<el-button  v-if="dialogStatus=='update'"type="primary" @click="updateData">
					{{$t('tabOperation.save')}}
				</el-button>
				<el-button  v-else-if="dialogStatus=='creat'"type="primary" @click="creatData">
					{{$t('tabOperation.save')}}
				</el-button>		
			</div>
		</el-dialog>
	</div>
</template>

<script>

	
	import {datedialogFormat , descriptionValue,getTime ,isJust ,isValidIP} from '@/assets/js/index.js'
//	import devicePort from './clounFile/devicePort';
	export default{
		name:'Unknown',
//		components:{
//			devicePort
//		},
		data(){
			var isNumber= (rule,value,callback) => {
				if(!value){
					callback(new Error(this.$t('Public.notEmity')))
				}else if(! isJust(value)){
					 callback(new Error(this.$t('Public.placeRight')))
				}else{
					callback()
				}
			};
			var aIsIp= (rule , value , callback) => {
				if(!value){
					callback( new Error(this.$t('Public.placeaIp')))
				}else if ( ! isValidIP(value)){
					callback(new Error(this.$t('Public.plaIP')))
				}else{
					callback()	
				}
			};
			var zIsIp= (rule , value , callback) => {
				if(!value){
					callback( new Error(this.$t('Public.placezIp')))
				}else if ( ! isValidIP(value)){
					callback(new Error(this.$t('Public.plaIP')))
				}else{
					callback()	
				}
			};
			return{
				//获取用户的权限token
				token:sessionStorage.getItem('token'),
				//顶部分工具栏的搜索部分
				filters:{
					search_name:'',
					search_status:'',
					start_time:'',
					end_time:'',
					//总的接收时间
					timeVal:[],
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
				aDevice:[],// a 设备
				aDevicePort:[],// a 设备端口
				zDevice:[],// z 设备
				zDevicePort:[],// z 设备端口
				//编辑的时候界面的显示
				editForm:{
					id:'',
					a_node_id:'',
					a_node_name:'',
					a_ip:'',
					a_vlan:'',
					a_desc:'',
					a_device:'',
					a_device_port:'',
					
					z_node_id:'',
					z_node_name:'',
					z_ip:'',
					z_vlan:'',
					z_desc:'',
					z_device:'',
					z_device_port:'',
					a_device_port_ids:'',
					z_device_port_ids:'',

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
					newdevice_a:"",
					newport_a:'',
					devicelist:[
						{
							a_device:'',
							a_device_port:'',
						}
					],
					devicelistdesc:[
						{
							a_device:'',
							a_device_port:'',
						}
					],
					device_zlist:[
						{
							z_device:'',
							z_device_port:'',
							
						}
					],
					device_zlistdesc:[
						{
							z_device:'',
							z_device_port:'',
							
						}
					]
				},
				devicelist:[
						{
							a_device:'1',
							a_device_port:'1',
						}
				],
				device_zlist:[
						{
							z_device:'1',
							z_device_port:'1',
							
						}
				],
				//添加的时候校验规则
				editFormRules:{
					a_node_id:[{ required: true, message: this.$t('Public.placeaNode'), trigger: 'change' }],
					a_ip:[{ required: true, validator: aIsIp, trigger: 'blur' }],
					a_vlan:[{ required: true, validator:isNumber, trigger: 'blur' }],
					a_desc:[{required:true, message:this.$t('Public.placeaDes'),trigger:'blur'}],
					a_device:[{required:true, message:this.$t('Public.selDeviceA'),trigger:'change,blue'}],
					a_device_port:[{required:true, message:this.$t('Public.selPort'),trigger:'change,blue'}],
					z_node_id:[{ required:true, message:this.$t('Public.placezNode'),trigger:'change'}],
					z_ip:[{required:true , validator:zIsIp, trigger:'blur'}],
					z_vlan:[{ required:true , validator:isNumber,trigger:'blur'}],
					z_desc:[{ required:true , message:this.$t('Public.placezDes'),trigger:'blur'}],
					z_device:[{required:true, message:this.$t('Public.selDeviceZ'),trigger:'change ,blue'}],
					z_device_port:[{required:true, message:this.$t('Public.selPort'),trigger:'change , blue'}],
					physical_bandwidth:[{ required:true ,validator:isNumber,trigger:'blur'}],
					bandwidth:[{ required:true , validator:isNumber,trigger:'blur'}],
					
					monitoring:[{required:true ,message:this.$t('Public.placeLink'), trigger:'change'}],
					
					link_cost:[{ required:true ,validator:isNumber,trigger:'blur'}]	,
					monitoring_type:[{required:true ,message:this.$t('Public.placeLinkType'), trigger:'change'}],
				},
				//链路检测是否开启部分
				detectionStatue:[
					{

						label:true,
						name:this.$t('Public.open')
					},{

						label:false,
						name:this.$t('Public.close')
					}
				],
				detectionType:[
					{
						label:'BFD',
						value:'BFD'
					}
				],
				textMap:{
					creat:this.$t('tabOperation.add'),
					update:this.$t('tabOperation.edit'),
					see:this.$t('tabOperation.info'),
					
				},
				//发现未知节点的数据
				foundForm:{
					parameter:''
				},
				TitleMap:{
					found:this.$t('Public.findParams')	
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
				buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 "link@add_unknown_link"
			  		add:this.codeVal(this.recursion( this.$store.state.aside ,"Public.unLink").list, "link@add_unknown_link").show,//添加	
			  		del:this.codeVal(this.recursion( this.$store.state.aside ,"Public.unLink").list, "link@del_link").show,//单个删除和批量的删除是绑定在一起的  
			  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"Public.unLink").list,"link@edit_unknown_link").show,//编辑的值
			  		see:this.codeVal(this.recursion( this.$store.state.aside ,"Public.unLink").list, "link@link_info" ).show,//查看详情
			  		run:this.codeVal(this.recursion( this.$store.state.aside ,"Public.unLink").list,"link@run_link" ).show,//运行
			  	},
			  	siDevice_port:true,
				deviceData:[],
			}
		},
		watch:{
			//检测editForm里面的monitoring的变化
			'editForm.monitoring':function(newVal,oldVal){
				if(newVal){
					this.detectionStatus=true;
				}else if(!newVal){
					this.detectionStatus=false;
				}
			},
			'editForm.devicelist':{
				handler(newVal,oldVal){
					this.editForm.devicelist=newVal;
				},
				deep:true
			},
			'editForm.device_zlist':{
				handler(newVal,oldVal){
					this.editForm.device_zlist=newVal;
				},
				deep:true
			}
		},
//		computed:{
//			a(){
//				return {
//					device:'A端设备',
////					port:'设备端口',
//					deviceList:this.aDevice
//				}
//			},
//			z(){
//				return {
//					device:'z设备',
//					port:'z端口',
//					id:this.editForm.z_node_id
//				}
//			}
//		},
		created(){
			this.getUsers();
			this.getNodeData();
		
		},
		filters:{
			bbs(msg){
				var ipt=JSON.parse(msg)['input'];
				var out=JSON.parse(msg)['output'];
				return Math.round( ipt['bytes'] / (1000*1024) )+'/'+Math.round( out['bytes']/ (1000*1024) );
			}
		},
		
		methods:{
			close(){
				this.$refs['editForm'].resetFields()
			},
			clearValidate(formName) {
			this.$refs[formName].clearValidate();
			},
			device_port_add(){
				
				this.editForm.devicelist.push({
					a_device:'',
					a_device_port:'',
				})
			},
			device_port_down(index){
				if(this.editForm.devicelist.length>1){
					this.editForm.devicelist.pop();
				}
			},
			device_port_add_Z(){
				this.editForm.device_zlist.push({
					z_device:'',
					z_device_port:'',
				})
			},
			device_port_down_Z(index){
				if(this.editForm.device_zlist.length>1){
					this.editForm.device_zlist.pop();
				}
			},
			// 节点
			selectNodeA(id){
				this.$forceUpdate();
				this.aDevicePort=[];
				this.editForm.devicelist.map(it=> {
					it.a_device='';
					it.a_device_port='';
				})
				this.aDevice=[];
				//选择A的节点 下的对应的设备
				this.$ajax.get('/node/node_info/'+id+'?token='+this.token)
				.then(res => {
					if(res.status == 200){
						if(res.data.status == 0){
							this.aDevice=res.data.data.devices;
						}
					}
				}).catch(e => {console.log(e)})
			},
			selectDeviceA(item){
				this.$forceUpdate();
				item.a_device_port='';
				//筛选可用的设备端口
				var para={
					search_available:false
				}
				this.editForm.a_device=item.a_device;
				this.$ajax.get('/node/device_info/'+item.a_device+'/ports'+'?token='+this.token,para)
				.then(res => {
					if(res.status == 200){
						if(res.data.status == 0){
							res.data.data.items.map(item => {
								if(item.status === 'UP'){
									item.color='statusUP'
								}else{
									item.color='statusDOWN'
								}
							})
							this.aDevicePort=res.data.data.items;
						}
					}
				}).catch(e => {console.log(e)})
			
			},
			selectDevicePort(ids){
				this.$forceUpdate();
				this.editForm.a_device_port=ids;

			},
			selectDevicePortZ(ids){
				this.$forceUpdate();
				this.editForm.z_device_port=ids;
			},
			// 节点
			selectNodeZ(id){
				this.$forceUpdate();
				this.zDevicePort=[];
				this.zDevice=[];
				this.editForm.device_zlist.map(it=> {
					it.z_device='';
					it.z_device_port='';
				})
				//选择Z的节点
				this.$ajax.get('/node/node_info/'+id+'?token='+this.token)
				.then(res => {
					if(res.status === 200){
						if(res.data.status == 0){
							this.zDevice=res.data.data.devices;
						}
					}
				}).catch(e => {console.log(e)})
			},
			selectDeviceZ(item){
				this.$forceUpdate();
				var item = item;
				item.z_device_port='';
				var para={
					search_available:false
				}
				this.editForm.z_device=item.z_device;
				this.$ajax.get('/node/device_info/'+item.z_device+'/ports'+'?token='+this.token,para)
				.then(res => {

					if(res.status === 200){
						if(res.data.status == 0){
							var arr =res.data.data.items;
							for(let item =0 ;item <arr.length;item ++){
								if(arr[item].status === 'UP'){
									arr[item].color='statusUP'
								}else{
									arr[item].color='statusDOWN'
								}
							}
							this.zDevicePort=res.data.data.items;
						}
					}
				}).catch(e => {console.log(e)})
				
			},
			getNodeData(){
				//获取节点的数据
				var para={
					search_activated:true
				}
				this.$ajax.get('/node/nodes'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.nodeData=res.data.data.items;
						}
					}
				}).catch( e => {
					console.log(e)
				})

			},
			handleSizeChange(val){

				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){

				this.currentPage=val;
				this.getUsers()
			},
			reset(){
				this.$refs['filters'].resetFields()
			},
			getUsers(){
				
				//获取数据和搜索
				this.loading=true;
				//对时间的选择的处理，当不选择的时候作为一个空
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
					search_activated:false
				}
				this.$ajax.get('/link/links'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.loading=false;
							this.total=res.data.data.page.total;
							var arr =res.data.data.items;
							for(let item =0 ;item <arr.length;item ++){
								if(arr[item].monitoring){
									arr[item].monitoringText=this.$t("Public.open");									
								}else if(!arr[item].monitoring){
									arr[item].monitoringText=this.$t('Public.close');									
								}
							}
							this.total=res.data.data.page.total;
							this.users=res.data.data.items;
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
			},
			
			timeValSearchBtn(value) {
				this.filters.start_time = this.filters.timeVal[0];
				this.filters.end_time = this.filters.timeVal[1];
			},
			show(newdevice,newport){
				this.editForm.newdevice_a=newdevice;
				this.editForm.newport_a=newport;
			},
			handleAdd(){
				//添加
				this.$forceUpdate();
				this.dialogStatus='creat';
				this.editFormStatus=false;
				this.seeStatus=false;
				//添加位置链路
				this.dialogFormVisible=true;
				
				this.editForm={
					devicelist:[
						{
							a_device:'',
							a_device_port:'',
						}
					],
					device_zlist:[
						{
							z_device:'',
							z_device_port:'',
						}
					],
					newdevice_a:'',
					newport_a:'',
					a_node_id:'',
					a_ip:'',
					a_vlan:'',
					a_desc:'',
					a_device:'',
					a_device_port:'',
					z_node_id:'',
					z_ip:'',
					z_vlan:'',
					z_desc:'',
					z_device:'',
					z_device_port:'',
					physical_bandwidth:'',
					bandwidth:'',
					monitoring:false,
					monitoring_type:'',
					monitoring_param:'',
					link_cost:'',
					description:'',
				};
				this.$forceUpdate();
			},
			creatData:function(){
				this.$refs.editForm.validate(valid => {
					if(valid){
						if(this.editForm.a_ip == this.editForm.z_ip){
							this.$message({
								message:this.$t('Public.a_zEqual'),
								type:'warning'
							})
						}else{
							let device_a_arr=[];
							let device_z_arr=[];
							this.editForm.devicelist.map(it=> {
								device_a_arr.push({
									a_device:it.a_device,
									a_device_port:it.a_device_port
								})
							})
							this.editForm.device_zlist.map(it=> {
								device_z_arr.push({
									z_device:it.z_device,
									z_device_port:it.z_device_port
								})
							})
							let newde=[];
							device_a_arr.map(v=>{
								newde.push(v.a_device+'_'+v.a_device_port)
							})
							let newdez=[];
							device_z_arr.map(v=>{
								newdez.push(v.z_device+'_'+v.z_device_port)
							})

							let para={
								a_node_id:this.editForm.a_node_id,
								a_ip:this.editForm.a_ip,
								a_vlan:this.editForm.a_vlan,
								a_desc:this.editForm.a_desc,
								// a_device_id:this.editForm.a_device,
								// a_port_id:this.editForm.a_device_port,
								a_device_port_ids:newde.join(),
								z_node_id:this.editForm.z_node_id,
								z_ip:this.editForm.z_ip,
								z_vlan:this.editForm.z_vlan,
								z_desc:this.editForm.z_desc,
								z_device_port_ids:newdez.join(),
								physical_bandwidth:this.editForm.physical_bandwidth,
								bandwidth:this.editForm.bandwidth,
								monitoring:this.editForm.monitoring.toString(),
								monitoring_type:this.editForm.monitoring_type,
								monitoring_param:this.editForm.monitoring_param,
								link_cost:this.editForm.link_cost,
								description:this.editForm.description,	
//								get_speed_key:this.editForm.get_speed_key,
							}
							this.$ajax.post('/link/add_unknown_link'+'?token='+this.token,para)
							.then( res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('tooltipMes.addSuccess'),
											type:'success'
										})
									}
									this.$refs['editForm'].resetFields();
									this.dialogFormVisible=false;
									this.getUsers()
								}
							}).catch(e => {
								console.log(e)
							})
						}
							
					}
				})
			},
			handleSee(index,row){
				//详情
				this.dialogStatus='see';
				this.dialogFormVisible=true;
				this.seeStatus=true;
				this.editFormStatus=true;
				this.editForm.devicelist = [];
				let bodyArr1 = row.a_device_ports;
				bodyArr1.map(v => {
					this.editForm.devicelist.push({
						a_device:v.device.name,
						a_device_port:v.port.port_no,
					})
				})
				this.editForm.device_zlist = [];
				let bodyArr2 = row.z_device_ports;
				
				bodyArr2.map(v => {
					this.editForm.device_zlist.push({
						z_device:v.device.name,
						z_device_port:v.port.port_no,
					})
				})
				this.editForm={
					id:row.id,
					a_node_id:row.a_node.id,
					a_node_name:row.a_node.name,
					a_ip:row.a_ip,
					a_vlan:row.a_vlan,
					a_desc:row.a_desc,
					devicelist:this.editForm.devicelist,
					device_zlist:this.editForm.device_zlist,

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
					creation_time:row.creation_time,
					description:row.description,
//					get_speed_key:row.get_speed_key,
				}
			},
			handleEdit(index,row){
				console.log(row)
				//编辑
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.seeStatus=false;
				//显示时间
				this.editFormStatus=true;
				//editForm.creation_time
				this.editForm.devicelist = [];
				this.editForm.devicelistdesc=[];
				let bodyArr1 = row.a_device_ports;
				bodyArr1.map(v => {
					this.editForm.devicelist.push({
						a_device:v.device.name,
						a_device_port:v.port.port_no,
					})
					this.editForm.devicelistdesc.push({
						a_device:v.device.name,
						a_device_port:v.port.port_no
					})
				})
				this.editForm.device_zlist = [];
				this.editForm.device_zlistdesc=[];
				let bodyArr2 = row.z_device_ports;
				bodyArr2.map(v => {
					this.editForm.device_zlist.push({
						z_device:v.device.name,
						z_device_port:v.port.port_no,
					})
					this.editForm.device_zlistdesc.push({
						z_device:v.device.name,
						z_device_port:v.port.port_no
					})
				})
				this.editForm={
					id:row.id,
					a_node_id:row.a_node.id,
					a_node_name:row.a_node.name,
					devicelist:this.editForm.devicelist,
					device_zlist:this.editForm.device_zlist,
					a_device_port_ids:row.a_device_port_ids,
					a_ip:row.a_ip,
					a_vlan:row.a_vlan,
					a_desc:row.a_desc,
					a_device:'',
					devicelistdesc:this.editForm.devicelistdesc,
					device_zlistdesc:this.editForm.device_zlistdesc,
					z_device_port_ids:row.z_device_port_ids,
					z_node_id:row.z_node.id,
					z_node_name:row.z_node.name,
					z_ip:row.z_ip,
					z_vlan:row.z_vlan,
					z_desc:row.z_desc,
					z_device:'',
					bandwidth:row.bandwidth,
					physical_bandwidth:row.physical_bandwidth,
					link_cost:row.link_cost,
					monitoring:row.monitoring,
					monitoring_type:row.monitoring_type,
					monitoring_param:row.monitoring_param,
					maintenance_type:row.maintenance_type,
					status:row.status,
					creation_time:row.creation_time,
					description:row.description,
				}

			},
			updateData(){
				//编辑操作
//				var this=this;
				this.editLoading=true;
				this.$refs.editForm.validate(valid => {
					if(valid){
						
						if(this.editForm.a_ip == this.editForm.z_ip){
							this.$message({
								message:this.$t('PUblic.a_zEqual'),
								type:'warning'
							})
						}else{
							let device_a_arr=[];
							let device_z_arr=[];
							let device_a_new=[];
							let device_z_new=[];
							this.editForm.devicelist.map(it=> {
								device_a_arr.push({
									a_device:it.a_device,
									a_device_port:it.a_device_port
								})
							})
							this.editForm.device_zlist.map(it=> {
								device_z_arr.push({
									z_device:it.z_device,
									z_device_port:it.z_device_port
								})
							})
							this.editForm.devicelistdesc.map(it=> {
								device_a_new.push({
									a_device:it.a_device,
									a_device_port:it.a_device_port
								})
							})
							this.editForm.device_zlistdesc.map(it=> {
								device_z_new.push({
									z_device:it.z_device,
									z_device_port:it.z_device_port
								})
							})
							let newde=[];
							device_a_arr.map(v=>{
								newde.push(v.a_device+'_'+v.a_device_port)
							})
							let newdez=[];
							device_z_arr.map(v=>{
								newdez.push(v.z_device+'_'+v.z_device_port)
							})
							
							let new_des_a=[];
							let new_des_z=[];
							device_a_new.map(v=>{
								new_des_a.push(v.a_device+'_'+v.a_device_port)
							})
							device_z_new.map(v=>{
								new_des_z.push(v.z_device+'_'+v.z_device_port)
							})

							let para={
								a_node_id:this.editForm.a_node_id,
								a_ip:this.editForm.a_ip,
								a_vlan:this.editForm.a_vlan,
								a_desc:this.editForm.a_desc,
								a_device_port_ids:newde.join()==new_des_a.join()?this.editForm.a_device_port_ids:newde.join(),
								// a_device_id:this.editForm.a_device == this.editForm.a_device_basic?this.editForm.a_device_id:this.editForm.a_device ,
								// a_port_id:this.editForm.a_device_port==this.editForm.a_port_basic?this.editForm.a_device_port_id:this.editForm.a_device_port,
								
								z_node_id:this.editForm.z_node_id,
								z_ip:this.editForm.z_ip,
								z_vlan:this.editForm.z_vlan,
								z_desc:this.editForm.z_desc,
								z_device_port_ids:	newdez.join()==new_des_z.join()?this.editForm.z_device_port_ids:newdez.join(),
								// z_device_id:this.editForm.z_device == this.editForm.z_device_basic?this.editForm.z_device_id:this.editForm.z_device ,
								// z_port_id:this.editForm.z_device_port==this.editForm.z_port_basic?this.editForm.z_device_port_id:this.editForm.z_device_port,
								
								physical_bandwidth:this.editForm.physical_bandwidth,
								bandwidth:this.editForm.bandwidth,
								monitoring:this.editForm.monitoring,
								monitoring_type:this.editForm.monitoring_type,
								monitoring_param:this.editForm.monitoring_param,
								link_cost:this.editForm.link_cost,
								description:this.editForm.description,	
//								get_speed_key:this.editForm.get_speed_key
							}
							this.$ajax.put('/link/edit_unknown_link/'+this.editForm.id+'?token='+this.token,para)
							.then( res => {
								this.editLoading=false;
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('tooltipMes.editSuccess'),
											type:'success'
										})
										this.dialogFormVisible=false;
										this.getUsers();
									}
								}
							})
							.catch(e => {
								console.log(e)
							})
						}
					}
				})
			},
			handleStart(index,row){
				//运行
				this.$confirm(this.$t('Public.openLinkSure'),this.$t('confirm.tooltip'),{
					type:'primary'
				})
				.then (() => {
					this.$ajax.put('/link/run_link/'+row.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('Public.linkRunSuc'),
									type:'success'
								})
								row.maintain_type=true
								this.getUsers()
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

				//查看a的节点的详细的信息
				this.$router.push({path:'/location/index/unknown/nodedetails',
					query:{
						detailsID:row.a_node.id
					}
				});
			},
			handelSee_zNode(index,row){
				//查看z节点额详细信息
				this.$router.push({path:'/location/index/unknown/nodedetails',
				query:{
					detailsID:row.z_node.id
				}
				});
				
			},
			handleDel(index,row){
				//删除
//				var this=this;
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{
					type:'danger'
				})
				.then( () => {
					this.$ajax.del('/link/del_link/'+row.id+'?token='+this.token)
					.then( res => {
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
							var para={
								
							};
							this.foundFormVisible=false;
					}else{
						this.foundFormVisible=false;
						this.$message({
							message:this.$t("Public.paramsNotEmity"),
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
				this.$confirm(this.$t('confirm.titles'),this.$t('confirm.tooltip'),{
					type:'danger'
				})
				.then( () => {
					let para={
						ids :ids,
					};
					this.$ajax.del('/link/del_links'+'?token='+this.token,para)
					.then( res => {

						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
							}
							this.getUsers()	;						
							
						}
					})
					.catch( e => {
						console.log(e)
					})
				})
				.catch( () => {})
			},

		},
	}
</script>

<style>
	.sel{
		width: 100px;
	}
</style>