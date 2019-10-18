<template>
	<div>
		<section>
			<!--工具条-->
			<el-row>									
				<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
					<el-form :inline='true' :model='filters' ref='filters'>
						<el-form-item label='名称' prop='name'>
							<el-input v-model='filters.name' class='sel'></el-input>
						</el-form-item>
						<el-form-item label='数据中心'prop='search_dc'>
							<el-select v-model='filters.search_dc' filterable placeholder='全部' class='sel'>
								<el-option
									v-for='(item,index) in datac'
									:key='index'
									:label='item.name'
									:value='item.id'>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='创建日期' prop='timeVal'>
							<el-date-picker
								v-model='filters.timeVal'
								type='daterange'
								@change="timeValSearchBtn"
								range-separator='至'
								start-placeholder='开始日期'
								end-placeholder='结束日期'>
							</el-date-picker>
						</el-form-item>
						<el-form-item>
							<el-button type='primary'@click='getUsers'>查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type='info' @click='reset'>重置</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<!--添加部分-->
			<el-row>
				<el-col :span='8'>
					<template >
						<el-button type="primary" @click="handleAdd">+添加节点</el-button>
						<el-button type='success' @click='foundNode'>发现节点</el-button>
					</template>
				</el-col>
				<el-col :span='16'	class="table-top">
					<el-button type="danger" @click="batchRemove(sels)" :disabled="this.sels.length===0">批量删除</el-button>
					
				</el-col>
			</el-row>
			
			<!--列表部分-->
			<el-table :data='users'  highlight-current-row style='width: 100%;'@selection-change="selsChange"
				:default-sort = "{prop: 'creation_time', order: 'descending'}" v-loading='loading'>
				<el-table-column type="selection" width="50" align='center'></el-table-column>
				<el-table-column type='index' min-width='50'max-width='70' label='序号' align='center'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='creation_time'width='101'label='申请时间'sortable align='center' :formatter='dateFormat'></el-table-column>
				<el-table-column prop='name' min-width='100'max-width='120' label='节点名称' align='center'></el-table-column>
				<el-table-column  min-width='120'max-width='140' label='设备名称' align='center'>
					<template slot-scope='scope'>
						<span>{{scope.row.devices_name1}}</span> <br />
						<span>{{scope.row.devices_name2}}</span>
					</template>
				</el-table-column>
				<el-table-column  min-width='70'max-width='90' label='SN号' align='center'> 
					<template slot-scope="scope">
						<span>{{scope.row.devices_sn1}}</span> <br />
						<span>{{scope.row.devices_sn2}}</span>
						
					</template>
				</el-table-column>			
				<el-table-column min-width='70'max-width='90' label='管理IP' align='center'>
					<template slot-scope="scope">
						<span>{{scope.row.devices_ip1}}</span>   <br />
						<span>{{scope.row.devices_ip2}}</span>
						
					</template>
				</el-table-column>
				<el-table-column prop='vtep' min-width='80' max-width='100' label='Vtep' align='center'></el-table-column>		
				<el-table-column prop='dc.name' min-width='80'max-width='100' label='设备中心' align='center'></el-table-column>
				<el-table-column prop='description' min-width='60'max-width='80' label='备注' align='center'></el-table-column>
				<el-table-column width='300' align='center'label='操作'>
					<template slot-scope='scope'>
						<el-button type='primary':diasbled='RunStatus' size='small' @click='run(scope.$index, scope.row)' class='run'>运行</el-button>
						<el-button type='info' size='small' @click='handleSee(scope.$index, scope.row)'>详情</el-button>
						<el-button type='success' size='small' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
		<!--底部工具栏-->
		<el-row>
			<el-col :span='24' class='toolbar'>
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
		</el-row>
		<!--发现节点额界面-->
		<el-dialog :title='textMap[dialogStatus]':visible.sync="dialogFormVisible":close-on-click-modal="false">
			<el-form :model='foundForm' ref='foundForm'>
				<el-form-item >
					<!--<input type="" placeholder="" name="" id="" value="" />-->
					<el-input v-model='foundForm.parameter' placeholder='请输入发现参数'></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				 <el-button @click.native="dialogFormVisible=false">取消</el-button>
				<!--添加-->
				<el-button v-if="dialogStatus=='found'" type="primary" @click="foundData">保存</el-button>
			</div>
		</el-dialog>
		</section>
	</div>
</template>

