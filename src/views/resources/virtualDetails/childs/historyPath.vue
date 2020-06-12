<template>

	<div>
		<section>
			<el-row class='history'>
				<el-col :span='2'align='center' >
					历史路径
				</el-col>
				
				<el-col :span='7'>
					<!--<el-pagination
						style='margin-top:5px'
			            :total="total"
			            @size-change="handleSizeChange"
			            @current-change="handleCurrentChange"
			            layout="total, sizes, prev, pager, next, jumper"
			            :page-sizes="[5, 10, 20,30]"
			            :current-page.sync="currentPage"
			            :page-count='pageNum'
			            :pager-count="pagecount"
			        ></el-pagination>-->
				</el-col>
				<el-col :span='15'>
					日期时间:
					<el-date-picker
						v-model='time'
				      	type="datetimerange"
				      	range-separator="至"
				      	start-placeholder="开始日期"
				      	end-placeholder="结束日期">
				    </el-date-picker>
				</el-col>
				<el-col :span='24'>
					<ul class="marT10 dashed_top" >
						<li v-for='(item ,index ) in  list ' :key='index' >
							<el-row class="dashed_bom">
								<el-col :span='24' >
									<el-col :span='10'>
										<ul>
											<li>状态:{{item.status_type}}</li>
											<li>路径更新于:{{item.time}}</li>
											<li>切换原因:{{item.reason}}</li>
										</ul>
									</el-col>
									<el-col :span='14'>
										<el-button 
											size='mini'
											:disabled=' default_val.id === item.id?true:false '
											:type='default_val.id === item.id?"info":"primary"'
											style='margin-top: 50px;' 
											@click='seePath(index,item)'
											v-if='(item.status_type =="创建失败" || item.status_type =="删除成功") ?false:true '
											>
											{{default_val.id === item.id?'路径使用中':'查看路径'}}
										</el-button>
									</el-col>
								</el-col>
							</el-row>
						</li>
						
					</ul>
				</el-col>
				<el-col :span='24'	>
					<el-pagination
						style='margin-top:5px'
			            :total="total"
			            @size-change="handleSizeChange"
			            @current-change="handleCurrentChange"
			            layout="total, sizes, prev, pager, next, jumper"
			            :page-sizes="[5, 10, 20,30]"
			            :page-size="pagesize"
			            :current-page.sync="currentPage"
			            :page-count='pageNum'
			            :pager-count="pagecount"
			        ></el-pagination>
				</el-col>
			</el-row>
			
			<el-dialog 
				:title='textMap[dialogStatus]'
				:visible.sync='dialogFormVisible'
				:close-on-click-modal='false'
				v-loading='seeLoading'
				background-color='green'
				@open="open()"
				@close='close'
				>

				<el-row>
					<el-col :span='24'>
						<ul>
							<li>默认路径:{{info.action ==='delete'?'是':'否'}}</li>
							<li>路径更新于:{{info.time}}</li>
							<li>切换原因:{{info.reason}}</li>
						</ul>
					</el-col>
				</el-row>
				<el-row class='marT10'>
					<el-col :span='16'>
						<charts ref='chart_svg'@sendReal='getReals' :currentData='currentData' @sendNode='getNode' :id='id' :detail='id' v-if='bool'></charts>
					</el-col>
					<el-col :span='8'>
						<h3 >指定路径节点排列表:
						</h3>
						<div v-if='Nodes && Nodes.length != 0'>
							<el-table :data='Nodes ' width='100%'>
								<el-table-column type='index' label='跳数'align='center' min-width='40'>
								</el-table-column>
								<el-table-column prop='node.name' label='节点名称'align='center'min-width='60'></el-table-column>
								<el-table-column prop='def_val' label='类型'align='center'min-width='40'></el-table-column>
							</el-table>
						</div>
						<div v-else class="path_spa marT20">
							当前无指定路径，系统按照真实路径走！
						</div>
						<div class="marT20">
							<h3>真实路径节点排列表:</h3>
							<el-table :data='reals' width='100%'>
								<el-table-column type='index' label='跳数' align='center' min-width='40'></el-table-column>
								<el-table-column prop='name' label='节点名称' align='center' min-width='60'></el-table-column>
								<el-table-column prop='def_val' label='类型' align='center' min-width='40'>
								</el-table-column>
								
							</el-table>
						</div>
						<!--<h3 >路径节点排列表:
						</h3>
						<el-table :data='Nodes' width='100%'>
							<el-table-column type='index' label='跳数'align='center' min-width='40'>
							</el-table-column>
							<el-table-column prop='name' label='节点名称'align='center'min-width='60'></el-table-column>
							<el-table-column prop='def_val' label='类型'align='center'min-width='40'></el-table-column>
						</el-table>
						<span class="path_spa marT10" v-if='JSON.stringify(info)!=="{}"? info.action === "create" ? false:true:true'>
							当前系统默认路径
						</span>-->
					</el-col>
					<el-col :span='24'align='center'>
						<el-button size='small' type='primary' @click='redeployment '>重新部署</el-button>
						<el-button  size='small' type='info' @click='dialogFormVisible=false'>取消</el-button>
					</el-col>
				</el-row>
				
			</el-dialog>

			
			<el-dialog 
				:title='textMap[dialogAgain]'
				:visible.sync='dialogForm'
				:close-on-click-modal='false'
				:modal-append-to-body='false'
				v-loading='seeLoading'
				background-color='green'>

				<el-form :model='form':rules="formRules" ref='form'label-width='100px'>
					<el-form-item label='切换原因' prop='why'>
						<el-input type='textarea' v-model='form.why':rows='4':cols='4'></el-input>
					</el-form-item>
				</el-form>
				<div slot='footer' class="dialog-footer">
					<el-button size='small' @click.native='dialogForm=false'>取消</el-button>
					<el-button size='small'  type="primary"  @click='save'>确认</el-button>
				</div>
				
			</el-dialog>

		</section>
	</div>
