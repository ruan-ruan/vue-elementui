<template>
	<div>
		<el-tabs v-model='activeName'  @tab-click="handleClick">
			<el-tab-pane label='骨干节点' name='first'>		
				<backBone v-if="isChildUpdate1"></backBone>
			</el-tab-pane>
			<el-tab-pane label='未知节点' name='second'>
				<Unknown v-if="isChildUpdate2"></Unknown>
			</el-tab-pane>	
		</el-tabs>	
		<!--<router-view></router-view>-->
	</div>
</template>

<script>
	import backBone from '@/views/nav1/node/backBone'
	import Unknown from '@/views/nav1/node/Unknown'
	
	export default {
		data(){
			return{
				activeName:this.$store.state.statusname?'second':'first',
				activeName:'first',
				isChildUpdate1:true,
				isChildUpdate2:false,
				Tabs:this.$route.query.tab,
			}
		},
		created(){
			if(this.$store.state.statusname){
				this.activeName='second';
				this.isChildUpdate1 = false;
	            this.isChildUpdate2 = true;
			}else{
				this.activeName='first';
				this.isChildUpdate1 = true;
	            this.isChildUpdate2 = false;
			}
		},
		methods:{
			handleClick(tab) {
	            if(tab.name == "first") {
	                this.isChildUpdate1 = true;
	                this.isChildUpdate2 = false;
	            } else if(tab.name == "second") {
	                this.isChildUpdate1 = false;
	                this.isChildUpdate2 = true;
	            }
	        }
		},
		components:{
			backBone,
			Unknown
		}
	}

</script>