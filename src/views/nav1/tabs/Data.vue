<template>
	<div>
			<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-col :span='24'>
						
						<el-form :inline="true" :model="filters">
							<!--<el-col :span='18'>-->
							<el-form-item label='名称'>
								<!--名字-->
								<el-input v-model="filters.name" placeholder="请输入名称"></el-input>
							</el-form-item>
							<el-form-item label='所属区域:'>
								<el-select v-model='filters.search_region' placehoder='全部' class='sel' @change='selectArea(filters.search_region)'>
									<el-option
										v-for='(item,index) in areaData'
										:key='index'
										:label='item.name'
										:value='item.id'>
									</el-option>
								</el-select>
								<el-select v-model='filters.city_id' class='sel' >
									<el-option
										v-for='(item,index) in cityData'
										:key='index'
										:label='item.name'
										:value='item.id'>										
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" v-on:click="getDatas">查询</el-button>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="handleAdd">新增</el-button>
							</el-form-item>
							<el-form-item>
								<el-dropdown split-button type='success'@command="handleExport">
									导出数据
									<el-dropdown-menu slot='dropdown'>
										<el-dropdown-item command="current">当前页 </el-dropdown-item>									
										<el-dropdown-item command="all">所有页</el-dropdown-item>																				
									</el-dropdown-menu>
								</el-dropdown>
							</el-form-item>
						</el-form>	
					</el-col>

				</el-col>
		
				<!--列表-->
				<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;">
					<el-table-column type="selection" width="70" align='center'>
					</el-table-column>
					<el-table-column type="index" width="70" label='序号' align='center'>
					</el-table-column>
					<el-table-column prop="id" label="ID" width="150" align='center'>
					</el-table-column>
					<el-table-column prop="name" label="名称" width="120" align='center'>
					</el-table-column>
					<el-table-column prop="region.name" label="所属区域" min-width="150" align='center'>
					</el-table-column>
					<el-table-column prop="city.name" label="所属城市" min-width="150" align='center'>
					</el-table-column>
					<el-table-column prop="description" label="备注" min-width="150"align='center' >
					</el-table-column>
					<el-table-column label="操作" width="260"align='center'>
						<template slot-scope="scope">
							<el-button size='small' type='info' @click='handleSee(scope.$index,scope.row)'>详情</el-button>
							<el-button size="small"type='success' @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)"  >删除</el-button>
						</template>
					</el-table-column>
				</el-table>
		
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-col :span='3'>
						<el-button type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0">批量删除</el-button>
					</el-col>
					<el-col :span='21'>
						<el-pagination 
							:total='total' 
							layout="total, sizes, prev, pager, next, jumper"
							@size-change='handleSizeChange' 
							@current-change="handleCurrentChange" 
							:page-sizes="[10, 20, 50, 100]"
							:page-count='pageNum' 
							:pager-count="pagecount"
						    :prev-text='prev'
						    :next-text='next'>
						</el-pagination>
					</el-col>
					
				</el-col>
		
				<!--编辑界面-->
				<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
					<el-form label-position='left' :model="editForm" label-width="80px" label-ailgn='center' :rules="editFormRules" ref="editForm">
						<el-form-item label="名   字" prop='name'>
							<el-input v-model="editForm.name"  auto-complete="off" class='ipt_sels'></el-input>
						</el-form-item>
						<el-form-item label='所属区域' prop='region_id' >		
								<el-select  v-model='editForm.region_id'   @change='selectArea(editForm.region_id)' class='sel' >
									<el-option
										v-for='(item,index) in areaData'
										:key='index'
										:label='item.name'
										:value='item.id'>	
									</el-option>
								</el-select>
								<el-select v-model='editForm.city_id' class='sel'>
									<el-option
										v-for='(item,index) in cityData'
										:key='index'
										:label='item.name'
										:value='item.id'>										
									</el-option>
									
								</el-select>
							</el-form-item>
						<el-form-item label="备注" prop='description'>
							<el-input type="textarea" v-model="editForm.description" class='ipt_sels'></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						 <el-button @click.native="dialogFormVisible=false">取消</el-button>
						<!--添加-->
						<el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
						  <!--编辑-->
			        	<el-button v-else type="primary" @click="updateData">保存</el-button>
						<!-- <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button> -->
					</div>
					
				</el-dialog>
				<!--详情界面-->
				<el-dialog :title="textMap[dialogStatus]":visible.sync="dialog"  :close-on-click-modal="false">
					<el-form label-position='left' :model="seeForm" label-width="80px"  ref="seeForm">
						<el-form-item label="名称:" >
							<template>
								<span v-text="seeForm.name"></span>
							</template>
						</el-form-item>
						<el-form-item label="所属区域:" >
							<template>	
								<span v-text="seeForm.region.name"></span>
							</template>
						</el-form-item>
						<el-form-item label="所属城市:" >
							<template>
								<span v-text="seeForm.city.name"></span>
							</template>
						</el-form-item>
						<el-form-item label="描述:">
							<template>
								<span v-text="seeForm.description"></span>
							</template>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						 <el-button @click.native="dialog=false">取消</el-button>
					</div>
				</el-dialog>
			</section>	
	</div>
