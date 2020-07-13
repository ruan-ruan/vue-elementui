<template>
	<div class="toolbar z-one" v-loading='load'>
		<el-tabs v-model='activeName'  >
			<el-tab-pane :label='$t("topology.details.wat")' name='first'>
				<ul v-for='(item , index) in itemsData' :key='index' class='label_tit marT5 marB8'>
					<li  class="marT5"> 
						<label class="textR">
							{{$t('Public.time')+'：'}}
						</label>
						<span  class="text">{{item.time|timeFormat }}</span>
					</li>
					<li class="marT5">
						<label class="textR"> 
							{{$t('Public.type')+'：'}}
						</label>
						<span v-text='item.type' class="text"></span>
					</li>
					<li class="marT5">
						<label class="textR"> 
							id：
						</label>
						<span v-text='item.id'class="text"></span>
					</li>
					<li class="marT5 marB10">
						<label class="textR">
							{{$t('Public.name')+'：'}}
						</label>
						<span v-text='item.title'class="text"></span>
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
				load:false,
			}
		},
		created(){
			this.load=true
			this.token=sessionStorage.getItem('token');
			this.getData();
			

		},
		mounted(){
			this.$forceUpdate()
			this.interVal=setInterval( () => {
				this.getData()
			},5000)
			this.load=false
		},
		beforeDestroy(){
			clearInterval(this.interVal)
		},
		methods:{
			getData(){
				let para={
					search_level:'warning',
					search_include_del:true
				}
				this.$ajax.get('/public/get_news'+'?token='+this.token,para)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							if(res.data.data.items.length > 7){
								this.tit=this.$t('topology.details.notDatatip');
							}else if(res.data.data.items.length<7 && res.data.data.items.length>0){
								this.tit=''
							}else if(res.data.data.items.length ==0) {
								this.tit=this.$t('topology.details.noData');
							}
							this.itemsData=res.data.data.items.slice(0,7)//截取数据的里面的前面的七个
							
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