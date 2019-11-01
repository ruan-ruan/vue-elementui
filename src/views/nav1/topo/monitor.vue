<template>
	
	
	<div class="toolbar z-one">
		<el-tabs v-model='activeName'  >
			<el-tab-pane :label='$t("topology.details.wat")' name='first'>
				<ul v-for='(item , index) in itemsData' :key='index' class='label_tit marT10'>
					<li  class="marT5"> <label>
								<!--时间-->
								{{$t('Public.time')+'：'}}
							</label>
							<span v-text='item.time'></span>
					</li>
					<li class="marT5">
						<label> 
								<!--类型-->
								{{$t('Public.type')+'：'}}
								
							</label>
							<span v-text='item.type'></span>
					</li>
					<li class="marT5">
						<label> 
								<!--状态-->
								{{$t('Public.status')+'：'}}
								
							</label>
							<span v-text='item.status'></span>
					</li>
					<li class="marT5">
						<label>
								<!--名称-->
								{{$t('Public.name')+'：'}}
							</label>
							<span v-text='item.title'></span>
					</li>
					
				</ul>

				<div  >{{tit}}</div>

			</el-tab-pane>
				
		</el-tabs>
		
	</div>
</template>

<script>
	import { datedialogFormat } from '@/assets/js/index'
	export default{
		name:'monitor',
		data(){
			return{
				id:this.nodeData,
				token:'',
				activeName:'first',
				itemsData:[],//获取监记录的数据
//				status:true,
				tit:'',
				interVal:0,
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');
			this.getData();
			this.interVal=setInterval( () => {
				this.getData()
			},30000)

		},
		beforeDestroy(){
			clearInterval(this.interVal)
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
//							console.log(res)
							if(res.data.data.items.length > 7){
								this.tit=this.$t('topology.details.notDatatip');
//								this.status=true;
//								this.tit='更多数据请到信息列表中查看';
							}else if(res.data.data.items.length<7 && res.data.data.items.length>0){
//								this.status=false;
								this.tit=''
							}else if(res.data.data.items.length ==0) {
								this.tit=this.$t('topology.details.noData');
//								this.status=true;
//								this.tit='暂无报警信息'
							}
							res.data.data.items.map(item => {
								item.time=datedialogFormat(item.time);
							})
							
							this.itemsData=res.data.data.items.slice(0,7)//截取数据的里面的前面的七个
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