<script>
	import { getTime } from "@/assets/js/index.js";
	export default{
		name:'Unknown',
//		props:['data'],
		data() {
	 		return {
	 			//获取用户的权限：
	 			token:'',
	 			//运行按钮的控制是否是可点击，根据表格里面的数据，如果必填项里面存在空的时候，则是禁止点击
	 			RunStatus:false,
	 			//顶部的搜索的绑定对象
	 			filters:{
	 				name:'',
	 				search_dc:'',
	 				start_time:'',
	 				end_time:'',
	 				//日期的接收
	 				timeVal:[],
	 			},
	 			
	 			//接收数据
	 			users:[],
	 			datac:[],
	 			//多选的数据
	 			sels:[],
	 			//底部分页数据
	 			total:0,
	 			pagesize:10,
	 			currentPage:1,
	 			pageNum:1,
	 			pagecount:5,
	 			next:'下一页',
				prev:'上一页',

				//在详情的界面的时间转换
				Time:0,
				//当切换到详情的界面的需要的控制的参数
				//加载等待loading
				loading:false,
				disab:true,
				excelData:[],
				//发现节点日志
				textMap:{
					found:'发现设备参数设置'
				},
				dialogStatus:'',
				dialogFormVisible:false,
				foundForm:{
					parameter:''
				}
	 		}
	    },
	    watch:{
	    	users:function(newVal,oldVal){
//	    		this.getUsers()
	    	}
	    },
	    created(){
	    	//获取用户的权限信息
	    	this.token=sessionStorage.getItem('token');
	    },
	    methods:{
	    	handleSizeChange(val){
	    		console.log(`每页${val}条`);
	    		this.pagesize=val;
	    		this.getUsers()
	    	},
	    	handleCurrentChange(val){
	    		this.currentPage=val;
	    		console.log(`当前页 数是${val}`);
	    		this.getUsers()
	    	},
	    	//查询方法
	    	getUsers(){
				this.loading=true;
			 	this.filters.start_time = this.filters.timeVal[0] ? this.filters.timeVal[0] : "";
				this.filters.end_time = this.filters.timeVal[1] ? this.filters.timeVal[1] : "";
				var para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.name,
					search_dc:this.filters.search_dc,
					search_status:this.filters.search_status,
					search_start_time:getTime(this.filters.start_time),
					search_end_time:getTime(this.filters.end_time),
				}
				this.$ajax.get('/node/unknown_nodes'+'?token='+this.token,para)
	    		.then(res => {
	    			if(res.status==200){
	    				if(res.data.status==0){
	    					this.loading=false;
//			    			console.log(res);
			    			res.data.data.items.forEach(ele => {
//			    				console.log(ele)
			    				if(ele.devices.length ==1){
			    					var str1=ele.devices.find(item => {
				    					return item['sign'] == 'd1' 
				    				})
			    					console.log(str1)
				    				ele.devices_name1=str1.hostname
				    				ele.devices_ip1=str1.ip;
				    				ele.devices_sn1=str1.sn;
				    				
				    				ele.devices_name2='';
				    				ele.devices_ip2='';
				    				ele.devices_sn2='';
			    				}else if(ele.devices.length ==2){
			    					var str1=ele.devices.find(item => {

				    					return item.sign == 'd1' 
				    				})
			    					
			    					var str2=ele.devices.find(item => {
				    					return item.sign =='d2' 
				    				})
	    					
				    				ele.devices_name1=str1.hostname
				    				ele.devices_ip1=str1.ip;
				    				ele.devices_sn1=str1.sn;
				    				
				    				ele.devices_name2=str2.hostname
				    				ele.devices_ip2=str2.ip;
				    				ele.devices_sn2=str2.sn;
			    				}
			    			})
							this.users=res.data.data.items
							this.total = res.data.data.page.total;
	    				}else{
	    					this.loading=false
	    				}
	    			}	
	    		})
	    		.catch( e => {
	    			console.log(e)
	    		})
	    	},
	    	reset(){
				this.$refs['filters'].resetFields()
			},
	    	dateFormat(row,column){
	    		//将时间戳转换为前端的时间
	    		let date=new Date(parseInt(row.creation_time)*1000);
	    		let Y=date.getFullYear()+'-';
	    		let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
	    		let D=   date.getDate() <10	?  '0' + date.getDate() +'   ':date.getDate()+'   ';
	    		
	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	    		return Y + M + D + h + m + s	    		
	    	},
	    	handleAdd(){
//				this.$trouter.push('/location/index/unknown')
				this.$router.push({
					path:'/location/index/unknown_add',
					query:{
						id:'add'
					}
				})
			},
			timeValSearchBtn(value) {
				this.filters.start_time = this.filters.timeVal[0];
				this.filters.end_time = this.filters.timeVal[1];
			},
	    	foundNode(){
	    		//发现节点
	    		this.dialogStatus='found';
	    		this.dialogFormVisible=true;
	    		
	    	},
	    	foundData(){
	    		//发现节点保存按钮
	    		this.$refs.foundForm.validate(valid => {
	    			if(valid){
	    				// this.$confirm('提交后稍等获取输入参数后的数据','提示',{})
	    				// .then(() => {
	    					this.$ajax.post('/node/find_node'+'?token='+this.token)
	    					.then(res => {
	    						console.log(res);
	    						if(res.status==200){
	    							if(res.data.status==0){
	    								this.$message({
	    									message:res.data.message,
	    									type:'success'
	    								})
	    								this.dialogFormVisible=false
	    								this.$refs['foundForm'].resetFields();
	    							}else {
	    								this.$message({
	    									message:res.data.message,
	    									type:'warning'
	    								})
	    							}
	    						}
	    					}).catch((e ) => {console.log(e)})
	    				// }).catch( () => {
	    				// })
	    			}
	    		})
	    	},
	    	//查看详情
	    	handleSee(index,row){
	    		console.log(row)
				this.$router.push({
					path:'/location/index/unknown_details/'+row.id,
				})
	    	},
	    	//编辑
	    	handleEdit(index,row){
				this.$router.push({
//					name:'未知节点编辑',
					path:'/location/index/unknown_editForm/'+row.id,
				})
	    	},
	    	//运行
	    	run(index,row){
	    		//设备运行
//	    		var _this=this;
	    		var runText=document.getElementsByClassName('run');
	    		if(runText[index].textContent=='运行'){
	    			this.$confirm('确定要运行该设备吗?','提示',{})
	    			.then(() => {
	    				
	    				this.$ajax.put('/node/run_node/'+row.id+'?token='+this.token)
	    				.then(res => {
	    					console.log(res);
	    					if(res.status==200){
	    						if(res.data.status==0){
	    							this.$message({
	    								message:'运行成功，请在骨干节点中查看',
	    								type:'success'
	    							})
	    							this.getUsers()
	    							this.$router.push('/location/backbone')
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
	    				
	    			})
	    		}
	    	},
	    	//删除
		    handleDel(index, row) {
		    	console.log(row)
		      	this.$confirm("确认删除该记录吗?", "提示", {
		       		type: "warning"
		      	})
		        .then(() => {
					this.$ajax.del('/node/del_unknown_node/'+row.id+'?token='+this.token)
		          .then(res => {
		          		if(res.status==200){
		          			if(res.data.status==0){
					            this.$message({
					              message: "删除成功",
					              type: "success"
					            });
					            this.getUsers();
		          			}else if( res.data.status){
		          				this.$message({
		          					message:res.data.message,
		          					type:'warning'
		          				})
		          			}
		          		}
		          })
		          .catch( e =>{
		          	console.log(e)
		          })
		        })
		        .catch(() => {});
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
		
		          let para = { 
		          	ids: ids,
		          };
		          this.$ajax.del('/node/del_unknown_nodes'+'?token='+this.token,para)
		          .then(res => {
		          	if(res.status=='200'){
		          		if(res.data.status=='0'){
				            this.$message({
				              message: "删除成功",
				              type: "success"
				            });
				            this.getUsers();
		          		}else if(res.data.status){
		          			this.$message({
		          				message:res.data.message,
		          				type:'warning'
		          			})
		          			this.getUsers();
		          		}
		          	}
		              
		          });
		        })
		        .catch(() => {});
		    },
	    	getDataCen(){
	    		//接收数据中心的数据，由于时间总线传递的值，在刷新之前是出不来的丢失问题，所以先使用axios解决，后期改成vuex
				this.$ajax.get('/location/dcs'+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							var str=[];
							var sons=[];
							var dataCen
							str=res.data.data.items;
							sons=str;
							var arr = []
						    for(let val of sons){
						        arr.push(val.id)
						    }
						    var newArr = [];
						    var newArr2 = [];
						    for(var i =0;i<arr.length-1;i++){
						        if(newArr.indexOf(arr[i]) == -1){
						            newArr.push(arr[i]);
						            newArr2.push(sons[i]);
						        }
						    }
							this.datac=newArr2;
						}
					}
				})
				.catch(e => {
					console.log(e)
				})
	    	}
	    },
	    mounted(){
	    	this.getUsers();
	    	this.getDataCen()
	    	
	    }
	}
</script>

<style scoped="scoped">
	.sel{
		width: 150px;
	}
	.el-dialog__header{
		text-align: center;
	}
</style>