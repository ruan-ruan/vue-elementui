<template>
  <div>
   	 <!--逻辑端口管理-->
   	 <section>
   	 	<el-row class='toollbar' style='width: 100%;'>
   	 		<el-col :span='24'>
   	 			<el-form :inline='true' :model='filters' ref='filters'>
   	 				<el-form-item label='名称' prop='name'>
   	 					<el-input v-model='filters.name' placeholder="请输入逻辑端口名称" class='sel'></el-input>
   	 				</el-form-item>
   	 				<el-form-item label='租户标识' prop='nameLogo'>
   	 					<el-input v-model='filters.nameLogo' placeholder="请输入逻辑端口名称" class='sel'></el-input>
   	 				</el-form-item>
   	 				<el-form-item label='状态' prop='status'>
   	 					<!--<el-input v-model='filters.name' placeholder="请输入逻辑端口名称"></el-input>-->
   	 					<el-select v-model='filters.status'placeholder="请选择逻辑端口状态" class='sel'>
   	 						<el-option v-for=' (item,index) in PortStatus'
   	 							:value='item.value'
   	 							:key='index'
   	 							:label='item.label'></el-option>
   	 					</el-select>
   	 				</el-form-item>
   	 				<el-form-item>
   	 					<el-button type='primary' @click='getUsers'>搜索</el-button>
   	 					<el-button type='info' @click='reset(filters)'>重置</el-button>
   	 				</el-form-item>
   	 			</el-form>
   	 		</el-col>
   	 	</el-row>
   	 	
   	 	<el-row>
   	 		<el-col :span='24'>
   	 			<el-col :span='4'>
   	 				<el-button type='primary' @click='addUsers' v-if=' !tit'>+创建逻辑端口</el-button>
   	 			</el-col>
   	 			<el-col :span='20'>
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
   	 	
   	 	
   	 	<!--表格数据部分-->
   	 	<el-table :data='users' highlight-current-row style='width: 100%;' v-loading='loading'>
   	 		<el-table-column type='index' width='60' align='center'></el-table-column>
   	 		<el-table-column prop='creation_time' label='创建时间' width='120'align='center':formatter='dateFormat'></el-table-column>
   	 		<el-table-column prop='name' label='逻辑端口名称' width='120'align='center'>
   	 			<template slot-scope='scope'>
   	 				<span class='cli_spn' @click="handleSee(scope.$index,scope.row)">{{scope.row.name}}</span>
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column prop='tenant.name' label='租户标识' width='120'align='center'></el-table-column>
   	 		<el-table-column  label='逻辑口状态' width='120'align='center'>
   	 			<template slot-scope='scope'>
   	 				<span :class='scope.row.usableTextColor'>{{scope.row.usableText}}</span>
   	 			</template>
   	 		</el-table-column>
   	 		<el-table-column prop='physical_ports_len' label='端口组合数' width='120'align='center'></el-table-column>
   	 		<el-table-column prop='access_type' label='用户连接方式' width='120'align='center'></el-table-column>
   	 		<el-table-column prop='creation_time' label='合同开始时间' width='120'align='center':formatter='dateFormat'></el-table-column>
   	 		<el-table-column prop='creation_time' label='合同结束时间' width='120'align='center':formatter='dateFormat'></el-table-column>
   	 		<el-table-column prop='creation_time' label='备注' width='120'align='center'></el-table-column>
   	 		<el-table-column  label='操作' width='260'  v-if=' !tit'>
   	 			<template slot-scope='scope'>
   	 				<el-button size='small' type='info' @click='handleStatus(scope.$index, scope.row)'>{{scope.row.btnStatus}}</el-button>
	   	 			<el-button size='small' type='success' @click='handleEdit(scope.$index,scope.row)'>编辑</el-button>
	   	 			<el-button size='small' type='danger' @click='handleDel(scope.$index,scope.row)' v-if="scope.row.btnStatus=='启用'">删除</el-button>
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
				     	:prev-text='prev'
				     	:next-text='next'></el-pagination>
   	 		</el-col>
   	 	</el-row>
   	 </section>
  </div>
</template>

