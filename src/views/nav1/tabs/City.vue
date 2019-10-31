<template>
	<div>
		<section>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-col :span='24'>
					<el-form :inline="true" :model="filters" ref='filters'>
						<el-form-item label='名称' prop='name'>
							<el-input v-model="filters.name" placeholder="请输入名称"></el-input>
						</el-form-item>
						<el-form-item label='区域:' prop='value'>
							<el-select v-model='filters.value' placehoder='请选择' filterable class='sel' >
								<el-option
									v-for='(item,index) in areaData'
									:key='index'
									:label='item.name'
									:value='item.id'
									>								
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getCitys">查询</el-button>
							<el-button type='info' @click='reset'>重置</el-button>
						</el-form-item>
						
					</el-form>	
				</el-col>
			</el-col>
			
			<el-col :span='24'>
				<el-col :span='4'>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-col>
				<el-col :span='20' class='table-top'>
					<el-button type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0">批量删除</el-button>
					<el-dropdown split-button trigger="click" type='success'@command="handleExport">
						导出数据
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item command="current">当前页 </el-dropdown-item>									
							<el-dropdown-item command="all">所有页</el-dropdown-item>																				
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>

			<!--列表-->
			<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;"
				:default-sort = "{prop: 'creation_time', order: 'descending'}" v-loading='loading'>
				<el-table-column type="selection" width="50" align='center'>
				</el-table-column>
				<el-table-column type="index" width="50" label='序号' align='center'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="creation_time" sortable label="创建时间" align='center' width='101' :formatter='dateFormat' >
				</el-table-column>
				<el-table-column prop="name" label="名称"  align='center' min-wdith='100'>
				</el-table-column>
				<el-table-column prop="region.name" label="所属区域" align='center'min-width='100' >
				</el-table-column>
				<el-table-column prop="descriptionVal" label="备注"  align='center'min-width='100' >
				</el-table-column>
				<el-table-column label="操作" width="220" align='center'>
					<template slot-scope="scope">
						<el-button size='small' type='info'  @click='handleSee(scope.$index,scope.row)'>详情</el-button>
						<el-button size="small"type='success' @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)"  >删除</el-button>
					</template>
				</el-table-column>
			</el-table>
	
			<!--工具条-->
			<el-col :span='24'  class="toolbar">
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
	
			<!--编辑界面-->
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
				<el-form label-position='left' :model="editForm"  label-width="80px" :rules="editFormRules" ref="editForm">
					<el-form-item label="名称id">
						<el-input v-model="editForm.id"  auto-complete="off" disabled class='ipt_sels'></el-input>
					</el-form-item>
					<el-form-item label="名称" prop="name">
						<el-input v-model="editForm.name" auto-complete="off" class='ipt_sels'></el-input>
					</el-form-item>
					<el-form-item label='所属区域'  prop='region_id'>
							<el-select  v-model='editForm.region_id'    class='sel'>
								<el-option
									v-for='(item,index) in areaData'
									:key='index'
									:label='item.name'
									:value='item.id'>	
								</el-option>
							</el-select>
							<!--<p></p>-->
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
				</div>
				
			</el-dialog>
			<!--详情界面-->
			<el-dialog :title="textMap[dialogStatus]":visible.sync="dialog"  :close-on-click-modal="false" v-loading='editLoading'>
				<el-form label-position='left' :model="seeForm" label-width="80px"  ref="seeForm">
					<el-form-item label="名称ID:" >
						<template>
							<span v-text='seeForm.id'></span>
						</template>
					</el-form-item>
					<el-form-item label="名称:" >
						<template>
							<span v-text="seeForm.name"></span>
						</template>
					</el-form-item>
					<!--region_id-->
					<el-form-item label='所属区域:'>
						<template>
							<span v-text="seeForm.region.name"></span>
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
	
	import {descriptionValue} from '@/assets/js/index.js'
	export default{
		name:'City',
		data() {
		    return {
		    	 token:'',
		    	//选择区域部分
		    	
		    	regions:'',
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
		        	value:'',
		      	},
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
		        	name: [{ required: true, message: "请输入姓名", trigger: "blur"}],
		        	region_id:[ { required: true, message: '请选择区域', trigger: 'change'}]
		      	},
		      //编辑界面数据
		      	editForm: {
//		        	id: "",
		        	name: "",
		        	description: "",
		        	region_id:'',
		        	region_name:''
		      	},
		      	backUp:{},//数据备份
		    //详情界面
		      	seeForm:{
		      		description:'',
		      		id:'',
		      		name:'',
					region:{
						id:'',
						name:''
					}
		      	},
		      	Time:0,
		      	dialog:false,
		      //区域数据name
		     	areaForm:{
		     		name:'',
		     		id:''
		     	},
		     	areaData:[],
		      	addFormVisible: false, //新增界面是否显示
		      	excelData:[],
		      	editLoading:false
		    	};
		  	},
		  created(){
			this.token=sessionStorage.getItem('token');
			this.getCitys();
			this.getArea()
		  },
		  methods: {
		  	reset(){
		  		this.$refs['filters'].resetFields();
		  	},
		  	getArea(){
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
			handleSizeChange(val){
				this.pagesize=val;
				this.getCitys()
			},
		    handleCurrentChange(val) {
		        let _this=this;
    			_this.currentPage=val
		      	this.getCitys();
		    },
		    //获取城市列表
		    getCitys() {
		    this.loading = true;
			 var para={
			 	page:this.currentPage,
			 	per_page:this.pagesize,
			 	search_name:this.filters.name,
			 	search_region:this.filters.value,
			 }
			this.$ajax.get('/location/cities'+'?token='+this.token,para)
		    .then(res => {
		    	if(res.status==200){
		    		if(res.data.status==0){
		    			console.log(res);
		    			this.loading = false;
		    			descriptionValue(res.data.data.items);
		    			this.total = res.data.data.page.total;

						this.users=res.data.data.items;
		    		}
		    	}
		      });
		    },
		    //删除
		    handleDel: function(index, row) {
		      	this.$confirm("确认删除该记录吗?", "提示", {
		        	type: "warning"
		      	})
		        .then(() => {
					this.$ajax.del('/location/del_city/'+row.id+'?token='+this.token,)
		          	.then(res => {
			          	if(res.status==200){
			          		if(res.data.status==0){
					            this.$message({
					              message: "删除成功",
					              type: "success"
					            });
					            this.getCitys();
			          		}else if(res.data.status){
			          			this.$message({
			          				message:res.data.message,
			          				type:'warning'
			          			})
			          		}
			          	}					
		          	}).catch( e =>{
		          	console.log(e)
		          })
		        })
		        .catch(() => { });
		    },
		    //查看详情界面
		    handleSee:function(index,row){
		    	this.dialogStatus='see';
		    	this.dialog=true;
		    	//克隆赋值
		    	this.editLoading=true;

				this.$ajax.get('/location/city_info/'+row.id+'?token='+this.token,)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							this.editLoading = false;
							this.seeForm=res.data.data;
						}
					}
				}).catch(e => {console.log(e)})
		    },
		    //显示编辑界面
		    handleEdit: function(index, row) {
		      	this.dialogStatus = "update";
		      	this.dialogFormVisible = true;
//		      	console.log(row);
				this.backUp=Object.assign({} ,row);
				this.editForm={
					name:row.name,
					region_id:row.region.name,
					id:row.id,
					description:row.description
				}
		    },
		    //显示新增界面
		    handleAdd: function() {
		      this.dialogStatus = "create";
		      this.dialogFormVisible = true;
		      this.editForm = {
		        name: "",
				region_id:'',
		        description: "",
				}
		    },
		    //编辑
		    updateData:function() {
		      this.$refs.editForm.validate(valid => {
		        if (valid) {
	                this.editLoading = true;
					let obj={};
					if(this.editForm.region_id==this.backUp.region.name){
						obj={
							region_id:this.backUp.region.id
						}
					}else{
						obj={
							region_id:this.editForm.region_id
						}
					}
					let para={
						name:this.editForm.name,
						region_id:obj.region_id,
						description:this.editForm.description
					}
					this.$ajax.put('/location/edit_city/'+this.backUp.id+'?token='+this.token,para)
	              	.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.editLoading = false;
				                this.$message({
				                  message: "编辑成功",
				                  type: "success"
				                });
				                this.$refs["editForm"].resetFields();
				                 this.dialogFormVisible = false;
				                this.getCitys();	
							}else if(res.data.status){
								this.$message({
									message:res.data.message,
									type:'warning'
								})
							}
						}

	              }).catch (e => {console.log(e)})
		        }
		      });
		    },
		    //新增
		    createData: function() {
		      this.$refs.editForm.validate(valid => {
		        if (valid) {
		         	//  this.$confirm("确认提交吗？", "提示", {})
		            // .then(() => {
		                this.editLoading = true;
		             	let para = Object.assign({}, this.editForm);
						this.$ajax.post('/location/add_city'+'?token='+this.token,para)
			            .then(res => {
			              	if(res.status=='200'){
			              		if(res.data.status=='0'){
			              			this.addLoading = false;
					                this.$message({
					                    message: "提交成功",
					                    type: "success"
					                });
					                this.$refs["editForm"].resetFields();
					                this.dialogFormVisible = false;
					                this.getCitys();
			              		}else if(res.data.status){
			              			this.$message({
			              				message:res.data.message,
			              				type:'warning'
			              			})
			              		}
			              	} 
			            }).catch(e => {console.log(e)})
		            // }) .catch( ()=> { });
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
				rows.forEach(element =>{
					ids.push(element.id);
				})
		      this.$confirm("确认删除选中记录吗？", "提示", {
		        type: "warning"
		      })
		    .then(() => {
		        let para = { ids: ids };
				this.$ajax.del('/location/del_regions'+'?token='+this.token,para)
		          .then(res => {
		          	console.log(res)
		          	if(res.status=='200'){
		          		if(res.data.status=='0'){

				            this.$message({
				              message: "删除成功",
				              type: "success"
				            });
				            this.getCitys();
		          		}else {
		          			this.$message({
		          				message:res.data.message,
		          				type:'warning'
		          			})
		          			this.getCitys();
		          		}
		          	}
		          })
		          .catch( e => {
		          	console.log(e);
		          })
		        })
		        .catch(() => {	        	
		        });
		    },
		    handleExport(command){
		    	var _this=this;
		    	if(_this.users==''){
		    		this.$message({
		    			message:'数据为空，不能执行导出操作!',
		    			type:'warning'
		    		})
		    	}else if(_this.users!=''){
		    		console.log(_this.users)
//		    		console.log('数据不是空')
					if(command=='all'){
		    		//导出所有的数据
			    		this.$confirm('确定要导出所有的数据吗?','提示',{
			    			confirmButtonText:'确定',
			    			cancelButtonText:'取消',
			    			type:'warning'
			    		}).then(() => {
			    			
			    			this.exportData()
			    		}).catch(() => {
			    			
			    		})
			    	}else if(command=='current'){
			    		//导出当前
			    		this.$confirm('确定要导出当前页数据吗?','提示',{
			    			confirmButtonText:'确定',
			    			cancelButtonText:'取消',
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
				this.$ajax.get('/location/cities'+'?token='+this.token,params)
		    	.then(res => {
		    		if(res.status==200){
		    			if(res.data.status==0){
		    				this.$message({
		    					message:'导出成功!',
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
		    					type:'warning'
		    				})
		    			}
		    		}
		    		
		    	}).catch(e => {
		    		console.log(e)
		    	})
		    },
			//数据写入excel表格里面
			export2Excel(){
				let that=this;
				require.ensure([],() => {
					const {export_json_to_excel} =require('@/excel/export2Excel');
					const tHeader=['id','区域名称','所属区域','备注'];
					const filterVal=['id','name','region_name','description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,'下载数据excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map (j => v[j]))
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

<style lang="scss">

</style>