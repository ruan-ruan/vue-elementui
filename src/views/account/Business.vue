<template>
	<div>
		<!--业务经理-->
		<section>
			<!--顶部工具栏-->
			<el-col :span='24' class='toolbar ' style='padding-bottom: 0px;'>
				<!--@submit.native.prevent-->
				<el-form :inline='true' :model='filters' ref='filters'>
					<el-form-item label='名称'>
						<el-input v-model='filters.name'></el-input>
					</el-form-item>
					<el-form-item label='手机'>
						<el-input v-model='filters.mobile'></el-input>
					</el-form-item>
					<el-form-item label='邮箱'>
						<el-input v-model='filters.email'></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' @click='getUsers'> 搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type='info' @click="reset(filters)">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type='success' @click="addUsers(editForm)">添加</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			
			<el-col :span='24'>
					<el-dropdown split-button type='success' @command="handleExport">
						导出数据
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item command="current">当前页 </el-dropdown-item>
							<el-dropdown-item command="all">所有页</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
			</el-col>
			<!--数据部分-->
			<el-col :span='24'>
				<el-table :data='users' highlight-current-row @select-change='selsChange(sels)' v-loading='loading'>
					<el-table-column type='selection' width='60' >						
					</el-table-column>
					<el-table-column type='index'label='序号' align='center' width='60' >						
					</el-table-column>
					<!--:formatter='dateFormat'-->
					<el-table-column  prop='creation_time' :formatter='dateFormat' label='创建时间'   width='120'  align='center'>						
					</el-table-column>
					<el-table-column  prop='name' label='名称'   width='120'  align='center'>						
					</el-table-column>
					<el-table-column  prop='email' label='邮箱'   width='160'  align='center'>						
					</el-table-column>
					<el-table-column  prop='mobile' label='手机号'   width='160'  align='center'>						
					</el-table-column>
					<el-table-column  prop='roles[0].name' label='角色名称'   width='120'  align='center'>						
					</el-table-column>
					<el-table-column  prop='description' label='备注'   width='120'  align='center'>						
					</el-table-column>
					<el-table-column   label='操作'   width='300'  align='center'>	
						<template slot-scope='scope'>
							<el-button size='small' type='info' @click='handleSee(scope.$index,scope.row)'>详情</el-button>
							<el-button size='small' type='primary' @click='handleEdit(scope.$index,scope.row)'>编辑</el-button>
							<el-button size='small' type='danger' @click='handleDel(scope.$index,scope.row)'>删除</el-button>	
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			
			<!--底部工具栏-->
			<el-col :span='24' class='toolbar'>
				<el-col :span='4'>
					<el-button type='danger' click='batchRemove(sels)' :disabled="this.sels.length===0">批量删除</el-button>
				</el-col>
				<el-col :span='20'>
					<el-pagination
						:total='total'
						@size-change='handleSizeChange'
						@current-change='handleCurrentChange'
						layout='total ,sizes,prev,pager,next,jumper'
						:page-sizes='[10,20,30,50]'
						:page-count='pageNum'
						:pager-count='pagecount'>
						
					</el-pagination>
				</el-col>
			</el-col>
			
			
			<!--添加和编辑部分-->
			<el-dialog :title='textMap[dialogStatus]' :visible.sync='dialogFormVisible' :close-on-click-modal="false">
				<el-form :model='editForm' ref='editForm' :rules='editFormRules' label-width='100px'>
					<el-form-item label='名称' prop='name'>
						<el-input v-model='editForm.name' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='角色' prop='role_ids'>
						<!--<el-input v-model='editForm.role_ids' class='ipt'></el-input>-->
						<el-select v-model='editForm.role_ids'>
							<!--<el-option></el-option>-->
						</el-select>
					</el-form-item>
					<el-form-item label='手机号' prop='mobile'>
						<el-input v-model='editForm.mobile' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='邮箱' prop='email'>
						<el-input v-model='editForm.email' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='密码' prop='passwd'>
						<el-input type='password' v-model='editForm.passwd' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='确认密码' prop='password_confirm'>
						<el-input type='password' v-model='editForm.password_confirm' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='备注' >
						<el-input type='textarea' v-model='editForm.description' class='ipt'></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class="dialog-footer">
					<el-button @click.native='dialogFormVisible=false'>取消</el-button>
					<el-button type='success' v-if='dialogStatus=="creat"' @click='creatData'>保存</el-button>
					<el-button type='primary' v-else-if='dialogStatus=="update"' @click='updateData'>保存</el-button>
				</div>
			</el-dialog>
		</section>

	</div>
</template>

