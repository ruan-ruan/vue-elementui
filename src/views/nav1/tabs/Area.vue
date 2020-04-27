<template>
	<div>
			<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="filters" ref='filters' @submit.native.prevent >
						<el-form-item :label='$t("Public.name")' prop='name'>
							<el-input v-model="filters.name" :placeholder="$t('validateMes.place')+$t('topFilters.name')"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button size='small' type="primary" v-on:click="getUsers" >
								{{$t('topFilters.search')}}
							</el-button>
							<el-button size='small' type='info' @click='reset'>
								<!--重置-->
								{{$t('topFilters.reset')}}
							</el-button>
						</el-form-item>
					</el-form>	
				</el-col>
		
				<!--列表-->
				<el-col :span='24'>
					<el-col :span='4'>
						<el-button size='small' type="primary" @click="handleAdd" v-if='buttonVal.add'>
							<!--新增-->
							{{$t('tabOperation.add')}}
						</el-button>
					</el-col>
					<el-col :span='20'class="table-top"	>
						<el-button size='small' type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0" v-if='buttonVal.del'>
							<!--批量删除-->
							{{$t('tabOperation.batchDel')}}
						</el-button>
						<el-dropdown size='small' split-button type='success'@command="handleExport">
							<!--导出数据-->
								{{$t('tabOperation.derived.tit')}}
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command="current">
								{{$t('tabOperation.derived.currentPage')}}
									
								</el-dropdown-item>									
								<el-dropdown-item command="all">
									<!--所有页-->
								{{$t('tabOperation.derived.allPage')}}
									
								</el-dropdown-item>																				
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-col>

				<el-table  :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;" 
					v-loading='loading' >
					<el-table-column type="selection"min-width='80'  align='center'>
					</el-table-column>
					<el-table-column type="index"  :label='$t("Public.index")' min-width='80' align='center'>
						<template slot-scope='scope'>
							<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="creation_time"  :label='$t("Public.creation")' align='center' width='80' >
						<template slot-scope='scope'>
							{{scope.row.creation_time | timeFormat}}
						</template>
					</el-table-column>
					<el-table-column prop="name" :label='$t("Public.name")' align='center' min-width='120'>
					</el-table-column>
					<el-table-column prop="descriptionVal" :label='$t("Public.description")'  align='center' min-width='120'>
					</el-table-column>
					<el-table-column :label='$t("Public.operation")'  align='center'  width='140'>
						<template slot-scope="scope" style="width: 100%;">
							<el-button size='mini' type='info' @click='handleSee(scope.$index, scope.row)'v-if='buttonVal.see'>
								<!--详情-->
								{{$t('tabOperation.info')}}
							</el-button>
							<el-button size="mini"type='success' @click="handleEdit(scope.$index, scope.row)" v-if='buttonVal.edit'>
								<!--编辑-->
								{{$t('tabOperation.edit')}}
							</el-button>
							<el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)" v-if='buttonVal.del'>
								<!--删除-->
								{{$t('tabOperation.delete')}}
							</el-button>
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
				     	:page-size='pagesize'
				     	:current-page.sync="currentPage"  
				     	:page-count='pageNum'
				     	:pager-count="pagecount"
				     	>						     	
				     </el-pagination>
				</el-col>
		
				<!--添加， 编辑界面   详情界面-->
				<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"  v-loading='editLoading'>
					<el-form  :model="editForm" label-width="200px" :rules="editFormRules" ref="editForm" >
						<el-form-item :label="$t('Form.creation')" v-if=' dialogStatus =="see" ' >
							<span>{{ editForm.creation_time | timeFormat}}</span>
						</el-form-item>
						<el-form-item label="ID :"  v-if=' dialogStatus =="see" ' >
							<el-input v-model='editForm.id' :disabled=' dialogStatus =="see"  '  class='ipt_sels'></el-input>
						</el-form-item>
						<el-form-item :label="$t('Public.name')+'：'" prop="name">
							<el-input v-model="editForm.name" auto-complete="off" class='ipt_sels' :disabled=' dialogStatus =="see"  ' ></el-input>
						</el-form-item>
						<el-form-item :label="$t('Public.description')+':'">
							<el-input type="textarea" v-model="editForm.description" class='ipt_sels'  :disabled=' dialogStatus =="see"  '  ></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						 <el-button size='small' @click.native="dialogFormVisible=false">
						 	<!--取消-->
						 	{{$t('tabOperation.cancel')}}
						 </el-button>
						<!--添加-->
						<el-button size='small'  v-if="dialogStatus=='create'" type="primary" @click="createData">
						 	{{$t('tabOperation.save')}}
						</el-button>
						  <!--编辑-->
			        	<el-button size='small' v-else-if=" dialogStatus=='update' " type="primary" @click="updateData">
						 	{{$t('tabOperation.save')}}
			        	</el-button>
					</div>
				</el-dialog>
			</section>

	</div>
</template>
 
