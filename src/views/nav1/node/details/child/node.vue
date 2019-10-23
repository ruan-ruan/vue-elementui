<template>
	<div>
		<section>
			<!--<h4 v-show='unknown_editForm_status'>骨干ID:{{seeForm.id}}</h4>-->
				<el-form label-position='left'style='margin-left: 50px;' :model='seeForm'ref='seeForm' label-width="100px"  v-loading='loading' :rules='rulesForm'>
					<el-row>
						<el-col :span='24'>
							<el-col :span='12'>
								
								<el-form-item label='骨干名称:' prop='name'>
									<el-input v-model='seeForm.name' :disabled='StaEditForm'class='ipt'placeholder='请输入骨干名称'></el-input>
								</el-form-item>
								<el-form-item label='Vtep:'prop='vtep'>
									<el-input v-model='seeForm.vtep' :disabled='StaNot'class='ipt'placeholder='请输入vtep'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>								
								<el-form-item label='数据中心:' prop='dc_id'>
									<el-input v-model='seeForm.dc_id' :disabled='StaEditForm' v-show='StaEditForm' class='ipt'></el-input>
									<el-select v-model='seeForm.dc_id' @change="change" filterable class='ipt' v-show='!StaEditForm' placeholder='请选择数据中心'>
										<el-option v-for='item in itemData'
											:value='item.id'
											:key='item.name'
											:label='item.name'>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-col>
						<el-button size='small' type='success' @click='equStatusTwo = !equStatusTwo' v-show='addEquipStatus' v-text='equStatusTwo?"收起物理设备2":"添加物理设备2"' ></el-button>
						<el-col :span='24'>		
							<el-col :span='12' class='equipment'>
								<h4>物理设备1:</h4>
								<el-form-item label='设备名称:'prop='devices0_hostname'>
									<el-input v-model='seeForm.devices0_hostname':disabled='StaNot' class='ipt'placeholder='请输入设备名称'></el-input>
								</el-form-item>
								<el-form-item label='管理IP:'prop='devices0_ip'>
									<el-input v-model='seeForm.devices0_ip':disabled='StaNot' class='ipt'placeholder='请输入管理IP'></el-input>
								</el-form-item>
								<el-form-item label='硬件供应商:' prop='devices0_vendor'>
									<el-input v-model='seeForm.devices0_vendor':disabled='StaNot'class='ipt'placeholder='请输入硬件供应商'></el-input>
								</el-form-item>
								<el-form-item label='SN号:' prop='devices0_sn'>
									<el-input v-model='seeForm.devices0_sn':disabled='StaNot'class='ipt'placeholder='请输入SN号'></el-input>
								</el-form-item>
								<el-form-item label='设备型号:'prop='devices0_model'>
									<el-input v-model='seeForm.devices0_model':disabled='StaNot'class='ipt'placeholder='请输入设备型号'></el-input>
								</el-form-item>
								<!--业务端口区间-->
								<el-form-item label='端口区间:' prop='port_section0'>
									<template>						
										<el-input v-model='seeForm.port_section0':disabled='StaNot'class='ipt' placeholder='请输入设备1端口'></el-input>
										<span class="cli_toTip":title='portRules'>*?</span>
									</template>
								</el-form-item>
								<el-form-item label='所在位置:'>
									<el-input v-model='seeForm.devices0_position':disabled='StaEditForm'class='ipt'placeholder="所在位置"></el-input>
								</el-form-item>
								<el-form-item label='所在房间:'>
									<el-input v-model='seeForm.devices0_room':disabled='StaEditForm'class='ipt'placeholder="所在房间"></el-input>
								</el-form-item>
								<el-form-item label='所在Rack:'>
									<el-input v-model='seeForm.devices0_rack':disabled='StaEditForm'class='ipt'placeholder="所在Rack"></el-input>
								</el-form-item>
								<el-form-item label='备注:'>
									<el-input type="textarea" v-model='seeForm.devices0_description'rows='4':disabled='StaEditForm'placeholder="最多输入150字符" maxlength='150'class='ipt' ></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12' class='equipment'v-if='equStatusTwo'>
								<h4>物理设备2:</h4>
								<el-form-item label='设备名称:' prop='devices1_hostname'>
									<el-input v-model='seeForm.devices1_hostname':disabled='StaNot' class='ipt'></el-input>
								</el-form-item>
								<el-form-item label='管理IP:'prop='devices1_ip'>
									<el-input v-model='seeForm.devices1_ip':disabled='StaNot' class='ipt'></el-input>
								</el-form-item>
								<el-form-item label='硬件供应商:'prop='devices1_vendor'>
									<el-input v-model='seeForm.devices1_vendor':disabled='StaNot'class='ipt'></el-input>
								</el-form-item>
								<el-form-item label='SN号:' prop='devices1_sn'>
									<el-input v-model='seeForm.devices1_sn':disabled='StaNot'class='ipt'></el-input>
								</el-form-item>
								<el-form-item label='设备型号:'prop='devices1_model'>
									<el-input v-model='seeForm.devices1_model':disabled='StaNot'class='ipt'></el-input>
								</el-form-item>
								<!--业务端口区间-->
								<el-form-item label='端口区间:' prop='port_section1'>
									<template>
										<el-input v-model='seeForm.port_section1':disabled='StaNot'class='ipt' placeholder="请输入设备2端口"></el-input>
										<span class="cli_toTip":title='portRules'>*?</span>
									</template>
								</el-form-item>
								<el-form-item label='所在位置:'>
									<el-input v-model='seeForm.devices1_position':disabled='StaEditForm'class='ipt'placeholder="所在位置"></el-input>
								</el-form-item>
								<el-form-item label='所在房间:'>
									<el-input v-model='seeForm.devices1_room':disabled='StaEditForm'class='ipt'placeholder="所在房间"></el-input>
								</el-form-item>
								<el-form-item label='所在Rack:'>
									<el-input v-model='seeForm.devices1_rack':disabled='StaEditForm'class='ipt'placeholder="所在Rack"></el-input>
								</el-form-item>
								<el-form-item label='备注:'>
									<el-input type="textarea" v-model='seeForm.devices1_description'rows='4':disabled='StaEditForm'placeholder="最多输入150字符" maxlength='150'class='ipt' ></el-input>
								</el-form-item>
							</el-col>
						</el-col>
					</el-row>					
				</el-form>
				<div slot='footer' class="dialog-footer footer_right">
					<el-button size='small' @click='goback' v-if='editFormBtn' >返回</el-button>
					
					<el-button size='small' @click='unknowgoback' v-else-if='!editFormBtn'  >返回</el-button>
					<!--节点的编辑保存-->
					<el-button size='small' v-if='editFormBtn' @click='editForm' type="primary">保存</el-button>
					<!--未知节点的添加按钮-->
					<el-button size='small' v-if='creatFormBtn' @click='creatForm'type='primary'>保存 </el-button>
					<!--未知节点的编辑按钮-->
					<el-button size='small' v-if='unknownStatusBtn' @click='unknownEditForm' type='primary'>保存</el-button>
				</div>
		</section>
	</div>
