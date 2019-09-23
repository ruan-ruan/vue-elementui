<template>
	<div >
		<!--设置-->
		<section>
			<!--<div>
				<el-button size='small' type='info' @click='reset'><返回</el-button>
			</div>-->
			<goback></goback>
			<el-form  :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm' v-loading='Loading'>
				<el-form-item label='名称' prop='name'>
					<el-input v-model='editForm.name' class='sel' :disabled='disUp'></el-input>
				</el-form-item>
				<el-form-item label='角色状态' prop='usable'>
					<template>
						<el-radio-group v-model='editForm.usable' :disabled='disUp'>
							<el-radio v-for='(item,index) in Sta'
								:value='item.value'  
								:label='item.name'
								:key='index' >
								<!--{{editForm.usable}}-->
							</el-radio>
						</el-radio-group>			
					</template>		
				</el-form-item>
				<el-form-item label='备注'>
					<el-input type='textarea' v-model='editForm.description' class='sel' :disabled='disUp'></el-input>
				</el-form-item>
				<!--添加的时候-->
				<h3  class="toolbar text_c">角色的权限列表</h3>
				<el-form-item label='权限选择' prop='rights' v-model='editForm.rights'>	
					<el-tree v-model='editForm.rights'
						ref='organizationData'
						:data='organizationData'
						show-checkbox
						:props="defaultProps"
						node-key="code"
						show-checkbox					
						default-expand-all
						:expand-on-click-node="false"
						:default-checked-keys="roleDetails"
						@check='setrole'
						
						>
					</el-tree>
					<!--@check-change="handleCheckChange"-->
					
				</el-form-item>
			</el-form>
			<div style="text-align: right; margin-right: 30px;" v-if='disNo'>
				<el-button @click='reset(editForm)'>取消</el-button>
				<!--角色的添加部分-->
				<el-button  type="primary" @click="addUsers" v-if="roleBtnStatus">保存</el-button>
				<!--角色的编辑的界面-->
				<el-button  type="primary" @click="handleEdit" v-else-if="!roleBtnStatus">保存</el-button>
				
			</div>
		</section>
	</div>
</template>

