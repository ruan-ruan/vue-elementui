<template>
	<div>
		<!--端口的子组件的公用-->
		<section>
			<el-form  label='80px'>
				<el-form-item label='设备名称'>
					<!--<template>{{title.name}}</template>-->
					<!--<span v-text=''></span>-->
				</el-form-item>
				<el-form-item label='管理IP'>
					<!--<template>{{title.ip}}</template>-->
				</el-form-item>
			</el-form>
			<el-table :data='users' highlight-current-row  style="width: 100%;">
				<el-table-column type='index' width='70' align='center'label='序号' >					
				</el-table-column>
				<el-table-column prop='name' width='100' align='center'label='端口名称' >					
				</el-table-column>
				<el-table-column prop='status' width='100' align='center'label='端口状态' >					
				</el-table-column>
				<el-table-column prop='max_speed' width='150' align='center'label='速率(Mbps)' >					
				</el-table-column>
				<el-table-column prop='mac' width='150' align='center'label='Mac地址' >					
				</el-table-column>
				<el-table-column prop='description' width='160' align='center'label='描述信息' >					
				</el-table-column>
				<el-table-column prop='note' width='160' align='center'label='备注' >					
				</el-table-column>
				<el-table-column  width='100' align='center'label='操作' >
					<template slot-scope='scope'>
						<el-button size='small' type='primary'@click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--底部工具条-->
			<el-col>
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
			<!--编辑部分-->
			<el-dialog :title='textMap[dialogStatus]' :visible.sync='dialogFormVisible' :close-on-click-modal="false" >
				<el-form :model='editForm' label-width='40px' ref='editForm' >
					<el-form-item label='备注'>
						<el-input type='textarea' v-model='editForm.note'></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class="dialog-footer">
					<el-button @click.native='dialogFormVisible=false' >取消</el-button>
					<el-button @click='updateData' type='success'>保存</el-button>
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>
//	import {base} from '@/api/api'
	export default{
		name:'childs',
		props:['titleOne','titleTwo'],  //,'titleOne','titleTwo'  逻辑端口部分
		data(){
			return{
				//获取用户的权限
				token:'',
				//接收数据
				users:[],
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,
				next:'下一页',
				prev:'上一页',
				//编辑部分的参数
				dialogFormVisible:false,
				textMap:{
					update:'编辑'
				},
				dialogStatus:'',				
				editForm:{
					note:'',
//					id:''
				},
				ids:'',
				title:{
					name:'',
					ip:''
				}
				
			}
		},
		created(){
			var dataStr=[this.titleOne,this.titleTwo];
			dataStr.forEach(ele => {
				if(typeof ele  !='undefined'){
//					this.ids=ele;
					this.users=ele
				}
			})
//			this.getUsers()
			this.token=sessionStorage.getItem('token');
			console.log(this.token);
		},
		methods:{
			handleSizeChange(val){
				console.log(`每页:${val}条`);
				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
				console.log(`当前是第${val}页`)
				this.currentPage=val;
				this.getUsers()
			},
//			getUsers(){
////				console.log()
//				var para={
//					page:this.currentPage,
//					per_page:this.pagesize,
////					token:this.token
//				}
//				this.$axios({
//					method:'get',
//					url:base+'/node/node_info/'+this.ids+'/ports'+"?token="+this.token,
//					params:para
//				})
//				.then(res => {
////					console.log(res)
//					if(res.status==200){
//						if(res.data.status==0){
//							this.users=res.data.data.items;
//							this.total=res.data.data.page.total;
//						}
//					}
//				}).catch( e => {
//					console.log(e)
//				})
//			},
			handleEdit(index,row){
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.editForm=Object.assign({} ,row);
//				console.log(this.editForm);
			},
			updateData(){
				this.$refs.editForm.validate(valid => {
					if(valid){
						this.$confirm('确认要提交吗?','提示',{
							type:'info'
						})
						.then( () => {
							var para={
								note:this.editForm.note,
							}
							this.$ajax.put('/node/edit_port/'+para.id+'?token='+this.token,para)
							.then( res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功',
											type:'success'
										})
										this.$refs['editForm'].resetFields();
										this.dialogFormVisible=false;
										this.getUsers()
									}else if(res.data.message){
										this.$message({
											message:res.data.msg,
											type:'warning'
										})
									}
								}else{
									this.$message({
										message:res.status,
										type:'warning'
									})
								}
							})
							.catch(e => {
								console.log(e)
							})
						})
					}
				})
			}
		},
		mounted(){

		}
	}
</script>

<style>
</style>