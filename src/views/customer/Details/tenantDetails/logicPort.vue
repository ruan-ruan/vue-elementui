<template>
	<div>
		<!--逻辑端口-->
		<section>
			<el-row class='toolbar' style='padding-bottom: 0px;'>
				<el-col :span='24'>
					<el-form :inline='true' :model='filters'ref='filters' @submit.native.prevent>
						<el-form-item label='端口名称'>
							<el-input v-model='filters.name' placeholder='请输入名称'class='sel'></el-input>
						</el-form-item>
						<el-form-item label='租户标识'>
							<el-input v-model='filters.name'class='sel'></el-input>
						</el-form-item>
						<el-form-item label='逻辑口状态'>
							<el-select v-model='filters.status' class='sel'>
								<el-option v-for='(item,index) in portStatus'
									:value='item.value'
									:label='item.label'
									:key='index'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type='primary' @click='getUsers' >搜索</el-button>
							<el-button type='info'  @click='reset(filters)' >重置</el-button>
							
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			
			<!--表格数据部分-->
			<el-table :data='users'highlight-current-row @selection-change="selsChange" style="width: 100%;" v-loading='loading'>
				<el-table-column type='selection' width='55' align='center'>
				</el-table-column>
				<el-table-column label='序号' width='55' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='逻辑端口名称' width='100' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='租户标识' width='100' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='逻辑口状态' width='100' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='端口组合数' width='100' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='用户连接方式' width='100' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='合同开始时间':formatter='dateTableFormat' width='100' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='合同终止时间':formatter='dateTableFormat' width='100' align='center'>
				</el-table-column>
				<el-table-column prop='name' label='备注' width='100' align='center'>
				</el-table-column>
			</el-table>
			<el-row>
				<el-col :span='24'>
					<el-col :span='4'>
						<el-dropdown split-button type='success' @command='handleExport'>
							导出数据
							<el-dropdown-menu slot='dropdown'>
								<el-dropdown-item command='current'>当前页</el-dropdown-item>
								<el-dropdown-item command='all'>所有页</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
					<el-col :span='20'>
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
				</el-col>
			</el-row>
		</section>
	</div>
</template>

<script>

import {dateTableFormat} from '@/assets/js/index.js';	
	export default{
		name:'logicPort',
		data(){
			return{
				//获取权限token
				token:'',
				filters:{
					name:''
				},
				portStatus:[
					{
						value:'UP',
						label:'UP'
					},{
						value:'DOWN',
						label:"DOWN"
					},
					{
						value:'异常',
						label:"异常"
					},{
						value:"禁用",
						label:'禁用'
					}
				],
				users:[],
				sels:[],
				loading:false,
				//保存导出的数据
				excelData:[],
				//分页的时候所需要的数据
				total: 0,
		//	  page:1,
			  	pagesize:10,
			  	currentPage:1,
			  	pageNum:1,
			  	pagecount:5,
			  	next:'下一页',
			  	prev:'上一页',
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getUsers();
		},
		methods:{
			reset(val){
				for(let ietm in val){
					val[item]=''
				}
			},
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
			getUsers(){
				//获取所有的数据
			},
			selsChange(val){
				this.sels.push(val);
			},
			handleExport(command){
				var _this=this;
				if(this.users==''){
					this.$message({
						message:'没有数据，不能导出！',
						type:'warning '
					})
				}else{
					if(command=='all'){
						//导出所有的数据
						this.$confirm('确定要导出所有页的数据吗?','提示',{
							confirmButtonText:'确定',
			    			cancelButtonText:'取消',
			    			type:'warning'
						})
						.then(() => {
							this.exportData()
						}).catch(() => {})
					}else if(command=='current'){
						this.$confirm('确定要导出当前页的数据吗?','提示',{
							confirmButtonText:'确定',
			    			cancelButtonText:'取消',
			    			type:'warning'
						})
						.then(() => {
							let para={
								page:this.currentPage,
			    				per_page:this.pagesize
							}
							this.exportData(para)
						}).catch(() => {})
					}
				}
			},
			exportData:function(params){
				//导出数据
				
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
				//将数据写入表格数据
				let that=this;
				require.ensure([],() => {
					const {export_json_to_excel} =require('@/excel/export2Excel');
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
			dateTableFormat(row,column){
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

<style>
</style>