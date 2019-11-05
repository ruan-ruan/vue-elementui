<template>
	<div>
		<section>

			<el-form :model='editForm' ref='editForm' :rules='editFormRules' v-loading='editLoading' label-width='140px'>
				<el-row>
					<el-col :span='24'>
						<!--<el-col :span='12'>-->
							<h3 class="tit_h3" v-if='clounStatus'>云链路基础信息配置</h3>
							<el-form-item label='公有云' prop='type'>
								<template>
									<el-autocomplete class='ipt' :disabled='!clounStatus'
									  	popper-class="my-autocomplete"
									  	v-model="editForm.type"
									  	:fetch-suggestions="querySearch"
									  	placeholder="请输入内容"
									  	@select="handleSelect" >
									  	<template slot-scope="{ item }">
	                      					<span >{{item.value}}</span>
									  	</template>
									</el-autocomplete>
									<span class="cli_toTip" title="请正确填写公有云名称，否则将会影响拓扑图的效果展示">?</span>	
								</template>
							</el-form-item>
							<el-form-item label='云链路名称'prop='name'>
								<el-input v-model='editForm.name'class='ipt' :disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='区域' prop='region'>
								<el-input v-model='editForm.region'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='接入点' prop='access_point'>
								<el-input v-model='editForm.access_point'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='带宽' prop='bandwidth'>
								<el-input v-model='editForm.bandwidth'class='ipt':disabled='!clounStatus'></el-input> Gbps
							</el-form-item>
							<el-form-item label='备注'prop='description'>
								<el-input type='textarea' v-model='editForm.description'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<h3 class="tit_h3" v-if='clounStatus'>云链路对接配置</h3>
							<el-form-item label='对接节点名称' prop='node_id'>
								<el-select v-model='editForm.node_id'class='ipt':disabled='!clounStatus' @change='selNode(editForm.node_id)'>
									<el-option v-for='(item,index) in clounData'
										:label='item.name'
										:value='item.id'
										:key='index'></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label='对接逻辑口' prop='logic_port_id'>
								<el-select v-model='editForm.logic_port_id'class='ipt':disabled='!clounStatus'>
									<el-option v-for='(item,index) in logicData'
										:label='item.name'
										:value='item.id'
										:key='index'></el-option>
								</el-select>
							</el-form-item>
							<h3 class="tit_h3" v-if='clounStatus'>云链路参数配置</h3>
							<el-form-item label='接口驱动' prop='interface_driver'>
								<el-select v-model='editForm.interface_driver'class='ipt':disabled='!clounStatus'>
									<el-option v-for='(item,index) in driveData'
										:label='item'
										:value='item'
										:key='index'></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label='API-URL'prop='api_url'>
								<el-input v-model='editForm.api_url'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='API-Token'prop='api_token'>
								<el-input v-model='editForm.api_token'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='UUID'prop='api_uuid'v-if='clounStatus'>
								<el-input v-model='editForm.api_uuid'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='Uni-ID' v-if='!clounStatus'>
								<el-input v-model='editForm.api_uuid'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='数据结构'v-if='!clounStatus'>
								<el-input type='textarea' v-model='editForm.extension'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='备注'v-if='!clounStatus'>
								<el-input type='textarea' v-model='editForm.extension'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
							<el-form-item label='参数'prop='extension'v-if='clounStatus'>
								<el-input type='textarea' v-model='editForm.extension'class='ipt':disabled='!clounStatus'></el-input>
							</el-form-item>
						<!--</el-col>-->
						<!--<el-col :span='12'></el-col>-->
					</el-col>
				</el-row>
			</el-form>
			<div slot='footer' class='dailog-footer' v-if='clounStatus'style="text-align: center;">
				<el-button @click='goback' size='small' >返回</el-button>
				<el-button type='primary' size='small' @click='handleAdd' v-if='btnStatus'>提交</el-button>
				<el-button type='primary' size='small' @click='handleEdit' v-if='!btnStatus'>提交</el-button>
				
			</div>
		</section>
	</div>
</template>

