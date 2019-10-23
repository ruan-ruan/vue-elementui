<template>
	<div>

			<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters" ref='filters' @submit.native.prevent >
						<el-form-item label='名称' prop='name'>
							<el-input v-model="filters.name" placeholder="请输入名称"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="getUsers" >查询</el-button>
							<el-button type='info' @click='reset'>重置</el-button>
						</el-form-item>
					</el-form>	
				</el-col>
		
				<!--列表-->
				<el-col :span='24'>
					<el-col :span='4'>
						<el-button type="primary" @click="handleAdd">新增</el-button>
					</el-col>
					<el-col :span='20'class="table-top"	>
						<el-button type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0">批量删除</el-button>
						<el-dropdown split-button type='success'@command="handleExport">
							导出数据
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command="current">当前页 </el-dropdown-item>									
								<el-dropdown-item command="all">所有页</el-dropdown-item>																				
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-col>

				<el-table  :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;" 
					v-loading='loading' :default-sort = "{prop: 'creation_time', order: 'descending'}">
					<el-table-column type="selection"  align='center'>
					</el-table-column>
					<el-table-column type="index"  label='序号' align='center'>
						<template slot-scope='scope'>
							<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="creation_time" sortable label="创建时间" align='center' width='101' :formatter='dateFormat' >
					</el-table-column>
					<el-table-column prop="name" label="名称" align='center' min-width='120'>
					</el-table-column>
					<el-table-column prop="descriptionVal" label="备注"  align='center' min-width='120'>
					</el-table-column>
					<el-table-column label="操作"  align='center' width='220'>
						<template slot-scope="scope" style="width: 100%;">
							<el-button size='small' type='info' @click='handleSee(scope.$index, scope.row)'>详情</el-button>
							<el-button size="small"type='success' @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span='24' class="toolbar">
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
				     	  :next-text='next' >						     	
				     </el-pagination>
				</el-col>
		
				<!--编辑界面-->
				<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"  v-loading='editLoading'>
					<el-form label-position='left' :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm" >
						<el-form-item label="名字" prop="name">
							<el-input v-model="editForm.name" auto-complete="off" class='ipt_sels' ></el-input>
						</el-form-item>
						<el-form-item label="备注">
							<el-input type="textarea" v-model="editForm.description" class='ipt_sels' ></el-input>
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
				<el-dialog  :title="textMap[dialogStatus]":visible.sync="dialog"  :close-on-click-modal="false" v-loading='editLoading'>
					<el-form label-position='left' :model="seeForm" label-width="80px"  ref="seeForm">
						<el-form-item label="创建时间:" >
							<template>
								<span v-text="Time"></span>
							</template>
						</el-form-item>
						<el-form-item label="ID :" >
							<template>
								<span v-text='seeForm.id'></span>
							</template>
						</el-form-item>
						<el-form-item label="区域名称:" >
							<template>
								<span v-text="seeForm.name"></span>
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


	import util from "@/common/util";
	import {datedialogFormat,descriptionValue} from '@/assets/js/index.js'
	export default {
		name:'Area',
	
	  	data() {
		    return {
		    	//详情界面的是否可编辑部分
		    	disab:true,
		    	
		    	activeName:'first',
		      	dialogStatus: "",
		      	dialog:'',
		      	textMap: {
		        	update: "编辑",
		        	create: "新增",
		        	see:'详情'
		      	},
		      	dis:'disabled',
		      	dialogFormVisible: false,
		      	filters: {
		       		name: ""
		      	},
		      //加载等待
		      	loading:false,
		            
		      //保存获取的列表的数据
		      	users: [],
		      	total: 0,
		//	  page:1,
			  	pagesize:10,
			  	currentPage:1,
			  	pageNum:1,
			  	pagecount:5,
			  	next:'下一页',
			  	prev:'上一页',
			  
		      	sels: [], //列表选中列
		        editLoading: false,
		      	editFormRules: {
		        	name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
		      	},
		      //编辑界面数据
		      	editForm: {
		        	id: "",
		        	name: "",
		        	description: ""
		      	},
		      //详情界面
		      	seeForm:{
		      	//时间戳
		      		creation_time:'',
		      		description:'',
		      		id:'',
		      		name:''
		      	},
		      	Time:0,
		      	dialog:false,
		      	addFormVisible: false, //新增界面是否显示
		      	addFormRules: {
		        	name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
		      	},
		      	excelData:[],
		      	token:'',
				url:'',
		    };
	  	},
	  	created(){
			this.token=sessionStorage.getItem('token');
			this.getUsers();
	  	},
	  			
		mounted() {
//		    console.log(this.users)
		    this.bus.$emit('Area',this.users);
		},
		methods: { 	
			reset(){
				this.$refs['filters'].resetFields();
			},
		//改变的时候
			handleSizeChange(val){
				console.log(`每页${val}条`);
				this.pagesize=val;
				this.getUsers();
			},
			//条目改变的时候
		    handleCurrentChange(val) {
		    	let _this=this;
		    	_this.currentPage=val
		    	console.log(`当前页:${val}`)  
		      this.getUsers();
		    }, 
		    getUsers() {
		    	this.loading=true;
		      	let para = {
			        page: this.currentPage,
			        per_page:this.pagesize,
			        search_name:this.filters.name,
		      	};
				
				this.$ajax.get('/location/regions'+'?token='+this.token,para)
		      	.then(res => {
			      	if(res.status==200){
			      		
			      		if(res.data.status==0){
			      			this.loading=false;
							console.log(res)
							descriptionValue(res.data.data.items)//处理   备注信息

					        this.total=res.data.data.page.total;
					        this.pageNum=res.data.data.page.pages;
							this.users=res.data.data.items;
							//将区域的数据保存到vuexstate的arae
							this.$store.state.area=res.data.data.items;
			      		}
			      	}
			    }).catch(e => {
			    	this.loading=false;
			    	console.log(e)
			    })
		      
		    },
		    //删除
		    handleDel: function(index, row) {
		    	this.$confirm('确定要删除该记录吗？','提示',{})
		    	.then(()=> {

		    		this.$ajax.del('/location/del_region/'+row.id+'?token='+this.token)
		    		.then(res =>{
		    			if(res.status==200){
		    				if(res.data.status==0){
		    					this.$message({
		    						message:'删除成功!',
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
		    		}).catch(e => {
		    			console.log(e)
		    		})
		    	}).catch(() => {
		    		console.log()
		    	})
		   	},
		    //详情界面
		    handleSee:function(index, row){
			    this.dialogStatus = "see";
			    this.dialog = true;
		        this.editLoading = true;       
		        let para = Object.assign({}, this.editForm);
				this.$ajax.get('/location/region_info/'+row.id+'?token='+this.token)
		        .then(res => {
		          	this.seeForm=res.data.data;
		          	//将时间戳转化为时间格式
					this.Time=datedialogFormat(this.seeForm.creation_time)
		            this.editLoading = false;
		
		        })
		        .catch(e => {
		          	console.log(e);
		        })
		    },		    
		    //显示编辑界面
		    handleEdit: function(index, row) {
		      	this.dialogStatus = "update";
		      	this.dialogFormVisible = true;
		      	this.editForm = Object.assign({}, row);
				this.loading=false;
		    },
		    //显示新增界面
		    handleAdd: function() {
		      	this.dialogStatus = "create";
		     	 this.dialogFormVisible = true;
		      	this.editForm = {
		        	name: "",
		        	description: ""
				}
		    },
		    //编辑
		    updateData:function() {
		    	
		      this.$refs.editForm.validate(valid => {

		        if (valid) {

		            let para = Object.assign({}, this.editForm);
					this.$ajax.put('/location/edit_region/'+para.id+'?token='+this.token,para)
		              .then( (res) => {             	
		              	if(res.status=='200'){
		              		if(res.data.status=='0'){
				                this.$message({
				                  message: "修改成功",
				                  type: "success"
				                });
				                this.$refs["editForm"].resetFields();
				                 this.dialogFormVisible = false;
				                this.getUsers();
		              		}else if(res.data.status){
		              			this.$message({
		              				message:res.data.message,
		              				type:'warning '
		              			})
		              		}
		              	}
		                  
		              })
		              .catch(e => {
		              	console.log(e);
		              })

		        }
		      });
		    },
		    //新增
		    createData: function(index,row) {
		      this.$refs.editForm.validate(valid => {
		        if (valid) {
	              let para = Object.assign({}, this.editForm);
					this.$ajax.post('/location/add_region'+'?token='+this.token,para)
					.then((res) => {
						if(res.status=='200'){
							if(res.data.status=='0'){
								this.$message({
					                message: "添加成功",
					                type: "success"
				                });
				                this.$refs["editForm"].resetFields();
								this.dialogFormVisible = false;
								this.getUsers();
							}else if(res.data.status){
								this.$message({
									message:res.data.message,
									type:'warning'
								})
							}
						}  
					})
					.catch(e => {
						console.log(e)
					})
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
					              message: "批量删除成功",
					              type: "success"
					            });
					            this.getUsers();
			          		}else {
			          			this.$message({
			          				message:res.data.message,
			          				type:'warning'
			          			})
			          			 this.getUsers();
			          		}
			          	}    
		          	}).catch(e => {console.log(e)})
		        }).catch(() => {});
		    },
			handleExport(command){
				var _this=this
				if(command=='current'){//当前页的数据
		    		//导出所有的数据
		    		this.$confirm('确定要导出当前页的数据吗?','提示',{
		    			confirmButtonText:'确定',
		    			cancelButtonText:'取消',
		    			type:'warning'
		    		}).then(() => {
		    			var para={
		    				page:this.currentPage,
		    				per_page:this.pagesize
		    			}
		    			this.exportData(para)
		    		}).catch(() =>{
		    			
		    		})
		    	}else if(command=='all'){
		    		//导出当前
		    		this.$confirm('确定要导出所有页数据吗?','提示',{
		    			confirmButtonText:'确定',
		    			cancelButtonText:'取消',
		    			type:'warning'
		    		}).then(() => {
		    			this.exportData()
		    		}).catch(() => {
		    			
		    		})
		    	}		
		    },
		    exportData:function(params){
				this.$ajax.get('/location/regions'+'?token='+this.token,params)
		    	.then(res => {
		    		if(res.status==200){
		    			if(res.data.status==0){
		    				this.excelData=res.data.data.items;
							this.export2Excel();
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
					const {export_json_to_excel} =require('../../../excel/export2Excel');
					const tHeader=['id','名称ID','备注','创建时间'];
					const filterVal=['id','name','description','creation_time'];
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
		      	let D =  date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + "  ";
		      	let h = date.getHours() < 10  ? "0" + date.getHours() + ":"  : date.getHours() + ":";
		        let m = date.getMinutes() < 10  ? "0" + date.getMinutes() + ":"  : date.getMinutes() + ":";
		        let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
//		        var str=Y + M + D+'<br/>' + h + m + s;
//		        document.write(str)
		      return Y + M + D + h + m + s;
		    },
		},

	};
</script>

<style scoped>

</style>