<template>
	<div>
		<!--逻辑端口1-2-->
		<logic-port :tit='titleOne' ></logic-port>
		<span>{{titleOne}}</span>
	</div>
</template>

<script>
	
	import logicPort from '@/views/resources/port.vue'
	export default{
		name:'logicalPort',
		components:{logicPort},
		props:['titleOne','titleTwo'],
		data(){
			return{
				
				data:''
			}
		},
		watch:{
			titleOne:{
				handler:function (newVal){
					console.log(newVal);
//					console.log(newVal.id);
//					this.obj.id=newVal.id;
//					this.obj=JSON.parse( JSON.stringify(newVal))
//					this.getList(newVal.id)
//					this.title.id=newVal.id;
//					this.title.name=newVal.hostname;
//					this.title.ip=newVal.ip
				},
				deep:true
			},
			
			titleTwo:{
				handler(newVal,oldVal){
//					this.data=newVal.id;
					console.log(newVal)
//					this.getList(newVal.id)
//					this.title.id=newVal.id;
//					this.title.name=newVal.hostname;
//					this.title.ip=newVal.ip
				},
				deep:true
			}
		},
		mounted(){
			
			this.$nextTick(() => {
				console.log(this.titleOne)
			})
			
			
		}

	}
</script>

<style>
</style>