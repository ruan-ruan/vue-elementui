<template>
	<div>
		<section>
			<span >通过此页面可创建对应的逻辑口</span>
			<el-row class="toolbar" style="padding-bottom: 0px;">
				<el-col :span='24'>
					<el-form :inline='true' :model='filters' ref='filters' @submit.native.prevent>
						<el-form-item label='云链路名称' prop='name'>
							<el-input v-model='filters.name' class='sel_chart'></el-input>
						</el-form-item>
						<el-form-item label='公有云' prop='cloun'>
							<el-select v-model='filters.cloun' class='sel'>
								<el-option v-for='(item,index) in clounData'
									:label='item.label'
									:value='item.value'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label='链路状态' prop='status'>
							<el-select v-model='filters.status' class='sel'>
								<el-option v-for='(item,index) in statusData'
									:label='item.label'
									:value='item.value'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type='primary' @click='getUser'>搜索</el-button>
							<el-button type='info' @click='reset'>重置</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span='24'>
					<el-col :span='4'>
						<el-button type='primary' @click='addClounLink'>+添加云链路</el-button>
					</el-col>
					<el-col :span='20' class='table-top'>
						<el-button type='danger'  @click='batchRemove(sels)':disabled="this.sels.length===0">
							批量删除</el-button>
						<el-dropdown split-button type='success'@command="handleExport">
							导出数据
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command="current">当前页 </el-dropdown-item>									
								<el-dropdown-item command="all">所有页</el-dropdown-item>																				
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-col>
			</el-row>

			
			
			<el-table :data='users' highlight-current-row @selection-change="selsChange" style='width: 100%;'
				:default-sort = "{prop: 'creation_time', order: 'descending'}" v-loading='loading'>
				<el-table-column type='selection'min-width='40'></el-table-column>
				<el-table-column type='index' label='序号' min-width='50'align='center'>
					<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='creation_time' sortable label='创建时间' width='101' align='center' :formatter='dateFormat'>					
				</el-table-column>
				<el-table-column  label='云链路名称' min-width='120' align='center'>
					<template slot-scope='scope'>
						<a href="#" @click='handleSeeLink(scope.$index,scope.row)'>{{scope.row.name}}</a>
					</template>
				</el-table-column>
				<el-table-column prop='status'  label='链路状态' min-width='80' align='center'>
				</el-table-column>
				<el-table-column prop='type'  label='公有云' min-width='80' align='center'>
				</el-table-column>
				<el-table-column prop='region'  label='区域 ' min-width='60' align='center'>
				</el-table-column>
				<el-table-column prop='access_point'  label='接入点' min-width='70' align='center'>
				</el-table-column>
				<el-table-column prop='bandwidth'  label='带宽(Gbps)' min-width='70' align='center'>
				</el-table-column>
				<el-table-column prop='logic_port.name'  label='逻辑口' min-width='80' align='center'>
					<template slot-scope='scope'>
						<a href="#" @click="handleSeeLogic(scope.$index,scope.row)">{{scope.row.logic_port.name}}</a>
					</template>
				</el-table-column>
				<el-table-column   label='逻辑口状态' min-width='80' align='center'>
					<template slot-scope='scope'>
						<span :class='scope.row.color' v-text="scope.row.portStatus"></span>
					</template>
				</el-table-column>
				<el-table-column prop='descriptionVal'  label='备注' min-width='80' align='center'>
				</el-table-column>
				<el-table-column   label='操作' width='160' align='center'>
					<template slot-scope='scope'>
						<el-button size='small' type='primary' @click='handleEdit(scope.$index,scope.row)'>编辑</el-button>
						<el-button size='small' type='danger' @click='handleDel(scope.$index,scope.row)'>删除</el-button>
						
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
				     	:prev-text='prev'
				     	:next-text='next'></el-pagination>
					</el-col>
			</el-row>
			
			
		</section>
	</div>
</template>

<script>
	import {descriptionValue,getPortStatus} from '@/assets/js/index.js'
	
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
						label:'阿里云',
						value:'ali'
					},{
						label:'腾讯云',
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
				next:'下一页',
				prev:'上一页',
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
							
							descriptionValue(res.data.data.items)
							res.data.data.items.forEach(ele => {
//								if(ele.type == 'ali'){
//									ele.typeName='阿里云'
//								}else if(ele.type == 'tencent'){
//									ele.typeName='腾讯云'
//								}
//								console.log(ele.logic_port.physical_port)
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
				this.$confirm(`云链路名称${row.name}`,'确定要删除该数据吗?','提示',{})
				.then(() => {
					this.$ajax.del('/link/del_cloud_link/'+row.id+'?token='+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'删除成功!',
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
				this.$confirm('确定要删除所选中的数据吗?','提示',{})
				.then(() => {
					this.$ajax.del('/link/del_cloud_links'+'?token='+this.token,para)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:'删除成功!',
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
					this.$confirm('确定要导出所有的数据吗?','提示',{})
					.then(() => {
						this.exportData()
					}).catch(() => {})
				}else if(command=='current'){
					this.$confirm('确定要导出当前页的数据吗?','提示',{})
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
					const tHeader=['创建时间','数据中心','设备ID','管理Ip','备注'];
					const filterVal=['creation_time','dc_name','id','ip','description'];
					const list=that.excelData;
					const data=that.formatJson(filterVal,list);
					export_json_to_excel(tHeader,data,'下载数据excel')
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