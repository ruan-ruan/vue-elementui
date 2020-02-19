<template>
	<div>
		<!--端口信息-->
		<!--顶部标签-->
		<el-tabs type='border-card'>
			<el-tab-pane :label='$t("Public.physics1")'>
				<portChilds :titleOne='base1' ></portChilds>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.physics2")' v-if='equipStatue'>
				<portChilds :titleTwo='base2'></portChilds>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.logic1")' v-if='port'>
				<logicalPort :titleOne='base1ID'></logicalPort>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.logic2")' v-if='port && equipStatue'>
				<logicalPort :titleTwo='base2ID'></logicalPort>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import portChilds from '@/views/nav1/node/details/child/portsChild/portChilds'
//	import logicalPort from '@/views/nav1/node/details/child/portsChild/logicalPort'
	import logicalPort from '@/views/resources/port'

	export default{
		name:'port',
		//这里的传的值是从总的界面传递的id
		token:'',
		props:['title'],  //,'physicalPort','physicalData'
		components:{
			portChilds,logicalPort
		},
		computed:{
			port(){
				return this.recursion( this.$store.state.aside ,"aside.logicManage").show;
			}
		},
		data(){
			return{
				idOne:[],
				idTwo:[],
				node_equip:[],
				equipStatue:false,
				obj:{},
				base1:{},
				base2:{},
//				dataVal:[],
				base1ID:'',
				base2ID:'',
//				ids1:''
			}
		},
		created(){
			
			this.token=sessionStorage.getItem('token');
			this.getUsers(this.title);
//			console.log( this.recursion( this.$store.state.aside ,"aside.logicManage") )
		},
		watch:{
			base1:{
				handler(newVal,oldVal){
					this.base1ID=newVal.id;
				},
				deep:true,
			},
			base2:{
				handler(newVal,oldVal){
					
					this.base2ID=newval.id;
				},
				deep:true
			}
		},
		methods:{
			getUsers(id){
				this.$ajax.get('/node/node_info/'+id+'?token='+this.token)
				.then(res => {
					if(res.status==200){
						if(res.data.status==0){
							
							this.obj=res.data.data;
							if(res.data.data.devices){
								if(res.data.data.devices.length==2){
									this.equipStatue=true

									this.base1=res.data.data.devices.find((item ) => {
										return item['sign']=='d1'
									})
									this.base2=res.data.data.devices.find((item ) => {
										return item['sign']=='d2'
									})

								}else{
									this.equipStatue=false
									this.base1=res.data.data.devices.find((item ) => {
										return item['sign']=='d1'
									})
								}
							}

						}
					}
				})
				.catch(e => {console.log(e)})
			},

		}

	}
</script>

<style>
</style>