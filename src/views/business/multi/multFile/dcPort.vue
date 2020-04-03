<template>
	<div>
		<!--数据中心的端口-->
		<el-form :model='editForm' ref='editForm':rules='editFormRules'v-loading='editLoading' label-width='160px'>
			<el-form-item :label='$t("Public.nodeName") +"："' prop='nodeName'>
				<el-select v-model='editForm.nodeName' filterable  @change='selectNode(editForm.nodeName)' class='ipt'>
					<el-option v-for='(item ,index) in nodeData'
						:label='item.name'
						:value='item.id'
						:key='index'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label='$t("Public.logic") +"："' prop='logic'>
				<el-select v-model='editForm.logic' filterable @change='selecLogic(editForm.logic)' class='ipt'>
					<el-option v-for='(item,index) in logicPort'
						:value='item.id'
						:key='index'
						:label='item.name'
						:disabled='item.statusVal < 0 ? true :false'
						>
						<template>
							<span>{{item.name}}</span>
							<span :class='item.statusColor' class="spn_val">{{item.status}}</span>
						</template>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label='$t("business.logicType")+"："' prop='endpoints_vlan'>
				<template>
					<el-radio-group v-model='editForm.endpoints_vlan' >
						<el-radio-button size='small' v-for='item in portType'
							:label='item.label'
							:value='item.value'
							:key='item.value'></el-radio-button>
					</el-radio-group>
				</template>
			</el-form-item>
			<el-form-item label='vlan ：'prop='vlan' v-if='editForm.endpoints_vlan ==="trunk"? true :false '>
				<template>
					<el-input v-model='editForm.vlan' v-show='false'></el-input>
					<el-switch v-model='editForm.chooseVlan'
						active-text="UNTAG"
						:title='$t("business.tooltip2")'></el-switch>	
						<el-button v-text='editForm.logic==""?$t("business.changeVlan"):editForm.endpoints_vlan === "trunk" ?  editForm.selVlan ? editForm.selVlan:$t("business.changeVlan") : $t("business.changeVlan")         '
							size='small' 
							@click='addVlan' 
							:title='$t("business.tooltip1")'
							:disabled=' editForm.logic === "" ? true : false '
							v-if='!editForm.chooseVlan'></el-button>
				</template>		
			</el-form-item>
		</el-form>

		<el-dialog style='width: 100%;' :title='textMap[dialogStatus]' :visible.sync="dialogFormVisible":close-on-click-modal="false" v-loading='vlanLoading' >
			<el-form   :model='portVlan' ref='portVlan'>
				<el-form-item>
					<template>
						<span>{{$t('Public.logic')}}:</span>
						<span>{{logicDetails.name}}</span>
					</template>
					<br />
					<template>
						<span>{{$t('Public.logicStatus')}}:</span>
						<span>{{logicDetails.portStatus}}</span>
					</template>
					<template>
						<el-input v-model='portVlan.vlanName'  :placeholder='$t("business.plaVlan")'class='ipt_sels2'></el-input>
						<el-button size='small' type='primary' @click='getVlan'>{{$t('topFilters.search')}}</el-button>
					</template>
				</el-form-item>
				<el-form-item >
					<template slot-scope='scope'>
						<div  v-model='portVlan.vlanVal' id="idData" style="height: 300px; overflow-y: auto;">
							<el-button	 class="bor_data" 
								v-for='(item ,index) in disVlan' 
								:key='index'
								:value='item.value'
								@click='cliData(index,item.value)'
								:class='item.clas'
								:disabled=' item.clas==="active" ? true : false'
								>{{item.value}}</el-button>
						</div>
						<el-pagination 
							@size-change="handleSizeChange" 
							@current-change="handleCurrentChange" 
							:current-page="index" 							
							:page-size="size" 
							:page-sizes="[100]"
							layout="total, sizes, prev, pager, next, jumper" 
							:total="tableCopyTableList.length">
			    		</el-pagination>

					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				 <el-button size='small' @click.native="dialogFormVisible=false">{{$t('tabOperation.cancel')}}</el-button>
				 <el-button size='small' type='primary' @click='creatVlan'>{{$t('tabOperation.save')}}</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>

	
	import {datedialogFormat,getPortStatus ,isPortStatus} from '@/assets/js/index.js'
	export default{
		name:'dcPort',
		props:['tit','resVal'],
		data(){
			var logic_port= (rule ,value ,callback) => {
				if(! value){
					callback(new Error(this.$t('Public.notEmity')))
				}else {
					callback()
				}
			}
			return{
				token:'',
				editLoading:false,
				editForm:{
					endpoints_vlan:'trunk',//逻辑口类型
//					endpoints_vlan:this.vlanType,//逻辑口类型
					
					nodeName:'',
					logic:"",//逻辑口名称
					chooseVlan:'false',
					vlan:'',//因为选择的状态不同，用来保存vlan的所选当前的数据
					selVlan:''
				},
				sendForm:{
					vlan:'',
					nodeName:'',
					logic:'',
				},
				nodeObj:{},//根据选择的nodeName(id)获取对应的json对象
				logicObj:{},//根据逻辑口的部分，获取对应的对象里面的数据
				editFormRules:{
					nodeName:[  { required: true, message: this.$t('Public.plChNode'), trigger: 'change' }],
					
					logic:[  { required: true,  validator:logic_port ,trigger: 'change' }],
					
					endpoints_vlan:[  { required: true, message: this.$t('Public.plaChangeLogic'), trigger: 'change' }],
//					vlan:[  { required: true, message: '请选择vlan', trigger: 'change' }],
				},
				portType:[{label:'透传',value:'-1'},{label:'trunk',value:'0'}],//逻辑口的类型
				textMap:{
					title:this.$t('tabOperation.add')+"vlan"
				},
				dialogStatus:'',
				dialogFormVisible:false,
				portVlan:{
					vlanName:'',
					vlanVal:'',
				},
				vlanLoading:false,
				vlanData:[],//保存选择vlan号区间的所有的数据
				vlanVal:[],//保存所选取的vlan的区间的前后的字符串
				portType:[{label:'透传',value:'-1'},{label:'trunk',value:'0'}],

				timeIndex:null,

				nodeData:[],//获取节点的数据
				logicPort:[],//逻辑口的数据
				logicDetails:{},//获取逻辑口的详情
				nodeVal:[],
				disabeldData:[],//vlan不可用的数据
				disVlan:[],
				itable:null,
				pointData:[],//获取所有的点到点的所有数据，用来判断里面的逻辑口的状态 //获取组网的数据列表   也是为了获取逻辑口的数据  
				baseObj:[],
				cloudLogic:[],//获取云对接链路列表里所有的逻辑口，将不可在用于开通业务
				//自定义分页
				
				index: 1,
      			size: 100,
      			tableCopyTableList: [],//数据copy
//    			pagecount:5,
				
			}
		},
		watch:{

			editForm:{
				handler(newVal,oldVal){	
////					验证逻辑口
					if(newVal.endpoints_vlan == '透传' ){
						if(this.baseObj.length != 0){
							var obj1=this.baseObj.find(item => {
								return item.statusVal == 0;
							})
							var obj2=this.baseObj.filter(item => {
								return item.statusVal > 0;
							})
							if((JSON.stringify(obj1) !='{}'&&typeof obj1 !='undefined') || obj2.length !=0){
								this.$message({
									message:this.$t('business.plaTrunk'),
									type:'warning'
								})

								newVal.logic='';
								newVal.vlan='';
								newVal.selVlan=''
							}else {
								newVal.selVlan=-1;
								newVal.vlan=-1; 
							}

						}else{//为透传模式
							newVal.selVlan='';
							newVal.vlan=-1; 

						}
					}else if(newVal.endpoints_vlan == 'trunk'){

						if(newVal.chooseVlan){

							if(this.baseObj.length != 0){
								
								var obj1=this.baseObj.find(item => {
									return item.statusVal == 0;
								})
								var obj2=this.baseObj.filter(item => {
									return item.statusVal > 0;
								})

								if(JSON.stringify(obj1) !='{}' && typeof obj1 !='undefined'){
									
									this.$message({
										message:this.$t('business.plaUntag'),
										type:'warning'
									})
									newVal.logic='';
									newVal.vlan='';
									newVal.selVlan=''
								}else {
									newVal.vlan=0;  //当时untag模式的是vlan为0
									newVal.selVlan=0;
								}
							}else {
								newVal.vlan=0;  //当时untag模式的是vlan为0
								newVal.selVlan=0;
							}
						}
					}
					//验证选择的模式

					//下面的form表单的转换 ，是当触发的时候，将需要传的参数放在一个新对象内，以便于，，在监听的是偶向父组件传值
					this.sendForm.vlan=newVal.vlan;
					this.sendForm.nodeName=newVal.nodeName;
					this.sendForm.logic=newVal.logic;

				},
				deep:true,
			},

			sendForm:{
				handler(newVal,oldVal){
//					console.log(newVal)
					this.$emit('sendFormData',newVal)
					this.$emit('sendFormData_a',newVal)
					this.$emit('sendFormData_z',newVal)
				},
				deep:true,
			},
		},
		created(){
			this.token=sessionStorage.getItem('token');

			this.tableCopyTableList = JSON.parse(JSON.stringify(this.disVlan));
			this.disVlan = this.paging(this.size, this.index);
			this.getformData();
			if(typeof this.tit !=='undefined'){
				this.textMap.title=this.tit;
			}
	
			
		},
		methods:{
			// 页数改变事件
		    handleSizeChange(size) {
		      	this.size = size;
		      	this.disVlan = this.paging(size, this.index);
		    },
		    // 页码改变事件
		    handleCurrentChange(current) {
		      	this.index = current;
		      	this.disVlan = this.paging(this.size, current);
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
			getVlan(){
				//本地分页的模糊查找
				this.index =parseInt( this.portVlan.vlanName/this.size ) ;
				this.handleCurrentChange(this.index)
			},
			getformData(){
				this.$ajax.get('/node/nodes'+'?token='+this.token)   //获取节点的数据
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.nodeData=res.data.data.items;
						}
					}
				}).catch(e => {console.log(e)})
				
			      //获取点到点的所有的数据   对里面的所有的逻辑口进行判断，
			      //如果该逻辑口为透传模式=>则不可在使用   ,如果该逻辑口为untag模式，可以使用，不能再选择untag模式
			    
			    this.$ajax.get('/vll/p2p_vlls'+'?token='+this.token)
			    .then(res => {
			      	if(res.status==200){
			      		if(res.data.status==0){
			      			var str=res.data.data.items;
			      			str.forEach(ele => {
			      				ele.endpoints.forEach(item => { //用statusVal   来判断   该逻辑口的状态
			      					item.logic_port.statusVal=item.vlan;
			      					this.pointData.push(item.logic_port);
			      				})
			      			})
			      		}
			      	}
			    }) .catch(e => { console.log(e) })
			    
			    this.$ajax.get('/vll/multi_vlls'+'?token='+this.token)
			    .then(res => {
			    	if(res.status==200){
			    		if(res.data.status==0){
			    			var str=res.data.data.items;
			    			if(str.length !=0){
				    			str.forEach(ele => {
				    				if(ele.endpoints){
				    					ele.endpoints.forEach( item => {
					    					item.logic_port.statusVal=item.vlan;
					      					this.pointData.push(item.logic_port);
					    				})
				    				}
				    				//云的vlan部分
//				    				else if(ele.cloud_endpoints){
//				    					ele.cloud_endpoints.map(item => {
//				    						item.cloud_config.logic_port.statusVal=item.vlan;
//				    						this.pointData.push(item.cloud_config.logic_port);
//				    					})
//				    				}
				    			})	
			    			}
			    		}
			    	}
			    }).catch(e => {console.log(e)})
			    
			    this.cloudLogic=[];
			    var obj={}
			    //获取云对接链路里面的数据  cloudLogic
			    this.$ajax.get('/link/cloud_links'+'?token='+this.token)
			    .then(res => {
			    	res.data.data.items.forEach(ele =>{
			    		obj={
			    			name:ele.logic_port.name,
			    			id:ele.logic_port.id
			    		};
			    		this.cloudLogic.push(obj);
//			    		this.cloudLogic.push(ele.logic_port)
			    	})
			    }).catch(e =>{console.log(e)})
			},
			selectNode(ids){//根据选择的节点获取逻辑口的数据
				this.editForm.logic=''
				this.logicPort=[];
				this.disVlan=[];
				var para={
					search_node:ids,
					search_usable:true,
				}
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							res.data.data.items.map(ele => {
								let staus=[]
								ele.physical_ports.map(items => {
									staus.push(items.port)
								})
								let strVal={};
								if(getPortStatus(staus)=='UP'){
									strVal.statusColor='statusUP'
								}else if(getPortStatus(staus)=='DOWN'){
									strVal.statusColor='statusDOWN'
								}else if(getPortStatus(staus)=='异常'){

									strVal.statusColor='statusAbno'
								}
								let portObj={
									id:ele.id,
									name:ele.name,

									status:isPortStatus(ele.physical_ports),

									statusColor:strVal.statusColor,
									statusVal:2,//statusVal  根据点到点的列表的数据   来判断该逻辑口的是否为可用的 默认的逻辑扣是全部可用的
								}
								this.logicPort.push(portObj)
							})
							this.logicPort= this.logicPort.filter(item => {//将云对接的所有的列表内的逻辑口用过的删除
							     let idList= this.cloudLogic.map(v => v.id)
							     return !idList.includes(item.id)
							})

							for(var item1 of this.logicPort){
								for(var item2 of this.pointData){
									if(item1.id == item2.id){
										item1.statusVal=item2.statusVal
									}
								}
							}

						}
					}
				}).catch(e => {console.log(e)})
			},
			selecLogic(ids){//获取逻辑口的id，可用与选择的vlan的时候里面的信息的展示
				this.$ajax.get('/port/logic_port_info/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							let str=res.data.data;
							for(let item in str){
								str.portStatus=isPortStatus(str.physical_ports)
							}
							this.logicDetails=Object.assign({},res.data.data);
						}
					}
				}).catch(e => {
					console.log(e)
				})

				var obj1=this.pointData.filter(item => {
					return item.id == ids;
				})

				this.baseObj=[];
				if(typeof obj1 !='undefined'){
					this.baseObj=obj1;
				}
				//获取逻辑口下的vlan的信息
				this.$ajax.get('/vll/get_vlan/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status == 200){
						if(res.data.status == 0){
							this.disVlan=res.data.data;
							return this.$ajax.get('/vll/get_disable_vlan/'+ids+'?token='+this.token)
						}
					}
				}).then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.disabeldData=res.data.data;
							this.disVlan=JSON.parse(JSON.stringify(this.conversion(this.disVlan,this.disabeldData))); 
							this.tableCopyTableList = JSON.parse(JSON.stringify(this.disVlan));
							this.disVlan = this.paging(this.size, this.index);
						}
					}
				}).catch(e =>{
					console.log(e)
				})
			},
			conversion(data,disData){
				var str=data.map(item => {
					return {value:item,clas:""}
				})
				str.forEach(item => {
					if(disData.indexOf(item['value'])  !==-1){
						item.clas='active'
					}else{
						item.clas=''
					}
				})
				return str;
				
			},
			addVlan(){//选择vlan
				this.dialogStatus='title'
				this.dialogFormVisible=true;	

			},
			cliData:function(index,val){//activeCla   disVlan   disabeldData
				this.disVlan.forEach(ele => {
					if(ele.value===val && ele.clas !=="active"){
						ele.clas='activeCla'
						this.portVlan.vlanVal=val;
						this.editForm.selVlan=val
						this.editForm.vlan=val;
					}else if(ele.value!==val && ele.clas !=="active"){
						ele.clas=''
					}else{
						ele.clas='active'
					}
				})

			},
			creatVlan(){
				//设置vlan号的时候保存
				if(this.portVlan.vlanVal){
					this.editForm.selVlan=this.portVlan.vlanVal;
					this.editForm.vlan=this.portVlan.vlanVal;
					this.$message({
						message:this.$t('tooltipMes.changeSuccess'),
						type:'success'
					})
					this.dialogFormVisible=false;
					
				}else{
					this.$message({
						message:this.$t('business.vlanNot'),
						type:'warning'
					})
				}
			},
			selectVal(ids,type){  //type分为node，logic
				let items=ids;
				if(type==='node'){
					//根据租户的选择的id获取对应的name
					var findNode=this.nodeData.find(function(obj){
						return obj.id===items;
					})
					this.nodeObj=Object.assign({},findNode);
					return this.nodeObj;
				}
				if(type==='logic'){
					var findLogic=this.logicPort.find(function(obj){
						return obj.id===items;
					})
					this.logicObj=Object.assign({},findLogic)
					return this.logicObj;
				}
			},
		}
	}
</script>

<style>
	.active{
		background:#737272  !important;
	}
	.activeCla{
		background: #45BAFD !important;
	}
	
	#barcon{
		text-align: center;
	}
	.spn_val{
		text-align: right;
		margin-right: 5px;
	}
	.bor_data{
		width: 60px;
		margin: 2px 1px !important;
		padding: 10px;
	}
	.details{
		width: 150px;
	}
</style>