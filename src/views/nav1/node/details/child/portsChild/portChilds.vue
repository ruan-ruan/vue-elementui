<template>
	<div>
		<!--端口的子组件的公用-->
		<section>
			<el-form  label='80px'>
				<el-form-item label='设备名称:'>
					<span v-text='title.name'></span>
				</el-form-item>
				<el-form-item label='管理IP:'>
					<span v-text='title.ip'></span>
				</el-form-item>
			</el-form>
			<el-table :data='users' highlight-current-row  style="width: 100%;">
				<el-table-column type='index' width='70' align='center'label='序号' >
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='name' width='100' align='center'label='端口名称' >					
				</el-table-column>
				<el-table-column prop='status' width='100' align='center'label='端口状态' >					
				</el-table-column>
				<el-table-column prop='max_speed' width='80' align='center'label='速率(Mbps)' >					
				</el-table-column>
				<el-table-column prop='mac' width='80' align='center'label='Mac地址' >					
				</el-table-column>
				<el-table-column width='80' align='center'label='是否为业务端口' >	
					<template slot-scope='scope'>
						{{ scope.row.available ? '是' : '否'}}
					</template>
				</el-table-column>
				<el-table-column prop='description' width='100' align='center'label='描述信息' >					
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
						<el-input type='textarea' v-model='editForm.note' class='ipt_sels'></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class="dialog-footer">
					<el-button @click.native='dialogFormVisible=false' >取消</el-button>
					<el-button @click='updateData' type='primary'>保存</el-button>
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
					ip:'',
					id:''
				}
				
			}
		},
		watch:{
			titleOne:{
				handler:function (newVal){
					console.log(newVal)
					this.getList(newVal.id)
					this.title.id=newVal.id;
					this.title.name=newVal.hostname;
					this.title.ip=newVal.ip
	
				},
				deep:true
			},
			
			titleTwo:{
				handler(newVal,oldVal){
					console.log(newVal)
					this.getList(newVal.id)
					this.title.id=newVal.id;
					this.title.name=newVal.hostname;
					this.title.ip=newVal.ip
				},
				deep:true
			}

		},
		created(){
			this.token=sessionStorage.getItem('token');
			console.log(this.titleTwo);
			console.log(this.titleOne)
			if(typeof this.titleTwo   !=='undefined'){
				this.getList(this.titleTwo.id);
				this.title.id=this.titleTwo.id;
				this.title.name=this.titleTwo.hostname;
				this.title.ip=this.titleTwo.ip
			}
			if(typeof this.titleOne !=='undefined'){
				this.getList(this.titleOne.id);
				this.title.id=this.titleOne.id;
				this.title.name=this.titleOne.hostname;
				this.title.ip=this.titleOne.ip
				
			}
		},

		methods:{
			handleSizeChange(val){
				console.log(`每页:${val}条`);
				this.pagesize=val;
				this.getList(this.title.id)
			},
			handleCurrentChange(val){
				console.log(`当前是第${val}页`)
				this.currentPage=val;
				this.getList(this.title.id)
			},

			getList(ids){
				var para={
					page:this.currentPage,
					per_page:this.pagesize,
				}
				this.$ajax.get('/node/device_info/'+ids+'/ports'+'?token='+this.token,para)
				.then(res => {
					console.log(res)
					if(res.status==200){
						if(res.data.status==0){
							this.users=res.data.data.items;
							this.total=res.data.data.page.total;
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			getDetails(ids){//获取详情
				
			},
			handleEdit(index,row){
				console.log(row)
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.editForm=Object.assign({} ,row);
//				console.log(this.editForm);
			},
			
			updateData(){
				this.$refs.editForm.validate(valid => {
					if(valid){
							var para={
								note:this.editForm.note,
							}
							this.$ajax.put('/node/edit_port/'+this.editForm.id+'?token='+this.token,para)
							.then( res => {
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'修改成功',
											type:'success'
										})
										this.$refs['editForm'].resetFields();
										this.dialogFormVisible=false;
										this.getList(this.title.id)
//										this.getUsers()
									}
								}
						}).catch(e => {console.log(e)})
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