<script>
	import goback from '@/components/goback'
	import {isValidinteger} from '@/assets/js/index'
	export default{
		name:'addCloun',
		components:{goback},
		props:['clounId'],
		data(){
			var  isvalidNumber =(rule,value,callback) => {
				if(!value){
					callback(new Error('请输入带宽'))
				}else if(!isValidinteger(value)){
					callback(new Error('请输入正确的带宽'))
				}if(value>1000000){
					callback(new Error('带宽最大不超过1000000Mbps'))
				}else{
					callback()
				}
			}
			return{
				token:'',
				nameAdd:this.$route.query.name,
				nameEdit:this.$route.query.id,
				editForm:{
					type:'',
					name:'',
					region:'',
					access_point:'',
					bandwidth:'',
					description:'',
					node_id:'',
					logic_port_id:'',
					interface_driver:'',
					api_url:'',
					api_token:'',
					api_uuid:'',
					extension:'',
					get_speed_key:''

				},
				editLoading:false,
//				sharedCloun:['阿里云','腾讯云','百度云','华为云','金山云','AWS','Ucloud'],
				
				sharedCloun:[{value:'阿里云'},{value:'腾讯云'},{value:'百度云'},{value:'华为云'},{value:'金山云'},{value:'AWS'},{value:'Ucloud'}],
				clounData:[],//对接的节点名称
				logicData:[],//对接的逻辑口名称
				driveData:[],//接口驱动的数据
				editFormRules:{
					bandwidth:[{  required: true, validator: isvalidNumber, trigger: 'blur' }],
					type:[ { required: true, message: '请选择公有云类型', trigger: 'change' }],
					name:[ { required: true, message: '请输入云链路名称', trigger: 'blur' }],
					region:[ { required: true, message: '请输入云链路名称', trigger: 'blur' }],
					access_point:[ { required: true, message: '请输入云链路名称', trigger: 'blur' }],
					node_id:[ { required: true, message: '请输入云链路名称', trigger: 'blur' }],
					logic_port_id:[ { required: true, message: '请输入云链路名称', trigger: 'blur' }],
					interface_driver:[ { required: true, message: '请输入云链路名称', trigger: 'blur' }],
				},
				btnStatus:true,
				bakcUpData:{},
				clounStatus:false,//云的详情控制下面的操作按钮以及界面的显示 以及配置title
				pointLogic:[],//将点的的逻辑口的数据,点到多点的逻辑口的数据
//				multiLogic:[],//
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			if(typeof this.nameEdit !=='undefined'){
				this.getCloun(this.nameEdit);
				this.btnStatus=false;
				this.clounStatus=true
			}
			if(typeof this.nameAdd !=='undefined'){
				this.btnStatus=true;
				this.clounStatus=true;
			}

			if(typeof this.clounId!=='undefined'){
				this.clounStatus=false
				this.getCloun( this.clounId);

			}
			this.getData()
		},
		methods:{
			goback(){
				this.$router.go(-1)
			},
			getData(){
				this.sliceLogic=[];
				let obj={}
				this.$ajax.get('/node/nodes'+'?token='+this.token)
				.then(res => {//获取节点的数据
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.clounData=res.data.data.items;
	
						}
					}
				}).catch( e => {console.log(e)})
				this.$ajax.get('/vll/get_cloud_drive_list'+'?token='+this.token) //获取接口驱动的数据
				.then(res => {
					if(res.status==200){
						console.log(res)
						if(res.data.status==0){
							this.driveData=res.data.data;
						}
					}
				}).catch(e => {console.log(e)})
				
				//获取点到点 ，点到多点所有使用过的逻辑口   在这个对接逻辑口的时候 就不能再使用
				this.$ajax.get('/vll/p2p_vlls'+'?token='+this.token)
				.then(res => {//点到点数据
					console.log(res);
					res.data.data.items.forEach(ele => {
						ele.endpoints.forEach(item => {
							this.pointLogic.push(item.logic_port)
						})
					})
//					sliceLogic
				}).catch(e => {console.log(e)})
				this.$ajax.get('/vll/multi_vlls'+'?token='+this.token)
				.then(res => {//获取点到多点的里面所有的逻辑口
					console.log(res);
					res.data.data.items.forEach(ele => {
						ele.endpoints.forEach(item => {
							this.pointLogic.push(item.logic_port)
						})
					})
				}).catch(e =>{console.log(e)})
			},
			selNode(ids){//根据所选取的节点获取逻辑口
				this.editForm.logic_port_id=''
				var para={
					search_node:ids,
					search_usable:true,
				};
				var obj={};
//				console.log(this.multiLogic);
				console.log(this.pointLogic);
				var logic=[];//保存  去重后的数据
				
				let res = []
				let objSet = {}
				var arr=this.pointLogic;
				for (let i = 0; i < arr.length; i++) {
				  if (!objSet[arr[i].id]) { // name  对应数组中的name
				    logic.push(arr[i])
				    objSet[arr[i].id] = true
				  }
				}
				console.log(logic)
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,para)
				.then(res => {
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
//							this.logicData=res.data.data.items;

							this.logicData=res.data.data.items.filter( item => {//根据id删除业务开通的额时候  占用 逻辑口
								let idList=logic.map(v => v.id);
								return  !idList.includes(item.id)
							})
						}
					}
				}).catch(e => {console.log(e)})
			},
			
			handleSelect(){

			},
			querySearch(queryString, cb) {
		        var restaurants = this.sharedCloun;
		        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
		        // 调用 callback 返回建议列表的数据
		        cb(results);
		      },
		      createFilter(queryString) {
		        return (restaurant) => {
		          // return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
              	return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
		        };
		     },
			getCloun(ids){
				this.editLoading=true;
				//编辑的时候需要先获云对接原始数据
				this.$ajax.get('/link/cloud_link_info/'+ids+'?token='+this.token)
				.then(res => {
					if(res.status==200){	
						if(res.data.status==0){
							console.log(res)
							this.editLoading=false;
							let str=res.data.data;
							this.backUpData=Object.assign({},str);
							this.editForm={
								id:str.id,
								type:str.type,
								name:str.name,
								region:str.region,
								access_point:str.access_point,
								bandwidth:str.bandwidth,
								description:str.description,
								node_id:str.node.name,
								logic_port_id:str.logic_port.name,
								interface_driver:str.interface_driver,
								api_url:str.api_url,
								api_token:str.api_token,
								api_uuid:str.api_uuid,
								extension:str.extension,
								get_speed_key:str.get_speed_key
							}
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			handleAdd(){
				//添加的时候提交
				this.$refs.editForm.validate(valid => {
					if(valid){
						this.$confirm('确定要提交吗?','提示',{})
						.then(() => {
							this.editLoading=true;
//							let para=Object.assign({},this.editForm)
							console.log(this.editForm)
							let para={
								type:this.editForm.type,
								name:this.editForm.name,
								region:this.editForm.region,
								access_point:this.editForm.access_point,
								bandwidth:this.editForm.bandwidth,
								description:this.editForm.description,
								node_id:this.editForm.node_id,
								logic_port_id:this.editForm.logic_port_id,
								interface_driver:this.editForm.interface_driver,
								api_url:this.editForm.api_url,
								api_token:this.editForm.api_token,
								api_uuid:this.editForm.api_uuid,
								extension:this.editForm.extension,
								get_speed_key:this.editForm.get_speed_key,
							}
							this.$ajax.post('/link/add_cloud_link'+'?token='+this.token,para)
							.then(res => {
								this.editLoading=false;
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'添加成功!',
											type:'success'
										})
										this.$refs['editForm'].resetFields();
										this.$router.replace('/location/line/cloun')
									}else{
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							}).catch(e => {console.log(e)})
						}).catch(() => {})
					}
				})
			},
			handleEdit(){
				console.log(this.editForm)
				console.log('进入编辑');
				this.$refs.editForm.validate(valid => {
					if(valid) {
						this.$confirm('确定要修改吗','提示',{})
						.then( () => {
							this.editLoading=true;
							let obj={
								node_id:'',
								logic_port_id:''
							}
							if(this.editForm.node_id === this.backUpData.node.name){
								obj.node_id=this.backUpData.node.id

							}else{
									obj.node_id=this.editForm.node_id
							}
							if(this.editForm.logic_port_id === this.backUpData.logic_port.name){
								obj.logic_port_id=this.backUpData.logic_port.id
							}else{
									obj.logic_port_id=this.editForm.logic_port_id
							}
							let para={
								type:this.editForm.type,
								name:this.editForm.name,
								region:this.editForm.region,
								access_point:this.editForm.access_point,
								bandwidth:this.editForm.bandwidth,
								description:this.editForm.description,
								node_id:obj.node_id,
								logic_port_id:obj.logic_port_id,
								interface_driver:this.editForm.interface_driver,
								api_url:this.editForm.api_url,
								api_token:this.editForm.api_token,
								api_uuid:this.editForm.api_uuid,
								extension:this.editForm.extension,
								get_speed_key:this.editForm.get_speed_key,
							}
							console.log(para)
							this.$ajax.put('/link/edit_cloud_link/'+this.editForm.id+'?token='+this.token,para)
							.then(res => {
								this.editLoading=false;
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功!',
											type:'success'
										})
										this.$refs['editForm'].resetFields();
										this.$router.replace('/location/line/cloun')
									}else{
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							}).catch(e => {console.log(e)
							})
						}).catch(() => {})
					}
				})
			}
		}
	}
</script>

<style>
</style>
