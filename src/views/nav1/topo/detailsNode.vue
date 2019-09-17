<template>
	<div>
		<!--节点的详情-->
		<el-form :model='seeForm' ref='seeForm'label-wdith='80px'  v-loading='seeLoading' >
			<el-form-item label='创建时间'>
				<span v-text="seeForm.time"></span>
			</el-form-item>
			<el-form-item label='骨干名称'>
				<span v-text="seeForm.name"></span>
			</el-form-item>
			<el-form-item label='骨干状态'>
				<!--<span v-text="seeForm.status"></span>-->
			</el-form-item>
			<el-form-item label='数据中心'>
				<!--<span v-text="seeForm.data"></span>-->
			</el-form-item>
			<el-form-item label='Vtep'>
				<span v-text="seeForm.vtep"></span>
			</el-form-item>
			<el-form-item>
				<el-button @click='seedetails' type='primary' size='small'>查看设备详情</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {datedialogFormat} from'@/assets/js/index.js'
	
	export default{
		mame:'datailsNode',
		props:['see'],
		data(){
			return{
				token:'',	
				
				seeForm:{
					time:'',
					name:'',
					status:'',
					data:'',
					Vtep:'',
				},
				seeLoading:false,
			}
		},
		watch:{
			see:{
				handler(newVal,oldVal){
					console.log(newVal)
					this.seeForm={
						time:newVal.time,
						name:newVal.name,
						vtep:newVal.Vtep
					}
				},
				deep:true
			}
//			nodeID:function(newVal){
//				console.log(newVal)
//				this.getData(newVal)
//			}
		},
		created(){
			this.seeForm=Object.assign({},this.see)
		},
		mounted(){
			this.seeForm=Object.assign({},this.see)
		},
		methods:{
//			getData(ids){
//				this.seeLoading=true;
//				this.$ajax.get('/node/node_info/'+ids+'?token='+this.token)
//				.then(res => {
//					console.log(res)
////					if(res.status==200){
////						if(res.data.status==0){
////							this.seeLoading=false;
////							console.log(res)
////							let str=res.data.data;
//////							this.seeForm=Object.assign({},res.data.data);
////							this.seeForm={
////								time:datedialogFormat(str.creation_time),
////								name:str.name,
//////								status:str.status,
////								vtep:str.vtep,
//////								data:str.dc.name
////							}
////						}
////					}
//				}).catch(e => {console.log(e)})
//			},
			seedetails(){
				this.$router.push('/location/index/unknown/nodedetails/'+this.nodeId)
			}
		}
	}
</script>

<style>
</style>