<script>
	import goback from '@/components/goback'
	export default{
		token:'',
		name:'roles',
		components:{
			goback
		},
		created(){
			//获取token
			this.token=sessionStorage.getItem('token');
			this.getRoles();
			if(typeof this.id !='undefined' && typeof this.roleID =='undefined'){
				console.log('执行角色的详情的界面')
//				this.isOk=true;
				this.disUp=true;
				//在角色详情的界面的时候下方的操作按钮是不会渲染的
				this.disNo=false;
				this.getRoleDetails(this.id);
			}
			
			if(typeof this.roleID !='undefined' &&  typeof this.id =='undefined'){
				console.log('执行角色的编辑的界面');
				//获取编辑的按钮
				this.roleBtnStatus=false;
				this.getEditRole(this.roleID);				
			}
			
			if(typeof this.id=='undefined'&& typeof this.roleID=='undefined'){
				//当详情和编辑的id都是未定义的时候，这个是时候进来的是添加角色部分
				this.roleBtnStatus=true;
			}
		},
//		mounted(){
//			this.getRoles();
//		},
		data(){
			return{
//				isOk:false,
				//角色详情的时候获取的id
				id:this.$route.params.id,
				//角色编辑的时候获取的部分
				roleID:this.$route.query.roleID,
				disUp:false,
				disNo:true,
				defaultProps: {
		        	children: 'list',
		        	label: 'name',
		        },
				dialogFormVisible:false,
				isIndeterminate:false,
				//tree的数据
				organizationData:[],
				//默认选中的数据
				roleDetails:[],
				editForm:{
					name:'',
					usable:'',
					description:'',
					rights:'',
					dataCen:[],
					statusName:'',
				},
				editFormRules:{
					name:[
						{ required: true, message: '请输入名称', trigger: 'blur' },
            			{ min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
					],
					usable:[{ required: true, message: '请输选择状态', trigger: 'change' }],
					rights:[{ required: true, message: '权限集合不能为空', trigger: 'change' }]
				},
				//角色的状态
				Sta:[
					{
						name:'启用',
						value:'true',
					},{
						name:'禁用',
						value:'false',
					}
				],
				Loading:false,
				//角色的添加按钮默认的时候是显示，编辑的时候按钮是隐藏的
				roleBtnStatus:true,
			}
		},
		methods:{
			getRoles(){

				this.$ajax.get('/role/permissions'+'?token='+this.token)
				.then( res => {
					if(res.status==200){
						if(res.data.status==0){
							
							this.organizationData=res.data.data;
							
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			reset(sel){
				 this.$router.go(-1)
			},
			//角色添加的时候显示
			addUsers(editForm){
				console.log('添加按钮')
				this.$refs.editForm.validate((valid) => {
					if(valid){
						let para={
							name:this.editForm.name,
							usable:this.editForm.usable,
							description:this.editForm.description,
							rights:this.editForm.rights,
						}
						this.$ajax.post('/role/add_role'+"?token="+this.token,para)
						.then(res => {
							console.log(res)
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'添加成功!',
										type:'success'
									})
									this.$router.replace('/account');
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
					}else{
						return false
					}
				})
				
			},
			getEditRole(row){
				this.Loading=true;
				this.$ajax.get('/role/role_info/'+row+'?token='+this.token)
				.then(res => {
					this.Loading=false;
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							console.log(res.data.data.rights)
							if(res.data.data.usable){
								this.editForm.statusName='启用'
							}else{
								this.editForm.statusName='禁用'
							}
							if(res.data.data.rights==='all'){
								console.log(this.organizationData)
								this.getAllRole()
								this.roleDetails=this.organizationData
								this.$refs.organizationData.setCheckedNodes(this.roleDetails)
//								this.roleDetails=res.data.data.rights.split(',');
							}else{
								this.$refs.organizationData.setCheckedNodes(this.roleDetails);
								
							}
							 this.editForm={
								name:res.data.data.name,
								usable:this.editForm.statusName,
								description:res.data.data.description,
//								rights:res.data.data.rights,
								rights:this.roleDetails,
								usableStatus:res.data.data.usable
							}
						}
					}
				}).catch(e => {
					console.log(e);
				})
			},
			handleEdit(){
				console.log('执行编辑');
				this.$refs.editForm.validate(valid => {
					if(valid){
						//编辑的角色的时候按钮
						this.$confirm('确认要修改吗?','提示 ',{})
						.then( () => {
							var para={
								name:this.editForm.name,
								rights:this.editForm.rights.join(','),
								usable:this.editForm.usableStatus,
								description:this.editForm.description
							}
							this.$ajax.put('/role/edit_role/'+this.editForm.id+'?token='+this.token,para)
							.then(res => {
								console.log(res)
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功!',
											type:'success'
										})
										this.$router.place('/account')
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
			getAllRole(data){

				this.$ajax.get('/role/permissions'+'?token='+this.token)
				.then( res => {
					console.log(res)
					if(res.status==200){
						if(res.data.status==0){
							this.organizationData=res.data.data;
							function rolesFor(data){
								data.forEach(item => {
									console.log(item)
								})
							}
							
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			getRoleDetails(rows){
				console.log('详情部分数据')
				this.Loading=true;
				//详情的界面的进来的时候显示
				this.$ajax.get('/role/role_info/'+rows+'?token='+this.token)
				.then(res => {
					this.Loading=false;
					console.log(res);
					if(res.status==200){
						if(res.data.status==0){
							this.roleDetails=res.data.data.rights.split(',');
							console.log( this.roleDetails);
							if(res.data.data.usable){
								this.editForm.statusName='启用'
							}else{
								this.editForm.statusName='禁用'
							}
							if(res.data.data.rights=='all'){
								this.roleDetails=this.organizationData;
							}else{
								this.$refs.organizationData.setCheckedNodes(this.roleDetails);
							}
							 this.editForm={
								name:res.data.data.name,
								usable:this.editForm.statusName,
								description:res.data.data.description,
//								rights:res.data.data.rights,
								rights:this.roleDetails
							}
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			setrole(data,checked){

				console.log(data);
				console.log(checked)
				this.editForm.dataCen=checked.checkedKeys;
				this.editForm.rights=this.editForm.dataCen.join(',');
			},

		}
		
	}
</script>

<style >
	.el-table__empty-block{
		/*display: none !important;*/
		display: none  !important;
	}
	.sel{
		width: 300px;
	}
	.el-tree-node__children{
		overflow: hidden;
	}
	.is-expanded{
		float: left;
	}
	.text_c{
		text-align: center;
	}
</style>