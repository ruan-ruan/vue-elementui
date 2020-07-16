<template>
	<div>
		<!--节点的详情-->
		<el-form :model='seeForm' ref='seeForm'label-wdith='80px'  v-loading='load' >
			<el-form-item :label='$t("Public.creatime")+"："'>
				<span v-text="seeForm.time"></span>
			</el-form-item>
			<el-form-item :label='$t("Public.backboneName")+"："'>
				<span v-text="seeForm.name"></span>
			</el-form-item>
			<el-form-item :label='$t("Public.backboneStatus")+"："'>
				<span v-text="seeForm.status"></span>
			</el-form-item>
			<el-form-item :label='$t("Public.dataCen")+"："'>
				<span v-text="seeForm.data"></span>
			</el-form-item>
			<el-form-item label='Vtep：'>
				<span v-text="seeForm.vtep"></span>
			</el-form-item>
			<el-form-item>
				<el-button @click='seedetails' type='primary' size='small'>
					<!--查看设备详情-->
					{{$t('topology.details.deviceDetails')}}
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {datedialogFormat} from'@/assets/js/index.js'
	
	export default{
		mame:'datailsNode',
		props:{
			see:{
				type:Object,
				default:function(){
					return {}
				}
			},
			load:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				token:'',	
				seeForm:{
					time:'',
					name:'',
					status:'',
					data:'',
					Vtep:'',
					id:''
				},
				seeLoading:this.load,
			}
		},
		watch:{
			see:{
				handler(newVal,oldVal){
//					this.load=true;
					if(newVal){
//						this.load=false
						this.seeForm={
							time:newVal.time,
							name:newVal.name,
							vtep:newVal.vtep,
							data:newVal.data,
							id:newVal.id,
							status:newVal.status
						}
					}
					
				},
				deep:true
			}

		},
		created(){
//			this.seeForm=Object.assign({},this.see)
		},
		mounted(){
			this.seeForm=Object.assign({},this.see)
		},
		methods:{
			seedetails(){
				this.$router.push(  {
					path:'/location/index/unknown/nodedetails',
					query:{
					detailsID:this.seeForm.id
				}
					
				})
			}
		}
	}
</script>

<style>
</style>