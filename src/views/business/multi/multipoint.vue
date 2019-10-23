<template>
	<div>
		<section>
			<el-row class='toolbar'>
				<el-col :span='24'>
					<el-form :inline='true' :model='filters' ref='filters'>
						<el-form-item label='组网名称' prop='name'>
							<el-input v-model='filters.name' class='sel_chart'></el-input>
						</el-form-item>
						<el-form-item label='租户标识'prop='tenant_id'>
							<el-select v-model='filters.tenant_id' filterable class='sel_chart'>
								<el-option v-for='(item,index) in tenantData'
									:label='item.name'
									:value='item.id'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item >
							<el-button type='primary'  @click='getUsers'> 搜索</el-button>
							<el-button @click='reset'> 重置</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span='24'>
				<el-col :span='4'>
					<div v-show='(typeof virTit !=="undefined"?false: (typeof clounID !=="undefined"?false:true)) '>
						<el-button @click='add' type='primary'>添加虚拟组网</el-button>	
					</div>
				</el-col>
				<el-col :span='20' class='table-top' :class='(typeof virTit !=="undefined"?"marL": (typeof clounID !=="undefined"?"marL":"table_top")) '  v-if='(typeof clounID !=="undefined"?false:true)' >
					<el-button type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0">
						批量删除</el-button>
				</el-col>
			</el-col>
			</el-row>
			
			
			
			<el-table :data='users' highlight-current-row @selection-change="selsChange"style='width: 100%;' 
				v-loading='loading' :default-sort = "{prop: 'creation_time', order: 'descending'}">
				<el-table-column type='selection' width='60' v-if='(typeof clounID !=="undefined"?false:true)'></el-table-column>
				<el-table-column type='index' width='80' label='序号'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="creation_time" sortable label="时间" align='center' width='95' :formatter='dateFormat' >
				</el-table-column>
				<el-table-column prop='name'label='组网名称' align='center'min-width='150' ></el-table-column>
				<el-table-column prop='len'label='关联端点数' align='center'min-width='150' ></el-table-column>
				<el-table-column prop='tenant.name'label='租户标识' align='center'min-width='150' ></el-table-column>
				<el-table-column prop='descriptionVal'label='备注' align='center'min-width='150' ></el-table-column>
				<el-table-column label='操作' align='center' width='220'>
					<template slot-scope='scope'>
						<el-button size='small' type='info' @click='handleDetails(scope.$index,scope.row)'>详情</el-button>
						 <el-button size='small' type='primary' @click='handleEdit(scope.$index,scope.row)' v-if='(typeof clounID !=="undefined"?false:true)'>
							编辑</el-button>
						<el-button size='small' type='danger'@click='handleDel(scope.$index,scope.row)'v-if='(typeof clounID !=="undefined"?false:true)'>
							删除</el-button> 
						
					</template>
				</el-table-column>
			</el-table>

			<el-row class='toolbar' v-if='(typeof clounID !=="undefined"?false:true)'>
				<el-col :span='24'>
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
            :next-text='next'
          ></el-pagination>
				</el-col>
			</el-row>
			
			<el-dialog :title='textMap[dialogStatus]' :visible.sync="dialogFormVisible":close-on-click-modal="false"  v-loading='editLoading'>
				<el-form :model='editForm' ref='editForm' label-width='100px' :rules='editFormRules'>
					<el-form-item label='组网名称' prop='name'>
						<el-input v-model='editForm.name' class='ipt'></el-input>
					</el-form-item>
					<el-form-item label='租户标识' prop='tenant_id'>
						<el-select v-model='editForm.tenant_id' class='ipt'>
							<el-option v-for='(item,index) in tenantData'
								:label='item.name'
								:value='item.id'
								:key='index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label='备注' prop='des'>
						<el-input type='textarea' v-model='editForm.des'class='ipt'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					 <!--<el-button @click.native="dialogFormVisible=false">取消</el-button>-->
					<!--添加-->
					<el-button size='small' type="primary"  @click='addSubmit'>提交</el-button>
					
				</div>
			</el-dialog>
			
			
		</section>
	</div>
</template>

