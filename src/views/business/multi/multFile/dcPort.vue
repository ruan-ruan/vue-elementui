<template>
	<div>
		<!--数据中心的端口-->
		<el-form :model='editForm' ref='editForm':rules='editFormRules'label-position='left' v-loading='editLoading' label-width='100px'>
			<el-form-item label='节点名称' prop='nodeName'>
				<el-select v-model='editForm.nodeName' filterable  @change='selectNode(editForm.nodeName)' class='ipt'>
					<el-option v-for='(item ,index) in nodeData'
						:label='item.name'
						:value='item.id'
						:key='index'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='逻辑口' prop='logic'>
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
			<el-form-item label='逻辑口类型' prop='endpoints_vlan'>
				<template>
					<el-radio-group v-model='editForm.endpoints_vlan'>
						<el-radio-button size='small' v-for='item in portType'
							:label='item.label'
							:value='item.value'
							:key='item.value'></el-radio-button>
					</el-radio-group>
				</template>
			</el-form-item>
			<el-form-item label='vlan'prop='vlan' v-if='editForm.endpoints_vlan==="trunk"? true :false '>
				<template>
					<el-input v-model='editForm.vlan' v-show='false'></el-input>
					<el-switch v-model='editForm.chooseVlan'
						active-text="UNTAG"
						title='默认逻辑口为trunk,vlan为UNTAG'></el-switch>	
						<el-button v-text=' editForm.logic==""?"选择vlan": (editForm.selVlan ? editForm.selVlan:"选择vlan")'
							size='small' 
							@click='addVlan' 
							title='请先选择节点和逻辑口'
							:disabled=' editForm.logic === "" ? true : false '
							v-if='!editForm.chooseVlan'></el-button>
				</template>		
			</el-form-item>
		</el-form>

		<el-dialog style='width: 100%;' :title='textMap[dialogStatus]' :visible.sync="dialogFormVisible":close-on-click-modal="false" v-loading='vlanLoading' >
			<el-form   :model='portVlan' ref='portVlan'>
				<el-form-item>
					<template>
						<span>逻辑口:</span>
						<span>{{logicDetails.name}}</span>
					</template>
					<br />
					<template>
						<span>逻辑口状态:</span>
						<span>{{logicDetails.portStatus}}</span>
					</template>
					<template>
						<el-input v-model='portVlan.vlanName' placeholder='请输入vlan号'class='details'></el-input>
						<el-button size='small' type='primary' @click='getVlan'>搜索</el-button>
					</template>
					<template>
						<span>VLAN区间</span>
						<el-select v-model='portVlan.selVlanVal'placeholder='请选择vlan区间'class='details'>
							<el-option v-for='(item,index) in vlanInterval'
								:value='item.value'
								:label='item.label'
								:key='index'></el-option>
						</el-select>
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
						
						
						<div id="barcon">
							<span class='spn_tit'>共{{vlanData.length}}条记录{{totalPage}}页</span>
							<span @click='goPaseSize(1,100)' class="spn">首页</span>
							<span @click='goPaseSize(currentPage-1>0?currentPage-1:1,100)' class="spn" >上一页</span>
							<span v-for='(item,index) in pageVal'
								:key='index' @click='goPaseSize(item,100)'class="spn">{{item}}</span>
							<span @click='goPaseSize(currentPage+1<totalPage?currentPage+1:totalPage,100)'class="spn">下一页</span>
							<span @click='goPaseSize(6,100)'class="spn">尾页</span>
						</div>
					</template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				 <el-button size='small' @click.native="dialogFormVisible=false">取消</el-button>
				 <el-button size='small' type='primary' @click='creatVlan'>保存</el-button>
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
//				if(this.baseObj){
//					if(this.baseObj.statusVal == 0 && this.editForm.chooseVlan){
//						callback(new Error('当前端口已为UNTAG端口'))
//					}
//				}else
				if(! value){
					callback(new Error('不能为空'))
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
					nodeName:[  { required: true, message: '请选择节点', trigger: 'change' }],
					
					logic:[  { required: true,  validator:logic_port ,trigger: 'change' }],
					
					endpoints_vlan:[  { required: true, message: '请选择逻辑口类型', trigger: 'change' }],
//					vlan:[  { required: true, message: '请选择vlan', trigger: 'change' }],
				},
				portType:[{label:'透传',value:'-1'},{label:'trunk',value:'0'}],//逻辑口的类型
				textMap:{
					title:'添加'
				},
				dialogStatus:'',
				dialogFormVisible:false,
				portVlan:{
					vlanName:'',
					selVlanVal:'1-600',
					vlanVal:'',
				},
				vlanLoading:false,
				vlanData:[],//保存选择vlan号区间的所有的数据
				vlanVal:[],//保存所选取的vlan的区间的前后的字符串
				portType:[{label:'透传',value:'-1'},{label:'trunk',value:'0'}],
				vlanInterval:[{label:'1-600',value:'1-600'},{label:'601-1200',value:'601-1200'},{label:'1201-1800',value:'1201-1800'},
				{label:'1801-2400',value:'1801-2400'},{label:'2401-3000',value:'2401-3000'},{label:'3001-3600',value:'3001-3600'},{
				label:'3601-4094',value:'3601-4094'},],//数据中心互联的是偶是这个区间段  ali和腾讯vlan根据列表进行手添加就可以了
				timeIndex:null,
				//自定义分页
				totalPage:0,//一共有几页
				currentPage:0,//当前是第几页   默认的显示的是第一页
				pageSize:0,//每页显示数量
				pageVal:[1,2,3,4,5,6],
				nodeData:[],//获取节点的数据
				logicPort:[],//逻辑口的数据
				logicDetails:{},//获取逻辑口的详情
				nodeVal:[],
				disabeldData:[],//vlan不可用的数据
				disVlan:[],
				itable:null,
				pointData:[],//获取所有的点到点的所有数据，用来判断里面的逻辑口的状态 //获取组网的数据列表   也是为了获取逻辑口的数据  
				baseObj:{},
				cloudLogic:[],//获取云对接链路列表里所有的逻辑口，将不可在用于开通业务
			}
		},
		watch:{
			
			'portVlan.selVlanVal':function(newVal,oldVal){
				this.vlanVal=this.portVlan.selVlanVal.split('-');
				this.vlanData=this.getData(parseInt(this.vlanVal[0]),parseInt(this.vlanVal[1]));
				this.disVlan=JSON.parse(JSON.stringify(this.conversion(this.vlanData))); 

			},
			baseObj:{
				handler(newVal,oldVal){
					console.log(newVal)
				},
				deep:true
			},
			editForm:{
				handler(newVal,oldVal){	
					console.log(newVal);
					console.log(oldVal)
					console.log(this.baseObj);
////					验证逻辑口
					if(newVal.endpoints_vlan == '透传' ){
						console.log('touchuan')
						if(JSON.stringify(this.baseObj) != '{}'){
//							console.log('kkkk')
							if(this.baseObj.statusVal>= 0){//当为trunk模式
								this.$message({
									message:'请重新选择,该逻辑口已经选择trunk模式，不能再选择透传模式',
									type:'warning'
								})

								newVal.logic='';
								newVal.vlan='';
							}else if(this.baseObj.statusVal < 0){
								this.$message({
									message:'请重新选择,该逻辑口已经选择透传模式，不能再选择透传模式',
									type:'warning'
								})
								newVal.logic='';
								newVal.vlan='';
							}
						}else{//为透传模式
							newVal.selVlan=-1;
							newVal.vlan=-1; 

						}
					}else if(newVal.endpoints_vlan == 'trunk'){
						

						if(newVal.chooseVlan){
							console.log('天润k')
							if(JSON.stringify(this.baseObj) != '{}'){
								if(this.baseObj.statusVal == 0){
									console.log('untage')
									this.$message({
										message:'该逻辑口已经为UNTAG模式，不可在为该模式！',
										type:'warning'
									})
									newVal.logic='';
									newVal.vlan='';
									newVal.selVlan=''
								}else if(this.baseObj.statusVal < 0){
									this.$message({
										message:'该逻辑口已经为trunk模式，不可在为透传模式！',
										type:'warning'
									})
								}else if(this.baseObj.statusVal > 0){
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
			'editForm.logic':function(newVal,oldVal){
				console.log(newVal)
			},
			sendForm:{
				handler(newVal,oldVal){
					console.log(newVal)
					this.$emit('sendFormData',newVal)
					this.$emit('sendFormData_a',newVal)
					this.$emit('sendFormData_z',newVal)
				},
				deep:true,
			},
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.vlanVal=this.portVlan.selVlanVal.split('-');
			this.vlanData=this.getData(parseInt(this.vlanVal[0]),parseInt(this.vlanVal[1]));
			this.disVlan=JSON.parse(JSON.stringify(this.conversion(this.vlanData))); 
			this.getformData();
			if(typeof this.tit !=='undefined'){
				this.textMap.title=this.tit;
			}
	
			
		},
		methods:{
			
			conversion(data){
				let disData=this.disabeldData
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
			      			console.log(res)
			      			var str=res.data.data.items;
			      			str.forEach(ele => {
			      				ele.endpoints.forEach(item => { //用statusVal   来判断   该逻辑口的状态
			      					item.logic_port.statusVal=item.vlan;
			      					this.pointData.push(item.logic_port);
			      				})
			      			})
			      			console.log(this.pointData)
			      		}
			      	}
			    }) .catch(e => { console.log(e) })
			    
			    this.$ajax.get('/vll/multi_vlls'+'?token='+this.token)
			    .then(res => {
			    	if(res.status==200){
			    		if(res.data.status==0){
			    			console.log(res)
			    			var str=res.data.data.items;
			    			str.forEach(ele => {
			    				ele.endpoints.forEach( item => {
			    					item.logic_port.statusVal=item.vlan;
			      					this.pointData.push(item.logic_port);
			    				})
			    			})
			    		}
			    	}
			    }).catch(e => {console.log(e)})
			    
			    this.cloudLogic=[];
			    var obj={}
			    //获取云对接链路里面的数据  cloudLogic
			    this.$ajax.get('/link/cloud_links'+'?token='+this.token)
			    .then(res => {
			    	console.log(res);
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
				this.logicPort=[]
				var para={
					search_node:ids,
					search_usable:true,
				}
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,para)
				.then(res => {
					console.log(res)
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							//pointData
<<<<<<< HEAD

							console.log(this.pointData)
							res.data.data.items.forEach(ele => {
								let strVal={};
								if(isPortStatus(ele.physical_ports)=='UP'){
									strVal.statusColor='statusUP'
								}else if(isPortStatus(ele.physical_ports)=='DOWN'){
									strVal.statusColor='statusDOWN'
								}else if(isPortStatus(ele.physical_ports)=='异常'){


=======
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
>>>>>>> 472df4b589afb81fe5c1adb75c5e3ca8cbc98ffd
									strVal.statusColor='statusAbno'
								}
								let portObj={
									id:ele.id,
									name:ele.name,
<<<<<<< HEAD
									status:isPortStatus(ele.physical_ports),


=======
									status:getPortStatus(staus),
>>>>>>> 472df4b589afb81fe5c1adb75c5e3ca8cbc98ffd
									statusColor:strVal.statusColor,
									statusVal:2,//statusVal  根据点到点的列表的数据   来判断该逻辑口的是否为可用的 默认的逻辑扣是全部可用的
								}
								this.logicPort.push(portObj)
							})
//							console.log(this.logicPort)
							this.logicPort= this.logicPort.filter(item => {//将云对接的所有的列表内的逻辑口用过的删除
							     let idList= this.cloudLogic.map(v => v.id)
							     return !idList.includes(item.id)
							})
							
//							console.log(this.pointData)
							for(var item1 of this.logicPort){
								for(var item2 of this.pointData){
									if(item1.id == item2.id){
										item1.statusVal=item2.statusVal
									}
								}
							}
<<<<<<< HEAD

=======
>>>>>>> 472df4b589afb81fe5c1adb75c5e3ca8cbc98ffd
						}
					}
				}).catch(e => {console.log(e)})
			},
			selecLogic(ids){//获取逻辑口的id，可用与选择的vlan的时候里面的信息的展示
				this.$ajax.get('/port/logic_port_info/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
//							isPortStatus   logicPort
							
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

				console.log(this.pointData);

				
				var obj1=this.pointData.filter(item => {
					return item.id == ids;
				})
				console.log(obj)
				this.baseObj={};
				if(typeof obj1 !='undefined'){
					this.baseObj=obj1
				}


				//获取逻辑口下的vlan的信息
				this.$ajax.get('/vll/get_disable_vlan/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.disabeldData=res.data.data;
							this.disVlan=JSON.parse(JSON.stringify(this.conversion(this.vlanData))); 
						}
					}
				})
				.catch(e =>{
					console.log(e)
				})
				
			},
			addVlan(){//选择vlan
				this.dialogStatus='title'
				this.dialogFormVisible=true;	

				this.goPaseSize(1,100)
			},
			getData(start,end){
				//获取选择的vlan的区间的时候转换为数据
				let strVal=[];
				for (let i=start;i<end+1;i++) {
					strVal.push(i)
				}
				//将获取的vlan的不可用的区间标识出来
				
				return strVal
			},
			cliData:function(index,val){//activeCla   disVlan   disabeldData
				this.disVlan.forEach(ele => {
					if(ele.value===val && ele.clas !=="active"){
						ele.clas='activeCla'
//						this.timeIndex=index;
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
			goPaseSize(pno=1,psize=100){
//				let itable=document.getElementById('idData').getElementsByTagName("span");//bor_data
				let itable=document.getElementById('idData').getElementsByClassName('bor_data');
//				let itable=this.itable;
				this.totalPage=0;
				this.pageSize=psize;
				let num=itable.length;
			        //总共分几页 
			    if(num/this.pageSize > parseInt(num/this.pageSize)){   
			        this.totalPage=parseInt(num/this.pageSize)+1; 
					
			    }else{   
			        this.totalPage=parseInt(num/this.pageSize);   
			    }
			    this.currentPage=pno;//当前页数
			    var startRow = (this.currentPage - 1) * this.pageSize+1;//开始显示的行  31 
			    var endRow = this.currentPage * this.pageSize;//结束显示的行   40
			    endRow = (endRow > num)? num : endRow;    //40
			    for(var i=1;i<(num+1);i++){    
			        var irow = itable[i-1];
			        if(i>=startRow && i<=endRow){
			            irow.style.display = "inline-block";    
			        }else{
			            irow.style.display = "none";
			        }
			    }
			},
			selectData(start,end){//获取选择的vlan的区间的时候转换为数据
				let strVal=[];
				for (let i=start;i<end+1;i++) {
					strVal.push(i)
				}
				return strVal;//将获取的vlan的不可用的区间标识出来
			},
			getVlan(){
				//获取所有的vlan区间内的数据
				let obj={};
				let  strVal=[];
				let numVla=parseInt(this.portVlan.vlanName);
				let str=['1-600','601-1200','1201-1800','1801-2400','2401-3000','3001-3600','3601-4094'];
				if(parseInt(this.portVlan.vlanName)>=1&&parseInt(this.portVlan.vlanName)<=4094){
					for(let index in str){
						if(numVla>=parseInt(str[index].split('-')[0])&&numVla<=parseInt(str[index].split('-')[1])){
							this.portVlan.selVlanVal=str[index];
						}
					}
				}else if(parseInt(this.portVlan.vlanName)<1||parseInt(this.portVlan.vlanName)>4094){
					this.$message({
						message:'该号不在区间内！',
						type:'warning'
					})
				}else{
					return
				}
			},
			creatVlan(){
				//设置vlan号的时候保存
				if(this.portVlan.vlanVal){
					this.editForm.selVlan=this.portVlan.vlanVal;
					this.editForm.vlan=this.portVlan.vlanVal;
					this.$message({
						message:'选择成功！',
						type:'success'
					})
					this.dialogFormVisible=false;
					
				}else{
					this.$message({
						message:'vlan值不能为空!',
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
	.v-modal{
		z-index: 2000 !important;
	}
	#barcon{
		text-align: center;
	}
	.spn{
		cursor: pointer;
		color: #2B8CFC;
		display: inline-block;
		margin-left: 5px;
	}
	.spn_tit{
		font-family: "微软雅黑";	
		font-weight: bold;	
	}
	.spn_val{
		text-align: right;
		margin-right: 5px;
	}
	.bor_data{
		width: 60px;
		margin: 2px 1px !important;
		/*margin-left: 1px !important;
		margin-top:2px !important;*/
		
	}
	.details{
		width: 150px;
	}
</style>