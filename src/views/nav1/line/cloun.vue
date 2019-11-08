<template>
	<div>
		<section>
			<span >{{$t('Public.cloudTit')}}</span>
			<el-row class="toolbar" style="padding-bottom: 0px;">
				<el-col :span='24'>
					<el-form :inline='true' :model='filters' ref='filters' @submit.native.prevent>
						<el-form-item :label='$t("Public.cloudName")' prop='name'>
							<el-input v-model='filters.name' class='sel_chart'></el-input>
						</el-form-item>
						<el-form-item :label='$t("Public.shardCloud")' prop='cloun'>
							<el-select v-model='filters.cloun' class='sel'>
								<el-option v-for='(item,index) in clounData'
									:label='item.label'
									:value='item.value'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label='$t("Public.linkState")' prop='status'>
							<el-select v-model='filters.status' class='sel'>
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
						<el-button size='small' type='primary' @click='addClounLink'>+{{$t('Public.addCloud')}}</el-button>
					</el-col>
					<el-col :span='20' class='table-top'>
						<el-button size='small' type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0">
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
				<el-table-column prop='creation_time' :formatter='dateFormat' :label='$t("Public.creation")' width='80' align='center' >					
				</el-table-column>
				<el-table-column  :label='$t("Public.cloudName")' min-width='100' align='center'>
					<template slot-scope='scope'>
						<a href="#" @click='handleSeeLink(scope.$index,scope.row)'>{{scope.row.name}}</a>
					</template>
				</el-table-column>
				<el-table-column prop='status'  :label='$t("Public.linkState")' min-width='80' align='center'>
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
						<a href="#" @click="handleSeeLogic(scope.$index,scope.row)">{{scope.row.logic_port.name}}</a>
					</template>
				</el-table-column>
				<el-table-column   :label='$t("Public.logicStatus")' min-width='80' align='center'>
					<template slot-scope='scope'>
						<span :class='scope.row.color' v-text="scope.row.portStatus"></span>
					</template>
				</el-table-column>
				<el-table-column prop='descriptionVal'  :label='$t("Public.description")' min-width='80' align='center'>
				</el-table-column>
				<el-table-column   :label='$t("Public.operation")' width='100' align='center'>
					<template slot-scope='scope'>
						<el-button size='mini' type='primary' @click='handleEdit(scope.$index,scope.row)'>{{$t('tabOperation.edit')}}</el-button>
						<el-button size='mini' type='danger' @click='handleDel(scope.$index,scope.row)'>{{$t("tabOperation.delete")}}</el-button>
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
	import {descriptionValue,getPortStatus ,datedialogFormat} from '@/assets/js/index.js'
	
	export default{
		name:'cloun',
		data(){
			return{
				token:'',
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

				excelData:[]
			}
		},
		created(){
			this.token=sessionStorage.getItem('token')
			this.getUser()
		},
		methods:{
			addClounLink(){
				//添加云
				this.$router.push({
					path:'/location/line/addcloun',
					query:{
						name:'添加云'
					}
				})
			},
			handleSizeChange(val){
//				console.log(`每页${val}条`);
				this.pagesize=val;
				this.getUser()
			},
			handleCurrentChange(val){
//				console.log(`当前页数是:${val}`)
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
							console.log(res)
							//datedialogFormat
							descriptionValue(res.data.data.items)
							res.data.data.items.map(ele => {

								ele.portStatus=getPortStatus(ele.logic_port.physical_port)
								if(getPortStatus(ele.logic_port.physical_port) === 'UP'){
									ele.color='colorGreen'
								}else if(getPortStatus(ele.logic_port.physical_port) === 'DOWN'){
									ele.color='colorRed'
								}else if(getPortStatus(ele.logic_port.physical_port) === '异常'){
									ele.color='colorWarning'	
								}
							})
							console.log(res)
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
			this.$router.push({
					path:'/resource/see/logicalPort',
					query:{
						detailsID:row.id
					}
				})
			},
			handleSeeLink(index,row){
				//详情   云莲路详情
				this.$router.push({
					path:'/location/line/clounDetails',
					query:{
						id:row.id
					}
				})
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
							}else{
								this.$message({
									message:res.data.message,
									type:'warning'
								})
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
								this.getUser()
							}else{
								this.$message({
									message:res.data.message,
									type:'warning'
								})
								this.getUser()
							}
						}
					})
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
			//表格数据时间转换
			dateFormat(row,column){
	    		//将时间戳转换为前端的时间
	    		let date=new Date(parseInt(row.creation_time)*1000);
	    		let Y=date.getFullYear()+'-';
	    		let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
	    		let D=date.getDate() <10? '0' +date.getDate() +'  ':date.getDate()+'  ';
	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	    		return Y + M + D + h + m + s	    		
	    	}
		}
	}
</script>

<style>
	

</style>