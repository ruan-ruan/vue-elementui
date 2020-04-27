<template>
	<div>
		<!--端口的子组件的公用-->
		<section>
			<el-form  label='200px'>
				<el-form-item :label='$t("Public.deviceName")+"："'>
					<span v-text='title.name'></span>
				</el-form-item>
				<el-form-item :label='$t("Public.manageIP")+"："'>
					<span v-text='title.ip'></span>
				</el-form-item>
			</el-form>
			<el-table :data='users' highlight-current-row  style="width: 100%;">
				<el-table-column type='index' align='center':label='$t("Public.index")' >
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='name'  align='center':label='$t("Public.portName")' >					
				</el-table-column>
				<el-table-column prop='status'  align='center':label='$t("Public.poerStatus")' >					
				</el-table-column>
				<el-table-column prop='max_speed'  align='center':label='$t("Public.speed")+"(Mbps)"' >					
				</el-table-column>
				<el-table-column prop='mac'  align='center':label='$t("Public.macAddress")' >					
				</el-table-column>
				<el-table-column  align='center':label='$t("Public.yesNoPort")' >	
					<template slot-scope='scope'>
						{{ scope.row.available ? $t("Public.yes") : $t("Public.no")}}
					</template>
				</el-table-column>
				<el-table-column align='center':label='$t("Public.information")' >
					<template slot-scope='scope'>
						{{ scope.row.description | descriptionValue }}
					</template>
				</el-table-column>
				<el-table-column  align='center':label='$t("Public.description")' >	
					<template slot-scope='scope'>
						{{ scope.row.note | descriptionValue }}
					</template>
				</el-table-column>
				<el-table-column  align='center':label='$t("Public.operation")' >
					<template slot-scope='scope'>
						<el-button size='mini' type='primary'@click="handleEdit(scope.$index, scope.row)">{{$t('tabOperation.edit')}}</el-button>
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
			     	:page-size='pagesize'
			     	:page-count='pageNum'
			     	:pager-count="pagecount"
			     	>					
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
					<el-button @click.native='dialogFormVisible=false' >{{$t('tabOperation.cancel')}}</el-button>
					<el-button @click='updateData' type='primary'>{{$t('tabOperation.save')}}</el-button>
				</div>
			</el-dialog>
		</section>
	</div>
</template>

<script>
	export default{
		name:'childs',
		props:['titleOne','titleTwo'],  //,'titleOne','titleTwo'  逻辑端口部分
		data(){
			return{
				//获取用户的权限
				token:sessionStorage.getItem('token'),
				//接收数据
				users:[],
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,
				//编辑部分的参数
				dialogFormVisible:false,
				textMap:{
					update:this.$t('tabOperation.edit')
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

					this.getList(newVal.id)
					this.title.id=newVal.id;
					this.title.name=newVal.hostname;
					this.title.ip=newVal.ip
	
				},
				deep:true
			},
			
			titleTwo:{
				handler(newVal,oldVal){

					this.getList(newVal.id)
					this.title.id=newVal.id;
					this.title.name=newVal.hostname;
					this.title.ip=newVal.ip
				},
				deep:true
			}

		},
		created(){

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

				this.pagesize=val;
				this.getList(this.title.id)
			},
			handleCurrentChange(val){

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
	
				this.dialogStatus='update';
				this.dialogFormVisible=true;
				this.editForm=Object.assign({} ,row);

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
										message:this.$t('tooltipMes.editSuccess'),
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
		}
	}
</script>

<style>
</style>