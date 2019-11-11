<template>
  <div>
   	 <!--逻辑端口管理-->
   	 <section>
   	 	<el-row class='toolbar' style='width: 100%;'>
   	 		<el-col :span='24'>
   	 			<el-form :inline='true' :model='filters' ref='filters'>
   	 				<el-form-item :label='$t("Public.name")' prop='name'>
   	 					<el-input v-model='filters.name' placeholder="请输入逻辑端口名称" class='sel'></el-input>
   	 				</el-form-item>
   	 				<el-form-item :label='$t("Public.tenant")' prop='nameLogo'>
   	 					<el-select v-model='filters.nameLogo' class='sel' :placeholder="$t('Public.plaTenant')">
   	 						<el-option v-for='(item,index ) in tenantData'
   	 							:value='item.id'
   	 							:label='item.name'
   	 							:key='index'></el-option>
   	 					</el-select>
   	 				</el-form-item>
   	 				<el-form-item :label='$t("Public.status")' prop='status'>
   	 					<el-select v-model='filters.status' :placeholder="$t('Public.plaLogicSt')" class='sel'>
   	 						<el-option v-for=' (item,index) in PortStatus'
   	 							:value='item.value'
   	 							:key='index'
   	 							:label='item.label'></el-option>
   	 					</el-select>
   	 				</el-form-item>
   	 				<el-form-item>
   	 					<el-button size='small' type='primary' @click='getUsers'>{{$t('topFilters.search')}}</el-button>
   	 					<el-button size='small' type='info' @click='reset'>{{$t('topFilters.reset')}}</el-button>
   	 				</el-form-item>
   	 			</el-form>
   	 		</el-col>
   	 	</el-row>
   	 	
   	 	<el-row>
   	 		<el-col :span='24'>
   	 			<el-col :span='4'>
   	 				<el-button size='small' type='primary' @click='addUsers' v-if=' !tit'>+{{$t('Public.creatLogic')}}</el-button>
   	 			</el-col>
   	 			<el-col :span='20' class='table-top'>
   	 				<el-dropdown size='small' split-button type='success'@command="handleExport">
							<!--导出数据-->{{$t('tabOperation.derived.tit')}}
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command="current">{{$t('tabOperation.derived.currentPage')}} </el-dropdown-item>									
								<el-dropdown-item command="all">{{$t('tabOperation.derived.allPage')}}</el-dropdown-item>																				
							</el-dropdown-menu>
						</el-dropdown>
   	 			</el-col>
   	 		</el-col>
   	 	</el-row>

   	 	
   	 	<!--表格数据部分-->
   	 	<el-table :data='users' highlight-current-row style='width: 100%;' v-loading='loading' 
   	 		>
   	 		<el-table-column type='index' width='60':label='$t("Public.index")' align='center'>
   	 			<template slot-scope='scope'>
						<span>{{scope.$index+(currentPage-1)*pagesize+1}}</span>
					</template>
   	 		</el-table-column>
   	 		<el-table-column prop='creation_time'   :label='$t("Public.creation")' :formatter='dateFormat' width='80'align='center'></el-table-column>
   	 		<el-table-column prop='name' :label='$t("Public.logName")' min-width='100'align='center'>
   	 			<template slot-scope='scope'>
   	 				<span class='cli_spn' @click="handleSee(scope.$index,scope.row)">{{scope.row.name}}</span>
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column prop='tenant.name' :label='$t("Public.tenant")' min-width='100'align='center'></el-table-column>
   	 		<el-table-column  :label='$t("Public.logicStatus")' min-width='100'align='center'>
   	 			<template slot-scope='scope'>
   	 				<span :class='scope.row.usableTextColor'>{{scope.row.usableText}}</span>
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column prop='physical_ports_len' :label='$t("Public.portNumber")' min-width='100'align='center'></el-table-column>
   	 		<el-table-column prop='access_type' :label='$t("Public.linkType")' min-width='100'align='center'></el-table-column>
   	 		<el-table-column prop='start_time' :label='$t("Public.conStart")' :formatter='dateFormat' width='80'align='center'></el-table-column>
   	 		<el-table-column prop='end_time' :label='$t("Public.conEnd")' :formatter='dateFormat' width='80'align='center'></el-table-column>
   	 		<el-table-column prop='descriptionVal' :label='$t("Public.description")' min-width='100'align='center'></el-table-column>
   	 		<el-table-column  :label='$t("Public.operation")' width='120'  v-if=' !tit'align='center'>
   	 			<template slot-scope='scope'>
   	 				<el-button size='mini' type='info' @click='handleStatus(scope.$index, scope.row)'>{{scope.row.btnStatus}}</el-button>
	   	 			<el-button size='mini' type='success' @click='handleEdit(scope.$index,scope.row)'>{{$t('tabOperation.edit')}}</el-button>
	   	 			<el-button size='mini' type='danger' @click='handleDel(scope.$index,scope.row)' v-if="scope.row.btnStatus== '启用' ">{{$t('tabOperation.delete')}}</el-button>
   	 			</template>
   	 		</el-table-column>
   	 		
   	 	</el-table>
   	 	<el-row>
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
	import {getPortStatus,isPortStatus,descriptionValue,datedialogFormat,dealNull} from '@/assets/js/index'
	export default{
		name:'port',
		props:['titleOne','titleTwo','LogicTitle','tenantID'],//来判断进入的界面的，控制添加和操作按钮显示
		data(){
			return{			
				token:'',
				filters:{
					nameLogo:'',
					name:'',
					status:''
				},
				PortStatus:[
					{
						label:'UP',
						value:'UP'
					},{
						label:'DOWN',
						value:'DOWN'
					},{
						label:this.$t('Public.abnormal'),
						value:'异常'
					},{
						label:this.$t('Public.Prohibit'),
						value:'禁用'
					}
				],
				
				users:[],
//				sels:[],
				loading:false,
				//分页所需要的参数
				total:0,
				pagesize:10,
				currentPage:1,
				pageNum:1,
				pagecount:5,

				excelData:[],
				//用来控制删除按钮的显示和隐藏
				statusDel:null,
				tenantData:[],//租户数据
				tit:''
			}
		},
		watch:{
			'titleOne':function(newVal,oldVal){
				console.log(newVal)
				this.tit=newVal;
				this.getUsers()
			},
			'titleTwo':function(newVal,oldVal){
				console.log(newVal);
				this.tit=newVal;
				this.getUsers()
			},
			'tenantID':function(newVal,oldVal){
				console.log(newVal)
			}
		},
		created(){
			//获取token
			this.token=sessionStorage.getItem('token');
//			console.log(this.titleOne)
//			console.log(this.titleTwo)
			
			this.getUsers();
			this.getTenantData();
			console.log(this.tenantID)
			
		},
		methods:{
			getTenantData(){
				//tenantData
				this.$ajax.get('/tenant/tenants'+'?token='+this.token)
				.then(res => {
					if(res.status==200&& res.data.status==0){
						this.tenantData=res.data.data.items;
					}
				}).catch(e => {
					console.log(e)
				})
			},
			handleSizeChange(val){
//				console.log(`每页${val}条`);
				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
//				console.log(`当前页数是:${val}`)
				this.currentPage=val;
				this.getUsers();

			},
			getUsers(){
				this.loading=true;
				let para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.name,
					search_tenant:typeof this.tenantID !='undefined'? this.tenantID:  this.filters.nameLogo,
					search_device: typeof this.tit !=='undefined' ?this.tit:''
//					search_usable:this.filters.status,
				}
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,para)
				.then(res => {
					this.loading=false;
					if(res.status==200){
						if(res.data.status==0){
							console.log(res)
							descriptionValue(res.data.data.items)
							this.total=res.data.data.page.total;

							res.data.data.items.forEach(ele => {
								ele.physical_ports_len=ele.physical_ports.length;

								if(ele.usable){
									//根据物理端口下的port的status拼接出来的这个参数，并在不同的状态的时候显示不同的字体格式
//									ele.usableText=this.getPortStatus(ele.physical_ports);
									ele.usableText=isPortStatus(ele.physical_ports);
									//根据不同的value设置不同的css
										if(ele.usableText==='UP'){
											ele.usableTextColor='colorGreen'
										}else if(ele.usableText==='DOWN'){
											ele.usableTextColor='colorRed'
										}else if(ele.usableText=== '异常'){
											ele.usableText==='DOWN'
											ele.usableTextColor='colorWarning'
										}	
									ele.btnStatus=this.$t('Public.Prohibit')
								}else{
									ele.usableText='禁用';
									ele.btnStatus=this.$t('Public.enable');
									ele.usableTextColor='portAbnor'
								}
							})
								//对数据状态的遍历  
							if(this.filters.status !=''){
									this.users=res.data.data.items.filter(item => {
										return item.usableText==this.filters.status;
									})
							}else{
								this.users=res.data.data.items;
							}

						}
					}
				}).catch(e => {
					console.log(e)
				})
			},
			reset(){
				this.$refs['filters'].resetFields();

			},
			addUsers(){
				//添加  逻辑端口
//				console.log('进入逻辑端口的创建')
				this.$router.push({
					path:'/resource/add/logicalPort',
					query:{
						name:'新建逻辑端口'
					}
				})
			},
			handleEdit(index,row){
				//编辑逻辑端口部分
//				console.log('进入逻辑端口的编辑部分')
				this.$router.push({
					path:'/resource/edit/logicalPort',
					query:{
						id:row.id
					}
				})
			},
			handleSee(index,row){
				//查看信息详情
//				console.log('进入详情的界面');
				this.$router.push({
					path:'/resource/see/logicalPort',
					query:{
						detailsID:row.id
					}
				})
			},
			handleStatus(index,row){
				//设置端口的启用和禁用

				if(row.btnStatus ==this.$t('Public.Prohibit')){

					this.$confirm(this.$t('confirm.disPort'),this.$t('confirm.tooltip'),{})
					.then(() => {
						this.$ajax.put('/port/to_disable_logic_port/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if (res.data.status==0) {
									this.$message({
										message:this.$t('tooltipMes.diSuccess'),
										type:'success'
									});
									
//									row.btnstatus='启用'
									this.getUsers()
								}else{
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}
							}
						})
					}).catch(() => {})
				}else if(row.btnStatus==this.$t('Public.enable')){

					this.$confirm(this.$t('Public.enPort'),this.$t('confirm.tooltip'),{})
					.then(() => {
						
						this.$ajax.put('/port/to_enable_logic_port/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:this.$t('tooltipMes.enSuccess'),
										type:'success'
									})
//									row.btnStatus='禁用';
									this.getUsers()
								}else{
									this.$message({
										message:res.data.message,
										type:'warning'
									})
								}
							}
						})
					}).catch(() => {})
				}
			},
			handleDel(index,row){
				//删除
				this.$confirm(this.$t('confirm.title'),this.$t('confirm.tooltip'),{type:'warning'})
				.then(() =>{
					
					this.$ajax.del('/port/del_logic_port/'+row.id+"?token="+this.token)
					.then(res => {
						if(res.status==200){
							if(res.data.status==0){
								this.$message({
									message:this.$t('tooltipMes.delSuccess'),
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
					})
				}).catch(() => {
					
				})
			},
			//导出数据部分
			handleExport(command){
				if(command=='all'){
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
			exportData:function(params){
				
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,params)
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
					export_json_to_excel(tHeader,data,this.$t('addNode.download')+ 'excel')
				})
			},
			formatJson(filterVal,jsonData){
				return jsonData.map(v => filterVal.map(j => v[j]))
			},
			//表格数据时间转换
			dateFormat(row,column){
	    		//将时间戳转换为前端的时间
	    		let date=null;
	    		if(column.property == "creation_time"){
	    				date=new Date(parseInt(row.creation_time)*1000);
	    		}
	    		if(column.property == "start_time"){
	    				date=new Date(parseInt(row.start_time)*1000);
	    		}
	    		if(column.property == "end_time"){
	    				date=new Date(parseInt(row.end_time)*1000);
	    		}
	    		
	    		let Y=date.getFullYear()+'-';
	    		let M=date.getMonth() + 1<10 ? '0' + (date.getMonth()+1) + '-' :date.getMonth() + 1 + '-';
	    		let D=date.getDate() <10? '0' +date.getDate() +' ':date.getDate()+' ';
	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	    		return Y + M + D + h + m + s	    		
	    }
		}
	}

</script>

<style >
	/*.portUP{
		color: #409EFF;
	}
	.portDOWN{
		color:#F56C6C ;
	}
	.portAbnor{
		color:#E6A23C;
		
	}*/
</style>
