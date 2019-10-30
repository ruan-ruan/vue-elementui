<template>
	
	
	<div class="toolbar z-one">
		<el-tabs v-model='activeName'  >
			<el-tab-pane :label='$t("topology.details.wat")' name='first'>
				<el-form>
					<el-form-item v-for='(item , index) in itemsData' :key='index' class='label_tit'>
						<template>
							<label>
								<!--时间-->
								{{$t('Public.time')}}
							</label>
							<sapn v-text='item.time'></sapn>
						</template>
						<template>
							<label> 
								<!--类型-->
								{{$t('Public.type')}}
								
							</label>
							<sapn v-text='item.type'></sapn>
						</template>
						<template>
							<label> 
								<!--状态-->
								{{$t('Public.status')}}
								
							</label>
							<sapn v-text='item.status'></sapn>
						</template>
						<template>
							<label>
								<!--名称-->
								{{$t('Public.name')}}
							</label>
							<sapn v-text='item.name'></sapn>
						</template>
					</el-form-item>
				</el-form>
				<span v-text="foolter" v-show='status'></span>
			</el-tab-pane>
				
		</el-tabs>
		
	</div>
</template>

<script>

	export default{
		name:'monitor',
		data(){
			return{
				id:this.nodeData,
				token:'',
				activeName:'first',
				itemsData:[],//获取监记录的数据
				foolter:this.$t('topology.details.notDatatip'),
				status:true,
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
		},
		methods:{
			getData(){
				let para={
					search_type:'warning'
				}
				this.$ajax.get('/public/get_news'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							this.itemsData=res.data.data.slice(0,7)//截取数据的里面的前面的七个
							if(res.data.data.length>7){
								this.status=true;
							}else{
								this.status=false;
							}
						}else{
							this.$message({
								message:res.data.message,
								type:'warning'
							})
						}
					}
				}).catch(e => {console.log(e)})
			}
		}
	}
</script>

<style>
	.z-one{
		z-index: 10;
	}
</style>