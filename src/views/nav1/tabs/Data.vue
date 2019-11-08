<template>
	<div>
			<section>
				<!--工具条-->
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-col :span='24'>
						<el-form :inline="true" :model="filters" ref='filters'>
							<el-form-item :label='$t("Public.name")' prop='name'>
								<el-input v-model="filters.name" :placeholder="$t('validateMes.place')+$t('topFilters.name')"></el-input>
							</el-form-item>
							<el-form-item :label='$t("Public.SubordinateArea")' prop='search_region'>
								<el-select v-model='filters.search_region' filterable :placehoder='$t("topFilters.placeholder")' class='sel' @change='selectArea(filters.search_region)'>
									<el-option
										v-for='(item,index) in areaData'
										:key='index'
										:label='item.name'
										:value='item.id'>
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item prop='city_id'>
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
								<el-button type="primary" v-on:click="getDatas">
									<!--查询-->{{$t('topFilters.search')}}
								</el-button>
								<el-button type='info' @click='reset'>
									<!--重置-->{{$t('topFilters.reset')}}
								</el-button>
							</el-form-item>
						</el-form>	
					</el-col>

				</el-col>
				<el-col :span='24'>
					<el-col :span='4'>
						<el-button type="primary" @click="handleAdd">
							<!--新增-->{{$t('tabOperation.add')}}
						</el-button>
					</el-col>
					<el-col :span='20' class='table-top'>
						<el-button type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0">
							<!--批量删除-->{{$t('tabOperation.batchDel')}}
						</el-button>
						<el-dropdown split-button type='success'@command="handleExport">
							<!--导出数据-->{{$t('tabOperation.derived.tit')}}
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command="current">
									<!--当前页-->{{$t('tabOperation.derived.currentPage')}}
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
					<el-table-column type="selection" min-width="80" align='center'>
					</el-table-column>
					<el-table-column type="index" min-width="100" :label='$t("Public.index")' align='center'>
						<template slot-scope='scope'>
							<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="creation_time"  :label="$t('Public.creation')" align='center' width='80' :formatter='dateFormat' >
					</el-table-column>
					<el-table-column prop="name" :label="$t('Public.name')" min-width="120" align='center'>
					</el-table-column>
					<el-table-column prop="region.name" :label="$t('Public.region')" min-width="120" align='center'>
					</el-table-column>
					<el-table-column prop="city.name" :label="$t('Public.SubordinateArea')" min-width="120"  align='center'>
					</el-table-column>
					<el-table-column prop="descriptionVal" :label="$t('Public.description')" align='center' >
					</el-table-column>
					<el-table-column :label="$t('Public.operation')" align='center'width='140'>
						<template slot-scope="scope">
							<el-button size='mini' type='info' @click='handleSee(scope.$index,scope.row)'>
								<!--详情-->{{$t('tabOperation.info')}}
							</el-button>
							<el-button size="mini"type='success' @click="handleEdit(scope.$index, scope.row)" >
								<!--编辑-->{{$t('tabOperation.edit')}}
							</el-button>
							<el-button type="danger" size="mini" @click="handleDel(scope.$index, scope.row)"  >
								<!--删除-->{{$t('tabOperation.delete')}}
							</el-button>
						</template>
					</el-table-column>
				</el-table>
		
				<!--工具条-->
				<el-col :span="24" class="toolbar">
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
					<el-form  :model="editForm" label-width="160px" label-ailgn='center' :rules="editFormRules" ref="editForm">
						<el-form-item :label="$t('Public.name')+'：'" prop='name'>
							<el-input v-model="editForm.name"  auto-complete="off" class='ipt_sels'></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.SubordinateArea")+"："' prop='region_id' >		
							<el-select  v-model='editForm.region_id'  filterable  @change='selectAreaDia(editForm.region_id)' class='sel' >
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
						<el-form-item :label="$t('Public.description')+'：'" prop='description'>
							<el-input type="textarea" v-model="editForm.description" class='ipt_sels'></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						 <el-button @click.native="dialogFormVisible=false">
						 	<!--取消-->{{$t('tabOperation.cancel')}}
						 </el-button>
						<!--添加-->
						<el-button v-if="dialogStatus=='create'" type="primary" @click="createData">
							{{$t('tabOperation.save')}}
						</el-button>
						  <!--编辑-->
			        	<el-button v-else type="primary" @click="updateData">
			        		<!--保存-->{{$t('tabOperation.save')}}
			        	</el-button>

					</div>
					
				</el-dialog>
				<!--详情界面-->
				<el-dialog :title="textMap[dialogStatus]":visible.sync="dialog"  :close-on-click-modal="false">
					<el-form  :model="seeForm" label-width="160px"  ref="seeForm">
						<el-form-item :label="$t('Public.name')+'：'" >
							<template>
								<span v-text="seeForm.name"></span>
							</template>
						</el-form-item>
						<el-form-item :label="$t('Public.SubordinateArea')+'：'" >
							<template>	
								<span v-text="seeForm.region.name"></span>
							</template>
						</el-form-item>
						<el-form-item :label="$t('Public.SubordinateCity')+'：'" >
							<template>
								<span v-text="seeForm.city.name"></span>
							</template>
						</el-form-item>
						<el-form-item :label="$t('Public.description')+'：'">
							<template>
								<span v-text="seeForm.description"></span>
							</template>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						 <el-button @click.native="dialog=false">
						 	<!--取消-->{{$t('tabOperation.cancel')}}
						 </el-button>
					</div>
				</el-dialog>
			</section>	
	</div>
