<template>
	<div>
		<!--路径选择-->
		<section >
			<goback v-if='selectId'></goback>
			<el-row >
				<el-col :span='14'>
					
					<ul >
						<li>默认路径：{{JSON.stringify(info)!=="{}"? info.action === 'create' ? "否" :'是':'是(无指向路径)'}}</li>
						<li>路径更新于：{{info.time}}</li>
						<li>切换原因：{{info.reason}}</li>
						<li class="cli_toTip" v-if='selectId'>温馨提示：请从起点开始依次规划路径走向(请先选中起点)</li>
					</ul>
				</el-col>
				<el-col :span='10'align='left'>
					<div v-if='selectId'>
						<el-button size='mini' type='primary' @click.native='handlePath' 
							v-if='JSON.stringify(info) !=="{}" ? info.action ==="delete"?false:true :false'
							>
							{{btn }}
						</el-button>
					</div>
					<div v-else>
						<!--进入详情的界面的时候存在的按钮文本-->
						<el-button size='mini' type='primary' @click.native='selectPath' >
							{{btn}}
						</el-button>
					</div>
				</el-col>
			</el-row>
			<el-row class='marT10'>
				<el-col :span='16'style='text-align: center;'>
					<!--拓扑的节点图 :detail='titData':sendCurrent='getCurren' -->
					<charts ref='default' 
						:id='ids' 
						:detail='titData' 
						v-if='basicBool && ids'   
						:currentData='currentData'  
						@sendNode='getNode' 
						@basic='getBasic'
						@sendStatus='getStatus'
						></charts>
					<div class="marT10" v-if='selectId'>
						
						<el-button @click='newPath'>保存新路径</el-button>
						<el-button @click='$router.go(-1)'>返回</el-button>
					</div>
					
				</el-col>
				<el-col :span='8'>
					
					<h3 >路径节点排列表:
						<el-button size='small' type='primary' @click='reduction' v-if='selectId  && !selectStatus'>还原 </el-button>
					</h3>
					
					<el-table :data='Nodes' width='100%'>
						<el-table-column type='index' label='跳数'align='center' min-width='40'>
						</el-table-column>
						<el-table-column prop='node.name' label='节点名称'align='center'min-width='60'></el-table-column>
						<el-table-column prop='def_val' label='类型'align='center'min-width='40'></el-table-column>
					</el-table>
					<span class="path_spa marT10" v-if='JSON.stringify(info)!=="{}"? info.action === "create" ? false:true:true'>
						当前系统默认路径
						<span v-if='JSON.stringify(info) ==="{}"'>
							(无指向路径)
						</span>
					</span>
					
				</el-col>
			</el-row>
			<el-row class='marT10'  v-if='!selectId'>
				<el-col :span='24'>
					<history-path :id='ids' v-if='ids' @path_info='path_info' @reduction='reduction' :default='info'@sendChild='sendChild' ></history-path>
					
				</el-col>
			</el-row>
			
			<!--默认路径的还原部分-->
			<el-dialog :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible" :close-on-click-modal="false"  v-loading='editLoading'>
				<el-form :model='backForm':rules="backFormRules" label-width='100px' ref="backForm" >
					<el-form-item label='切换原因' prop='why'>
						<el-input type='textarea' v-model='backForm.why':rows="5"></el-input>
					</el-form-item>
					
				</el-form>
				<div slot='footer' class="dialog-footer">
					<el-button size='small' @click.native='dialogFormVisible=false'>取消</el-button>
					<el-button size='small' v-if='dialogStatus==="back" ' type="primary"  @click='save'>确认</el-button>
					<el-button size='small' v-if='dialogStatus==="path" ' type="primary"  @click='saveNewPath'>确认</el-button>
					
				</div>
			</el-dialog>
			
			
		</section>
	</div>
</template>

