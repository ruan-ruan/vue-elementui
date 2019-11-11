<template>
	<div>
		<!--角色设置-->
		<section>
			<!--顶部工具栏-->
			<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
				<el-form :inline='true' :model='filters' ref='filters'>
					<el-form-item :label='$t("Public.name")' prop='name'>
						<el-input v-model='filters.name'></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size='small' type='primary' @click='getUsers'>{{$t('topFilters.search')}}</el-button>
						<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
					</el-form-item>
					
				</el-form>
			</el-col>
			
			<el-col :span='24'>
				<el-col :span='4'>
					<el-button size='small' type='primary' @click='addUsers()'>+{{$t('aside.addRole')}}</el-button>
				</el-col>
				<el-col :span='20' class='table-top'>
					<el-button size='small' type='danger'  @click='batchRemove(sels)' :disabled="this.sels.length===0">{{$t('tabOperation.batchDel')}}</el-button>
					<el-dropdown size='small' split-button type='success' @command="handleExport" >
						{{$t('tabOperation.derived.tit')}}
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>
							<el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>

			<!--主体数据部分-->
			<el-table :data ="users"  highlight-current-row style='width: 100%;' @selection-change="selsChange" 
				 v-loading='loading'>
				<el-table-column type='selection' align='center'></el-table-column>
				<el-table-column type='index':label='$t("Public.index")' align='center'>
				</el-table-column>
				<el-table-column prop='creation_time'  width='80' :formatter='dateFormat' :label='$t("Public.creation")' align='center'>
				</el-table-column>
				<el-table-column prop='name' :label='$t("roles.roleName")' align='center'>
				</el-table-column>
				<el-table-column   :label='$t("roles.roleStatus")' align='center'>
					<template slot-scope='scope'>
						<span :class='scope.row.color' v-text="scope.row.usableText"></span>
					</template>
				</el-table-column>
				<el-table-column prop='descriptionVal' :label='$t("Public.description")' align='center'>
				</el-table-column>
				<el-table-column  width='180' :label='$t("Public.operation")' align='center'>
					<template slot-scope='scope'>
						<!--下面的这个是对角色的启用和禁用的设置-->
						<el-button size='mini'type='warning'  @click='handleSta(scope.$index, scope.row)' class='btnStatus'>{{scope.row.btnText}}</el-button>
						<el-button size='mini' type='info' @click='handleSee(scope.$index, scope.row)'>{{$t('tabOperation.info')}}</el-button>
						<el-button size='mini' type='success' @click='handleEdit(scope.$index, scope.row)'>{{$t('tabOperation.edit')}}</el-button>				
						<el-button size='mini' type='danger' @click='handleDel(scope.$index, scope.row)'>{{$t('tabOperation.delete')}}</el-button>
						
					</template>
				</el-table-column>
			</el-table>
			<el-col :span='24'  class='toolbar'>
	          <el-pagination
	            :total="total"
	            @size-change="handleSizeChange"
	            @current-change="handleCurrentChange"
	            layout="total, sizes, prev, pager, next, jumper"
	            :page-sizes="[10, 20, 30,50]"
	            :current-page.sync="currentPage"
	            :page-count='pageNum'
	            :pager-count="pagecount"

	          ></el-pagination>
        </el-col>

		</section>
	</div>
</template>

