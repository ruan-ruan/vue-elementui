<template>
	<div>
		<el-tabs v-model='activeName'  @tab-click="handleClick">
			<el-tab-pane :label='$t("Public.backboneNode")' name='first' v-if='backbone'>		
				<backBone v-if="isChildUpdate1"></backBone>
			</el-tab-pane>
			<el-tab-pane :label='$t("Public.unNode")' name='second' v-if='unknown'>
				<Unknown v-if="isChildUpdate2"></Unknown>
			</el-tab-pane>	
		</el-tabs>	
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
				backbone:this.recursion( this.$store.state.aside , "Public.backboneNode").show,
				unknown:this.recursion( this.$store.state.aside , "Public.unNode").show,
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