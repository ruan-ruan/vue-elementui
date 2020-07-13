<template>
	<div>
		<!--<template>
			<span @click="goback" class="err_no" >
				<i class="el-icon-close"></i>
			</span>
		</template>-->
		
		<el-row>
			<el-col :span='22'>
				<el-tabs v-model='activeName' >
					<el-tab-pane :label='$t("Public.linkDetails")' name='first'>
						<linkDetails :seeDetails='seeForm'></linkDetails>
					</el-tab-pane>
				</el-tabs>
			</el-col>
			<el-col :span='2'>
				<span @click="goback" class="err_no">
					<i class="el-icon-close"></i>
				</span>
			</el-col>
		</el-row>
	</div>
</template>

<script >
	
	import linkDetails from '@/views/nav1/topo/linkDetails'
	
	export default{
		name:'linkTab',
		components:{linkDetails},
		data(){
			return{
				activeName:'first',
				seeForm:{}
			}
		},
		created(){
			this.seeForm=Object.assign({},this.$store.state.linkObj);
			this.bus.$on('sendlink',(msg) => {
				this.seeForm=Object.assign({},msg);
			})	
		},
		methods:{
			linksData(obj){
				if(obj.type==='link'){
//					console.log(执行链路的详情)
				}else{
//					console.log('执行云的详情')
				}
			},
			goback(){
				console.log('guanbi ')
				this.$emit('linkBack',false)
			},
		}
	}
	
</script>
<style >
	.el-tabs{
		padding-left: 10px;
	}
	
	
	
</style>