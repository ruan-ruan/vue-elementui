<template>
	<div>
		<!--<el-button size='small' @click='unknowgoback' v-if='typeof title != "undefined"? false : typeof editId!="undefined"?false: !unkownBtn'  >
			{{$t('Public.goback')}}
		</el-button>-->
		<goback  v-if='typeof title != "undefined"? false : typeof editId!="undefined"?false: !unkownBtn' ></goback>
		<section>
				<el-form style='margin-left: 50px;' :model='seeForm'ref='seeForm' label-width="200px"  v-loading='loading' :rules='rulesForm'>
					<el-row>
						<el-col :span='24'>
							<el-col :span='12'>
								
								<el-form-item :label='$t("Public.backboneName")+"："' prop='name'>
									<el-input v-model='seeForm.name' :disabled='StaEditForm'class='ipt'placeholder='请输入骨干名称'></el-input>
								</el-form-item>
								<el-form-item label='Vtep:'prop='vtep'>
									<el-input v-model='seeForm.vtep' :disabled='StaNot'class='ipt'placeholder='请输入vtep'></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12'>								
								<el-form-item :label='$t("Public.dataCen")+"："' prop='dc_id'>
									<el-input v-model='seeForm.dc_id' :disabled='StaEditForm' v-show='StaEditForm' class='ipt'></el-input>
									<el-select v-model='seeForm.dc_id' @change="change" filterable class='ipt' v-show='!StaEditForm' placeholder='请选择数据中心'>
										<el-option v-for='item in itemData'
											:value='item.id'
											:key='item.name'
											:label='item.name'>
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item :label='$t("Public.userVlan")+"："' prop='user_vlan'>
									<el-input v-model='seeForm.user_vlan' :disabled='StaNot'class='ipt'></el-input>
									<span class='cli_toTip' :title='$t("Public.vlanLen")'>*?</span>
								</el-form-item>
							</el-col>
						</el-col>
						<!--equStatusTwo = !equStatusTwo-->
						<el-button size='small' type='success' @click='changeDevice' v-show='addEquipStatus' v-text='equStatusTwo?$t("Public.packUpDeviceTwo"):$t("Public.addphyDeviceTwo")' ></el-button>
						<el-col :span='24'>		
							<el-col :span='12' class='equipment'>
								<h4>{{$t('Public.phyDeviceOne')}}:</h4>
								<el-form-item :label='$t("Public.deviceName")+"："'prop='devices0_hostname'>
									<el-input v-model='seeForm.devices0_hostname':disabled='StaNot' class='ipt' :placeholder='$t("validateMes.place")+$t("Public.deviceName")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.manageIP")+"："'prop='devices0_ip'>
									<el-input v-model='seeForm.devices0_ip':disabled='StaNot' class='ipt':placeholder='$t("validateMes.place")+$t("Public.manageIP")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.vendor")+"："' prop='devices0_vendor'>
									<el-input v-model='seeForm.devices0_vendor':disabled='StaNot'class='ipt':placeholder='$t("validateMes.place")+$t("Public.vendor")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.snNumber")+"："' prop='devices0_sn'>
									<el-input v-model='seeForm.devices0_sn':disabled='StaNot'class='ipt':placeholder='$t("validateMes.place")+$t("Public.snNumber")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.deviceModel")+"："' prop='devices0_model'>
									<el-input v-model='seeForm.devices0_model':disabled='StaNot'class='ipt':placeholder='$t("validateMes.place")+$t("Public.deviceModel")'></el-input>
								</el-form-item>
								<!--业务端口区间-->
								<el-form-item :label='$t("Public.portSection")+"："' prop='port_section0'>
									<template>						
										<el-input v-model='seeForm.port_section0'class='ipt':disabled='StaEditForm' :placeholder='$t("Public.place1")'></el-input>
										<span class="cli_toTip":title='portRules'>*?</span>
									</template>
								</el-form-item>
								<el-form-item :label='$t("Public.position")+"："'>
									<el-input v-model='seeForm.devices0_position':disabled='StaEditForm'class='ipt':placeholder='$t("Public.position")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.room")+"："'>
									<el-input v-model='seeForm.devices0_room':disabled='StaEditForm'class='ipt':placeholder='$t("Public.room")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.rack")+"："'>
									<el-input v-model='seeForm.devices0_rack':disabled='StaEditForm'class='ipt':placeholder='$t("Public.rack")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.description")+"："'>
									<el-input type="textarea" v-model='seeForm.devices0_description'rows='4':disabled='StaEditForm':placeholder='$t("Public.place150")' maxlength='150'class='ipt' ></el-input>
								</el-form-item>
							</el-col>
							<el-col :span='12' class='equipment'v-if='equStatusTwo'>
								<h4>{{$t("Public.phyDeviceTwo")}}</h4>
								<el-form-item :label='$t("Public.deviceName")+"："' prop='devices1_hostname'>
									<el-input v-model='seeForm.devices1_hostname':disabled=' typeof editId!="undefined"?baseData.devices !==undefined && baseData.devices.length ==1 ?false:true:StaNot' class='ipt'  :placeholder='$t("validateMes.place")+$t("Public.deviceName")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.manageIP")+"："'prop='devices1_ip'>
									<el-input v-model='seeForm.devices1_ip':disabled=' typeof editId!="undefined"?baseData.devices !==undefined && baseData.devices.length ==1 ?false:true:StaNot' class='ipt':placeholder='$t("validateMes.place")+$t("Public.manageIP")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.vendor")+"："'prop='devices1_vendor'>
									<el-input v-model='seeForm.devices1_vendor':disabled=' typeof editId!="undefined"?baseData.devices !==undefined && baseData.devices.length ==1 ?false:true:StaNot'class='ipt' :placeholder='$t("validateMes.place")+$t("Public.vendor")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.snNumber")+"："' prop='devices1_sn'>
									<el-input v-model='seeForm.devices1_sn':disabled=' typeof editId!="undefined"?baseData.devices !==undefined && baseData.devices.length ==1 ?false:true:StaNot'class='ipt':placeholder='$t("validateMes.place")+$t("Public.snNumber")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.deviceModel")+"："'prop='devices1_model'>
									<el-input v-model='seeForm.devices1_model':disabled=' typeof editId!="undefined"?baseData.devices !==undefined && baseData.devices.length ==1 ?false:true:StaNot'class='ipt':placeholder='$t("validateMes.place")+$t("Public.deviceModel")'></el-input>
								</el-form-item>
								<!--业务端口区间-->
								<el-form-item :label='$t("Public.portSection")+"："' prop='port_section1'>
									<template>
										<el-input v-model='seeForm.port_section1'class='ipt':disabled='typeof editId!="undefined"?false:StaEditForm'  :placeholder='$t("Public.place2")'></el-input>
										<span class="cli_toTip":title='portRules'>*?</span>
									</template>
								</el-form-item>
								<el-form-item :label='$t("Public.position")+"："'>
									<el-input v-model='seeForm.devices1_position':disabled='typeof editId!="undefined"?false:StaEditForm'class='ipt':placeholder='$t("Public.position")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.room")+"："'>
									<el-input v-model='seeForm.devices1_room':disabled='typeof editId!="undefined"?false:StaEditForm'class='ipt':placeholder='$t("Public.room")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.rack")+"："'>
									<el-input v-model='seeForm.devices1_rack':disabled='typeof editId!="undefined"?false:StaEditForm'class='ipt':placeholder='$t("Public.rack")'></el-input>
								</el-form-item>
								<el-form-item :label='$t("Public.description")+"："'>
									<el-input type="textarea" v-model='seeForm.devices1_description'rows='4':disabled='typeof editId!="undefined"?false:StaEditForm':placeholder='$t("Public.place150")' maxlength='150'class='ipt' ></el-input>
								</el-form-item>
							</el-col>
						</el-col>
					</el-row>					
				</el-form>
				<div slot='footer' class="dialog-footer footer_right">
					<el-button size='small' @click='goback' v-if='editFormBtn' >{{$t('Public.goback')}}</el-button>
					
					<el-button size='small' @click='unknowgoback' v-if='typeof title != "undefined"? false : unkownBtn'  >{{$t('Public.goback')}}</el-button>
					<!--节点的编辑保存-->
					<el-button size='small' v-if='editFormBtn' @click='editForm' type="primary">{{$t('tabOperation.save')}}</el-button>
					<!--未知节点的添加按钮-->
					<el-button size='small' v-if='creatFormBtn' @click='creatForm'type='primary'>{{$t('tabOperation.save')}} </el-button>
					<!--未知节点的编辑按钮-->
					<el-button size='small' v-if='unknownStatusBtn' @click='unknownEditForm' type='primary'>{{$t('tabOperation.save')}}</el-button>
				</div>
				
		</section>
	</div>