<script>
	
	import {descriptionValue} from '@/assets/js/index.js'
	
	export default{
		name:'multipoint',
		props:['virTit','clounID','logicID'],//虚拟组网专线  控制添加按钮的隐藏    clounID//节点里面的组网的详情     logicID逻辑口的详情里的id
		data(){
			return{
				token:'',
				filters:{
					name:'',
					tenant_id:'',
				},
				marL:'marL',
				table_top:'table-top',
				users:[],
				sels:[],
				loading:false,
				//分页所需要的参数
			      total: 0,
			      pagesize: 10,
			      currentPage: 1,
			      pageNum: 1,
			      pagecount: 5,
			      next: "下一页",
			      prev: "上一页",
				
				tenantData:[],
				textMap:{
//					update: "编辑虚拟组网",
		        	create: "新增虚拟组网",
				},
				dialogStatus:'',
				editLoading:false,
				dialogFormVisible: false,
				editForm:{
					name:'',
					tenant_id:'',
					des:""
				},
				editFormRules:{
					name:[{ required: true, message: '请输入组网名称', trigger: 'blur' },],
					tenant_id:[{ required: true, message: '请选择租户标识', trigger: 'change' },],
					
				}
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getUsers();
			this.getTenant();
			if(typeof this.clounID !=='undefined'){
				//执行云对接里面的详情的界面的数据
				this.getUsers();//加上 this.clounID
			}
		},
		methods:{
			getTenant(){//获取租户标识的数据
				let obj={}
				this.$ajax.get('/tenant/tenants'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							res.data.data.items.forEach(ele => {
								obj={
									id:ele.id,
									name:ele.name
								}
								this.tenantData.push(obj)
							})
						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
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
				let para={
					page: this.currentPage,
			        per_page:this.pagesize,
			        search_name:this.filters.name,
			        search_tenant:this.filters.tenant_id,
			        search_node:(typeof this.clounID !=='undefined' ? this.clounID:''),
			        search_logic_port:(typeof this.logicID !=='undefined' ?this.logicID:''),
				}
				console.log(para)
				this.$ajax.get('/vll/multi_vlls'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.loading=false
							console.log(res)
							descriptionValue(res.data.data.items);

							this.users=res.data.data.items;
							this.total=res.data.data.page.total
						}
					}
				}).catch(e => {console.log(e)})
			},
			reset(){
				this.$refs['filters'].resetFields();
			},
			add(){
				this.dialogStatus='create'
				this.dialogFormVisible=true;
			},
			addSubmit(){
				this.$refs.editForm.validate(valid => {
					if(valid) {
						// this.$confirm('确定要添加吗?','提示',{})
						// .then(() => {
							var para={
								name:this.editForm.name,
								tenant_id:this.editForm.tenant_id,
								description:this.editForm.des
							}
							this.$ajax.post('/vll/add_virtual_host'+'?token='+this.token,para)
							.then(res => {
								console.log(res)
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:'添加成功!',
											type:'success'
										})
										this.$refs['editForm'].resetFields();
										this.dialogFormVisible=false;
										this.getUsers()
									}else{
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
								}
							}).catch(e => {console.log(e)})
						// }).catch(() => {})
					}
				})
			},
			handleDetails(index,row){    //组网详情
				console.log(row)
				this.$router.push({
								path:'/business/detailsMultipoint',
								query:{
									detailsID:row.id,
								}
							})
				this.$ajax.get('/vll/multi_vll_info/'+row.id+'?token='+this.token)
				.then(res => {
					console.log(res);
					
				})
				.catch(e => {
					console.log(e)
				})

			},
			handleEdit(index,row){//编辑
				this.$router.push({
					path:'/business/editMultipoint',
					query:{
						id:row.id
					}
				})
			},
			handleDel(index,row){//删除
				this.$confirm('确定要删除该数据吗？','提示',{})
				.then(() => {
					this.$ajax.del('/vll/del_vll/'+row.id+'?token='+this.token)
					.then(res => {
						console.log(res);
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									messae:'删除成功!',
									type:'success'
								})
								this.getUsers()
							}else{
								this.$message({
									message:res.data.message,
									type:'warning'
								})
							}
						}
					}).catch(e => {console.log(e)})
				}).catch(() => {})
			},
			selsChange(sel){
				this.sels=sel
			},
			batchRemove:function(rows){
				let ids=[];
				rows.forEach(ele => {
					ids.push(ele.id)
				})
				let para={
					ids:ids
				}
				this.$ajax.del("/vll/del_vlls" + "?token=" + this.token, para)
	            .then(res => {
	              if (res.status == 200) {
	                if (res.data.status == 0) {
	                  this.$message({
	                    message: "删除成功!",
	                    type: "success"
	                  });
	                  this.getUsers();
	                } else {
	                  this.$message({
	                    message: res.data.message,
	                    type: "warning"
	                  });
	                  this.getUsers();
	                }
	              }
	            })
	            .catch(e => {
	              console.log(e);
	            });
			},
			dateFormat(row, column) {
		      	let date = new Date(parseInt(row.creation_time) * 1000);
		      	let Y = date.getFullYear() + "-";
		      	let M =date.getMonth() + 1 < 10  ? "0" + (date.getMonth() + 1) + "-" : date.getMonth() + 1 + "-";
		      	let D =  date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
		      	let h = date.getHours() < 10  ? "0" + date.getHours() + ":"  : date.getHours() + ":";
		        let m = date.getMinutes() < 10  ? "0" + date.getMinutes() + ":"  : date.getMinutes() + ":";
		        let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		      return Y + M + D + h + m + s;
		    },
		}
	}
</script>

<style>
	.marL{
		margin-left: 16.6%;
	}
</style>