<script>
	import {datedialogFormat} from '@/assets/js/index.js'

	import historyPath from '@/views/resources/virtualDetails/childs/historyPath'
	import goback from '@/components/goback';
	import charts from '@/views/resources/virtualDetails/childs/charts'; //测试的组件
	
	export default{
		name:'selectPath',
		data(){
			return {
				token:'',
				basicBool:true,
				selectId:this.$route.query.selectId,//详情界面和table里面的路径修改部分的时候公用
				info:{},
				textMap:{
					back:'还原默认路径',
					path:'保存新路径'
				},
				dialogStatus:'',
				dialogFormVisible:false,
				editLoading:false,
				backForm:{
					why:''
				},
				backFormRules:{
		        	why: [{ required: true, message:'请填写原因' , trigger: "blur" }]
				},
				Nodes:[],//节点的列表
				basicList:[],//备份列表
				currentData:{},
				selectStatus:true,
			};
		},
		props:['titData'],//进入详情的界面
		components:{
			historyPath,
			goback,
			charts,//测试的组件
		},
		computed:{
			ids(){
				if(typeof this.selectId  === 'undefined'){
					return this.titData
				}
				if(typeof this.titData === 'undefined'){
					return this.selectId;
				}
			},
			btn(){
				if(this.titData){
					return '路径调整'
				}else{
					if(JSON.stringify(this.info) !=='{}'){
						return this.info.action ==='create'?'还原系统默认路径':'';
					}
				}
			},

		},

		created(){
			this.token=sessionStorage.getItem('token');
			this.detailInfo(this.ids)

		},
		methods:{

			getStatus(msg){
				this.selectStatus=false;
			},
			sendChild(msg){
				this.reduction()
			},
			path_info(msg){
				this.currentData=msg;
			},
			reduction(){
				this.Nodes=JSON.parse(JSON.stringify(this.basicList));
				this.basicBool=false;
				setTimeout( () => {
					this.basicBool=true;
				},100)
				this.selectStatus=true;
			},
			getNode(msg){
//				var Data=[]
//				var str=msg.map((item,index) => {
//					if(item.def_val === '起点'){
//						Data.unshift(item)
//					}else{
//						Data.push(item)
//					}
//				})
				this.Nodes=msg;
			},
//			getCurren(msg){
//				this.Nodes=JSON.parse(JSON.stringify(msg));
//			},
			getBasic(msg){//数据备份
				this.basicList=JSON.parse(JSON.stringify(msg))
			},
			detailInfo(id){//获取路径  列表的默认的信息
				this.$ajax.get('/vll/paths/'+id+'?token='+this.token)
				.then(res => {
					if(res.status === 200){
						if(res.data.status === 0){
							if(res.data.data.items.length !== 0 ){
								var str=res.data.data.items[0];
								for(var key in str){
									if( (!str[key] && typeof (str[key] !=='undefined') && str[key] !== 0) || typeof str[key] ==='undefined' ){
										str[key] = ''
									}
									if(key === 'creation_time') str['time']=datedialogFormat(str[key])
								}
								this.currentData=str
								this.info=JSON.parse(JSON.stringify(str));
							}
							
						}
					}
				})
				.catch(err =>{ console.log(err) })
			},
			handlePath(){
				//存在两种情况   只有在详情的界面 显示-调整路径-才需要进行路由的跳转      在调整路径界面的时候 显示  -还原默认路径-  信息
				if(this.info.action ==='create'){//路径调整的时候  显示路径的还原信息
					this.dialogStatus='back';
					this.dialogFormVisible=true;
				}
			},
			selectPath(){
				//进入路径调整的界面
				if(!this.selectId && this.btn =='路径调整'){
					this.$router.push({
						path:'/resource/seletPath',
						query:{
							selectId:this.ids
						}
					})
				}
			},
			save(){//还原路径的时候保存
				this.$refs.backForm.validate(valid => {
					if(valid){
						var params={
							reason:this.backForm.why,
						}
						this.$axios.put('/vll/return_path/'+this.ids+'?token='+this.token,params)
						.then(res => {
							if(res.status === 200){
								if(res.data.status === 0){
									this.$message({
										message:'操作成功！',
										type:'success'
									})
									this.dialogFormVisible=false;
									this.$refs["backForm"].resetFields();
									this.reduction();//执行刷新
									this.detailInfo(this.ids)
								}
							}
						})
						.catch(err => {console.log(err)})
					}
				})
				
				
			},
			newPath(){
				this.dialogStatus='path';
				this.dialogFormVisible=true;
			},
			saveNewPath(){
				//新路径的保存
				this.$refs.backForm.validate(valid => {
					if(valid ){
						var sli=[];
						this.Nodes.map(item => {
							sli.push(item.node.id)
						})
						var para={
							reason:this.backForm.why,
							node_ids:sli
						}
		
						this.$axios.put('/vll/change_path/'+this.selectId+'?token='+this.token,para)
						.then(res => {
							if(res.status === 200){
								if(res.data.status === 0){
									console.log(res)
									this.$message({
										message:'修改成功',
										type:'success'
									})
									this.dialogFormVisible=false;
									this.$refs["backForm"].resetFields();
									this.reduction();//执行刷新
									this.detailInfo(this.ids);
		
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

<style>
	
	.path_spa{
		display: block;
		width: 100%;
		height: 30px;
		line-height: 30px;
		border-radius: 10px;
		background:#35CDFF;
		text-align: center;
	}
</style>