<script>

		import {descriptionValue,datedialogFormat} from '@/assets/js/index.js'
	export default{
		name:'Role',
		data(){
			return{
				//权限
				token:'',
				filters:{
					name:''
				},
				users:[],
				loading:false,
				sels:[],
				total: 0,
			    pagesize: 10,
			    currentPage: 1,
			    pageNum: 1,
			    pagecount: 5,

			}
		},
		created(){
			//获取权限
			this.token=sessionStorage.getItem('token');
			this.getUsers();
			
		},
		methods:{
			reset(){
				this.$refs['filters'].resetFields()
			},
			addUsers(){
				//添加
				this.$router.push({path:'/account/roles/add'})
			},
			//分页的选择页面显示个数和点击其他的分页的时候显示数据
		    handleSizeChange(val) {
		      this.pagesize = val;
		      this.getUsers();
		    },
		    handleCurrentChange(val) {
		      this.currentPage = val;
		      this.getUsers();
		    },
			getUsers(){
				this.loading=true;
				//获取所有数据
				let para={
					 page: this.currentPage,
				        per_page: this.pagesize,
				        search_name: this.filters.name,
				}
				this.$ajax.get('/role/roles'+'?token='+this.token,para)
				.then(res => {
					console.log(res)
					if(res.status==200){
						if(res.data.status==0){
							this.loading=false;
							//将数据同步到 store里面
							descriptionValue(res.data.data.items)
							
							res.data.data.items.forEach(ele => {
								if(ele.usable){
									ele.color='colorGreen'
									ele.usableText=this.$t('Public.enable');

									ele.btnText=this.$t('Public.Prohibit');
								}else if(!ele.usable){
									ele.color='colorRed'
									ele.usableText=this.$t('Public.Prohibit');

									ele.btnText=this.$t('Public.enable');
								}
							})
							this.users=res.data.data.items;
							this.total = res.data.data.page.total;
							this.$store.state.roles=this.users;
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
			
			},

			handleSee(index,row){
				//查看详情
				this.$router.push({path:'/account/roles/details/'+row.id})
			},
			handleEdit(index,row){
//				console.log(row);
				//编辑
				this.$router.push({
					path:'/account/roles/editForm',
					query:{
						roleID:row.id
					}
				})
				//将该数据的保存的仓库里面的，以便于在编辑额的界面的使用
				this.$store.state.editRoel=row;
				console.log(row);
			},
			handleSta(index,row){
				//角色的禁用和启用
				console.log(row)
				if(row.usable){//状态为可用   点击  为禁用
					this.$confirm(this.$t('roles.plaDis'),this.$t('confirm.tooltip'),{type:'warning'})
					.then(() => {
						
						this.$ajax.put('/role/to_disable_role/'+row.id+"?token="+this.token)
						.then(res => {
							console.log(res);
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.disSuccess'),
										type:'success'
									})
									this.getUsers();
								}else{
									this.$message({
										message:res.data.message,
										type:'warnings'
									})
								}
							}
						}).catch(e => {console.log(e)})
					}).catch(() => {})
				}else if(!row.usable){//状态为禁用  ，点击 为可用
					this.$confirm(this.$t('roles.plaEnable'),this.$t('confirm.tooltip'),{type:'warning'})
					.then(() => {
						
						this.$ajax.put('/role/to_enable_role/'+row.id+'?token='+this.token)
						.then(res => {
							console.log(res);
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.enSuccess'),
										type:'success'
									})
									this.getUsers();
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

			},
			handleDel(index,row){
				//删除
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{
					type:'warning'
				})
				.then(() => {
					
					
					this.$ajax.del('/role/del_role/'+row.id+'?token='+this.token)
					.then (res => {
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.$message({
									message:this.$t('tabOperation.delSuccess'),
									type:'success'
								})
								this.getUsers()
							}else if(res.data.status){
								this.$message({
									message:res.data.message,
									type:'danger'
								})
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
				})
				.catch(( e) => {
					console.log(e)
				})
			},
			selsChange:function(sels){
				//选择
				this.sels=sels
			},
			batchRemove:function(rows){
				console.log(rows)
				//批量删除
				var ids=[];
				rows.forEach(ele => {
					ids.push(ele.id)
				})
				this.$confirm(this.$t('confirm.titles'),this.$t('confirm.tooltip'),{
					type:'warning '
				})
				.then(() => {
					let para={ 
						ids:ids
					};
				
					this.$ajax.del('/role/del_roles'+'?token='+this.token,para)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('tabOperation.delSuccess'),
									type:'success'
								})
								this.getUsers()
							}else{
								this.$message({
									message:res.data.message,
									type:'danger'
								})
								this.getUsers()
							}
						}
					})
					.catch(e => {
						console.log(e)
					})
				})
				.catch(( e) => {
					console.log(e)
				})
			},
			
			//获取表格里面的数据
			
			handleExport(command){
				//选择当初当前页还是所有页
				var _this=this;
				if(_this.users.length == 0){
//					console.log('数据为空不能执行')
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
					console.log(res);
					res.data.data.items.map(item => {
						item.creation_time=datedialogFormat(item.creation_time)
					})
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
					const tHeader=[this.$t('Public.creation'),this.$t('Public.name'),this.$t('customer.phone'),this.$t('customer.email'),this.$t('Public.description'),this.$t('roles.role')];
					const filterVal=['creation_time','name','mobile','email','description','roles.name'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,this.$t('tooltipMes.download')+'excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			
			dateFormat(row,column){
	    		//将时间戳转换为前端的时间
	    		let date=new Date(parseInt(row.creation_time)*1000);
	    		let Y=date.getFullYear()+'-';
	    		let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
	    		let D=date.getDate() <10? '0' +date.getDate() +' ':date.getDate()+' ';
	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	    		return Y + M + D + h + m + s	    		
	    	},
		}
	}
</script>

<style>
</style>