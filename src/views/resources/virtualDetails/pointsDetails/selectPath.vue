<template>
	<div>
		<!--路径选择-->
		<section >
			<goback v-if='selectId'></goback>
			<el-row >
				<el-col :span='14'>
					<!--<ul>
						<li><label>默认路径:</label></li>
						<li><label>路径更新于:</label></li>
						<li><label>切换原因:</label></li>
					</ul>-->
					<path-detail></path-detail>
				</el-col>
				<el-col :span='10'align='left'>
					<el-button size='mini' type='primary' @click.native='path'>
						{{btn }}
					</el-button>
					
				</el-col>
			</el-row>

			<el-row class='marT10'>
				<el-col :span='16'>
					<path-chart ></path-chart>
				</el-col>
				<el-col :span='8'>
					<path-list></path-list>
				</el-col>
			</el-row>
			<el-row class='marT10'  v-if='!selectId'>
				<el-col :span='24'>
					<history-path></history-path>
				</el-col>
			</el-row>
		</section>
	</div>
</template>

<script>
	import pathList from '@/views/resources/virtualDetails/childs/pathList'
	import pathChart from '@/views/resources/virtualDetails/childs/pathChart'
	import historyPath from '@/views/resources/virtualDetails/childs/historyPath'
	import goback from '@/components/goback'
	import pathDetail from '@/views/resources/virtualDetails/childs/pathDetail'
	export default{
		name:'selectPath',
		data(){
			return {
				token:'',
				selectId:this.$route.query.selectId,//详情界面和table里面的路径修改部分的时候公用
				
			};
		},
		props:['titData'],
//		props:{
//			titData:{//这里是详情存在的id
//				type:Boolean,
//				default:true
//			}
//		},
		components:{
			pathList,
			pathChart,
			historyPath,
			goback,
			pathDetail
		},
		computed:{
			btn(){
				return this.selectId?'还原默认路径':'路径调整'
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
//			console.log(this.titData);
//			console.log(this.selectId)
		},
		methods:{
			path(){
				//存在两种情况   只有在详情的界面 显示-调整路径-才需要进行路由的跳转      在调整路径界面的时候 显示  -还原默认路径-  信息
				if(this.selectId){//存在选择调整的id    为调整界面此时显示还原默认路径
					
				}else{ //进入详情界面
					this.$router.push({
						path:'/resource/seletPath',
						query:{
							selectId:this.titData
						}
					})
				}
			}
		}
	}
	
</script>

<style>
</style>