</template>

<script>
	import goback from '@/components/goback'
	import {isValidNumber,isTest,isVlan,isValidIP} from '@/assets/js/index.js'
	export default{
		name:'node',
		//这里的title是节点的额详情的时候额界面
		props:['title'],
		components:{
			goback
		},
		data(){
			let validIP = (rule,value,callback) => {
				if(value == ''){
					callback(new Error(this.$t('Public.plaSureIp')))
				}else if(!isValidIP(value)){
					callback(new Error(this.$t('Public.plaIP')))
				}else{
					callback()
				}
			};
			let validcodeID =(rule,value,callback) => {
				if(value==''){
					callback(new Error(this.$t('validateMes.place')+this.$t('Public.id')))
				}else{
					callback()
				}
			};
			let validNumber = (rule,value,callback) => {
				if(!value){
					callback(new Error(this.$t('Public.PortNum')))
				}else if(!isTest(value).bool){
					callback(new Error(this.$t('Public.portRulestip')))
				} else {
					callback()
				}
			};
			var vlanNumber= (rule,value,callback) => {
				if(!value){
					callback(new Error(this.$t('Public.vlanNum')))
				}else if(!isVlan(value).bool){
					callback(new Error(this.$t('Public.vlanRulestip')))
				} else {
					callback()
				}
			};
			return{
				portRules:this.$t('Public.portRules'),
				//获取用户的权限信息
				token:'',
				//这是在节点编辑的时候传过来的值
				editId:this.$route.query.edtiID,
				//未知节点的添加
				unknown_id:this.$route.query.name,
				//接收未知节点的里面的详情的id
				unknownID:this.$route.query.unknownID,
				//未知节点的编辑
				unknown_editFormID:this.$route.query.unknownEditID,

				timeVal:'',
				seeForm:{
					id:'',
					name:'',
					vtep:'',
					user_vlan:'',
					
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
					name:[{ required: true, message: this.$t('validateMes.place')+this.$t('Public.nodeName'), trigger: 'blur' }],
					dc_id:[{ required: true, message: this.$t('validateMes.placeCh')+this.$t('Public.dataCen'), trigger: 'change' }],
					vtep:[{ required: true, message:this.$t('validateMes.place')+ 'vtep', trigger: 'blur' }],
					user_vlan:[{ required: true, trigger: 'blur', validator: vlanNumber }],
					
					devices0_id:[{ required: true, message: this.$t('Public.plaDeviceID'), trigger: 'blur' },
					{validator:validcodeID,trigger:'blur'}],
					devices0_hostname:[{ required: true, message:this.$t('validateMes.place')+this.$t('Public.deviceName'), trigger: 'blur' }],
					devices0_vendor:[{ required: true, message: this.$t('validateMes.place')+this.$t('Public.vendor'), trigger: 'blur' }],
					devices0_sn:[{ required: true, message: this.$t('validateMes.place')+this.$t('Public.snNumber'), trigger: 'blur' }],
					devices0_ip:[{ required: true, validator: validIP, trigger: 'blur' }],
					devices0_model:[{ required: true, message: this.$t('validateMes.place')+this.$t('Public.deviceModel'), trigger: 'blur' }],
					devices1_id:[{ required: true, message: this.$t('Public.plaDeviceID'), trigger: 'blur' },
					{validator:validcodeID,trigger:'blur'}],
					devices1_hostname:[{ required: true, message:this.$t('validateMes.place')+this.$t('Public.deviceName'), trigger: 'blur' }],
					devices1_vendor:[{ required: true, message:this.$t('validateMes.place')+this.$t('Public.vendor'), trigger: 'blur' }],
					devices1_sn:[{ required: true, message:this.$t('validateMes.place')+this.$t('Public.snNumber'), trigger: 'blur' }],
					devices1_ip:[{ required: true,validator: validIP, trigger: 'blur' }],
					devices1_model:[{ required: true, message: this.$t('validateMes.place')+this.$t('Public.deviceModel'), trigger: 'blur' }],
					
					
					port_section0:[{ required: true, trigger: 'blur', validator: validNumber }],
					port_section1:[{ required: true,  trigger: 'blur' , validator: validNumber}],
					
				},
				//当进去编辑部分的时候，这个时候对应的该属性是可以编辑的，并且保存按钮的控制
				StaEditForm:false,
				//编辑部分的显示的不可编辑的部分，默认为是不可以编辑的,并且控制确定按钮的实现和隐藏
				StaNot:true,
				loading:false,
				//设备2默认时候是隐藏，当只有一个设备的时候，这个时候设备2隐藏
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

				unkownBtn:false,
				
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
				this.unkownBtn=false;
				this.creatFormBtn=false;
				this.unknownStatusBtn=false;
				this.backstatus=true;
				this.devices_id_status=true;
				this.addEquipStatus=true;
				this.getUsers(this.editId)
				this.getDataCenter()
			}
			if(typeof this.title !='undefined'){
//				('进入详情的界面')
				this.getUsers(this.title)
				this.backstatus=true;
				//此处是节点的详情的界面
				this.StaEditForm=true;
				this.editFormBtn=false;
				this.unkownBtn=true;
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
				this.unkownBtn=true;
				this.creatFormBtn=true;
				this.devices_id_status=false;
				this.addEquipStatus=true;
				this.getDataCenter();
			}
			if(typeof this.unknownID !='undefined'){
				//判断未知节点的详情的时候显示的界面
				this.StaEditForm=true;
				
				this.editFormBtn=false;
				this.unkownBtn=false;
				this.creatFormBtn=false;
				this.unknownStatusBtn=false;
				this.devices_id_status=true;
				this.unknown_editForm_status=true;
				this.addEquipStatus=false;
				//获取未知节点的详情的界面的数据
				this.getUsers(this.unknownID)
//				this.getUnknownDetail(this.unknownID)
			}
			if(typeof this.unknown_editFormID !='undefined'){
				//未知节点的编辑
				this.unknown_editForm_status=false;
				
				this.addEquipStatus=true;
				
				this.StaEditForm=false;
				this.StaNot=false;
				this.editFormBtn=false;
				this.unkownBtn=true;
				this.creatFormBtn=false;
				this.unknownStatusBtn=true;
				this.devices_id_status=true;
				this.getDataCenter();
				this.getUsers(this.unknown_editFormID)
//				this.getUnknownDetail(this.unknown_editFormID)
			}
		},
		mounted(){
			this.bus.$emit('equipment',this.seeForm.devices);
			this.$refs['seeForm'].resetFields();

		},
		methods:{
			changeDevice(){
//				equStatusTwo = !equStatusTwo    false 的时候  显示一个设备
				/**
				 * 在未知节点或者节点编辑的时候 在收起设备2后  对设备2 进行删除的操作   其他的时候不变
				 * */
				if(JSON.stringify(this.baseData) !== '{}' && this.baseData.devices !==undefined && this.baseData.devices.length ==2){
					this.loading=true;
					this.$ajax.del('/node/del_dev/'+this.seeForm.id+'/'+this.seeForm.devices1_id+'?token='+this.token)
					.then(res => {
						this.loading=false;
						if(res.status == 200){
							if(res.data.status == 0){
								this.equStatusTwo=false;
								if(this.unknown_editFormID){
//									this.getUnknownDetail(this.unknown_editFormID)
									this.getUsers(this.unknown_editFormID)
								}
								if(this.editId){
									this.getUsers(this.editId)
								}
							}
						}
					}).catch(e => {
						console.log(e)
					})
				}else{
				
					this.equStatusTwo = !this.equStatusTwo
				}
			},
			change(){
				this.$forceUpdate()
			},
			getDataCenter(){
				this.$ajax.get('/location/dcs'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.itemData=res.data.data.items;
					
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
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
				/**
				 * 节点和未知节点的详情   编辑    数据部分
				 * */
				this.$ajax.get('/node/node_info/'+id+"?token="+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
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
									user_vlan:strData.user_vlan,
									
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
									user_vlan:strData.user_vlan,
									
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
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
			},
			editForm(){
				//当this.equStatusTwo   为true的时候    显示两个设备    this.equStatusTwo为false的时候显示一个设备
				/**未知节点部分的编辑分为以下几种情况：
				 * 		1.编辑部分，原数据 只有一个设备 
				 * 			提交的时候  一个设备   调用编辑
				 * 			提交的时候添加了一个  两个设备  先调用 添加接口 --> 详情接口 --> 编辑接口
				 *		2. 编辑部分的 原数据两个设备
				 *			调用  编辑接口 
				 * */
				
				var  para={};
				if( this.baseData.devices.length ==1 ){
					if(!this.equStatusTwo ){ //一个设备
						para={
							id:this.seeForm.id,
							name:this.seeForm.name,
							dc_id:this.seeForm.dc_id == this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
							vtep:this.seeForm.vtep,
							user_vlan:this.seeForm.user_vlan,
							devices:[
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
						this.changeEdit(true,para);
					}else{//  由一个设备改成两个设备
						para={
							id:this.seeForm.id,
							name:this.seeForm.name,
							dc_id:this.seeForm.dc_id == this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
							vtep:this.seeForm.vtep,
							user_vlan:this.seeForm.user_vlan,
							devices:[
								{						
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
						this.changeEdit(false,para);
						
					}
				}else{
					if(!this.equStatusTwo ){ //两个设备改成 一个设备  需要限制性一次删除
						para={
							id:this.seeForm.id,
							name:this.seeForm.name,
							dc_id:this.seeForm.dc_id == this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
							vtep:this.seeForm.vtep,
							user_vlan:this.seeForm.user_vlan,
							devices:[
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
					}else{//  两个设备
						para={
							name:this.seeForm.name,
							dc_id:this.seeForm.dc_id==this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
							vtep:this.seeForm.vtep,
							user_vlan:this.seeForm.user_vlan,
							devices:[
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
					this.changeEdit(true,para)
					
				}

			},
			changeEdit(type,para){
				
				this.$refs.seeForm.validate(valid => {
					if(valid){
						this.$confirm(this.$t('nav.conEditPwd'),this.$t('confirm.tooltip'),{
							type:'warning'
						})
						.then(() => {
							this.loading=true;
							if(type){// 直接执行编辑接口
								this.$ajax.put('/node/edit_node/'+this.seeForm.id+'?token='+this.token,para)
								.then(res => {
									if(res.status==200){
										if(res.data.status==0){
											this.$message({
												message:this.$t('tooltipMes.editSuccess'),
												type:'success',
											})
											//返回节点数据主页
											this.$router.push({path:'/location/backbone'})
										}
									}
								}).catch(e => {
									console.log(e)
								})
							}else{// 执行   添加   --> 详情 -- > 编辑
								this.$ajax.post('/node/add_dev/'+para.id+'?token='+this.token,para.devices[0])
								.then(res => {
									if(res.status ===200){
										if(res.data.status ===0){
											return this.$ajax.get('/node/node_info/'+para.id+"?token="+this.token)
										}
									}
								})
								.then(res => {
									if(res.status == 200){
										if(res.data.status == 0){
											this.baseData=JSON.parse(JSON.stringify(res.data.data));
											var strData=res.data.data
											if(strData.devices.length==2){
												this.equStatusTwo=true;
												var str=Object.assign([],strData.devices);
												var d1=str.find((item) => {
													return item['sign']=='d1'
												})
												var d2=str.find((item ) => {
													return item['sign']=='d2'
												})
												var setObj={
													id:strData.id,
													name:strData.name,
													vtep:strData.vtep,
													dc_id:strData.dc.name,
													user_vlan:strData.user_vlan,
													
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
											var params={
												id:this.seeForm.id,
												name:this.seeForm.name,
												vtep:this.seeForm.vtep,
												dc_id:this.seeForm.dc_id == this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
												user_vlan:this.seeForm.user_vlan,
												devices:[
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
											};
											return this.$ajax.put('/node/edit_node/'+params.id+'?token='+this.token,params)
										}
									}
								})
								.then(res => {
									this.loading=false;
									if(res.status == 200){
										if(res.data.status == 0){
											
											this.$message({
												message:this.$t('tooltipMes.editSuccess'),
												type:'success',
											})
											//返回节点数据主页
											this.$router.push({path:'/location/backbone'})
										}
									}
								})
								.catch(e => {this.loading=false;console.log(e)})
							}
						}).catch()
						
						
					}
				})
				
			},
			creatForm(){
				
				//未知节点的添加的时候进来的界面
				var para;
				if(!this.equStatusTwo){
					para={
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						user_vlan:this.seeForm.user_vlan,
						devices:[
							{						
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
							}
						],
					}
				}else if(this.equStatusTwo){
					if(this.seeForm.devices0_ip == this.seeForm.devices1_ip){
						this.$message({
							message:this.$t('Public.NoIp'),
							type:'warning'
						})
					}
					para={
//						token:this.token,						
//						id:this.seeForm.id,
						name:this.seeForm.name,
						dc_id:this.seeForm.dc_id,
						vtep:this.seeForm.vtep,
						user_vlan:this.seeForm.user_vlan,
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
			
				this.$refs.seeForm.validate(valid => {
					if(valid){
						this.$confirm(this.$t('confirm.conAdd'),this.$t('confirm.tooltip'),{
							type:'success'
						})
						.then(() => {
							this.$ajax.post('/node/add_unknown_node'+'?token='+this.token,para)
							.then(res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('tooltipMes.addSuccess'),
											type:'success'
										})
										this.$store.state.statusname=true;
										this.$router.push('/location/backbone')

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
				//this.addEquipStatus=true;

				//当this.equStatusTwo   为true的时候    显示两个设备    this.equStatusTwo为false的时候显示一个设备
				/**未知节点部分的编辑分为以下几种情况：
				 * 		1.编辑部分，原数据 只有一个设备 
				 * 			提交的时候  一个设备   调用编辑
				 * 			提交的时候添加了一个  两个设备  先调用 添加接口 --> 详情接口 --> 编辑接口
				 *		2. 编辑部分的 原数据两个设备
				 *			调用  编辑接口 
				 * */
				
				var para;
				var str=this.baseData.devices;//数据备份部分
				let obj={
					name:'',
					id:''
				}
				if(!this.baseData.dc && typeof(this.baseData.dc)!='undefined' && this.baseData.dc!=0){
					obj={
						name:'',
						id:''
					}
				}else if( typeof(this.baseData.dc) === "undefined" ){
					obj={
						name:'',
						id:''
					}
				}else{
					obj={
						name:this.baseData.dc.name,
						id:this.baseData.dc.id
					}
				}
				if(this.baseData.devices !== undefined ){
					if( this.baseData.devices.length == 1  ){ // 编辑的时候  原数据是一个设备
						if(!this.equStatusTwo){// 这个时候  编辑的是一个设备
							para={
								id:this.seeForm.id,
								name:this.seeForm.name,
								dc_id:this.seeForm.dc_id==obj.name?obj.id:this.seeForm.dc_id,
								vtep:this.seeForm.vtep,
								user_vlan:this.seeForm.user_vlan,
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
									}
								]
							}
							this.unChangeEdit(true,para)
						}else{//由一个设备变成了两个设备
							para={
								id:this.seeForm.id,
								name:this.seeForm.name,
								dc_id:this.seeForm.dc_id==obj.name?obj.id:this.seeForm.dc_id,
								vtep:this.seeForm.vtep,
								user_vlan:this.seeForm.user_vlan,
								devices:[
									{						
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
							this.unChangeEdit(false,para)
						}
					}else{//编辑的时候  原数据是两个设备
						if(!this.equStatusTwo){//将两个设备改成  显示一个设备
							para={
								id:this.seeForm.id,
								name:this.seeForm.name,
								dc_id:this.seeForm.dc_id==obj.name?obj.id:this.seeForm.dc_id,
								vtep:this.seeForm.vtep,
								user_vlan:this.seeForm.user_vlan,
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
									}
								]
							}	
						}else if(this.equStatusTwo){
							para={
								id:this.seeForm.id,
								name:this.seeForm.name,
								dc_id:this.seeForm.dc_id==obj.name?obj.id:this.seeForm.dc_id,
								vtep:this.seeForm.vtep,
								user_vlan:this.seeForm.user_vlan,
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
						this.unChangeEdit(true,para)
					}
				}
			},
			unChangeEdit(type,para){
				// type  未知节点编辑的时候需要调用的请求
				if(type){
					//  true的时候  为  调用编辑接口就可以了
					this.$refs.seeForm.validate(valid => {
						if(valid){
							
							this.$confirm(this.$t('nav.conEditPwd'),this.$t('confirm.tooltip'),{
								type:'warning'
							})
							.then(() => {
								this.loading=true;
								this.$ajax.put('/node/edit_unknown_node/'+para.id+'?token='+this.token,para)
								.then(res => {
									this.loading=false;
									if(res.status==200){
										if(res.data.status==0){
											this.$message({
												message:this.$t('tooltipMes.editSuccess'),
												type:'success'
											})
											this.$store.state.statusname=true;
											this.$router.push('/location/backbone')	
										}
									}
								}).catch(e => {
									console.log(e)
								})
								
							}).catch( () => {})
						}
					})
				}else{// 调用  添加   -- > 详情   --> 编辑
					this.$confirm(this.$t('nav.conEditPwd'),this.$t('confirm.tooltip'),{
						type:'warning'
					})
					.then(() => {
						this.loading=true;
						this.$ajax.post('/node/add_dev/'+para.id+'?token='+this.token,para.devices[0])
						.then(res => {
							if(res.status == 200){
								if(res.data.status == 0){
									this.loading=true;
									return this.$ajax.get('/node/node_info/'+para.id+'?token='+this.token);
								}
							}
						})
						.then(res => {
							if(res.status == 200){
								if(res.data.status == 0){
									this.baseData=Object.assign({},res.data.data);
									var str=res.data.data;
									var d1=str.devices.find(item => {
										return item['sign'] == 'd1'
									})
									var d2=str.devices.find(item => {
										return item['sign'] == 'd2'
									})
									this.seeForm={
										id:str.id,
										name:str.name,
										vtep:str.vtep,
										user_vlan:str.user_vlan,
										
					
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
									}
									if(res.data.data.dc){
										this.seeForm.dc_id=res.data.data.dc.name;
									}
									var params={
										id:this.seeForm.id,
										name:this.seeForm.name,
										vtep:this.seeForm.vtep,
										user_vlan:this.seeForm.user_vlan,
										dc_id:this.seeForm.dc_id==this.baseData.dc.name?this.baseData.dc.id:this.seeForm.dc_id,
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
									return this.$ajax.put('/node/edit_unknown_node/'+para.id+'?token='+this.token,params);
								}
							}
						})
						.then(res => {
							this.loading=false;
							if(res.status ==200){
								if(res.data.status == 0){
									this.loading=false;
									this.$message({
										message:this.$t('tooltipMes.editSuccess'),
										type:'success'
									})
									this.$store.state.statusname=true;
									this.$router.push('/location/backbone')
								}
							}
						})
						.catch(e => {
							this.loading=false;
							console.log(e)
						})
					}).catch()
					
				}
			},
			goback(){
				
				this.$store.state.statusname=false;
				this.$router.push('/location/backbone')
				
			},
			unknowgoback(){

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