</template>


<script>

	import {descriptionValue} from '@/assets/js/index.js'
	
	export default{
		name:'Data',
		data() {
		    return {
		    	token:'',
			    activeName:'first',
			    dialogStatus: "",
			    textMap: {
			        update: this.$t('tabOperation.edit'),
			        create: this.$t('tabOperation.add'),
			        see:this.$t('tabOperation.info')
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

			    sels: [], //列表选中列
			    editFormRules: {
			        id:[{required:true, message:this.$t('validateMes.place')+'id', trigger:'bur'}],
			        name: [{ required: true, message: this.$t('validateMes.place')+this.$t('tooltipMes.name'), trigger: "blur" }],    
			        region_id:[{ required: true, message: this.$t('validateMes.placeCh')+this.$t('tooltipMes.area'), trigger: "change , blur" },
			        { required: true, message:  this.$t('validateMes.placeCh')+this.$t('tooltipMes.city'), trigger: "change" }],
			        
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
		mounted() {
		    this.getDatas();
		},
		methods: {
			reset(){
				this.$refs['filters'].resetFields()
			},
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
			selectAreaDia(sels){//日志里面的搜索区域-城市
				this.editForm.city_id=''
				this.selFilterArea(sels)
			},
		  	selectArea(sels){//搜素栏里面的搜索 区域-城市
		  		this.filters.city_id=''
		  		//获取城市对应的接口数据
				this.selFilterArea(sels)
		  	},
		  	selFilterArea(sels){//选择区域的时候  获取的不同的数据
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

			    this.loading = true;
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
							this.loading = false;
							descriptionValue(res.data.data.items);
							this.total = res.data.data.page.total;
					        this.pageNum=res.data.data.page.pages;
							this.users=res.data.data.items;
					        
						}else{
							this.$message({
								message:res.data.message,
								type:'warning'
							})
						}
					}
				}).catch( e => {
					console.log(e)
				})
		    },
		    //删除
		    handleDel: function(index, row) {
		      this.$confirm(this.$t('confirm.title'), this.$t('confirm.tooltip'), {
		        type: "warning"
		      })
		        .then(() => {

					this.$ajax.del('/location/del_dc/'+row.id+'?token='+this.token)
		          	.then(res => {
						if(res.status=='200'){
							if(res.data.status=='0'){

								this.$message({
									message:this.$t('tooltipMes.delSucess'),
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
				this.$nextTick(() => {
					this.$refs["editForm"].resetFields();
				})
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
										message:this.$t('tooltipMes.editSuccess'),
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
										message:this.$t('tooltipMes.addSuccess'),
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
		      	this.$confirm(this.$t('confirm.titles'),this.$t('confirm.tooltip'), {
		        	type: "warning"
		      	})
		        .then(() => {

			        let para = { ids: ids };
					this.$ajax.del('/location/del_dcs'+'?token='+this.token,para)
			        .then(res => {
			          	if( res.status=='200'){
							if(res.data.status=='0'){

								this.$message({
									message:this.$t('tooltipMes.delSucess'),
									type:'success'
								})
								this.getDatas();
							}else if(res.data.status){
								this.$message({
									message:res.data.message,
									type:'warning'
								})
								this.getDatas();
							}
			          	}
			        }).catch(e => {console.log(e)})
		        }).catch(() => {});
		    },
		    handleExport(command){
		    		if(command=='all'){
			    		//导出所有的数据
			    		this.$confirm(this.$t('tooltipMes.exportDataAll'),this.$t('confirm.tooltip'),{
			    			confirmButtonText:this.$t('confirm.confi'),
			    			cancelButtonText:this.$t('tabOperation.cancel'),
			    			type:'warning'
			    		}).then(() => {
			    			
			    			this.exportData()
			    		}).catch(() => {
                			});
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
            				});
			    	}
			    },
			    exportData:function(params){
					this.$ajax.get('/location/dcs'+'?token='+this.token,params)
			    	.then(res => {
			    		if(res.status==200){
			    			if(res.data.status==0){
			    				
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
					const tHeader=['id',this.$t('Public.name'),this.$t('Public.SubordinateArea'),this.$t('Public.description')];
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
		},
		
	}
</script>

<style>

</style>