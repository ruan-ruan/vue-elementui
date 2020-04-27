<template>
	<div>
		<section>
			<el-row class='toolbar'>
				<el-col :span='24'>
					<el-form :inline='true' :model='filters' ref='filters'>
						<el-form-item :label='$t("multi.multiName")' prop='name'>
							<el-input v-model='filters.name' class='sel_chart'></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.tenant")'prop='tenant_id'>
							<el-select v-model='filters.tenant_id' filterable class='sel_chart'>
								<el-option v-for='(item,index) in tenantData'
									:label='item.name'
									:value='item.id'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label='$t("multi.multiStatus")'prop='status'>
							<el-select v-model='filters.status' filterable class='sel_chart'>
								<el-option v-for='(item,index) in virStatus'
									:label='item.name'
									:value='item.value'
									:key='index'>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item >
							<el-button  size='small'type='primary'  @click='getUsers'> {{$t('topFilters.search')}}</el-button>
							<el-button size='small' type='info' @click='reset'> {{$t('topFilters.reset')}}</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			
			<el-row v-if='filProps'>
				<el-col :span='24'>
				<el-col :span='4'>
					<div v-if='buttonVal.add'>
						<el-button size='small' @click='add' type='primary'
							>{{$t('multi.addMulti')}}</el-button>	
					</div>
				</el-col>
				<el-col :span='20' class='table-top'  v-if='buttonVal.del'  >
					<el-button type='danger' size='small'  @click='batchRemove(sels)':disabled="this.sels.length===0" >
						{{$t('tabOperation.delete')}}</el-button>
				</el-col>
			</el-col>
			</el-row>
			
			
			
			<el-table :data='users' highlight-current-row @selection-change="selsChange"style='width: 100%;' 
				v-loading='loading' >
				<el-table-column type='selection' width='60' v-if='(typeof clounID !=="undefined"?false:true)'></el-table-column>
				<el-table-column type='index' width='90' :label='$t("Public.index")'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="creation_time"  :label="$t('Public.creation')" align='center' width='80' :formatter='dateFormat' >
				</el-table-column>
				<el-table-column prop='name':label='$t("multi.multiName")' align='center'min-width='130' ></el-table-column>
				<el-table-column :label='$t("multi.multiStatus")' align='center'width='80' >
					<template slot-scope='scope'>
						<!--:class="scope.row.color"-->
						<span  :class="scope.row.color">{{scope.row.statusName}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='len':label='$t("multi.assPoints")' align='center'min-width='150' >
					<template slot-scope='scope'>
						<span>{{scope.row.endpoints?scope.row.endpoints.length:''}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='tenant.name':label='$t("Public.tenant")' align='center'min-width='150' ></el-table-column>
				<el-table-column prop='descriptionVal':label='$t("Public.description")' align='center'min-width='150' ></el-table-column>
				<el-table-column :label='$t("Public.operation")' align='center' width='140' v-if='filProps'>
					<template slot-scope='scope' v-if='scope.row.status == "creating" ? false : true ' >
						<el-button size='mini' type='warning' @click='handleSta(scope.$index,scope.row)' v-if='buttonVal.run?  scope.row.status == "failure"? false : true :buttonVal.run'>{{scope.row.btnStatus}}</el-button>
						<el-button size='mini' type='info' @click='handleDetails(scope.$index,scope.row)'v-if='buttonVal.see'>{{$t('tabOperation.info')}}</el-button>
						 <el-button size='mini' type='primary' @click='handleEdit(scope.$index,scope.row)' v-if='buttonVal.edit?(typeof clounID !=="undefined"?false:scope.row.status == "failure"?false:true):buttonVal.edit'>
							{{$t('tabOperation.edit')}}</el-button>
						<el-button size='mini' type='danger'@click='handleDel(scope.$index,scope.row)'v-if='buttonVal.del? (typeof clounID !=="undefined"? false: scope.row.status == "failure"?true:false  ): buttonVal.del'>
							{{$t('tabOperation.delete')}}</el-button> 
						
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
          			></el-pagination>
				</el-col>
			</el-row>
			
			<el-dialog :title='textMap[dialogStatus]' :visible.sync="dialogFormVisible":close-on-click-modal="false"  v-loading='editLoading'>
				<el-form :model='editForm' ref='editForm' label-width='200px' :rules='editFormRules'>
					<el-form-item :label='$t("multi.multiName")' prop='name'>
						<el-input v-model='editForm.name' class='ipt'></el-input>
					</el-form-item>
					<el-form-item :label='$t("Public.tenant")' prop='tenant_id'>
						<el-select v-model='editForm.tenant_id' class='ipt'>
							<el-option v-for='(item,index) in tenantData'
								:label='item.name'
								:value='item.id'
								:key='index'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label='$t("Public.description")' prop='des'>
						<el-input type='textarea' v-model='editForm.des'class='ipt'></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					 <el-button size='small' @click.native="dialogFormVisible=false">{{$t('tabOperation.cancel')}}</el-button>
					<!--添加-->
					<el-button size='small' type="primary"  @click='addSubmit'>{{$t('tabOperation.Submit')}}</el-button>
					
				</div>
			</el-dialog>
			
			
		</section>
	</div>
</template>

<script>
	
	import {descriptionValue} from '@/assets/js/index.js'
	
	export default{
		name:"multiPoint",
		/**nodeDetail  节点组件传过来的详情 ---id
		 * clounID     云对接 详情界面   --id
		 * logicID     逻辑口管理里面  ---id
		 * tenantID    租户里面详情里面对应的--- id
		 * */
		props:['virTit','clounID','logicID','nodeDetail','tenantID','search_port','search_device'],
		data(){
			return{
				token:'',
				filters:{
					name:'',
					tenant_id:'',
					status:''
				},
				virStatus:[
					{
						name:this.$t('Public.servicing'),
						value:'servicing'
					},{
						name:this.$t('Public.stopping'),
						value:'stopping'
					},{
						name:this.$t('Public.failure'),
						value:'failure'
					},{
						name:this.$t('Public.creating'),
						value:'creating'
					}
				],
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
	
				
				tenantData:[],
				textMap:{
//					update: "编辑虚拟组网",
		        	create: this.$t('multi.newAdd'),
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
					name:[{ required: true, message: this.$t('multi.plaMultiName'), trigger: 'blur' },],
					tenant_id:[{ required: true, message: this.$t('Public.plaChaTenant'), trigger: 'change' },],
				},
				buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 
			  		add:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list, "vll@add_virtual_host").show,//添加	
			  		del:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list, "vll@del_vll").show,//单个删除和批量的删除是绑定在一起的  
			  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list,"vll@edit_virtual_host").show,//编辑的值
			  		see:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list, "vll@multi_vll_info").show,//查看详情
			  		run:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list,"vll@to_serve_vll" ).show,//运行
			  		stop:this.codeVal(this.recursion( this.$store.state.aside ,"aside.pointsMultiInter").list,"vll@to_stop_vll" ).show,//停止
			  	}
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getUsers();
			console.log(this.search_port)
		},
		mounted(){
			this.getTenant();
//			console.log(this.logicID)
			
		},
		computed:{
			filProps(){
				if(this.nodeDetail || this.clounID || this.logicID || this.tenantID){
					return false;
				}else{
					return true;
				}
				
			}
		},
		methods:{
			handleSta(index,row){
				if(row.status == 'servicing'){
					this.$confirm(this.$t('confirm.conStop'),this.$t('confirm.tooltip'),{
						type:'warning'
					}).then( () =>{
						return this.$ajax.put('/vll/to_stop_vll/'+row.id+'?token='+this.token)
					}).then(res => {
						if(res.status == 200){
							if(res.data.status ==0){
								this.$message({
									message:this.$t('tooltipMes.stopSuccess'),
									type:'success'
								})
								this.getUsers()
							}
						}
						
					}).catch(e => {console.log(e)})
				}else if(row.status =='stopping'){
					this.$confirm (this.$t('confirm.conRun'),this.$t('confirm.tooltip'),{
						type:'success'
					}).then( () => {
						return this.$ajax.put('/vll/to_serve_vll/'+row.id+'?token='+this.token)
					} ).then(res => {

						if(res.status == 200){
							if(res.data.status ==0){
								this.$message({
									message:this.$t('tooltipMes.runSuccess'),
									type:'success'
								})
								this.getUsers()
							}
						}
					}).catch(e => {console.log(e)})
				}
			},
			getTenant(){//获取租户标识的数据
				let obj={};
				let para={
					search_usable:true
				}
				this.$ajax.get('/tenant/tenants'+'?token='+this.token,para)
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
			        search_tenant: typeof this.tenantID !='undefined'?this.tenantID: this.filters.tenant_id,
			        search_node:(typeof this.nodeDetail !=='undefined' ? this.nodeDetail:''),
			        search_logic_port:(typeof this.logicID !=='undefined' ?this.logicID:''),
			        search_status:this.filters.status,
			        search_device:typeof this.search_device !=='undefined'?this.search_device:'',
        			search_port:typeof this.search_port !=='undefined'? this.search_port :'',
				}
				this.$ajax.get('/vll/multi_vlls'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.loading=false
							descriptionValue(res.data.data.items);
							res.data.data.items.map(item => {
								if(item.status == 'servicing'){
									item.statusName=this.$t('Public.servicing');
									item.btnStatus=this.$t('tabOperation.stop');
									item.color='backRun';
									//colorGreen  backRun colorRed colorWarning
								}else if(item.status == 'stopping'){
									item.statusName=this.$t('Public.stopping');
									item.btnStatus=this.$t('tabOperation.run');
									item.color='backStop';
								}else if(item.status == 'creating'){
									item.statusName=this.$t('Public.creating');
									item.color='backCreat';
								}else if(item.status == 'failure'){
									item.statusName=this.$t('Public.failure');
									item.color='backWarn'

								}
							})
							this.users=res.data.data.items;
							this.total=res.data.data.page.total;
//							console.log(this.users)
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
								if(res.status==200){
									if(res.data.status==0){
										this.$message({
											message:this.$t('tooltipMes.addSuccess'),
											type:'success'
										})
										this.$refs['editForm'].resetFields();
										this.dialogFormVisible=false;
										this.getUsers()
									}
								}
							}).catch(e => {console.log(e)})
						// }).catch(() => {})
					}
				})
			},
			handleDetails(index,row){    //组网详情
				this.$router.push({
					path:'/business/detailsMultipoint',
					query:{
						detailsID:row.id,
					}
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
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{type:'warning'})
				.then(() => {
					this.$ajax.del('/vll/del_vll/'+row.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									messae:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
								this.getUsers()
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
	                    message:this.$t('tooltipMes.delSuccess'),
	                    type: "success"
	                  });
	                 
	                }
	                this.getUsers();
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