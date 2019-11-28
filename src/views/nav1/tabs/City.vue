<template>
	<div>
		<section>
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-col :span='24'>
					<el-form :inline="true" :model="filters" ref='filters'>
						<el-form-item :label='$t("Public.name")' prop='name'>
							<el-input v-model="filters.name" :placeholder="$t('validateMes.place')+$t('tooltipMes.name')"></el-input>
						</el-form-item>
						<el-form-item :label='$t("physicalPosition.tab.area")' prop='value'>
							<el-select v-model='filters.value' :placehoder='$t("validateMes.placeCh")' filterable class='sel' >
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
							<el-button size='small' type="primary" v-on:click="getCitys">
								<!--查询-->
								{{$t('topFilters.search')}}
							</el-button>
							<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
						</el-form-item>
						
					</el-form>	
				</el-col>
			</el-col>
			
			<el-col :span='24'>
				<el-col :span='4'>
					<el-button size='small' type="primary" @click="handleAdd" v-if='buttonVal.add'>{{$t('tabOperation.add')}}</el-button>
				</el-col>
				<el-col :span='20' class='table-top'>
					<el-button size='small' type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0" v-if='buttonVal.del'>
						<!--批量删除-->{{$t('tabOperation.batchDel')}}
					</el-button>
					<el-dropdown size='small' split-button trigger="click" type='success'@command="handleExport">
						<!--导出数据--> {{$t('tabOperation.derived.tit')}}
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item command="current">
								<!--当前页--> {{$t('tabOperation.derived.currentPage')}}
							</el-dropdown-item>									
							<el-dropdown-item command="all">
								<!--所有页-->{{$t('tabOperation.derived.allPage')}}
							</el-dropdown-item>																				
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>

			<!--列表-->
			<el-table :data="users" highlight-current-row @selection-change="selsChange" style="width: 100%;"
				 v-loading='loading'>
				<el-table-column type="selection" width="80" align='center'>
				</el-table-column>
				<el-table-column type="index" width="80" :label='$t("Public.index")' align='center'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="creation_time"  :label='$t("Public.creation")' align='center' width='80' :formatter='dateFormat' >
				</el-table-column>
				<el-table-column prop="name" :label='$t("Public.name")'  align='center' min-wdith='100'>
				</el-table-column>
				<el-table-column prop="region.name" :label='$t("Public.SubordinateArea")' align='center'min-width='100' >
				</el-table-column>
				<el-table-column prop="descriptionVal" :label='$t("Public.description")'  align='center'min-width='100' >
				</el-table-column>
				<el-table-column :label='$t("Public.operation")' align='center'width='140'>
					<template slot-scope="scope">
						<el-button size='mini' type='info'  @click='handleSee(scope.$index,scope.row)' v-if='buttonVal.see'>
							<!--详情-->
							{{$t("tabOperation.info")}}
						</el-button>
						<el-button size="mini"type='success' @click="handleEdit(scope.$index, scope.row)" v-if='buttonVal.edit'>
							<!--编辑-->{{$t("tabOperation.edit")}}
						</el-button>
						<el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)"  v-if='buttonVal.del'>
							<!--删除-->{{$t("tabOperation.delete")}}
						</el-button>
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
				    >
				</el-pagination>
			</el-col>
	
			<!--编辑界面-->
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
				<el-form :model="editForm"  label-width="200px" :rules="editFormRules" ref="editForm">
					<el-form-item label="ID： " v-show='dialogStatus == "create" ? false:true'>
						<el-input v-model="editForm.id"  auto-complete="off" disabled class='ipt_sels'></el-input>
					</el-form-item>
					<el-form-item :label="$t('Public.name')+'：' " prop="name">
						<el-input v-model="editForm.name" auto-complete="off" class='ipt_sels' :disabled='dialogStatus == "see" '></el-input>
					</el-form-item>
					<el-form-item :label="$t('Public.SubordinateArea')+'：' "  prop='region_id'>
						<el-select  v-model='editForm.region_id'  :disabled='dialogStatus == "see" '   class='ipt'>
							<el-option
								v-for='(item,index) in areaData'
								:key='index'
								:label='item.name'
								:value='item.id'>	
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('Public.description')+'：' " prop='description'>
						<el-input type="textarea" v-model="editForm.description" class='ipt_sels' :disabled='dialogStatus == "see" '></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					 <el-button size='small'  @click.native="dialogFormVisible=false"> 
					 	<!--取消-->
					 	{{$t('tabOperation.cancel')}}
					 </el-button>
					<!--添加-->
					<el-button size='small' v-if="dialogStatus=='create'" type="primary" @click="createData">
						<!--保存-->{{$t('tabOperation.save')}}
					</el-button>
					  <!--编辑-->
		        	<el-button size='small' v-else-if=' dialogStatus=="update" ' type="primary" @click="updateData">
		        		<!--保存-->{{$t('tabOperation.save')}}
		        	</el-button>
				</div>
				
			</el-dialog>

		</section>	
	</div>
</template>