<script>
	import {getPortStatus} from '@/assets/js/index'
	export default{
		name:'port',
		props:['tit','LogicTitle'],//来判断进入的界面的，控制添加和操作按钮显示
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
						label:'异常',
						value:'异常'
					},{
						label:'禁用',
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
				next:'下一页',
				prev:'上一页',
				excelData:[],
				//用来控制删除按钮的显示和隐藏
				statusDel:null,
			}
		},
		created(){
			//获取token
			this.token=sessionStorage.getItem('token');
			if(this.tit){//如果存在详情的里面的数据的时候，直接赋值就可以了 ，否则执行下面的
				this.users=this.tit
			}else{
				this.getUsers();
			}
			
		},
		methods:{
			handleSizeChange(val){
//				console.log(`每页${val}条`);
				this.pagesize=val;
				this.getUsers()
			},
			handleCurrentChange(val){
//				console.log(`当前页数是:${val}`)
				this.currentPage=val;
				this.getUsers()
			},
			getUsers(){
				this.loading=true;
//				filters:{
//					nameLogo:'',
//					name:'',
//					status:''
//				},
				let para={
					page:this.currentPage,
					per_page:this.pagesize,
					search_name:this.filters.name,
					search_tenant:this.filters.nameLogo,
//					search_usable:this.filters.status,
				}
				this.$ajax.get('/port/logic_ports'+'?token='+this.token,para)
				.then(res => {
					this.loading=false;
					if(res.status==200){
						if(res.data.status==0){
							console.log(res);
							res.data.data.items.forEach(ele => {
								console.log(ele)
								console.log(getPortStatus(ele.physical_ports));
								ele.physical_ports_len=ele.physical_ports.length;
								let portColor=document.getElementsByClassName('portColor');
								if(ele.usable){
									//根据物理端口下的port的status拼接出来的这个参数，并在不同的状态的时候显示不同的字体格式
//									ele.usableText=this.getPortStatus(ele.physical_ports);
									ele.usableText=getPortStatus(ele.physical_ports);
									//根据不同的value设置不同的css
										if(ele.usableText==='UP'){
											ele.usableTextColor='portUP'
										}else if(ele.usableText==='DOWN'){
											ele.usableTextColor='portDOWN'
										}else if(ele.usableText==='异常'){
											ele.usableText==='DOWN'
											ele.usableTextColor='portAbnor'
										}	
									ele.btnStatus='禁用'
								}else{
									ele.usableText='禁用';
									ele.btnStatus='启用';
									ele.usableTextColor='portAbnor'
								}
								// if(ele.usableText=='禁用'){
								// 	//禁用的是可以显示删除按钮部分
								// 	this.statusDel=true
								// }else{
								// 	//否则的时候是隐藏
								// 	this.statusDel=false
								// }
							})
								//对数据状态的遍历  
							if(this.filters.status !=''){
									this.users=res.data.data.items.filters(item => {
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
			reset(sel){
				for (let index in sel) {
					sel[index]=''
				}
			},
			addUsers(){
				//添加  逻辑端口
				console.log('进入逻辑端口的创建')
				this.$router.push({
					path:'/resource/add/logicalPort',
					query:{
						name:'新建逻辑端口'
					}
				})
			},
			handleEdit(index,row){
				//编辑逻辑端口部分
				console.log('进入逻辑端口的编辑部分')
				this.$router.push({
					path:'/resource/edit/logicalPort',
					query:{
						id:row.id
					}
				})
			},
			handleSee(index,row){
				//查看信息详情
				console.log('进入详情的界面');
				this.$router.push({
					path:'/resource/see/logicalPort',
					query:{
						detailsID:row.id
					}
				})
			},
			handleStatus(index,row){
				//设置端口的启用和禁用
				console.log(row);
				if(row.btnStatus=='禁用'){
					console.log('执行禁用');
					this.$confirm('确定要禁用该端口吗?','提示',{})
					.then(() => {
						this.$ajax.put('/port/to_disable_logic_port/'+row.id+'?token='+this.token)
						.then(res => {
							console.log(res);
							if(res.status==200){
								if (res.data.status==0) {
									this.$message({
										message:'禁用成功!',
										type:'success'
									});
									
									row.btnstatus='启用'
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
				}else if(row.btnStatus=='启用'){
					console.log('执行启用');
					this.$confirm('确定要启用该端口吗?','提示',{})
					.then(() => {
						
						this.$ajax.put('/port/to_enable_logic_port/'+row.id+'?token='+this.token)
						.then(res => {
							if(res.status==200){
								if(res.data.status==0){
									this.$message({
										message:'启用成功',
										type:'success'
									})
									row.btnStatus='禁用';
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
				this.$confirm('确定要删除该端口吗?','提示',{type:'warning'})
				.then(() =>{
					
					this.$ajax.del('/port/del_logic_port/'+row.id+"?token="+this.token)
					.then(res => {
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
					})
				}).catch(() => {
					
				})
			},
			//导出数据部分
			handleExport(command){
				if(command=='all'){
					console.log('导出所有的数据');
					this.$confirm('确定要导出当前的数据吗?','提示',{})
					.then(() => {
						var para={
		    				page:this.currentPage,
		    				per_page:this.pagesize,
						}
						this.exportData(para)
					}).catch(() => {})
				}else if(command=='current'){
					console.log('导出当前页面的数据');
					this.$confirm('确定要导出所页面的数据吗?','提示',{})
					.then(() => {
						this.exportData()
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
	    		let D=date.getDate() <10? '0' +date.getDate() +'':date.getDate()+'';
	    		let h=date.getHours() <10 ?'0' +date.getHours() +':':date.getHours() + ':';
	    		let m=date.getMinutes() <10 ? '0' +date.getMinutes() +':': date.getMinutes()+ ':';
	    		let s=date.getSeconds() <10? '0' +date.getSeconds(): date.getSeconds();
	    		return Y + M + D + h + m + s	    		
	    }
		}
	}

</script>

<style >
	.portUP{
		color: #409EFF;
	}
	.portDOWN{
		color:#F56C6C ;
	}
	.portAbnor{
		color:#E6A23C;
		
	}
</style>