<script>

	import {datedialogFormat,descriptionValue} from '@/assets/js/index.js'
	export default {
		name:'Area',
	
	  	data() {
		    return {
		    	//详情界面的是否可编辑部分
		    	disab:true,
		    	
		    	activeName:'first',
		      	dialogStatus: "",
		      	textMap: {
		        	update: this.$t('tabOperation.edit'),
		        	create: this.$t('tabOperation.add'),
		        	see:this.$t('tabOperation.info')
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
			  	pagesize:10,
			  	currentPage:1,
			  	pageNum:1,
			  	pagecount:5,
		      	sels: [], //列表选中列
		        editLoading: false,
		      	editFormRules: {
		        	name: [{ required: true, message:this.$t('validateMes.place')+this.$t('tooltipMes.name') , trigger: "blur" }]
		      	},
		      //编辑界面数据
		      	editForm: {
		        	id: "",
		        	name: "",
		        	description: ""
		      	},
		      	addFormVisible: false, //新增界面是否显示
		      	addFormRules: {
		        	name: [{ required: true,  message:this.$t('validateMes.place')+this.$t('tooltipMes.name') , trigger: "blur" }]
		      	},
		      	excelData:[],
		      	token:sessionStorage.getItem('token'),
		      	buttonData:this.recursion( this.$store.state.aside , 'physicalPosition.tab.area'),//获取区域内的所有的按钮的权限
		      	buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏
		      		del:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.area').list, "location@del_region").show,//单个删除和批量的删除是绑定在一起的  
		      		edit:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.area').list, "location@edit_region").show,//编辑的值
		      		add:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.area').list, "location@add_region").show,//添加的值
		      		see:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.area').list, "location@region_info" ).show,//查看详情
		      	}
		    };
	  	},
	  	created(){
			this.getUsers();
	  	},	
		methods: { 	
			reset(){
				this.$refs['filters'].resetFields();
			},
			//每页显示数  改变的时候
			handleSizeChange(val){
				this.pagesize=val;
				this.getUsers();
			},
			//条目改变的时候
		    handleCurrentChange(val) {
		    	let _this=this;
		    	_this.currentPage=val
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
			      	this.loading=false;
			      	if(res.status==200){
			      		if(res.data.status==0){
							descriptionValue(res.data.data.items)//处理   备注信息
					        this.total=res.data.data.page.total;
					        this.pageNum=res.data.data.page.pages;
							this.users=res.data.data.items;
							//将区域的数据保存到vuexstate的arae
//							this.$store.state.area=res.data.data.items;
			      		}
			      	}
			    }).catch(e => {
			    	this.loading=false;
			    	console.log(e)
			    })
		      
		    },
		    //删除
		    handleDel: function(index, row) {
		    	const confirmText=[this.$t('confirm.conDel')+row.name+this.$t('confirm.areaMes'),this.$t('confirm.war')];
		    	const newDatas = [];
        		const h = this.$createElement;
        		 for (const i in confirmText) {
		          	newDatas.push(h('p', null, confirmText[i]))
		        }
		    	this.$confirm(this.$t('confirm.tooltip'),{
		    		title: this.$t('confirm.tooltip'),
		    		message: h('div', null, newDatas),
		    		showCancelButton: true,
		            type: 'warning'
		    	})
		    	.then(()=> {

		    		this.$ajax.del('/location/del_region/'+row.id+'?token='+this.token)
		    		.then(res =>{
		    			if(res.status==200){
		    				if(res.data.status==0){
		    					this.$message({
		    						message:this.$t('tooltipMes.delSuccess'),
		    						type:'success'
		    					})
		    					this.getUsers()
		    				}
		    			}
		    		}).catch(e => {
		    			console.log(e)
		    		})
		    	}).catch(() => {
		    	})
		   	},
		    //详情界面
		    handleSee:function(index, row){
			    this.dialogStatus = "see";
			    this.dialogFormVisible = true;
		        this.editForm=row;
		        this.$nextTick(() =>{
		        	this.$refs.editForm.resetFields()
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
		    updateData() {
		    	
		      this.$refs.editForm.validate(valid => {
		        if (valid) {
		            let para = Object.assign({}, this.editForm);
					this.$ajax.put('/location/edit_region/'+para.id+'?token='+this.token,para)
		              .then( (res) => {             	
		              	if(res.status=='200'){
		              		if(res.data.status=='0'){
				                this.$message({
				                  message: this.$t('tooltipMes.editSuccess'),
				                  type: "success"
				                });
				                this.$refs["editForm"].resetFields();
				                 this.dialogFormVisible = false;
				                this.getUsers();
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
					                message: this.$t('tooltipMes.addSuccess'),
					                type: "success"
				                });
				                this.$refs["editForm"].resetFields();
								this.dialogFormVisible = false;
								this.getUsers();
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
			    this.$confirm(this.$t('confirm.titles'), this.$t('confirm.tooltip'), {
			        type: "warning"
			    })
		        .then(() => {
		          	let para = { ids: ids };
					this.$ajax.del('/location/del_regions'+'?token='+this.token,para)
		          	.then(res => {

			          	if(res.status=='200'){
			          		if(res.data.status=='0'){			
					            this.$message({
					              message: this.$t('tooltipMes.delSuccess'),
					              type: "success"
					            });
			          		}
			          		this.getUsers();
			          	}    
		          	}).catch(e => {console.log(e)})
		        }).catch(() => {});
		    },
			handleExport(command){
				var _this=this
				if(command=='current'){//当前页的数据
		    		//导出所有的数据
		    		this.$confirm(this.$t('tooltipMes.exportDataCurr'),this.$t('confirm.tooltip'),{
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
		    		this.$confirm(this.$t('tooltipMes.exportDataAll'),this.$t('confirm.tooltip'),{
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
		    				res.data.data.items.map(item => {
		    					//datedialogFormat
		    					item.creation_time=datedialogFormat(item.creation_time)
		    				})
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
					const tHeader=['id',this.$t('Public.name')+'ID',this.$t('Public.description'),this.$t('Public.creation')];
					const filterVal=['id','name','description','creation_time'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,this.$t('tooltipMes.download')+'excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map (j => v[j]))
			},
		},

	};
</script>


<style>
.el-table .cell{
  position:relative;
}
.el-table .caret-wrapper{
  position:absolute;
  top:2px;
  right:0;
}

</style>