</template>


<script>

	
	export default{
		name:'City',
		data() {
		    return {
		    	token:'',
			    activeName:'first',
			    dialogStatus: "",
			    textMap: {
			        update: "编辑",
			        create: "新增",
			        see:'详情'
			    },
			    dialogFormVisible: false,
			    filters: {
			        name: "",
					search_region:'',
					city_id:''
					
			    },
			      //详情界面的数据
			    seeForm:{
			      	//时间戳
			      	creation_time:'',
			      	description:'',
			      	id:'',
			      	name:'',
			      
			      	region:{
			      		id:'',
			      		name:''
			      	},
			      	city:{
			      		id:'',
			      		name:''
			      	}
			    },
			    Time:0,
			    dialog:false,
			      //加载等待时间
			    loading:false,
			      //保存获取的列表的数据
			    users: [],
			      //分页部分的数据
			    pagesize:10,
			    currentPage:1,
			    total: 0,
			    pageNum:1,
			    pagecount:5,
			    next:'下一页',
		  		prev:'上一页',
			    sels: [], //列表选中列
			    editFormRules: {
			        id:[{required:true, message:'请输入id', trigger:'bur'}],
			        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],    
			        region_id:[{ required: true, message: "请选择区域", trigger: "change , blur" },
			        { required: true, message: "请选择城市", trigger: "change" }],
			        
			    },
			      //编辑界面数据
			    editForm: {
			        name: "",
			        region_id:'',
			        city_id:'',
			        description: "",
			        region_val:'',
			      	city_val:"",
			    },
			    backUp:{},//编辑的时候数据的备份
			    areaData:[],
			    cityData:[],
			    addFormVisible: false, //新增界面是否显示
	
			    excelData:[],
			    base:'',
		    };
		},
		created(){
			this.token=sessionStorage.getItem('token');	
			this.getData()
		},
		methods: {
			getData(){
				this.$ajax.get('/location/regions'+'?token='+this.token)
		  		.then(res => {
		  			if(res.status==200){
		  				if(res.data.status==0){
		  					this.areaData=res.data.data.items;
		  				}
		  			}
		  		}).catch(e => {
		  			console.log(e)
		  		})
			},
		  	selectArea(sels){
		  	//获取城市对应的接口数据
				var para={
					search_region:sels,
				}
				this.$ajax.get('/location/cities'+'?token='+this.token,para)
				.then(res => {
					this.cityData=res.data.data.items;
				}).catch( e => {
					console.log(e)
				})
		  	},
			handleSizeChange(val){
				this.pagesize=val;
				this.getDatas()
			},
		    handleCurrentChange(val) {
		         let _this=this;
    			_this.currentPage=val
		      	this.getDatas();
		    },
		    //获取城市列表
		    getDatas() {

			    this.listLoading = true;
				var para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.name,
					search_region:this.filters.search_region,
				}
				this.$ajax.get('/location/dcs'+'?token='+this.token,para)
				.then( res => {
					if(res.status==200){
						if(res.data.status==0){
							this.total = res.data.data.page.total;
					        this.pageNum=res.data.data.page.pages;
							this.users=res.data.data.items;
					        this.listLoading = false;
						}
					}
				}).catch( e => {
					console.log(e)
				})
		    },
		    //删除
		    handleDel: function(index, row) {
		      this.$confirm("确认删除该记录吗?", "提示", {
		        type: "warning"
		      })
		        .then(() => {
		            this.listLoading = true;
					this.$ajax.del('/location/del_dc/'+row.id+'?token='+this.token)
		          	.then(res => {
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.listLoading = false;
								this.$message({
									message:'删除成功!',
									type:'success'
								})
				                this.getDatas();
							}else if(res.data.status){
								this.$message({
									message:res.data.message,
									type:'warning'
								})
							}
						}		           
		          })
		          .catch( e =>{console.log(e); 	})
		       }).catch(() => { });
		    },
		    //查看详情界面
		    handleSee:function(index,row){
		    	this.dialogStatus='see';
		    	this.dialog=true;
		    	this.seeForm=Object.assign({}, row);
		    	this.editLoading = true;
		    	//克隆赋值
				this.$ajax.get('/location/dc_info/'+row.id+'?token='+this.token,)
				.then( res =>{
					if(res.status==200){
						if(res.data.status==0){
							this.seeForm=res.data.data
						}
					}
				})
				.catch(e => {
					console.log( e)
				})
		    },
		    //显示编辑界面
		    handleEdit: function(index, row) {
		     	this.dialogStatus = "update";
		     	this.dialogFormVisible = true;
				console.log(row)
				this.editForm={
					region_id:row.region.name,
					region_val:row.region.id,
					city_id:row.city.name,
					city_val:row.city.id,
					id:row.id,
					description:row.description,
					name:row.name
				};
				this.backUp=Object.assign({} ,row);
		    },
		    //显示新增界面
		    handleAdd: function() {
		      	this.dialogStatus = "create";
		      	this.dialogFormVisible = true;
		      	this.editForm = {
			        id: "",
			        name: "",
					region_name:'',
			        description: "",
			        region_id:'',
			        city_id:''
				}
		    },
		    //编辑
		    updateData:function() {
			    this.$refs.editForm.validate(valid => {
			        if (valid) {
			        //   this.$confirm("确认提交吗？", "提示", {})
			        //     .then(() => {
			                this.editLoading = true;
							let para={};
							if(this.editForm.region_id==this.backUp.region.name){
								para.region_id=this.editForm.region_val;
								para.city_id=this.editForm.city_val;
							}else{
								para.region_id=this.editForm.region_id;
								para.city_id=this.editForm.city_id;
							}
			              	let  params={
			              		name:this.editForm.name,
			              		description:this.editForm.description,
			              		city_id:para.city_id,
			              		region_id:para.region_id
			              	}
							this.$ajax.put('/location/edit_dc/'+this.editForm.id+"?token="+this.token,params)
			              	.then((res) => {
				              	if(res.status=='200'){
				              		if(res.data.status=='0'){
				              			this.editLoading = false;
										this.$message({
											message:'编辑成功!',
											type:'success'
										})
										this.$refs["editForm"].resetFields();
						                 this.dialogFormVisible = false;
						                this.getDatas();
									}else if(res.data.status){
										this.$message({
											message:res.data.message,
											type:'warning'
										})
									}
				              	}		              	
			              	}).catch(e => {console.log(e)})
			            // }).catch(() => { });
			        }
			    });
		    },
		    //新增
		    createData: function() {
		      this.$refs.editForm.validate(valid => {
		        if (valid) {
		          	// this.$confirm("确认提交吗？", "提示", {})
		            // .then(() => {
		                this.editLoading = true;
		              	let para = Object.assign({}, this.editForm);	              
						this.$ajax.post('/location/add_dc'+'?token='+this.token,para)
			            .then(res => {
			              	if(res.status=='200'){
								if(res.data.status=='0'){
									this.addLoading = false;
									this.$message({
										message:'添加成功!',
										type:'success'
									})
									this.$refs["editForm"].resetFields();
					                this.dialogFormVisible = false;
					                //this.addFormVisible = false;
					                this.getDatas();
								}else if(res.data.status){
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}		              		
			              	}
			            }).catch( e =>{console.log(e)})
		            // }) .catch(() => { });
		        }
		      });
		    },
		    //全选单选多选
		    selsChange: function(sels) {
		      this.sels = sels;
		    },
		    //批量删除
		    batchRemove: function(rows) {
				var ids=[];
				rows.forEach(ele => {
					ids.push(ele.id)
				})
		      	this.$confirm("确认删除选中记录吗？", "提示", {
		        	type: "warning"
		      	})
		        .then(() => {
			        this.listLoading = true;
			        let para = { ids: ids };
					this.$ajax.del('/location/del_dcs'+'?token='+this.token,para)
			        .then(res => {
			          	if( res.status=='200'){
							if(res.data.status=='0'){
								this.listLoading = false;
								this.$message({
									message:'删除成功!',
									type:'success'
								})
								this.getDatas();
							}else if(res.data.status){
								this.$message({
									message:res.data.message,
									type:'warning'
								})
							}
			          	}
			        }).catch(e => {console.log(e)})
		        }).catch(() => {});
		    },
		    handleExport(command){
		    		if(command=='all'){
			    		//导出所有的数据
			    		this.$confirm('确定要导出所有的数据吗?','提示',{
			    			confirmButtonText:'确定',
			    			cancelButtonText:'取消',
			    			type:'warning'
			    		}).then(() => {
			    			
			    			this.exportData()
			    		}).catch(() => {
                			});
			    	}else if(command=='current'){
			    		//导出当前
			    		this.$confirm('确定要导出当前页数据吗?','提示',{
			    			type:'warning'
			    		}).then(() => {
			    			var para={
			    				page:this.currentPage,
			    				per_page:this.pagesize
			    			}
			    			this.exportData(para)
			    		}).catch(() => {
            				});
			    	}
			    },
			    exportData:function(params){
					this.$ajax.get('/location/dcs'+'?token='+this.token,params)
			    	.then(res => {
			    		if(res.status==200){
			    			if(res.data.status==0){
			    				this.$message({
			    					message:'正在下载，请稍等!',
			    					type:'success'
			    				})
			    				res.data.data.items.forEach(ele => {
			    					ele.region_name=ele.region.name;
			    				})
			    				this.excelData=res.data.data.items;
								this.export2Excel();
			    			}else{
			    				this.$message({
			    					message:res.data.message,
			    					type:'warning '
			    				})
			    			}
			    		}
			    	}).catch(e => {console.log(e)})
		    },
			//数据写入excel表格里面
			export2Excel(){
				let that=this;
				require.ensure([],() => {
					const {export_json_to_excel} =require('@/excel/export2Excel');
					const tHeader=['id','名称','所属区域','备注'];
					const filterVal=['id','name','region_name','description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,'下载数据excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map (j => v[j]))
			}
		},
		mounted() {
		    this.getDatas();
		},
	}
</script>

<style>

</style>