</template>

<script>
	import * as d3 from'd3';
	import {datedialogFormat} from '@/assets/js/index.js'

	import charts from '@/views/resources/virtualDetails/childs/charts'
	export default{
		name:'history',
		props:['id','default'],//default  当前界面的使用的路径的id
		data(){
			return {
				reals:{},
				token:'',
				historyData:[],//处理后的数据
				//分页所需要的参数
		      	total: 0,
		      	pagesize: 5,
		      	currentPage: 1,
		      	pageNum: 1,
		     	pagecount: 5,
      			textMap:{
      				see:'路径详情',
      				again:'重新部署路径'
      			},
      			dialogAgain:'',
      			dialogForm:false,
      			dialogStatus:'',
      			dialogFormVisible:false,
      			seeLoading:false,
      			list:[],
      			info:{},
      			form:{
      				why:'',
      			},
      			formRules:{
      				why: [{ required: true, message:'请填写原因' , trigger: "blur" }]
      			},
      			time:null,//时间
      			bool:true,
      			currentData:{},//当前路径的对象
      			Nodes:[],
//    			index:0
			};
		},
		components:{ charts },
		created(){
			this.token=sessionStorage.getItem('token');

			this.getUsers();
		},
		watch:{
			'time':{
				handler:function(newVal,oldVal){
					this.getUsers()
				},
				deep:true
			}
		},
		computed:{
			default_val(){
				return this.default;
			}
		},
		methods:{
			getReals(msg){
				this.reals=JSON.parse(JSON.stringify(msg))
			},
			close(){
				this.$emit('sendChild',false)
			},
			getNode(msg){
				this.Nodes=JSON.parse(JSON.stringify(msg));
			},
			open(){
				this.bool=false;
				d3.select('svg').remove()
				setTimeout(() => {
					this.bool=true;
//					console.log(this.$refs.chart_svg)
					this.$refs.chart_svg.nodes()
					this.$emit('sendChild',false)
				},100)
			},
			// 页数改变事件
		    handleSizeChange(val) {
		      	this.pagesize = val;
		      	this.getUsers();
		    },
		    handleCurrentChange(val) {
		      	this.currentPage = val;
		      	this.getUsers();
		    },
			getUsers(){
				var para;
				if( !this.time && typeof(this.time ) !='undefined'&& this.time !=0){
					para={
						page: this.currentPage,
	        			per_page: this.pagesize,	
					}
				}else {
					para={
						page: this.currentPage,
	        			per_page: this.pagesize,
	        			search_start_time:new Date(this.time[0]).getTime()/1000,
	        			search_end_time:new Date(this.time[1]).getTime()/1000,
					}
				}

				this.$ajax.get('/vll/paths/'+this.id+'?token='+this.token,para)
				.then(res => {
					if(res.status === 200 ){
						if(res.data.status ===0){

							res.data.data.items.map(item => {
								item.time =datedialogFormat(item.creation_time);
								if(item.action ==='delete'){
									if(item.status ==='success'){
										item.status_type='删除成功'
									}
									if(item.status === 'failure '){
										item.status_type='删除失败'
									}
								}
								if(item.action ==='create'){
									if(item.status ==='success'){
										item.status_type='创建成功'
									}
									if(item.status === 'failure '){
										item.status_type='创建失败'
									}
								}
							})
							this.list=res.data.data.items;
							this.total = res.data.data.page.total;
							this.$emit('path_info',res.data.data.items[0] );//  向父组件当前第一条数据  就是要展示的 数据
							this.$emit('sendChild',false)
						}
					}
				})
				.catch(err => {console.log(err)})
			},
		    seePath(index,row){//redeployment
//				this.bool=true;
		    	this.dialogStatus='see';
		    	this.dialogFormVisible=true;
		    	row.time=datedialogFormat(row.creation_time)
		    	this.info=JSON.parse(JSON.stringify(row));
		    	this.currentData=row;
		    },
		    redeployment(){
		    	//重新部署
		    	this.dialogAgain='again';
		    	this.dialogForm = true;
		    },
		    save(){
		    	this.$refs.form.validate(valid => {
		    		if(valid){
		    			var slice=[];
				    	if(this.Nodes){
				    		this.Nodes.map(item =>{
				    			slice.push(item.id)
				    		})
				    	}
				    	var params={
							reason:this.form.why,
							node_ids:slice
						}
						this.$axios.put('/vll/change_path/'+this.id+'?token='+this.token,params)
						.then(res => {
							if(res.status ===200){
								if(res.data.status ===0){
									this.dialogForm=false;
									this.dialogFormVisible=false;
									this.getUsers();
									this.$emit('reduction');//调用父组件内方法
//									this.$parent.reduction()
								}
								
							}
						})
						.catch(err => {console.log(err)})
		    		}
		    	})
		    	
		    }
		}
	}
</script>

<style scoped>
	.history{
		height: 40px;
		line-height:40px ;
		background: #D8DBDC;
		border-radius:10px ;
		
	}
	.dashed_top{
		border-top-style:dashed;
	}
	.dashed_bom{
		border-bottom-style:dashed;
	}
</style>