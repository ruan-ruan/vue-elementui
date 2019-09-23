<template>
	<div>
		关联虚拟专线
		<section>
			<!--工具条-->
			<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
				<el-form :inline='true' :model='filters'>
					<el-form-item label='名字'>
						<el-input v-model='filters.name'class='sel'></el-input>
					</el-form-item>
					<el-form-item label='状态'>
						<el-select v-model='filters.status' placehodle='全部' class='sel'>
							<!--<el-option>
								
							</el-option>-->
						</el-select>						
					</el-form-item>
					<el-form-item label='带块(Mbps)'>
						<el-input class='sel'></el-input>至
						<el-input class='sel'></el-input>
					</el-form-item>
					<el-form-item label='冗抗性'>
						<el-select placehodle='全部' class='sel'>
							<!--<el-option>
								
							</el-option>-->
						</el-select>
					</el-form-item>
					<el-form-item label='开始时间' >	
						<el-date-picker
					      v-model="timeVal"
					      type="daterange"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期">
					    </el-date-picker>
					</el-form-item>
					<el-form-item label='链路保护'>
						<el-select placehodle='全部' class='sel'>
							<!--<el-option>
								
							</el-option>-->
						</el-select>
					</el-form-item>
					<el-form-item label='优先级'>
						<el-select placehodle='全部' class='sel'>
							<!--<el-option>
								
							</el-option>-->
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type='primary' v-on:click='getUsers()'>搜索</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type='info' @click='reset'>重置</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			
			<!--表格数据-->
			<el-table :data='users' highlight-current-row @selection-change='selsChange' style='width: 100%;'>
				<el-table-column type='selection' width='70' align='center'>
				</el-table-column>
				<el-table-column type='index' width='70' align='center'label='序号'>
				</el-table-column>
				<el-table-column prop='name' width='100' align='center'label='名称'>
				</el-table-column>
				<el-table-column prop='status' width='100' align='center'label='状态'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='带宽'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='A端'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center'label='A端状态'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='B端'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='冗抗性'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='开始时间'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='过期时间'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='链路保护'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='优先级'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='用户'>
				</el-table-column>
				<el-table-column prop='selection' width='70' align='center' label='描述信息'>
				</el-table-column>
				<el-table-column  width='70' align='center' label='操作'>
					<template solt-scope='scope'>
						<el-button size='small' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
						<el-button size='small' @click='handleDel(scope.$index, scope.row)'>删除</el-button>
						<el-button size='small' @click='handleDis(scope.$index, scope.row)'>禁用</el-button>
						<el-button size='small' @click='handleMore(scope.$index, scope.row)'>更多</el-button>
						
					</template>
				</el-table-column>
			</el-table>
			
			<!--底部工具条-->
			<el-col :span='24' class='toolbar'>
				<el-col :span='3'>
					<el-button type='danger' @click='batchRemove(sels)'>批量删除</el-button>
				</el-col>
				<el-col :span='3'>
					<el-dropdown split-button type='success'>
						导出数据
						<el-dropdown-menu slot='dropdown'>
							<el-dropdown-item><el-button>当前页</el-button></el-dropdown-item>
							<el-dropdown-item><el-button>所有页</el-button></el-dropdown-item>
							
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>
		</section>
	</div>
</template>

<script>
	export default{
		name:'special',
		data(){
			return{
				filters:{
					name:'',
					status:'',
					start_time:'',
					end_time:'',
					line:'',
					level:'',					
				},
				timeVal:'',
				//接收表格数据
				users:[],
				//多选的时候用来存储多选的数据
				sels:[],
			}
		},
		methods:{
			reset(){
				
			},
			getUsers(){
				
			},
			//多选部分
			selsChange(sels){
				this.sels=sels;
			},
			//编辑
			handleEdit(index,row){
				
			},
			//删除
			handleDel(index,row){
				
			},
			//禁用
			handleDis(index,row){
				
			},
			//更多
			handleMore(index,row){
				
			}
		},
		mounted(){
			this.getUsers()
		}
	}
</script>

<style scoped>
	.sel{
		width: 100px;
	}
</style>