<script>
	
	import {descriptionValue ,datedialogFormat} from '@/assets/js/index.js'
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
		        	update: this.$t('tabOperation.edit'),
		        	create: this.$t('tabOperation.add'),
		        	see:this.$t('tabOperation.info'),
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

		      	sels: [], //列表选中列
		      	editFormRules: {
		        	name: [{ required: true, message:this.$t('validateMes.place')+this.$t('topFilters.name'), trigger: "blur"}],
		        	region_id:[ { required: true, message:this.$t('validateMes.placeCh')+this.$t('Form.region'), trigger: 'change'}]
		      	},
		      //编辑界面数据
		      	editForm: {
		        	id: "",
		        	name: "",
		        	description: "",
		        	region_id:'',
		        	region_name:''
		      	},
		      	Time:0,
		     	areaData:[],
		      	addFormVisible: false, //新增界面是否显示
		      	excelData:[],
		      	editLoading:false,
		      	buttonData:this.recursion( this.$store.state.aside , 'physicalPosition.tab.city'),//获取城市内的所有的按钮的权限
		      	buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏
		      		del:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.city').list, "location@del_city").show,//单个删除和批量的删除是绑定在一起的  
		      		edit:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.city').list,"location@edit_city").show,//编辑的值
		      		add:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.city').list, "location@add_city").show,//添加的值
		      		see:this.codeVal(this.recursion( this.$store.state.aside , 'physicalPosition.tab.city').list, "location@city_info" ).show,//查看详情
		      	}
		    };
		},
		  created(){
			this.token=sessionStorage.getItem('token');
			this.getCitys();
			this.getArea();
			console.log( this.buttonData )
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
		    	this.loading = false;
		    	if(res.status==200){
		    		if(res.data.status==0){
		    			descriptionValue(res.data.data.items);
		    			this.total = res.data.data.page.total;
						this.users=res.data.data.items;
		    		}
		    	}
		      });
		    },
		    //删除
		    handleDel: function(index, row) {
		      	this.$confirm(this.$t('confirm.title'), this.$t('confirm.tooltip'), {
		        	type: "warning"
		      	})
		        .then(() => {
					this.$ajax.del('/location/del_city/'+row.id+'?token='+this.token,)
		          	.then(res => {
			          	if(res.status==200){
			          		if(res.data.status==0){
					            this.$message({
					              message: this.$t('tooltipMes.delSucess'),
					              type: "success"
					            });
					            this.getCitys();
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
//		    	this.dialog=true;
				this.dialogFormVisible = true;
		    	this.editLoading=true;

				this.$ajax.get('/location/city_info/'+row.id+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.editLoading=false;
							var str=res.data.data;
							this.editForm={
					        	id: str.id,
					        	name: str.name,
					        	description: str.description,
					        	region_id:str.region.id,
					        	region_name:str.region.name
					      	}
						}
					}
				}).catch(e => {console.log(e)})
		    },
		    //显示编辑界面
		    handleEdit: function(index, row) {
		      	this.dialogStatus = "update";
		      	this.dialogFormVisible = true;

				this.editForm={
					name:row.name,
					region_id:row.region.id,
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
					let para={
						name:this.editForm.name,
						region_id:this.editForm.region_id,
						description:this.editForm.description
					}
					this.$ajax.put('/location/edit_city/'+this.editForm.id+'?token='+this.token,para)
	              	.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.editLoading = false;
				                this.$message({
				                  message:this.$t('tooltipMes.editSuccess'),
				                  type: "success"
				                });
				                this.$refs["editForm"].resetFields();
				                 this.dialogFormVisible = false;
				                this.getCitys();	
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
	                this.editLoading = true;
	             	let para = Object.assign({}, this.editForm);
					this.$ajax.post('/location/add_city'+'?token='+this.token,para)
		            .then(res => {
		              	if(res.status=='200'){
		              		if(res.data.status=='0'){
		              			this.addLoading = false;
				                this.$message({
				                    message: this.$t('tooltipMes.addSuccess'),
				                    type: "success"
				                });
				                this.$refs["editForm"].resetFields();
				                this.dialogFormVisible = false;
				                this.getCitys();
		              		}
		              	} 
		            }).catch(e => {console.log(e)})
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
				                message:this.$t('tooltipMes.delSucess'),
				                type: "success"
				            });
		          		}
		          		this.getCitys();
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
		    	if(_this.users.length==0){
		    		this.$message({
		    			message:this.$t('tooltipMes.dataNull'),
		    			type:'warning'
		    		})
		    	}else if(_this.users.length!=0){
					if(command=='all'){
		    		//导出所有的数据
			    		this.$confirm(this.$t('tooltipMes.exportDataAll'),this.$t('confirm.tooltip'),{
			    			type:'warning'
			    		}).then(() => {
			    			
			    			this.exportData()
			    		}).catch(() => {
			    			
			    		})
			    	}else if(command=='current'){
			    		//导出当前
			    		this.$confirm(this.$t('tooltipMes.exportDataCurr'),this.$t('confirm.tooltip'),{
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
		    					message:this.$t('tooltipMes.exportSucess'),
		    					type:'success'
		    				})

		    				res.data.data.items.forEach(ele => {
			    					ele.region_name=ele.region.name;
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
					const {export_json_to_excel} =require('@/excel/export2Excel');
					const tHeader=['id',this.$t('physicalPosition.regionName'),this.$t('Public.SubordinateArea'),this.$t('Public.description')];
					const filterVal=['id','name','region_name','description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,this.$t('tooltipMes.download')+'excel')
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