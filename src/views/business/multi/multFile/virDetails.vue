<template>
	<div>
		<!--虚拟机的详情界面-->   <!--基本的信息basicForm里面展示-->
		<!--Dc-->
		<!--<span>{{ basicObj }}</span>
		<span>{{type}}</span>-->
		<dc :dcData='detailsForm' ref='detailsForm' v-if='basicObj.dataType==="endpoints"'></dc>
		<!--云的数据-->
		<cloun :clounData='detailsForm' ref='detailsForm' v-if="basicObj.dataType==='cloud_endpoints'" :type='typeVal' ></cloun>
	</div>
</template>

<script>
	import cloun from '@/views/resources/virtualDetails/childs/cloun'
	import dc from '@/views/resources/virtualDetails/childs/dc'
	
	export default{
		name:'virDetails',
		props:['basicObj','type'],
		components:{cloun,dc},
		data(){
			return{
				token:'',
				detailsForm:{},
				detaLoading:false,
				dockCloun:[],//根据云对接的时候获取不同的数据
				typeVal:'',
			}
		},
		watch:{
			basicObj:{
				handler(newVal,oldVal){
					this.detailsForm=JSON.parse(JSON.stringify(newVal));
				},
				deep:true
			},
			'type':function(newVal,oldVal){
				this.typeVal=newVal;
			}
		},
		created(){
			this.token=sessionStorage.getItem('token');

			this.detailsForm=Object.assign({},this.basicObj)
		},
		mounted(){
			this.typeVal=this.type;
		},
	}
</script>

<style>
</style>