</template>

<script>
	
	import {isValidNumber,isTest} from '@/assets/js/index.js'
	export default{
		name:'node',
		//这里的title是节点的额详情的时候额界面
		props:['title'],
		data(){
			let validcodeID =(rule,value,callback) => {
				if(value==''){
					callback(new Error('请输入ID'))
				}else{
					callback()
				}
			};
			let validNumber = (rule,value,callback) => {
				if(!value){
					callback(new Error('请输入的端口号'))
				}else if(!isTest(value).bool){
					callback(new Error('请输入正确的端口号，详细规则请点击右侧'))
				} else {
					callback()
				}
			};
			return{
				portRules:'格式:填写1~54内的正整数;"-"代表端口区间并取两边的数值;","代表单个端口隔离 ,例:1-23,25,26-48代表除去24口的所有端口 ',
				//获取用户的权限信息
				token:'',
				//这是在节点编辑的时候传过来的值
				editId:this.$route.query.edtiID,
				//接收未知节点的里面的数据中心里面的数据
				unknown_id:this.$route.query.id,
				//接收未知节点的里面的详情的id
				unknownID:this.$route.params.unknownID,
				//未知节点的编辑
				unknown_editFormID:this.$route.params.unknownEditID,
				unknown_editFormData:{},
				timeVal:'',
				seeForm:{
					id:'',
					name:'',
					vtep:'',
					devices0_id:'',
					devices0_hostname:'',
					devices0_ip:'',
					devices0_vendor:'',
					devices0_model:'',
					devices0_sn:'',
					devices0_position:'',
					devices0_room:'',
					devices0_rack:'',
					devices0_description:'',
					port_section0:'',
					
					
					
					devices1_id:'',
					devices1_hostname:'',
					devices1_ip:'',
					devices1_vendor:'',
					devices1_model:'',
					devices1_sn:'',
					devices1_position:'',
					devices1_room:'',
					devices1_rack:'',
					devices1_description:'',
					port_section1:'',
					dc_id:'',
					dc_name:'',
				},
				rulesForm:{
					name:[{ required: true, message: '请输入节点名称', trigger: 'blur' }],
					dc_id:[{ required: true, message: '请选择数据中心', trigger: 'change' }],
					vtep:[{ required: true, message: '请输入vtep', trigger: 'blur' }],
					devices0_id:[{ required: true, message: '请输入设备ID', trigger: 'blur' },
					{validator:validcodeID,trigger:'blur'}],
					devices0_hostname:[{ required: true, message: '请输入设备名称', trigger: 'blur' }],
					devices0_vendor:[{ required: true, message: '请输入设备厂商', trigger: 'blur' }],
					devices0_sn:[{ required: true, message: '请输入sn号', trigger: 'blur' }],
					devices0_ip:[{ required: true, message: '请输入ip', trigger: 'blur' }],
					devices0_model:[{ required: true, message: '请输入设备型号', trigger: 'blur' }],
					devices1_id:[{ required: true, message: '请输入设备ID', trigger: 'blur' },
					{validator:validcodeID,trigger:'blur'}],
					devices1_hostname:[{ required: true, message: '请输入设备名称', trigger: 'blur' }],
					devices1_vendor:[{ required: true, message: '请输入设备厂商', trigger: 'blur' }],
					devices1_sn:[{ required: true, message: '请输入sn号', trigger: 'blur' }],
					devices1_ip:[{ required: true, message: '请输入ip', trigger: 'blur' }],
					devices1_model:[{ required: true, message: '请输入设备型号', trigger: 'blur' }],
					
					
					port_section0:[{ required: true, trigger: 'blur', validator: validNumber }],
					port_section1:[{ required: true,  trigger: 'blur' , validator: validNumber}],
					
				},
				//当进去编辑部分的时候，这个时候对应的该属性是可以编辑的，并且保存按钮的控制
				StaEditForm:false,
				//编辑部分的显示的不可编辑的部分，默认为是不可以编辑的,并且控制确定按钮的实现和隐藏
				StaNot:true,
				loading:false,
				//设备2默认时候是显示的，当只有一个设备的时候，这个时候设备2隐藏
				equStatusTwo:false,
				//节点编辑的时候保存的按钮默认的时候显示
				editFormBtn:true,
				//未知节点的添加的按钮
				creatFormBtn:false,
				//未知节点的保存按钮
				unknownStatusBtn:false,
				//下面的这个是在编辑的时候显示对应的id，在添加的时候隐藏
				devices_id_status:false,
				//骨干的ID的标签默认的时候是隐藏的，在添加的时候隐藏，编辑和详情的界面的显示
				unknown_editForm_status:false,
				//控制添加设备2的按钮,默认是隐藏的
				addEquipStatus:false,
				backstatus:false,//返回按钮
				itemData:[],
				dc_id:'',
				baseData:{},//数据备份
			}
		},
		watch:{
			'seeForm.port_section0':function(newVal,oldVal){
//				console.log(newVal)
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');

			//此处是节点部分的编辑和详情的界面控制
//			&&  typeof this.title=='undefined'
			if(typeof this.editId!='undefined'){
				//此时是节点编辑界面
				this.StaEditForm=false;
				this.editFormBtn=true;
				
				this.creatFormBtn=false;
				this.unknownStatusBtn=false;
				this.backstatus=true;
				this.devices_id_status=true;
				this.getUsers(this.editId)
				this.getDataCenter()
			}
			if(typeof this.title !='undefined'){
//				console.log('进入详情的界面')
				this.getUsers(this.title)
				this.backstatus=true;
				//此处是节点的详情的界面
				this.StaEditForm=true;
				this.editFormBtn=false;
				this.creatFormBtn=false;
				this.unknownStatusBtn=false;			
				this.devices_id_status=true;
				this.addEquipStatus=false;
				this.StaNot=true;
			}
			//下面的是未知节点的编辑，添加，详情的界面的控制
			if(typeof this.unknown_id != 'undefined'){
				//此处是未知节点的添加界面的控制除了物理id的隐藏  其他的都是可以控制的
				this.StaEditForm=false;
				this.StaNot=false;
				this.unknownStatusBtn=false;
				this.editFormBtn=false;
				this.creatFormBtn=true;
				this.devices_id_status=false;
				this.addEquipStatus=true;
				this.getDataCenter()
			}
			if(typeof this.unknownID !='undefined'){
				//判断未知节点的详情的时候显示的界面
				this.StaEditForm=true;
				
				this.editFormBtn=false;
				this.creatFormBtn=false;
				this.unknownStatusBtn=false;
				this.devices_id_status=true;
				this.unknown_editForm_status=true;
				this.addEquipStatus=false;
				//获取未知节点的详情的界面的数据
				this.getUnknownDetail(this.unknownID)
			}
			if(typeof this.unknown_editFormID !='undefined'){
				//未知节点的编辑
				this.unknown_editForm_status=false;
				this.addEquipStatus=false;
				this.StaEditForm=false;
				this.StaNot=false;
				this.editFormBtn=false;
				this.creatFormBtn=false;
				this.unknownStatusBtn=true;
				this.devices_id_status=true;
				this.getDataCenter()
				this.getUnknownDetail(this.unknown_editFormID)
			}
		},
		mounted(){
			this.bus.$emit('equipment',this.seeForm.devices);
			this.$refs['seeForm'].resetFields();
		},
		methods:{
			change(){
				this.$forceUpdate()
			},
			getDataCenter(){
				this.$ajax.get('/location/dcs'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.itemData=res.data.data.items;
							console.log(this.itemData)
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
			},
			cli_toTip(){
				this.$confirm('规则:n-m,代表是n-m之间所有的整数代表的端口，且包含n和m,如需断点，请使用","逗号隔开即可，只能输入数字和-，请按照规则输入！！！','警告',{type:'warning'})
				.then(()=>{})
				.catch(() =>{})
			},
			StatusDisplay(){
				this.equStatusTwo=true;
			},
			dateFormats(value){
	    		let date=new Date(parseInt(value)*1000);
	    		let Y=date.getFullYear()+'-';
	    		let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
	    		let D=date.getDate() <10? '0' +date.getDate() +'':date.getDate()+'';
	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	    		return Y + M + D + h + m + s
	    	},
			getUsers(id){
				//编辑和详情的界面的数据
				this.$ajax.get('/node/node_info/'+id+"?token="+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.loading=false
							var strData=res.data.data;
							this.baseData=res.data.data
							let str=[];
							var  setObj={};
							let dc_name=''
							if(!strData.dc && typeof(strData.dc)!='undefined' && strData.dc!=0){
								dc_name=''
							}else{
								dc_name=strData.dc.name;
							}
							
							if(strData.devices.length==1){
								this.equStatusTwo=false;
//								str=Object.assign([],strData.devices);
								str=JSON.parse(JSON.stringify(strData.devices))
								
								setObj={
									id:strData.id,
									name:strData.name,
									vtep:strData.vtep,
									dc_id:dc_name,
									
									port_section0:str[0].port_section,
									devices0_id:str[0].id,
									devices0_hostname:str[0].hostname,
									devices0_ip:str[0].ip,
									devices0_vendor:str[0].vendor,
									devices0_model:str[0].model,
									devices0_sn:str[0].sn,
									devices0_position:str[0].position,
									devices0_room:str[0].room,
									devices0_rack:str[0].rack,
									devices0_description:str[0].description,
								}
								
							}else if(strData.devices.length==2){
								console.log('进入设别2')
								this.equStatusTwo=true;
								str=Object.assign([],strData.devices);
								var d1=str.find((item) => {
									return item['sign']=='d1'
								})
								var d2=str.find((item ) => {
									return item['sign']=='d2'
								})
								setObj={
									id:strData.id,
									name:strData.name,
									vtep:strData.vtep,
									dc_id:dc_name,
									
									port_section0:d1['port_section'],
									devices0_id:d1.id,
									devices0_hostname:d1['hostname'],
									devices0_ip:d1.ip,
									devices0_vendor:d1.vendor,
									devices0_model:d1.model,
									devices0_sn:d1.sn,
									devices0_position:d1.position,
									devices0_room:d1.room,
									devices0_rack:d1.rack,
									devices0_description:d1.description,
									
									port_section1:d2.port_section,
									devices1_id:d2.id,
									devices1_hostname:d2.hostname,
									devices1_ip:d2.ip,
									devices1_vendor:d2.vendor,
									devices1_model:d2.model,
									devices1_sn:d2.sn,
									devices1_position:d2.position,
									devices1_room:d2.room,
									devices1_rack:d2.rack,
									devices1_description:d2.description,
								}
							}
							
							this.seeForm=Object.assign({},setObj);
							console.log(this.seeForm)
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
			editForm(){
				console.log('节点的编辑')
				console.log(this.seeForm)
				console.log(this.baseData)
				var  para={};
				
				if(this.baseData.devices.length ==1){
					para={
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id == this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						device:[
							{
								id:this.seeForm.devices0_id,
								port_section:this.seeForm.port_section0,
								position:this.seeForm.devices0_position,
								room:this.seeForm.devices0_room,
								rack:this.seeForm.devices0_rack,
								description:this.seeForm.devices0_description,
							}
						]
					}
				}else if(this.baseData.devices.length ==2){
					para={
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id==this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						device:[
							{
								id:this.seeForm.devices0_id,
								port_section:this.seeForm.port_section0,
								position:this.seeForm.devices0_position,
								room:this.seeForm.devices0_room,
								rack:this.seeForm.devices0_rack,
								description:this.seeForm.devices0_description,
							},{
								id:this.seeForm.devices1_id,
								port_section:this.seeForm.port_section1,
								position:this.seeForm.devices1_position,
								room:this.seeForm.devices1_room,
								rack:this.seeForm.devices1_rack,
								description:this.seeForm.devices1_description,
							}
						]
					}
				}
				
				
				
				console.log(para)
				//节点界面的 编辑部分的提交的数据
				this.$refs.seeForm.validate(valid => {					
					if(valid){
						this.$confirm('确认要修改吗?','提示',{})
						.then(() => {
							this.$ajax.put('/node/edit_node/'+this.seeForm.id+'?token='+this.token,para)
							.then(res => {
								console.log(res);
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功!',
											type:'success',
										})
										//返回节点数据主页
										this.$router.push({path:'/location/backbone'})
									}else {
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							}).catch(e => {
								console.log(e)
							})
						})
					}
				})
				
			},
			creatForm(){
				console.log('未知节点的添加')
				//未知节点的添加的时候进来的界面
				var para;
				if(!this.equStatusTwo){
					para={
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						devices:[
							{						
								hostname:this.seeForm.devices0_hostname,
								ip:this.seeForm.devices0_ip,
								vendor:this.seeForm.devices0_ip,
								model:this.seeForm.devices0_model,
								sn:this.seeForm.devices0_sn,
								position:this.seeForm.devices0_position,
								room:this.seeForm.devices0_room,
								rack:this.seeForm.devices0_rack,
								description:this.seeForm.devices0_description,
								port_section:this.seeForm.port_section0,
							}
						],
					}
				}else if(this.equStatusTwo){
					para={
//						token:this.token,						
//						id:this.seeForm.id,
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						devices:[
							{
//								id:this.seeForm.devices0_id,							
								hostname:this.seeForm.devices0_hostname,
								ip:this.seeForm.devices0_ip,
								vendor:this.seeForm.devices0_vendor,
								model:this.seeForm.devices0_model,
								sn:this.seeForm.devices0_sn,
								position:this.seeForm.devices0_position,
								room:this.seeForm.devices0_room,
								rack:this.seeForm.devices0_rack,
								description:this.seeForm.devices0_description,
								port_section:this.seeForm.port_section0,
							},
							{
//								id:this.seeForm.devices1_id,							
								hostname:this.seeForm.devices1_hostname,
								ip:this.seeForm.devices1_ip,
								vendor:this.seeForm.devices1_vendor,
								model:this.seeForm.devices1_model,
								sn:this.seeForm.devices1_sn,
								position:this.seeForm.devices1_position,
								room:this.seeForm.devices1_room,
								rack:this.seeForm.devices1_rack,
								description:this.seeForm.devices1_description,
								port_section:this.seeForm.port_section1,
							}
						],
					}
				}
				console.log(para)
				this.$refs.seeForm.validate(valid => {
					if(valid){
						this.$confirm('确认要提交吗?','提示',{})
						.then(() => {
							this.$ajax.post('/node/add_unknown_node'+'?token='+this.token,para)
							.then(res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'添加成功!',
											type:'success'
										})
										this.$store.state.statusname=true;
										this.$router.push('/location/backbone')

									}else{
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							}).catch(e => {
								console.log(e)
							})
						}).catch(() => {})
					}
				})
			},
			unknownEditForm(){
				//未知节点的额编辑
				var para;
				console.log(this.seeForm);
				console.log(this.unknown_editFormData)
				var str=this.unknown_editFormData.devices
				let obj={
					name:'',
					id:''
				}
				if(!this.unknown_editFormData.dc && typeof(this.unknown_editFormData.dc)!='undefined' && this.unknown_editFormData.dc!=0){
					obj={
						name:'',
						id:''
					}
				}else if( typeof(this.unknown_editFormData.dc) === "undefined" ){
					console.log(this.unknown_editFormData.dc)
					obj={
						name:'',
						id:''
					}
				}else{
					obj={
						name:this.unknown_editFormData.dc.name,
						id:this.unknown_editFormData.dc.id
					}
				}
				if(str.length=1){
					para={
						id:this.seeForm.id,
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id==obj.name?obj.id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						devices:[
							{
								id:this.seeForm.devices0_id,							
								hostname:this.seeForm.devices0_hostname,
								ip:this.seeForm.devices0_ip,
								vendor:this.seeForm.devices0_ip,
								model:this.seeForm.devices0_model,
								sn:this.seeForm.devices0_sn,
								position:this.seeForm.devices0_position,
								room:this.seeForm.devices0_room,
								rack:this.seeForm.devices0_rack,
								description:this.seeForm.devices0_description,
								port_section:this.seeForm.port_section0,
							}
						]
					}	
					
				}else if(str.length=2){
//					var d1=str.find((item) => {
//						return item['sign']=='d1'
//					})
//					var d2=str.find((item ) => {
//						return item['sign']=='d2'
//					})
					
					
					
					para={
						id:this.seeForm.id,
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						devices:[
							{
								id:this.seeForm.devices0_id,							
								hostname:this.seeForm.devices0_hostname,
								ip:this.seeForm.devices0_ip,
								vendor:this.seeForm.devices0_vendor,
								model:this.seeForm.devices0_model,
								sn:this.seeForm.devices0_sn,
								position:this.seeForm.devices0_position,
								room:this.seeForm.devices0_room,
								rack:this.seeForm.devices0_rack,
								description:this.seeForm.devices0_description,
								port_section:this.seeForm.port_section0,
							},
							{
								id:this.seeForm.devices1_id,							
								hostname:this.seeForm.devices1_hostname,
								ip:this.seeForm.devices1_ip,
								vendor:this.seeForm.devices1_vendor,
								model:this.seeForm.devices1_model,
								sn:this.seeForm.devices1_sn,
								position:this.seeForm.devices1_position,
								room:this.seeForm.devices1_room,
								rack:this.seeForm.devices1_rack,
								description:this.seeForm.devices1_description,
								port_section:this.seeForm.port_section1,
							}
						]
					}
				}
				console.log(para)
				this.$refs.seeForm.validate(valid => {
					if(valid){
						this.$confirm('确认要修改吗?','提示',{})
						.then(() => {
							this.loading=true;
							this.$ajax.put('/node/edit_unknown_node/'+para.id+'?token='+this.token,para)
							.then(res => {
								this.loading=false;
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功!',
											type:'success'
										})

										this.$store.state.statusname=true;
										this.$router.push('/location/backbone')

									}else{
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							}).catch(e => {
								console.log(e)
							})
						}).catch( () => {})
					}
				})
			},
			getUnknownDetail(id){
				
				//获取未知节点的详情
				this.loading=true;				
				this.$ajax.get('/node/unknown_node_info/'+id+'?token='+this.token)
				.then(res => {
					this.$refs['seeForm'].resetFields();
					this.loading=false;
					if(res.status==200){
						if(res.data.status==0){
							console.log(res);
							
							this.unknown_editFormData=Object.assign({},res.data.data)
							var unknownSee;
							unknownSee=res.data.data;
							var d1=unknownSee.devices.find( item => {
								return item['sign'] == 'd1'
							})
							if(unknownSee.devices.length==1){
								this.equStatusTwo=false;
								this.seeForm={
									id:unknownSee.id,
									name:unknownSee.name,
									vtep:unknownSee.vtep,
									devices0_id:d1.id,
									devices0_hostname:d1.hostname,
									devices0_ip:d1.ip,
									devices0_vendor:d1.vendor,
									devices0_model:d1.model,
									devices0_sn:d1.sn,
									devices0_position:d1.position,
									devices0_room:d1.room,
									devices0_rack:d1.rack,
									devices0_description:d1.description,
									port_section0:d1.port_section,
//										dc_id:unknownSee.dc.id,
//										dc_name:unknownSee.dc.name,
								}
							}else if(unknownSee.devices.length=2){
								this.equStatusTwo=true;
								var d1=unknownSee.devices.find( item => {
									return item['sign'] == 'd1'
								})
								var d2=unknownSee.devices.find( item => {
									return item['sign'] == 'd2'
								})
								this.seeForm={
//										dc_id:unknownSee.dc.id,
									id:unknownSee.id,
									name:unknownSee.name,
									vtep:unknownSee.vtep,
				
									devices0_id:d1.id,
									devices0_hostname:d1.hostname,
									devices0_ip:d1.ip,
									devices0_vendor:d1.vendor,
									devices0_model:d1.model,
									devices0_sn:d1.sn,
									devices0_position:d1.position,
									devices0_room:d1.room,
									devices0_rack:d1.rack,
									devices0_description:d1.description,
									port_section0:d1.port_section,
				
									devices1_id:d2.id,
									devices1_hostname:d2.hostname,
									devices1_ip:d2.ip,
									devices1_vendor:d2.vendor,
									devices1_model:d2.model,
									devices1_sn:d2.sn,
									devices1_position:d2.position,
									devices1_room:d2.room,
									devices1_rack:d2.rack,
									devices1_description:d2.description,
									port_section1:d2.port_section,
			
//										dc_id:unknownSee.dc.id,
//										dc_name:unknownSee.dc.name,
								}
							}
							if(res.data.data.dc){
								this.seeForm.dc_id=res.data.data.dc.name;
							}
							
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			goback(){
				console.log('kkk')
				this.$store.state.statusname=false;
				this.$router.push('/location/backbone')
				
			},
			unknowgoback(){
//				this.$store.state.statusname=true;
//				this.$router.push('/location/backbone')
				console.log('lll')
////				this.$router.go(-1)
				if(this.backstatus==true) {
					this.$store.state.statusname=false;
					this.$router.push('/location/backbone')
				}else {
					this.$store.state.statusname=true;
					this.$router.push('/location/backbone')
				}

			}
		},
	}
</script>

<style scoped="scoped">
	.footer_right{
		margin-left: 60%;
		margin-top: 20px;
	}
</style>