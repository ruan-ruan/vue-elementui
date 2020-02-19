<template>

	<div>
		<section>
			<el-row class='history'>
				<el-col :span='2'align='center' >历史路径</el-col>
				<el-col :span='22'>
					<el-pagination 
						@size-change="handleSizeChange" 
						@current-change="handleCurrentChange" 
						:current-page="index" 							
						:page-size="size" 
						:page-sizes="[10,20,30,50]"
						layout="total, sizes, prev, pager, next, jumper" 
						:total="tableCopyTableList.length"
						style='padding-top: 6px;'>
		    		</el-pagination>
				</el-col>
				<el-col :span='24'>
					<ul class="marT10 dashed_top" >
						<li v-for='(item ,index ) in  historyData ' :key='index' >
							<el-row class="dashed_bom">
								<el-col :span='24' >
									<el-col :span='8'>
										<ul>
											<li>默认路径:{{item.name}}</li>
											<li>路径更新于:{{item.age}}</li>
											<li>切换原因:{{item.work}}</li>
										</ul>
									</el-col>
									<el-col :span='16'>
										<el-button size='mini' type='primary' style='margin-top: 50px;' @click='seePath(index,item)'> 查看路径(共使用{{item.num}}次)</el-button>
									</el-col>
								</el-col>
							</el-row>
						</li>
					</ul>
				</el-col>
			</el-row>
			
			<el-dialog 
				:title='textMap[dialogStatus]'
				:visible.sync='dialogFormVisible'
				:close-on-click-modal='false'
				v-loading='seeLoading'
				background-color='green'>
				
				<path-detail></path-detail>
				<el-row class='marT10'>
					<el-col :span='16'>
						<path-chart></path-chart>
					</el-col>
					<el-col :span='8'>
						<path-list></path-list>
					</el-col>
					<el-col :span='24'align='center'>
						<el-button size='small' type='primary' @click='redeployment '>重新部署</el-button>
						<el-button  size='small' type='info' @click='dialogFormVisible=false'>取消</el-button>
					</el-col>
				</el-row>
				
			</el-dialog>
			
		</section>
	</div>
</template>

<script>
	import pathDetail from '@/views/resources/virtualDetails/childs/pathDetail'
	import pathList from '@/views/resources/virtualDetails/childs/pathList'
	import pathChart from '@/views/resources/virtualDetails/childs/pathChart'
	export default{
		name:'history',
		data(){
			return {
				historyData:[],//处理后的数据
				//自定义分页
				index: 1,
      			size: 10,
      			tableCopyTableList: [
      				{
						name:'1',
						age:'1',
						work:'1',
						num:1
					},{
						name:'2',
						age:'2',
						work:'2',
						num:2
					},{
						name:'3',
						age:'3',
						work:'3',
						num:3
					}
      			],//数据copy  所有的数据
      			textMap:{
      				see:'路径详情',
      			},
      			dialogStatus:'',
      			dialogFormVisible:false,
      			seeLoading:false,
			};
		},
		components:{ pathDetail ,pathList , pathChart },
		created(){
			this.historyData = this.paging(this.size, this.index);
		},
		methods:{
			// 页数改变事件
		    handleSizeChange(size) {
		      	this.size = size;
		      	this.historyData = this.paging(size, this.index);
		    },
		    // 页码改变事件
		    handleCurrentChange(current) {
		      	this.index = current;
		      	this.historyData = this.paging(this.size, current);
		    },
			// 本地分页的方法
		    paging(size, current) {
		      	const tableList = JSON.parse(JSON.stringify(this.tableCopyTableList));
		      	const tablePush = [];
		      	tableList.forEach((item, index) => {
		        	if (size * (current - 1) <= index && index <= size * current - 1) {
		          		tablePush.push(item);
		        	}
		      	});
		      	return tablePush;
		    },
		    seePath(index,row){
		    	console.log(row);
		    	console.log(index);
		    	this.dialogStatus='see';
		    	this.dialogFormVisible=true;
		    	
		    },
		    redeployment(){
		    	//重新部署
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