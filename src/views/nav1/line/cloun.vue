<template>
	<div>
		<section>
			<span >{{$t('Public.cloudTit')}}</span>
			<el-row class="toolbar" style="padding-bottom: 0px;">
				<el-col :span='24'>
					<el-form :inline='true' :model='filters' ref='filters' @submit.native.prevent>
						<el-form-item :label='$t("Public.cloudName")' prop='name'>
							<el-input v-model='filters.name' class='ipt_sta'></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.shardCloud")' prop='cloun'>
							<el-select v-model='filters.cloun' filterable class='sel'>
								<el-option v-for='(item,index) in clounData'
									:label='item.label'
									:value='item.value'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label='$t("Public.linkState")' prop='status'>
							<el-select v-model='filters.status' filterable class='sel'>
								<el-option v-for='(item,index) in statusData'
									:label='item.label'
									:value='item.value'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button size='small' type='primary' @click='getUser'>{{$t('topFilters.search')}}</el-button>
							<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span='24'>
					<el-col :span='4'>
						<el-button size='small' type='primary' @click='addClounLink'v-if='buttonVal.add' >+{{$t('Public.addCloud')}}</el-button>
					</el-col>
					<el-col :span='20' class='table-top'>
						<el-button size='small' type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0" v-if='buttonVal.del' >
							{{$t("tabOperation.batchDel")}}</el-button>
						<el-dropdown size='small' split-button type='success'@command="handleExport">
							{{$t('tabOperation.derived.tit')}}
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>									
								<el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>																				
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-col>
			</el-row>

			
			
			<el-table :data='users' highlight-current-row @selection-change="selsChange" style='width: 100%;'
				 v-loading='loading'>
				<el-table-column type='selection'min-width='40'></el-table-column>
				<el-table-column type='index' :label='$t("Public.index")' min-width='80'align='center'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column :label='$t("Public.creation")' width='80' align='center' >					
					<template slot-scope='scope'>
						{{ scope.row.creation_time | timeFormat }}
					</template>
				</el-table-column>
				<el-table-column  :label='$t("Public.cloudName")' min-width='100' align='center'>
					<template slot-scope='scope'>
						<a href="#" @click='handleSeeLink(scope.$index,scope.row)'style="text-decoration: none;">{{scope.row.name}}</a>
					</template>
				</el-table-column>
				<el-table-column   :label='$t("Public.linkState")' width='80' align='center'>
					<template slot-scope='scope'> <!--prop='status'-->
						<span :class='scope.row.color' >{{scope.row.portStatus}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='type'  :label='$t("Public.shardCloud")' min-width='80' align='center'>
				</el-table-column>
				<el-table-column prop='region'  :label='$t("Public.region") ' min-width='80' align='center'>
				</el-table-column>
				<el-table-column prop='access_point'  :label='$t("Public.accessPoint")' min-width='80' align='center'>
				</el-table-column>
				<el-table-column prop='bandwidth'  :label='$t("Public.bandwidthG")' min-width='80' align='center'>
				</el-table-column>
				<el-table-column prop='logic_port.name'  :label='$t("Public.logic")' min-width='80' align='center'>
					<template slot-scope='scope'>
						<a href="#" @click="handleSeeLogic(scope.$index,scope.row)"style="text-decoration: none;">{{scope.row.logic_port.name}}</a>
					</template>
				</el-table-column>
				<el-table-column   :label='$t("Public.logicStatus")' width='80' align='center'>
					<template slot-scope='scope'>
						<span :class='scope.row.color' v-text="scope.row.portStatus"></span>
					</template>
				</el-table-column>
				<el-table-column  :label='$t("Public.description")' min-width='80' align='center'>
					<template slot-scope='scope'>
						{{ scope.row.description  | descriptionValue }}
					</template>
				</el-table-column>
				<el-table-column   :label='$t("Public.operation")' width='100' align='center'>
					<template slot-scope='scope'>
						<el-button size='mini' type='primary' @click='handleEdit(scope.$index,scope.row)' v-if='buttonVal.edit' >{{$t('tabOperation.edit')}}</el-button>
						<el-button size='mini' type='danger' @click='handleDel(scope.$index,scope.row)' v-if='buttonVal.del' >{{$t("tabOperation.delete")}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<el-row class='toolbar'>
				<el-col :span='24'>
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
			     	></el-pagination>
				</el-col>
			</el-row>
		</section>
	</div>
</template>

<script>
	import {getPortStatus } from '@/assets/js/index.js'
	
	export default{
		name:'cloun',
		data(){
			return{
				token:sessionStorage.getItem('token'),
				filters:{
					name:'',
					cloun:"",
					status:'',
					
				},
				clounData:[
					{
						label:this.$t('Public.aliCloud'),
						value:'ali'
					},{
						label:this.$t('Public.tcCloud'),
						value:'tencent'
					}
				],
				statusData:[
					{
						label:'UP',
						value:'UP'
					},{
						value:'DOWN',
						label:'DOWN'
					}
				],
				users:[],
				sels:[],
				loading:false,
				//分页所需要的参数
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,

				excelData:[],
				buttonVal:{//获取权限列表的内按钮   控制页面内的权限按钮的显示和隐藏 "link@add_unknown_link"
			  		add:this.codeVal(this.recursion( this.$store.state.aside ,"aside.cloudLine").list, "link@add_cloud_link").show,//添加	
			  		del:this.codeVal(this.recursion( this.$store.state.aside ,"aside.cloudLine").list, "link@del_cloud_link").show,//单个删除和批量的删除是绑定在一起的  
			  		edit:this.codeVal(this.recursion( this.$store.state.aside ,"aside.cloudLine").list,"link@edit_cloud_link").show,//编辑的值
			  		see:this.codeVal(this.recursion( this.$store.state.aside ,"aside.cloudLine").list, "link@cloud_link_info" ).show,//查看详情
			  		seeLogic:this.codeVal(this.recursion( this.$store.state.aside ,"aside.logicManage").list, "port@logic_port_info" ).show,//查看逻辑口的详情
			  	} 
			}
		},
		created(){
			this.getUser()
		},
		methods:{
			addClounLink(){
				//添加云
				this.$router.push({
					path:'/location/line/addcloun',
					query:{
						name:'addCloud'
					}
				})
			},
			handleSizeChange(val){
				this.pagesize=val;
				this.getUser()
			},
			handleCurrentChange(val){
				this.currentPage=val;
				this.getUser()
			},
			getUser(){
				//获取云列表
				this.loading=true;
				let para={
					page: this.currentPage,
			        per_page:this.pagesize,
					search_name:this.filters.name,
					search_cloud:this.filters.cloun,
					search_status:this.filters.status,
					search_region:""
				}
				this.$ajax.get('/link/cloud_links'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.loading=false;
							var arr=res.data.data.items;
							for(let item =0 ;item <arr.length;arr++){
								arr[item].portStatus=getPortStatus(arr[item].logic_port.physical_port);
								switch( getPortStatus(arr[item].logic_port.physical_port) ){
									case 'UP':
										arr[item].color='backRun';
										break;
									default:
										arr[item].color='backWarn';
										break;
								}
								arr[item].bandwidth=Math.round(arr[item].bandwidth/1024) 
							}
							this.users=res.data.data.items;
							this.total=res.data.data.page.total;
						}
					}
				}).catch(e => {console.log(e)})
				
			},
			reset(){
				//条件清空重置
				 this.$refs['filters'].resetFields();
			},
			handleSeeLogic(index,row){
				//详情， 逻辑口
				if(this.buttonVal.seeLogic){
					this.$router.push({
						path:'/resource/see/logicalPort',
						query:{
							detailsID:row.id
						}
					})
				}else{
					this.$message({
						message:'没有查看详情的权限！',
						type:'warning'
					})
				}
				
			},
			handleSeeLink(index,row){
				//详情   云莲路详情
//				v-if='buttonVal.add' 
				if(this.buttonVal.see){
					this.$router.push({
						path:'/location/line/clounDetails',
						query:{
							id:row.id
						}
					})
				}else{
					this.$message({
						message:'没有查看详情的权限！',
						type:'warning'
					})
				}
				
			},
			handleEdit(index,row){
				//编辑
				this.$router.push({
					path:'/location/line/editcloun',
					query:{
						id:row.id
					}
				})
			},
			handleDel(index,row){
				//删除
				this.$confirm(this.$t('Public.cloudName')+`${row.name}`,this.$t('confirm.title'),this.$t('confirm.tooltip'),{})
				.then(() => {
					this.$ajax.del('/link/del_cloud_link/'+row.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
								this.getUser()
							}
						}
					})
				}).catch(() => {})
			},
			selsChange(sel){
				this.sels=sel;
			},
			batchRemove(rows){
//				//批量删除
				let ids=[];
				rows.forEach(ele => {
					ids.push(ele.id)
				})
				let para = {ids: ids}
				this.$confirm(this.$t('confirm.titles'),this.$t('confirm.tooltip'),{})
				.then(() => {
					this.$ajax.del('/link/del_cloud_links'+'?token='+this.token,para)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
									type:'success'
								})
							}
							this.getUser()
							
						}
					}).catch(e => {console.log(e)})
				}).catch(() => {})
			},
			handleExport(command){
				if(command=='all'){
					//导出所有的数据
					this.$confirm(this.$t('tooltipMes.exportDataAll'),this.$t('confirm.tooltip'),{})
					.then(() => {
						this.exportData()
					}).catch(() => {})
				}else if(command=='current'){
					this.$confirm(this.$t('tooltipMes.exportDataCurr'),this.$t('confirm.tooltip'),{})
					.then(() => {
						var para={
		    				page:this.currentPage,
		    				per_page:this.pagesize,
		    			}
		    			this.exportData(para)
					}).catch(() => {})
				}
			},
			exportData(params){
			
				this.$ajax.get('/'+'?token='+this.token,params)
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
			export2Excel(){
				let that=this;
				require.ensure([] ,() => {
					const {export_json_to_excel} = require('@/excel/export2Excel')
					const tHeader=[this.$t('Public.creation'),this.$t('Public.dataCen'),this.$t('Public.deviceID'),this.$t('Public.manageIP'),this.$t('Public.description')];
					const filterVal=['creation_time','dc_name','id','ip','description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,this.$t('tooltipMes.download')+'excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
		}
	}
</script>

<style>
	

</style>