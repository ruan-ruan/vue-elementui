<template>
	<div>
		<!--人员设置-->
		<section>
			<!--顶部工具条-->
			<el-col :span='24'class='toolbar' style="padding-bottom: 0px;">
				<el-form :inline='true' :model="filters" ref='filters' @submit.native.prevent >
					<el-form-item :label='$t("Public.name")' prop='search_name'>
						<el-input v-model='filters.search_name'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.status")' prop='search_status'>
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
						<el-button size='small' type='primary' @click='getUsers()'>{{$t('topFilters.search')}}</el-button>
						<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :span='24'>
				<el-col :span='4'>
					<el-button type='primary' @click='addUser(editForm)'size='small' v-if='buttonVal.add'>+{{$t('tabOperation.add')}}</el-button>
				</el-col>
				<el-col :span='20'class="table-top">
					<el-button size='small' type='danger' @click='batchRemove(sels)' :disabled="this.sels.length===0" v-if='buttonVal.del'>{{$t('tabOperation.batchDel')}}</el-button>
					
					<el-dropdown size='small' split-button type='success' @command="handleExport" >
						{{$t('tabOperation.derived.tit')}}
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>
							<el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>

			
			<!--数据部分-->
			<el-table :data = "users" highlight-current-row @selection-change="selsChange" style='width: 100%;'
				 v-loading='loading'>
				<el-table-column type='selection'align='center' min-width='60'></el-table-column>
				<el-table-column type='index' min-width='80'align='center' :label='$t("Public.index")'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='creation_time' width='80' :formatter='dateFormat' :label='$t("Public.creation")' align='center'>
				</el-table-column>
				<el-table-column prop='name' min-width='100' :label='$t("roles.account")' align='center'>
				</el-table-column>
				<el-table-column prop='real_name' min-width='100' :label='$t("Public.name")' align='center'>
				</el-table-column>
				<el-table-column  min-width='100' :label='$t("roles.personStatus")' align='center'>
					<template slot-scope='scope'>
						<span :class="scope.row.color" v-text="scope.row.roleStatus"></span>
					</template>
				</el-table-column>
				<el-table-column prop='mobile' min-width='100' :label='$t("customer.phone")' align='center'>
				</el-table-column>
				<el-table-column prop='email' min-width='100' :label='$t("customer.email")' align='center'>
				</el-table-column>
				<el-table-column prop='role.name' min-width='100' :label='$t("roles.roleName")' align='center'>
				</el-table-column>
				<el-table-column prop='descriptionVal' min-width='100' :label='$t("Public.description")' align='center'>
				</el-table-column>
				<el-table-column  width='180' :label='$t("Public.operation")' align='center'>
					<template slot-scope='scope'  >
						<el-button size='mini' type='warning'  @click='handleSta(scope.$index, scope.row)' class='btnStatus' v-if='buttonVal.stop'>{{scope.row.btnText}}</el-button>
						<el-button size='mini' type='info' @click='handleSee(scope.$index, scope.row)' v-if='buttonVal.see'>{{$t('tabOperation.info')}}</el-button>
						<el-button size='mini' type='success' @click='handleEdit(scope.$index, scope.row)'v-if='buttonVal.edit'>{{$t('tabOperation.edit')}}</el-button>				
						<el-button size='mini' type='danger' @click='handleDel(scope.$index, scope.row)'v-if='buttonVal.del'>{{$t('tabOperation.delete')}}</el-button>
						
					</template>
				</el-table-column>
			</el-table>
			
			
			<!--底部导航的额数据-->
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
			     	>
					
				</el-pagination>
			</el-col>
			
			
			<!--编辑，添加，详情的部分-->
			<el-dialog :title='textMap[dialogStatus]' :visible.sync='dialogFormVisible' :close-on-click-modal="false" v-loading='loading' >
				<el-form :model='editForm' label-width='200px' :rules='editFormRules' ref='editForm'>
					<el-form-item :label='$t("Public.creation")'  v-show='staCreat'>
						<el-input v-model='editForm.creation_time' class='ipt' disabled ></el-input>
					</el-form-item>
					<el-form-item :label='$t("roles.accNumber")' prop='name'>
						<el-input v-model='editForm.name' class='ipt':disabled='read' ></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.name")' prop='real_name'>
						<el-input v-model='editForm.real_name' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
					<el-form-item :label='$t("customer.phone")' prop='mobile'>
						<el-input v-model='editForm.mobile' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
					<el-form-item :label='$t("customer.email")' prop='email'>
						<el-input v-model='editForm.email' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
					<el-form-item :label='$t("roles.assRoles")' prop='role_id' >
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
					<el-form-item :label='$t("roles.psd")' prop='password'  v-if='psd'>
						<el-input type="password" v-popover:popover v-model="editForm.password" auto-complete="off" class='ipt' placeholder="请输入密码"></el-input>
						 <el-popover
							ref="popover"
							placement="right"
							width="30"
							trigger="focus"
							:content="$t('roles.psdCon')">
						</el-popover>
					</el-form-item>
					
					<el-form-item :label='$t("roles.conPsd")' prop='password_confirm' v-if='psd'>
						<el-input type="password" v-model='editForm.password_confirm' auto-complete="off" class='ipt'  placeholder="请确认密码"></el-input>
					</el-form-item>
					<el-form-item :label='$t("roles.personStatus")' v-show='changeRoleStatus'>
						<el-radio-group v-model='editForm.usable' :disabled='read' >
							<template v-for='item in roleChange'>
								<el-radio :value='item.value' :key ='item.value' :label='item.name'>{{item.name}}</el-radio>
							</template>	
						</el-radio-group>
					</el-form-item>
					<el-form-item :label='$t("Public.description")' >
						<el-input type='textarea' v-model='editForm.description' class='ipt' :disabled='read' ></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class='dailog-footer'>
					<el-button @click.native='dialogFormVisible=false'>{{$t('tabOperation.cancel')}}</el-button>
					<el-button v-if="dialogStatus=='update'"type="primary" @click="updateData">{{$t('tabOperation.save')}}</el-button>
					<el-button v-else-if="dialogStatus=='creat'"type="primary" @click="creatData">{{$t('tabOperation.save')}}</el-button>
					
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>
	
	import {descriptionValue,datedialogFormat} from '@/assets/js/index.js'
	export default{
		name:'Set',
		mounted(){
			this.getUsers()
		},
		data(){
			var regex=new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/)
			var validatePass2 =(rule,value ,callback) => {
				if(value===''){
					 callback(new Error(this.$t('roles.plAdginPsd')));
				}else if(value !==this.editForm.password){
					 callback(new Error(this.$t('roles.plaConPsd')));
				}
				else{
					 callback();
				}
			};
			 var validatePass = (rule, value, callback) => {
		        if (value === '') {
		          callback(new Error(this.$t('roles.plaPsd')));
		        } else if(!regex.test(this.editForm.password)){
		       		 callback(new Error(this.$t('roles.psdCon')))
		        }else{
		        	callback()
		        }
		      };
			var Mobile =(rule,value ,callback) => {
				if (!value) {
		          callback(new Error(this.$t('roles.plaPho')));
		        } else {
		          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
		          if (reg.test(value)) {
		            callback();
		          } else {
		            callback(new Error(this.$t('roles.plaRightPho')));
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
					search_status:'true',
					
				},
				status:[
					{
						value:'false',
						name:this.$t('Public.Prohibit')
					},
					{
						value:'true',
						name:this.$t('Public.enable')
					}
				],
				roleChange:[
					{
						name:this.$t('Public.enable'),
						value:'true',
//						label:'启用',
					},{
						name:this.$t('Public.Prohibit'),
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

				//添加，详情，编辑部分的界面
				dialogStatus:'',
				textMap:{
					see:this.$t('tabOperation.info'),
					update:this.$t('tabOperation.edit'),
					creat:this.$t('tabOperation.add')
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
						{ required: true, message: this.$t('roles.placcoun'), trigger: 'blur' },
            			{  max: 30, message: this.$t('roles.max30'), trigger: 'blur' }
					],
					real_name:[
						{ required: true, message: this.$t('Public.plaName'), trigger: 'blur' },
            			{  max: 30, message: this.$t('roles.max30'), trigger: 'blur' }
					],
					password:[ { validator: validatePass,required: true, trigger: 'blur' }],
					password_confirm:[ { validator: validatePass2,required: true, trigger: 'blur' }],
					email:[  { required: true, message: this.$t('customer.plaEma'), trigger: 'blur' },
     						 { type: 'email', message: this.$t('customer.plaRightEma'), trigger: 'blur' }],
					mobile:[ {validator: Mobile,required: true, trigger: 'blur'} ],
					role_id:[{required: true, message: this.$t('roles.plaRoles'), trigger: 'change'}]
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
				buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 "link@add_unknown_link"
			  		add:this.codeVal(this.recursion( this.$store.state.aside ,"aside.peopleSet").list,"admin@add_admin").show,//添加	
			  		del:this.codeVal(this.recursion( this.$store.state.aside ,"aside.peopleSet").list, "admin@del_admin").show,//单个删除和批量的删除是绑定在一起的  
			  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"aside.peopleSet").list,"admin@edit_admin").show,//编辑的值
			  		see:this.codeVal(this.recursion( this.$store.state.aside ,"aside.peopleSet").list, "admin@admin_info").show,//查看详情
			  		run:this.codeVal(this.recursion( this.$store.state.aside ,"aside.peopleSet").list, "admin@to_enable_admin").show,//运行
			  		stop:this.codeVal(this.recursion( this.$store.state.aside ,"aside.peopleSet").list,"admin@to_disable_admin").show,//停止
			  	}
				
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			
		},
		methods:{
			
			handleSizeChange(val){
				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
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
					search_usable:this.filters.search_status
				}
				
				this.$ajax.get('/admin/admins'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.loading=false;
							descriptionValue(res.data.data.items)
							res.data.data.items.forEach(ele => {
								if(!ele.usable){
									ele.color='colorRed'
									ele.roleStatus=this.$t('Public.Prohibit');
									ele.btnText=this.$t('Public.enable')
								}else{
									ele.color='colorGreen'
									
									ele.roleStatus=this.$t('Public.enable')
									ele.btnText=this.$t('Public.Prohibit');
								}
							})
							this.users=res.data.data.items;
							this.total=res.data.data.page.total	;
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
					creation_time:datedialogFormat(row.creation_time),
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
//						if(this.editForm.usable=='禁用'){
//							this.editForm.usable='false';
//						}else{
//							this.editForm.usable='true';
//						}
						let para={
							id:this.editForm.id,
							name:this.editForm.name,
							real_name:this.editForm.real_name,
							email:this.editForm.email,
							mobile:this.editForm.mobile,
							role_id:this.editForm.roleID,
							description:this.editForm.description,
//							usable:this.editForm.usable
						}
						this.$ajax.put('/admin/edit_admin/'+para.id+'?token='+this.token,para)
						.then( res => {

							if(res.status=='200'){
								this.loading=false;
								if(res.data.status=='0'){
									
									this.$message({
										message:'修改成功',
										type:'success'
									})
									this.$refs["editForm"].resetFields();									
								}
								this.dialogFormVisible=false;
								this.getUsers();
							}
						}).catch( e=> {console.log(e)})

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
			},
			creatData:function(){
				//添加
				this.$refs['editForm'].validate(valid => {
					if(valid){
						let para={
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
										message:this.$t('tooltipMes.addSuccess'),
										type:'success'
									})
								}
								this.$refs["editForm"].resetFields();
								this.dialogFormVisible=false;
								this.getUsers()
							}
						}).catch(e => {console.log(e)})
					}
				})
				
			},
			reset(){
				this.$refs['filters'].resetFields()
			},
			handleSta(index,row){

				if(row.usable){//启用的状态  点击  禁用
					this.$confirm(this.$t('customer.accNumber')+`:${row.name}`,this.$t('confirm.conStop'),this.$t('confirm.tooltip'),{
						type:'warning'
					})
					.then( () => {
						this.$ajax.put('/admin/to_disable_admin/'+row.id+'?token='+this.token)
						.then( res => {
							if(res.status=='200'){
								if(res.data.status=='0'){
									this.$message({
										message:this.$t('tooltipMes.diSuccess'),
										type:'success'
									})

								}
								this.getUsers()
							}
						}).catch(e => {
							console.log(e)
						})
					}).catch(() => {})
				}else{//禁用的状态 ，点击启用
					this.$confirm(this.$t('customer.accNumber')+`:${row.name}`,this.$t('confirm.conRun'),this.$t('confirm.tooltip'),{
						type:'warning'
					})
					.then(() => {
						this.$ajax.put('/admin/to_enable_admin/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status=='200'){
								if(res.data.status=='0'){
									this.$message({
										message:this.$t('tooltipMes.enSuccess'),
										type:'success'
									})
									this.getUsers()
								}
							}
						}).catch(e => {
							console.log(e)
						})
					} ).catch(() => {})
				}
				
			},

			handleSee(index,row){
				//查看详情
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
							var str=res.data.data;
							this.editForm={
								creation_time:datedialogFormat(str.creation_time),
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
								this.editForm.usable=this.$t('Public.enable');
							}else{
								this.editForm.usable=this.$t('Public.Prohibit')
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
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{
					type:'warning'
				})
				.then( () => {
					this.$ajax.del('/admin/del_admin/'+row.id+'?token='+this.token)
					.then(res => {
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
							}
							this.getUsers();
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
				this.$confirm(this.$t('confirm.titles'),this.$t('confirm.tooltip'),{
					type:'warning'
				})
				.then(() => {
					let para={ids:ids};
					this.$ajax.del('/admin/del_admins'+'?token='+this.token,para)
					.then( res => {
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
							}
							this.getUsers();
						}
					})
					.catch(e => {
						console.log(e)
					})
				}).catch(() => {})
			},
			handleExport(command){
				//选择当初当前页还是所有页
				var _this=this;
				if(_this.users.length==0){
					this.$message({
						message:this.$t('confirm.dataEmt'),
						type:'warning'
					})
				}else{
					if(command=='all'){
						this.$confirm(this.$t('confirm.conExportAll'),this.$t('confirm.tooltip'),{
							type:'warning'
						})
						.then(() => {
							this.exportData()
						}).catch(() => {})
					}else if(command=='current'){
						this.$confirm(this.$t('confirm.conExportCur'),this.$t('confirm.tooltip'),{

							type:'warning'
						}).then(() => {
							var para={
								page:this.currentPage,
								per_page:this.pagesize
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
					res.data.data.items.map(item => {
						item.creation_time=datedialogFormat(item.creation_time)
					})
					this.excelData=res.data.data.items
					this.export2Excel();
				}).catch(e => {
					console.log(e)
				})
			},
			export2Excel(){
				let that=this;
				require.ensure([] ,() => {
					const {export_json_to_excel} = require('@/excel/export2Excel')
					const tHeader=[this.$t('Public.creation'),this.$t('Public.name'),this.$t('customer.phone'),this.$t('customer.email'),this.$t('Public.description'),this.$t('roles.role')];
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