<template>
	<div>
		<!--角色设置-->
		<section>
			<!--顶部工具栏-->
			<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
				<el-form :inline='true' :model='filters' ref='filters'>
					<el-form-item label='名称' prop='name'>
						<el-input v-model='filters.name'></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' @click='getUsers'>搜索</el-button>
						<el-button type='info' @click='reset'>重置</el-button>
					</el-form-item>
					
				</el-form>
			</el-col>
			
			<el-col :span='24'>
				<el-col :span='4'>
					<el-button type='primary' @click='addUsers()'>+添加角色</el-button>
				</el-col>
				<el-col :span='20' class='table-top'>
					<el-button type='danger'  @click='batchRemove(sels)' :disabled="this.sels.length===0">批量删除</el-button>
					
				</el-col>
			</el-col>

			<!--主体数据部分-->
			<el-table :data ="users"  highlight-current-row style='width: 100%;' @selection-change="selsChange" 
				:default-sort = "{prop: 'creation_time', order: 'descending'}" v-loading='loading'>
				<el-table-column type='selection' width='60'></el-table-column>
				<el-table-column type='index' min-width='60' label='序号' align='center'>
				</el-table-column>
				<el-table-column prop='creation_time' sortable width='101' :formatter='dateFormat' label='创建时间' align='center'>
				</el-table-column>
				<el-table-column prop='name' min-width='150' label='角色名称' align='center'>
				</el-table-column>
				<el-table-column  min-width='150' label='角色状态' align='center'>
					<template slot-scope='scope'>
						<span :class='scope.row.color' v-text="scope.row.usableText"></span>
					</template>
				</el-table-column>
				<el-table-column prop='descriptionVal' min-width='200' label='描述' align='center'>
				</el-table-column>
				<el-table-column  width='300' label='操作' align='center'>
					<template slot-scope='scope'>
						<!--下面的这个是对角色的启用和禁用的设置-->
						<el-button size='small'  @click='handleSta(scope.$index, scope.row)' class='btnStatus'>{{scope.row.btnText}}</el-button>
						<el-button size='small' type='info' @click='handleSee(scope.$index, scope.row)'>详情</el-button>
						<el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>				
						<el-button size='small' type='danger' @click='handleDel(scope.$index, scope.row)'>删除</el-button>
						
					</template>
				</el-table-column>
			</el-table>
			
			<!--底部工具栏-->
			<!--<el-col :span='24'>
				<el-col :span='3'>
					<el-button type='danger'  @click='batchRemove(sels)' :disabled="this.sels.length===0">批量删除</el-button>
				</el-col>
			</el-col>-->
		</section>
	</div>
</template>

<script>
		import {descriptionValue} from '@/assets/js/index.js'
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
			getUsers(){
				this.loading=true;
				//获取所有数据
				this.$ajax.get('/role/roles'+'?token='+this.token)
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
									ele.usableText='可用';

									ele.btnText='禁用';
								}else if(!ele.usable){
									ele.color='colorRed'
									ele.usableText='禁用';

									ele.btnText='启用';	
								}
							})
							this.users=res.data.data.items;
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
				var   btnText=document.getElementsByClassName('btnStatus');
				if(btnText[index].textContent=='禁用'){
					console.log('禁用');
					this.$confirm('确定要禁用该角色吗?','提示',{})
					.then(() => {
						
						this.$ajax.put('/role/to_disable_role/'+row.id+"?token="+this.token)
						.then(res => {
							console.log(res);
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'禁用成功！',
										type:'success'
									})
									
									btnText[index].textContent='启用';
									this.getUsers();
								}else{
									this.$message({
										message:res.data.message,
										type:'warnings'
									})
								}
							}
						})
					}).catch(() => {})
				}else if(btnText[index].textContent=='启用'){
					console.log('启用');
					this.$confirm('确定要启用该角色吗?','提示 ',{})
					.then(() => {
						
						this.$ajax.put('/role/to_enable_role/'+row.id+'?token='+this.token)
						.then(res => {
							console.log(res);
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'启用成功!',
										type:'success'
									})
									btnText[index].textContent='禁用';
									this.getUsers();
								}else{
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}
							}
						})
					}).catch(() => {})
				}
			},
			handleDel(index,row){
				//删除
				this.$confirm('确认要删除该角色吗？','提示',{
					type:'warning'
				})
				.then(() => {
					
					
					this.$ajax.del('/role/del_role/'+row.id+'?token='+this.token)
					.then (res => {
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.$message({
									message:'删除成功！',
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
				.catch(( e) => {
					console.log(e)
				})
			},
			selsChange:function(sels){
				//选择
				this.sels=sels
			},
			batchRemove:function(rows){
				//批量删除
				var ids=[];
				rows.forEach(ele => {
					ids.push(ele.id)
				})
				this.$confirm('确认要删除选中的数据吗?','提示',{
					type:'warning '
				})
				.then(() => {
					let para={ids:ids};
				
					this.$ajax.del('/role/del_roles'+'?token='+this.token,para)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'删除成功！',
									type:'success'
								})
								this.getUsers()
							}else{
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
			//获取表格里面的数据
			//表格里面的 数据导出
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