<script>


	import {dateFormat,str} from '@/utils/time'
	export default{
		name:'Business',
		data(){
			var validatePass2 =(rule,value ,callback) => {
				if(value===''){
					 callback(new Error('请再次输入密码'));
				}else if(value !==this.editForm.passwd){
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
		          console.log(reg.test(value));
		          if (reg.test(value)) {
		            callback();
		          } else {
		            return callback(new Error('请输入正确的手机号'));
		          }
		        }
			};
			return{
				token:'',
				filters:{
					name:'',
					mobile:'',
					email:''
				},
				users:[],
				sels:[],
				loading:false,
//				分页参数
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,
				textMap:{
					update:'编辑',
					creat:'增加'
				},
				dialogStatus:'',
				dialogFormVisible:false,
				editFormRules:{
					name:[{ required: true, message: '请输入名称', trigger: 'blur' },
            			{ min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }],
					
					passwd:[ { validator: validatePass,required: true, trigger: 'blur' }],
					password_confirm:[ { validator:validatePass2,required: true, trigger: 'blur' }],
					mobile:[{validator:Mobile,required: true, trigger: 'blur'}],
					email:[  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
     						 { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
     				role_ids:[{ required: true, message: '请选择角色', trigger: 'change' }]
				},
				editForm:{
					name:'',
					email:'',
					passwd:'',
					mobile:'',
					role_ids:'',
					password_confirm:''
				},
				roles:[],
				te:[]
			}
		},
		computed:{
			roles(){
				return this.$store.state.roles;
				console.log(this.$store.state.roles)
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getUsers();
			
		},
		methods:{

			reset(sels){

				for(let i in sels){
					sels[i]='';
				}

			},
						//分页的选择页面显示个数和点击其他的分页的时候显示数据
			handleSizeChange(val){
//				console.log(`每页${val}条`);
				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
//				let _this=this;
				this.currentPage=val;
//				console.log(`当前页数是:${val}`)
				this.getUsers()
			},
			getUsers(){
//				console.log(this.$store.state.roles)
				//获取所有的数据
				this.loading=true;
				let para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.name,
					search_email:this.filters.email,
					search_mobile:this.filters.mobile
				}
				
				this.$ajax.get('/manager/managers'+'?token='+this.token,para)
				.then(res => {
					console.log(res)
					if(res.status=='200'){
						if(res.data.status=='0'){
							this.loading=false;
							var str=res.data.data.items;
							this.users=res.data.data.items;
							str.forEach(ele => {
//								console.log(ele.roles)
//								this.users=ele
							})
//							console.log(this.users)
							this.total=res.data.data.page.total;
						}else{
							console.log('对不起请求出错了')
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			addUsers( sels){
				//添加
				this.dialogFormVisible=true;
				this.dialogStatus='creat';
				for(let key in sels){
					sels[key]=''
				}
				this.$nextTick(() => {
					 this.$refs["editForm"].resetFields();       // this.$refs.adduserform.resetFields();
				});
				
			},
			creatData:function(){
				//添加的保存
				this.$refs.editForm.validate(valid => {
					if(valid){
						// this.$confirm('确认要添加吗?','提示',{
						// 	type:'success'
						// }).then(() => {
							let para={
								name:this.editForm.name,
								password:this.editForm.passwd,
								email:this.editForm.email,
								mobile:this.editForm.mobile,
								role_ids:this.editForm.role_ids,
								description:this.editForm.description
							}
							
							this.$ajax.post('/manager/add_manager'+'?token='+this.token,para)
							.then(res => {
								if(res.status=='200'){
									if(res.data.status=='0'){
										this.$message({
											message:'添加成功!',
											type:'success'
										})
										this.dialogFormVisible=false;
										this.getUsers()
									}else if(res.data.status){
										this.$message({
											message:'添加失败',
											type:'danger'
										})
									}
								}
							}).catch(e => {
								console.log(e)
							})
						// }).catch((e) => {
						// 	console.log(e)
						// })
					}
				})
			},
			handleSee(index,row){
				//详情
			},
			handleEdit(index,row){
				//编辑
			},
			updateData:function(){
				//编辑的保存
			},
			handleDel(index,row){
				//删除
			},
			selsChange(sels){
				//多选
				this.sels=sels	
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
							
							this.exportData()
						}).catch(() => {
							
						})
					}
				}												
			},
			exportData:function(params){
				
				this.$ajax.get('/manager/managers'+'?token='+this.token,params)
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
			//当数据绑定在表格中  直接转换的时候
		        let date = new Date(parseInt(row.creation_time) * 1000);
		        let Y = date.getFullYear() + '-';
		        let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
		        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
		        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
		        let m = date.getMinutes()  < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
		        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
		        return Y + M + D + h + m + s;
				
			}
		}
	}
</script>

<style >
	
	.ipt{
		width: 300px;
	}
</style>