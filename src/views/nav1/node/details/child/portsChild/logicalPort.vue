<template>
	<div>
		<!--逻辑端口1-2-->
		<logic-port :tit='data' ></logic-port>
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
		created(){
			console.log(this.titleOne)
			if(typeof this.titleOne !=='undefined'){
				this.data=this.titleOne
			}
			
			if(typeof this.titleTwo !=='undefined'){
				this.data=this.titleTwo
			}
//			let str=[this.titleOne,this.titleTwo];
//			str.forEach(ele => {
//				if(ele){
//					this.data=ele
//				}
//			})
		}
	}
</script>

<style>
</style>