<template>
	<div>
		<!--人员设置-->
		<section>
			<!--顶部工具条-->
			<el-col :span='24'class='toolbar' style="padding-bottom: 0px;">
				<el-form :inline='true' :model="filters" @submit.native.prevent >
					<el-form-item label='名称'>
						<el-input v-model='filters.search_name'></el-input>
					</el-form-item>
					<el-form-item label='状态'>
						<!--<el-input v-model='filters.search_status'></el-input>-->
						<el-select v-model='filters.search_status' class='sel'>
							<el-option
								v-for='(item,index) in status'
								:key='index'
								:value='item.value'
								:label='item.name'>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' @click='getUsers()'>搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type='info' @click='reset(filters)'>重置</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span='24'>
				<el-col :span='4'>
					<el-button type='primary' @click='addUser(editForm)' >+添加</el-button>
				</el-col>
				<el-col :span='20'class="table-top">
					<el-dropdown split-button type='success' @command="handleExport" >
						导出数据
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item command="current">当前页 </el-dropdown-item>
							<el-dropdown-item command="all">所有页</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>

			
			<!--数据部分-->
			<el-table :data = "users" highlight-current-row @selection-change="selsChange" style='width: 100%;' v-loading='loading'>
				<el-table-column type='selection' width='40'></el-table-column>
				<el-table-column type='index' min-width='50' label='序号'></el-table-column>
				<el-table-column prop='creation_time' width='95' :formatter='dateFormat' label='创建时间' align='center'>
				</el-table-column>
				<el-table-column prop='name' min-width='80' label='账户' align='center'>
				</el-table-column>
				<el-table-column prop='real_name' min-width='100' label='姓名' align='center'>
				</el-table-column>
				<el-table-column  min-width='80' label='人员状态' align='center'>
					<template slot-scope='scope'>
						<span :class="scope.row.color" v-text="scope.row.roleStatus"></span>
					</template>
				</el-table-column>
				<el-table-column prop='mobile' min-width='80' label='手机号' align='center'>
				</el-table-column>
				<el-table-column prop='email' min-width='80' label='邮箱' align='center'>
				</el-table-column>
				<el-table-column prop='role.name' min-width='100' label='角色名称' align='center'>
				</el-table-column>
				<el-table-column prop='descriptionVal' min-width='80' label='备注' align='center'>
				</el-table-column>
				<el-table-column  width='300' label='操作' align='center'>
					<template slot-scope='scope'  >
						<el-button size='small' type='warning'  @click='handleSta(scope.$index, scope.row)' class='btnStatus'>{{scope.row.btnText}}</el-button>
						<el-button size='small' type='info' @click='handleSee(scope.$index, scope.row)'>详情</el-button>
						<el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>				
						<el-button size='small' type='danger' @click='handleDel(scope.$index, scope.row)'>删除</el-button>
						
					</template>
				</el-table-column>
			</el-table>
			
			
			<!--底部导航的额数据-->
			<el-col :span='24' class='toolbar'>
				<el-col :span='3'>
					<el-button type='danger' @click='batchRemove(sels)' :disabled="this.sels.length===0">批量删除</el-button>
				</el-col>
				<el-col :span='21'>
					<el-pagination
						:total="total"
				     	@size-change="handleSizeChange"
                   		@current-change="handleCurrentChange"
				     	layout="total, sizes, prev, pager, next, jumper"
				     	:page-sizes="[10, 20, 30,50]" 						     	 
				     	:current-page.sync="currentPage"  
				     	:page-count='pageNum'
				     	:pager-count="pagecount"
				     	:prev-text='prev'
				     	:next-text='next'>
						
					</el-pagination>
				</el-col>
			</el-col>
			
			
			<!--编辑，添加，详情的部分-->
			<el-dialog :title='textMap[dialogStatus]' :visible.sync='dialogFormVisible' :close-on-click-modal="false" v-loading='loading'>
				<el-form :model='editForm' label-width='100px'  status-icon :rules='editFormRules' ref='editForm'>
					<el-form-item label='创建时间'  v-show='staCreat'>
						<el-input v-model='editForm.creation_time' class='ipt' disabled ></el-input>
					</el-form-item>
					<el-form-item label='账号' prop='name'>
						<el-input v-model='editForm.name' class='ipt':disabled='read' ></el-input>
					</el-form-item>
					<el-form-item label='姓名' prop='real_name'>
						<el-input v-model='editForm.real_name' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
					<el-form-item label='手机' prop='mobile'>
						<el-input v-model='editForm.mobile' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
					<el-form-item label='邮箱' prop='email'>
						<el-input v-model='editForm.email' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
					<el-form-item label='关联角色' prop='role_id' >
						<el-select v-model='editForm.role_id':disabled='read'  class='ipt'>
							<el-option v-for='(item,index) in roles'
								:key='index'
								:value='item.id'
								:label='item.name'
								>	
							</el-option>
						</el-select>
					</el-form-item>
					<!--当弹出的是天际的时候显示密码部分，否则隐藏-->
					<el-form-item label='密码' prop='password'  v-if='psd'>
						<el-input type="password" v-model="editForm.password" auto-complete="off" class='ipt' placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item label='确认密码' prop='password_confirm' v-if='psd'>
						<el-input type="password" v-model='editForm.password_confirm' auto-complete="off" class='ipt'  placeholder="请确认密码"></el-input>
					</el-form-item>
					<el-form-item label='人员状态' v-show='changeRoleStatus'>
						<el-radio-group v-model='editForm.usable' :disabled='read' >
							<template v-for='item in roleChange'>
								<el-radio :value='item.value' :key ='item.value' :label='item.name'>{{item.name}}</el-radio>
							</template>	
						</el-radio-group>
					</el-form-item>
					<el-form-item label='备注' >
						<el-input type='textarea' v-model='editForm.description' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='dialogFormVisible=false'>取消</el-button>
					<el-button v-if="dialogStatus=='update'"type="primary" @click="updateData">保存</el-button>
					<el-button v-else-if="dialogStatus=='creat'"type="primary" @click="creatData">保存</el-button>
					
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>
	
		import {descriptionValue} from '@/assets/js/index.js'
	export default{
		name:'Set',
		mounted(){
			this.getUsers()
		},
		data(){
			var validatePass2 =(rule,value ,callback) => {
				if(value===''){
					 callback(new Error('请再次输入密码'));
				}else if(value !==this.editForm.password){
					 callback(new Error('两次输入密码不一致!'));
				}else{
					 callback();
				}
			};
			 var validatePass = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error('请输入密码'));
		        } else {
//		          if (this.editForm.passwd !== '') {
//		            this.$refs['editForm'].validateField('passwd');
//		          }
		          callback();
		        }
		      };
			var Mobile =(rule,value ,callback) => {
				if (!value) {
		          return callback(new Error('手机号不能为空'));
		        } else {
		          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
//		          console.log(reg.test(value));
		          if (reg.test(value)) {
		            callback();
		          } else {
		            return callback(new Error('请输入正确的手机号'));
		          }
		        }
			};
			return{
				//获取token
				token:'',
				isOk:true,
				classA:"classA",
				classB:"classB",
				filters:{
					search_name:'',
					search_status:'',
					
				},
				status:[
					{
						value:'false',
						name:'禁用'
					},
					{
						value:'true',
						name:'启用'
					}
				],
				roleChange:[
					{
						name:'启用',
						value:'true',
//						label:'启用',
					},{
						name:'禁用',
						value:'false',
					}
				],
				users:[],
				sels:[],
				loading:false,
				//启用和禁用的判断  默认是启用的
				Sta:true,
				Stop:false,
				//分页所需要的参数
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,
				next:'下一页',
				prev:'上一页',
				//添加，详情，编辑部分的界面
				dialogStatus:'',
				textMap:{
					see:'详情',
					update:'编辑',
					creat:'添加'
				},
				//用户的详情的界面
//				dialogSee:false,
				dialogFormVisible:false,
				//编辑部分的数据
				editForm:{
					name:'',
					real_name:'',
					password:'',
					email:'',
					mobile:'',
					password_confirm:'',
					role_id:'',
					usable:'',
					description:'',
				},
				editFormRules:{
					name:[
						{ required: true, message: '请输入账号', trigger: 'blur' },
            			{ min: 3, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
					],
					real_name:[
						{ required: true, message: '请输入姓名', trigger: 'blur' },
            			{ min: 3, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
					],
					password:[ { validator: validatePass,required: true, trigger: 'blur' }],
					password_confirm:[ { validator: validatePass2,required: true, trigger: 'blur' }],
					email:[  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
     						 { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
					mobile:[ {validator: Mobile,required: true, trigger: 'blur'} ],
					role_id:[{required: true, message: '请选择角色', trigger: 'change'}]
				},
				//角色
				roles:[],
				//添加的时候密码的部分  默认是显示的
				psd:true,
				//编辑和添加的时候  角色的选择是默认是显示的
//				updis:true,
				//设置文本的只读的时候 默认的时候是false   是可以编辑的
				read:false,
				//导出数据
				excelData:[],
				//创建时间  默认的时候是隐藏的
				staCreat:false,
				//在选择人员设置启用和暂停
				changeRoleStatus:false,
				
				
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
		},
		methods:{
			
			handleSizeChange(val){
//				console.log(`每页${val}条`);
				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
//				console.log(`当前页数是:${val}`)
				this.currentPage=val;
				this.getUsers()
			},
			getUsers(){
				//获取所有的数据
				this.loading=true;
				let para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.search_name,
					search_status:this.filters.search_status
				}
				
				this.$ajax.get('/admin/admins'+'?token='+this.token,para)
				.then(res => {
					console.log(res)
					if(res.status==200){
						if(res.data.status==0){
							this.loading=false;
							descriptionValue(res.data.data.items)
							res.data.data.items.forEach(ele => {
//								console.log(ele.usable)
								if(!ele.usable){
									ele.color='colorRed'
									ele.roleStatus='禁用';
									ele.btnText='启用';
								}else{
									ele.color='colorGreen'
									
									ele.roleStatus='启用';
									ele.btnText='禁用';
								}
							})
							this.users=res.data.data.items;
							this.total=res.data.data.page.total	;
							console.log(res);
						}
					}
				}).catch(e => {console.log(e)})
				//获取角色
				
				this.$ajax.get('/role/roles'+'?token='+this.token)
				.then( res => {
					if(res.status==200){
						if(res.data.status==0){
							this.roles=res.data.data.items
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
			},
			handleEdit(index,row){
				
				//编辑
				
				console.log(row);
				//创建时间
				this.staCreat=true;
				//密码的隐藏
				this.psd=false;
				this.read=false;
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.changeRoleStatus=false;
//				this.loading=true;
				this.editForm={
					id:row.id,
					creation_time:this.dateFormats(row.creation_time),
					name:row.name,
					real_name:row.real_name,
					email:row.email,
					mobile:row.mobile,
					role_id:row.role.name,
					roleID:row.role.id,
//					usable:row.roleStatus,
					description:row.description
				}

			},
			updateData:function(){
				//编辑
				this.$refs.editForm.validate(valid => {
					if(valid){
						// this.$confirm('确认要提交吗?','提示',{})
						// .then(() => {
//							this.loading=true;
//							let para=Object.assign({} ,this.editForm)
							if(this.editForm.usable=='禁用'){
								this.editForm.usable='false';
							}else{
								this.editForm.usable='true';
							}
							let para={
								id:this.editForm.id,
								name:this.editForm.name,
								real_name:this.editForm.real_name,
								email:this.editForm.email,
								mobile:this.editForm.mobile,
								role_id:this.editForm.roleID,
								description:this.editForm.description,
//								usable:this.editForm.usable
							}
								this.$ajax.put('/admin/edit_admin/'+para.id+'?token='+this.token,para)
							.then( res => {

								console.log(res)
								// debugger
								if(res.status=='200'){
									if(res.data.status=='0'){
										this.loading=false;
										this.$message({
											message:'修改成功',
											type:'success'
										})
										this.$refs["editForm"].resetFields();
										this.dialogFormVisible=false;
										this.getUsers();
									}else if(res.data.status){
										this.dialogFormVisible=false;
										this.$message({
											message:res.data.message,
											type:'waring'
										})
									}
								}
							}).catch( e=> {console.log(e)})

					}else{
						return false;
					}
				})
			},
			addUser(editForm){
				//添加的部分
				this.dialogFormVisible=true;
				this.dialogStatus='creat';
				//创建时间隐藏
//				this.$refs.editForm.resetFields();    
				this.staCreat=false;
				this.read=false;
				this.psd=true;
				this.changeRoleStatus=false;
				this.editForm={
					name:'',
					real_name:'',
					password:'',
					email:'',
					mobile:'',
					password_confirm:'',
					role_id:'',
//					usable:'',
					description:'',
				}
				
//				this.$nextTick(() => {
//					 this.$refs.editForm.resetFields();       
//				});
				console.log(this.editForm.usable)
			},
			creatData:function(){
				//添加
				this.$refs.editForm.validate(valid => {
					if(valid){
						// this.$confirm('确认要添加吗?','提示',{})
						// .then( () => {
							let para={
//								token:this.token,
								name:this.editForm.name,
								real_name:this.editForm.real_name,
								password:this.editForm.password,
								email:this.editForm.email,
								mobile:this.editForm.mobile,
								role_id:this.editForm.role_id,
								usable:this.editForm.usable,
								description:this.editForm.description,
							}

							this.$ajax.post('/admin/add_admin'+'?token='+this.token,para)
							.then( res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'添加成功',
											type:'success'
										})
										this.$refs["editForm"].resetFields();
										this.dialogFormVisible=false;
										this.getUsers()
									}else {
										this.$message({
											message:res.data.message,
											type:'danger'
										})
									}
								}
							// })
							// .catch(e => {
							// 	console.log(e)
							// })
						})
					}
				})
				
			},
			reset(sels){
				//清空所有的搜索条件
				for(let key in sels){
					sels[key]='';
				}
			},
			handleSta(index,row){
				var btn=document.getElementsByClassName('btnStatus');
				if(btn[index].textContent=='启用'){
					this.$confirm(`账号:${row.name}`,'确认要启用吗?','提示',{
						type:'success'
					})
					.then(() => {
						this.$ajax.put('/admin/to_enable_admin/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status=='200'){
								if(res.data.status=='0'){
									this.$message({
										message:'启用成功!',
										type:'success'
									})
									btn[index].textContent='禁用'
									this.getUsers()
								}else if(res.data.status){
									this.$message({
										message:res.data.messaeg,
										type:'warning'
									})
								}
							}
						}).catch(e => {
							console.log(e)
						})
					} )
				}else if(btn[index].textContent=='禁用'){
					this.$confirm(`账号:${row.name}`,'确认要暂停吗?','提示',{
						type:'danger'
					})
					.then( () => {
						
						this.$ajax.put('/admin/to_disable_admin/'+row.id+'?token='+this.token)
						.then( res => {
							if(res.status=='200'){
								if(res.data.status=='0'){
									this.$message({
										message:'禁用成功!',
										type:'success'
									})
									//禁用
								btn[index].textContent='启用'

									this.getUsers()
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
			},

			handleSee(index,row){
				//查看详情
//				console.log(row);
				this.dialogStatus='see';
				this.psd=false;
				//创建时间隐藏
				this.staCreat=true;

				this.read=true;
				this.dialogFormVisible=true;
				this.changeRoleStatus=true;
				
				this.$ajax.get('/admin/admin_info/'+row.id+'?token='+this.token)
				.then(res => {
					
					if(res.status==200){
						if(res.data.status==0){
							console.log(res.data.data)
							var str=res.data.data;
							this.editForm={
								creation_time:this.dateFormats(str.creation_time),
								id:str.id,
								name:str.name,
								real_name:str.real_name,
								email:str.email,
								mobile:str.mobile,
//								usable:'',
								description:str.description,
								role_id:str.role.name
							}
							if(str.usable){
								this.editForm.usable='启用';
							}else{
								this.editForm.usable='禁用'
							}
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
				
			},
			
			handleDel(index,row){
				//删除
				this.$confirm('确认要删除该记录吗?','提示',{
					type:'warning'
				})
				.then( () => {
					this.$ajax.del('/admin/del_admin/'+row.id+'?token='+this.token)
					.then(res => {
//						console.log(res);
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.$message({
									message:'删除成功!',
									type:'success'
								})
								this.getUsers();
							}else {
								this.$message({
									message:res.data.message,
									type:'danger'
								})
							}
						}
					})
				})
				
			},
			selsChange:function(sels){
				//选择的数据
				this.sels=sels
			},
			batchRemove:function(rows){
				//批量删除
				var ids=[];
				rows.forEach(ele => {
					ids.push(ele.id)
				})
				this.$confirm('确认要删除选中的用户吗?','提示',{
					type:'warning'
				})
				.then(() => {
					let para={ids:ids};
					this.$ajax.del('/admin/del_admins'+'?token='+this.token,para)
					.then( res => {
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.$message({
									message:'删除成功!',
									type:'success'
								})
								this.getUsers()
							}else if(res.data.status){
								this.$message({
									message:'删除失败!',
									type:'danger'
								})
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
				})
				.catch((e) => {
					console.log(e)
				})
			},
			handleExport(command){
				//选择当初当前页还是所有页
				var _this=this;
				if(_this.users==''){
//					console.log('数据为空不能执行')
					this.$message({
						message:'数据为空不能执行导出操作!',
						type:'warning'
					})
				}else if(_this.users!=''){
//					console.log('数据不是空可以执行')
					if(command=='all'){
						console.log('这是点击了所有')
						this.$confirm('确定导出所有的数据吗?','提示',{
							confirmButtonText:'确定',
							cancelButtonText:'取消',
							type:'warning'
						})
						.then(() => {
	//						this.getUsers()
						var para={
							page:this.currentPage,
							per_page:this.pagesize
						}
						this.exportData(para)
							
						}).catch(() => {})
					}else if(command=='current'){
	//					console.log('这是点击了当前的部分')
						this.$confirm('确定要导出当前页的数据吗?','提示',{
							confirmButtonText:'确定',
							cancelButtonText:'取消',
							type:'warning'
						}).then(() => {
							var para={
								page:'',
								per_page:''
							}
							this.exportData(para)
						}).catch(() => {
							
						})
					}
				}												
			},
			exportData:function(params){
				this.$ajax.get('/admin/admins'+'?token='+this.token,params)
				.then(res => {
					console.log(res)
					this.excelData=res.data.data.items;
					this.export2Excel();
				}).catch(e => {
					console.log(e)
				})
			},
			export2Excel(){
				let that=this;
				require.ensure([] ,() => {
					const {export_json_to_excel} = require('@/excel/export2Excel')
					const tHeader=['创建时间','名称','手机号','邮箱','备注','角色'];
					const filterVal=['creation_time','name','mobile','email','description','roles.name'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,'下载数据excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			dateFormat(row,column){
                let date = new Date(parseInt(row.creation_time) * 1000);
                let Y = date.getFullYear() + '-';
                let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
                let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
                let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
                let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m + s;
				
			},
			dateFormats(value){
		    	let date = new Date(parseInt(value) * 1000);
		        let Y = date.getFullYear() + '-';
		        let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
		        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
		        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
		        let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
		        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		        return Y + M + D + h + m + s;
		    },
		},
		
	}
</script>

<style scoped>
	.sel{
		width:100px;
	}
	.ipt{
		width: 300px;
	}
	.shows{
		position: relative;
		right: 30px;
		cursor: pointer;
	}
</style>